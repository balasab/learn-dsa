import { BTreeNode } from "./BTreeNode";
import { BTree } from "./BTree";

export function remove<K, V>(btree: BTree<K, V>, key: K): void {
  if (!btree.root || btree.root.keys.length === 0) {
    console.warn("The tree is empty.");
    return;
  }

  removeNode(btree.root, key, btree.t);

  // If the root node has 0 keys, make its first child the new root
  // if it has a child. Otherwise, the tree becomes empty.
  /*
    Shrinks the B-Tree root if it becomes empty.
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Root node becomes empty after merging its children.
    
    BEFORE ROOT SHRINKING:
               Root Node (Empty keys, has 1 child)
               +----+ (keys: [])
              /
            Child Node
            +----+----+----+
            | 10 | 20 | 30 |
            +----+----+----+
    
    AFTER ROOT SHRINKING (Child node becomes the new root):
               New Root Node
               +----+----+----+
               | 10 | 20 | 30 |
               +----+----+----+
  */
  if (btree.root.keys.length === 0) {
    if (btree.root.isLeaf) {
      // Tree is now completely empty
      btree.root = new BTreeNode<K, V>(true);
    } else {
      btree.root = btree.root.children[0];
    }
  }
}

function removeNode<K, V>(node: BTreeNode<K, V>, key: K, t: number): void {
  let idx = 0;
  while (idx < node.keys.length && node.keys[idx] < key) {
    idx++;
  }

  // Case 1: The key to be removed is present in this node
  if (idx < node.keys.length && node.keys[idx] === key) {
    if (node.isLeaf) {
      removeFromLeaf(node, idx);
    } else {
      removeFromNonLeaf(node, idx, t);
    }
  } else {
    // Case 3: The key is not present in this internal node, so we must descend 
    // to the child where the key resides. To guarantee that deletion completes 
    // in a single pass without back-tracking, we must ensure the child we descend 
    // to has at least 't' keys (minimum degree). If it has less than 't' keys (i.e. t-1), 
    // we fill it first.
    if (node.isLeaf) {
      console.warn(`The key ${key} does not exist in the tree.`);
      return;
    }

    // The flag indicates whether the key is expected to be in the last child
    const isLastChild = idx === node.keys.length;

    // If the child where the key is supposed to exist has less than 't' keys,
    // we fill that child first.
    if (node.children[idx].keys.length < t) {
      fill(node, idx, t);
    }

    // If the last child has been merged, it must have been merged with the previous child,
    // so we recurse on the (idx - 1)th child. Otherwise, we recurse on the idx-th child.
    if (isLastChild && idx > node.keys.length) {
      removeNode(node.children[idx - 1], key, t);
    } else {
      removeNode(node.children[idx], key, t);
    }
  }
}

/*
  CASE 1: Remove from a Leaf Node
  =========================================================================
  VISUAL EXAMPLE (t = 3) -> Removing key '20' at index 1.
  
  BEFORE REMOVAL:
  +----+----+----+
  | 10 | 20 | 30 | (Leaf Node)
  +----+----+----+

  AFTER REMOVAL (splice key and value at index 1):
  +----+----+
  | 10 | 30 |
  +----+----+
*/
function removeFromLeaf<K, V>(node: BTreeNode<K, V>, idx: number): void {
  node.keys.splice(idx, 1);
  node.values.splice(idx, 1);
}

/*
  CASE 2: Remove from a Non-Leaf Node
  =========================================================================
  To remove a key from an internal node, we must maintain B-Tree properties 
  by either borrowing a key from a predecessor/successor child or merging.
*/
function removeFromNonLeaf<K, V>(node: BTreeNode<K, V>, idx: number, t: number): void {
  const key = node.keys[idx];

  // Case 2a: The child that precedes key (children[idx]) has at least 't' keys.
  // Find predecessor (rightmost key in left subtree), overwrite parent's key with it,
  // then recursively delete predecessor from the left subtree.
  //
  // VISUAL EXAMPLE (t = 3) -> Removing key '20' (idx = 1) from parent.
  // Left child preceding '20' has keys [12, 15, 18] (length 3 >= t).
  //
  // BEFORE Case 2a transformation:
  //            Parent Node
  //         +----+----+----+
  //         | 10 | 20 | 30 |
  //         +----+----+----+
  //             /      \
  //      Left Child    Right Child
  //     +----+----+----+
  //     | 12 | 15 | 18 | (Preceding child)
  //     +----+----+----+
  //
  // AFTER Case 2a transformation (18 replaces 20, then 18 is recursively deleted from Left Child):
  //            Parent Node
  //         +----+----+----+
  //         | 10 | 18 | 30 |
  //         +----+----+----+
  //             /      \
  //      Left Child    Right Child
  //     +----+----+
  //     | 12 | 15 |
  //     +----+----+
  if (node.children[idx].keys.length >= t) {
    const [predKey, predVal] = getPredecessor(node.children[idx]);
    node.keys[idx] = predKey;
    node.values[idx] = predVal;
    removeNode(node.children[idx], predKey, t);
  }
  // Case 2b: The child that succeeds key (children[idx+1]) has at least 't' keys.
  // Find successor (leftmost key in right subtree), overwrite parent's key with it,
  // then recursively delete successor from the right subtree.
  //
  // VISUAL EXAMPLE (t = 3) -> Removing key '20' (idx = 1) from parent.
  // Right child succeeding '20' has keys [22, 25, 28] (length 3 >= t).
  //
  // BEFORE Case 2b transformation:
  //            Parent Node
  //         +----+----+----+
  //         | 10 | 20 | 30 |
  //         +----+----+----+
  //             /      \
  //      Left Child    Right Child
  //                   +----+----+----+
  //                   | 22 | 25 | 28 | (Succeeding child)
  //                   +----+----+----+
  //
  // AFTER Case 2b transformation (22 replaces 20, then 22 is recursively deleted from Right Child):
  //            Parent Node
  //         +----+----+----+
  //         | 10 | 22 | 30 |
  //         +----+----+----+
  //             /      \
  //      Left Child    Right Child
  //                   +----+----+
  //                   | 25 | 28 |
  //                   +----+----+
  else if (node.children[idx + 1].keys.length >= t) {
    const [succKey, succVal] = getSuccessor(node.children[idx + 1]);
    node.keys[idx] = succKey;
    node.values[idx] = succVal;
    removeNode(node.children[idx + 1], succKey, t);
  }
  // Case 2c: Both preceding and succeeding children have less than 't' keys (i.e., t-1 keys).
  // Merge key and succeeding child into preceding child, then recursively delete key from it.
  //
  // VISUAL EXAMPLE (t = 3) -> Removing key '20' (idx = 1) from parent.
  // Both children have only t - 1 = 2 keys: Left [12, 15] and Right [25, 28].
  //
  // BEFORE Case 2c transformation:
  //            Parent Node
  //         +----+----+----+
  //         | 10 | 20 | 30 |
  //         +----+----+----+
  //             /      \
  //      Left Child    Right Child
  //     +----+----+    +----+----+
  //     | 12 | 15 |    | 25 | 28 |
  //     +----+----+    +----+----+
  //
  // AFTER Case 2c transformation (Merge parent's '20' and Right Child into Left Child):
  //          Parent Node (20 is pulled down, children[idx+1] removed)
  //           +----+----+
  //           | 10 | 30 |
  //           +----+----+
  //               /     \
  //       Merged Child   Other Children
  //     +----+----+----+----+----+
  //     | 12 | 15 | 20 | 25 | 28 |
  //     +----+----+----+----+----+
  //
  // (We then recurse to delete key '20' from the Merged Child)
  else {
    merge(node, idx);
    removeNode(node.children[idx], key, t);
  }
}

function getPredecessor<K, V>(node: BTreeNode<K, V>): [K, V] {
  let curr = node;
  while (!curr.isLeaf) {
    curr = curr.children[curr.children.length - 1];
  }
  return [curr.keys[curr.keys.length - 1], curr.values[curr.values.length - 1]];
}

function getSuccessor<K, V>(node: BTreeNode<K, V>): [K, V] {
  let curr = node;
  while (!curr.isLeaf) {
    curr = curr.children[0];
  }
  return [curr.keys[0], curr.values[0]];
}

/**
 * Ensures that the child node at node.children[idx] has at least 't' keys
 */
function fill<K, V>(node: BTreeNode<K, V>, idx: number, t: number): void {
  // If the previous sibling has more than t-1 keys, borrow from it
  if (idx !== 0 && node.children[idx - 1].keys.length >= t) {
    borrowFromPrev(node, idx);
  }
  // If the next sibling has more than t-1 keys, borrow from it
  else if (idx !== node.keys.length && node.children[idx + 1].keys.length >= t) {
    borrowFromNext(node, idx);
  }
  // Otherwise, merge node.children[idx] with its sibling
  else {
    if (idx !== node.keys.length) {
      merge(node, idx);
    } else {
      merge(node, idx - 1);
    }
  }
}

/*
  Ensures that the child node.children[idx] has at least 't' keys by borrowing from 
  the left sibling node.children[idx-1] which has >= t keys.
  =========================================================================
  VISUAL EXAMPLE (t = 3) -> Borrowing for node.children[1] (idx = 1).
  Parent key at index 0 separates Left Sibling (idx-1) and Target Child (idx).
  Left Sibling has 3 keys (>= 3): [5, 8, 12]. Target Child has 2 keys: [25, 28].
  Parent key at index 0 is '15'.

  BEFORE BORROW:
               Parent Node
               +----+
               | 15 |
               +----+
              /      \
      Left Sibling   Target Child
     +---+---+----+   +----+----+
     | 5 | 8 | 12 |   | 25 | 28 |
     +---+---+----+   +----+----+
               C3       C0 (of child)
               
  AFTER BORROW (15 moves down to Child, 12 moves up to Parent, last child pointer C3 moves to Child):
               Parent Node
               +----+
               | 12 |
               +----+
              /      \
      Left Sibling   Target Child
     +---+---+        +----+----+----+
     | 5 | 8 |        | 15 | 25 | 28 |
     +---+---+        +----+----+----+
                     /   \
                    C3   C0
*/
function borrowFromPrev<K, V>(node: BTreeNode<K, V>, idx: number): void {
  const child = node.children[idx];
  const sibling = node.children[idx - 1];

  // Shift all keys in child one step ahead
  child.keys.unshift(node.keys[idx - 1]);
  child.values.unshift(node.values[idx - 1]);

  if (!child.isLeaf) {
    child.children.unshift(sibling.children.pop()!);
  }

  // Move the last key of sibling to the parent
  node.keys[idx - 1] = sibling.keys.pop()!;
  node.values[idx - 1] = sibling.values.pop()!;
}

/*
  Ensures that the child node.children[idx] has at least 't' keys by borrowing from 
  the right sibling node.children[idx+1] which has >= t keys.
  =========================================================================
  VISUAL EXAMPLE (t = 3) -> Borrowing for node.children[0] (idx = 0).
  Parent key at index 0 separates Target Child (idx) and Right Sibling (idx+1).
  Right Sibling has 3 keys (>= 3): [18, 22, 25]. Target Child has 2 keys: [8, 12].
  Parent key at index 0 is '15'.

  BEFORE BORROW:
               Parent Node
               +----+
               | 15 |
               +----+
              /      \
      Target Child   Right Sibling
     +---+----+       +----+----+----+
     | 8 | 12 |       | 18 | 22 | 25 |
     +---+----+       +----+----+----+
                   C0
               
  AFTER BORROW (15 moves down to Child, 18 moves up to Parent, first child pointer C0 of sibling moves to Child):
               Parent Node
               +----+
               | 18 |
               +----+
              /      \
      Target Child   Right Sibling
     +---+----+----+  +----+----+
     | 8 | 12 | 15 |  | 22 | 25 |
     +---+----+----+  +----+----+
                 \   /
                 C0 C1 (now first child of sibling)
*/
function borrowFromNext<K, V>(node: BTreeNode<K, V>, idx: number): void {
  const child = node.children[idx];
  const sibling = node.children[idx + 1];

  // Parent key moves down to the end of child
  child.keys.push(node.keys[idx]);
  child.values.push(node.values[idx]);

  if (!child.isLeaf) {
    child.children.push(sibling.children.shift()!);
  }

  // First key of sibling moves up to parent
  node.keys[idx] = sibling.keys.shift()!;
  node.values[idx] = sibling.values.shift()!;
}

/**
 * Merges node.children[idx] with node.children[idx+1]
 */
/*
  Merges node.children[idx] with node.children[idx+1] using parent key at index idx.
  =========================================================================
  VISUAL EXAMPLE (t = 3) -> Merging node.children[0] and node.children[1].
  Parent key at index 0 is '15'.
  Both Target Child and Right Sibling have t-1 = 2 keys.
  Target Child: [8, 12], Right Sibling: [18, 22].

  BEFORE MERGE:
               Parent Node
               +----+----+
               | 15 | 30 |
               +----+----+
              /     |     \
      Target Child  Sibling  Other child
     +---+----+    +----+----+
     | 8 | 12 |    | 18 | 22 |
     +---+----+    +----+----+
              
  AFTER MERGE (15 is pulled down, Sibling is merged into Target Child, Sibling node is removed):
               Parent Node
               +----+
               | 30 |
               +----+
              /      \
        Merged Child  Other child
     +---+----+----+----+----+
     | 8 | 12 | 15 | 18 | 22 |
     +---+----+----+----+----+
*/
function merge<K, V>(node: BTreeNode<K, V>, idx: number): void {
  const child = node.children[idx];
  const sibling = node.children[idx + 1];

  // Pull down the item from the parent node and add it to the child
  child.keys.push(node.keys[idx]);
  child.values.push(node.values[idx]);

  // Copy keys and values from sibling to child
  child.keys = child.keys.concat(sibling.keys);
  child.values = child.values.concat(sibling.values);

  // Copy child pointers if not a leaf
  if (!child.isLeaf) {
    child.children = child.children.concat(sibling.children);
  }

  // Remove the key and child pointer from the parent
  node.keys.splice(idx, 1);
  node.values.splice(idx, 1);
  node.children.splice(idx + 1, 1);
}
