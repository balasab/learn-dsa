import { BPlusTreeNode } from "./BPlusTreeNode";
import type { BPlusTree } from "./BPlusTree.ts";

/**
 * Removes a key from the B+ Tree.
 * If the root becomes empty, it updates the root (decreases tree height if necessary).
 * If the first key of a leaf node was deleted, updates the internal node routing keys.
 * 
 * ### Example:
 * ```typescript
 * import { BPlusTree } from "./BPlusTree";
 * 
 * const btree = new BPlusTree<number, string>(3);
 * btree.insert(10, "Ten");
 * btree.insert(20, "Twenty");
 * btree.insert(5, "Five");
 * 
 * btree.remove(20);
 * ```
 */
export function remove<K, V>(btree: BPlusTree<K, V>, key: K): void {
  if (!btree.root || btree.root.keys.length === 0) {
    console.warn("The tree is empty.");
    return;
  }

  // Find the leaf node that should contain the key
  let leaf = btree.root;
  while (!leaf.isLeaf) {
    let i = 0;
    while (i < leaf.keys.length && key >= leaf.keys[i]) {
      i++;
    }
    leaf = leaf.children[i];
  }

  const keyIdx = leaf.keys.indexOf(key);
  if (keyIdx === -1) {
    console.warn(`The key ${key} does not exist in the tree.`);
    return;
  }

  const wasFirstKey = keyIdx === 0;

  removeRec(null, btree.root, 0, key, btree.t);

  // If the root became empty, update the root
  if (btree.root.keys.length === 0) {
    if (btree.root.isLeaf) {
      btree.root = new BPlusTreeNode<K, V>(true);
    } else {
      btree.root = btree.root.children[0];
    }
  }

  // If the deleted key was the first key in the leaf and the leaf still has keys,
  // we need to update any routing keys in the internal nodes.
  if (wasFirstKey && leaf.keys.length > 0) {
    updateRoutingKeys(btree.root, key, leaf.keys[0]);
  }
}

/**
 * Recursively removes a key from the tree.
 * Returns true if the node underflows (i.e. keys length < t - 1).
 */
function removeRec<K, V>(
  parent: BPlusTreeNode<K, V> | null,
  node: BPlusTreeNode<K, V>,
  indexInParent: number,
  key: K,
  t: number
): boolean {
  if (node.isLeaf) {
    const idx = node.keys.indexOf(key);
    if (idx !== -1) {
      node.keys.splice(idx, 1);
      node.values.splice(idx, 1);
    }
    // Return true if underflow occurs (minimum keys = t - 1)
    return parent !== null && node.keys.length < t - 1;
  }

  // Internal node: locate the child that should contain the key
  let i = 0;
  while (i < node.keys.length && key >= node.keys[i]) {
    i++;
  }

  const underflow = removeRec(node, node.children[i], i, key, t);
  if (!underflow) {
    return false;
  }

  // Resolve child underflow
  const child = node.children[i];

  // 1. Try borrowing from left sibling
  if (i > 0) {
    const sibling = node.children[i - 1];
    if (sibling.keys.length > t - 1) {
      borrowFromLeft(node, i, child, sibling);
      return false;
    }
  }

  // 2. Try borrowing from right sibling
  if (i < node.children.length - 1) {
    const sibling = node.children[i + 1];
    if (sibling.keys.length > t - 1) {
      borrowFromRight(node, i, child, sibling);
      return false;
    }
  }

  // 3. Merge siblings if borrowing is not possible
  if (i > 0) {
    const sibling = node.children[i - 1];
    mergeWithLeft(node, i, child, sibling);
  } else {
    const sibling = node.children[i + 1];
    mergeWithRight(node, i, child, sibling);
  }

  // Check if current internal node underflows
  return parent !== null && node.keys.length < t - 1;
}

/*
    Leaf Borrow from Left Sibling:
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Min keys in leaf = 2
    Child (index i = 1) has 1 key. Left sibling has 3 keys (can lend).

    BEFORE BORROW:
            Parent Node
            +----+
            | 10 |  (node.keys[0])
            +----+
           /      \
      Sibling      Child
    +----+----+  +----+
    |  2 |  5 |  | 10 |
    +----+----+  +----+

    AFTER BORROW (Sibling last key '5' shifts to Child; parent routing key updated):
            Parent Node
            +----+
            |  5 |
            +----+
           /      \
      Sibling      Child
    +----+       +----+----+
    |  2 |       |  5 | 10 |
    +----+       +----+----+

    -------------------------------------------------------------------------
    Internal Borrow from Left Sibling:
    =========================================================================
    Sibling has child pointers. Shift parent key down to child; promote sibling's last key.

    BEFORE BORROW:
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
      Sibling      Child
    +----+----+  +----+
    |  2 |  5 |  | 15 |
    +----+----+  +----+

    AFTER BORROW:
            Parent Node
            +----+
            |  5 |
            +----+
           /      \
      Sibling      Child
    +----+       +----+----+
    |  2 |       | 10 | 15 |
    +----+       +----+----+
 */
function borrowFromLeft<K, V>(
  node: BPlusTreeNode<K, V>,
  i: number,
  child: BPlusTreeNode<K, V>,
  sibling: BPlusTreeNode<K, V>
): void {
  if (child.isLeaf) {
    // Leaf borrow: copy sibling's last element to child's front
    const k = sibling.keys.pop()!;
    const v = sibling.values.pop()!;
    child.keys.unshift(k);
    child.values.unshift(v);
    // Parent routing key becomes the new first key of child
    node.keys[i - 1] = child.keys[0];
  } else {
    // Internal borrow: move parent key down, sibling child to child
    child.keys.unshift(node.keys[i - 1]);
    child.children.unshift(sibling.children.pop()!);
    node.keys[i - 1] = sibling.keys.pop()!;
  }
}

/*
    Leaf Borrow from Right Sibling:
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Min keys in leaf = 2
    Child (index i = 0) has 1 key. Right sibling has 3 keys (can lend).

    BEFORE BORROW:
            Parent Node
            +----+
            | 10 |  (node.keys[0])
            +----+
           /      \
       Child      Sibling
    +----+       +----+----+----+
    |  5 |       | 10 | 12 | 15 |
    +----+       +----+----+----+

    AFTER BORROW (Sibling first key '10' shifts to Child; parent routing key updated):
            Parent Node
            +----+
            | 12 |
            +----+
           /      \
       Child      Sibling
    +----+----+  +----+----+
    |  5 | 10 |  | 12 | 15 |
    +----+----+  +----+----+

    -------------------------------------------------------------------------
    Internal Borrow from Right Sibling:
    =========================================================================
    Sibling has child pointers. Shift parent key down to child; promote sibling's first key.

    BEFORE BORROW:
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
       Child      Sibling
    +----+       +----+----+----+
    |  5 |       | 15 | 20 | 25 |
    +----+       +----+----+----+

    AFTER BORROW:
            Parent Node
            +----+
            | 15 |
            +----+
           /      \
       Child      Sibling
    +----+----+  +----+----+
    |  5 | 10 |  | 20 | 25 |
    +----+----+  +----+----+
 */
function borrowFromRight<K, V>(
  node: BPlusTreeNode<K, V>,
  i: number,
  child: BPlusTreeNode<K, V>,
  sibling: BPlusTreeNode<K, V>
): void {
  if (child.isLeaf) {
    // Leaf borrow: copy sibling's first element to child's end
    const k = sibling.keys.shift()!;
    const v = sibling.values.shift()!;
    child.keys.push(k);
    child.values.push(v);
    // Parent routing key becomes the new first key of right sibling
    node.keys[i] = sibling.keys[0];
  } else {
    // Internal borrow: move parent key down, sibling child to child
    child.keys.push(node.keys[i]);
    child.children.push(sibling.children.shift()!);
    node.keys[i] = sibling.keys.shift()!;
  }
}

/*
    Leaf Merge with Left Sibling:
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Child (index i = 1) and Sibling (index i-1 = 0) have 1 key each.

    BEFORE MERGE:
            Parent Node
            +----+
            | 10 |  (node.keys[0])
            +----+
           /      \
      Sibling      Child
    +----+       +----+
    |  5 |       | 10 |
    +----+       +----+

    AFTER MERGE (Child is merged into Left Sibling; leaf lists linked; parent key removed):
            Parent Node (Empty)
            +----+
            |    |
            +----+
           /
      Sibling (Merged)
    +----+----+
    |  5 | 10 |
    +----+----+
 */
function mergeWithLeft<K, V>(
  node: BPlusTreeNode<K, V>,
  i: number,
  child: BPlusTreeNode<K, V>,
  sibling: BPlusTreeNode<K, V>
): void {
  if (child.isLeaf) {
    sibling.keys = sibling.keys.concat(child.keys);
    sibling.values = sibling.values.concat(child.values);
    // Link leaf sibling lists
    sibling.next = child.next;
    if (child.next) {
      child.next.prev = sibling;
    }
  } else {
    // Pull down parent routing key
    sibling.keys.push(node.keys[i - 1]);
    sibling.keys = sibling.keys.concat(child.keys);
    sibling.children = sibling.children.concat(child.children);
  }
  // Remove parent routing key and the child node pointer
  node.keys.splice(i - 1, 1);
  node.children.splice(i, 1);
}

/*
    Leaf Merge with Right Sibling:
    =========================================================================
    Right sibling is merged into the child.

    BEFORE MERGE:
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
       Child      Sibling
    +----+       +----+
    |  5 |       | 10 |
    +----+       +----+

    AFTER MERGE:
            Parent Node (Empty)
            +----+
            |    |
            +----+
           /
       Child (Merged)
    +----+----+
    |  5 | 10 |
    +----+----+
 */
function mergeWithRight<K, V>(
  node: BPlusTreeNode<K, V>,
  i: number,
  child: BPlusTreeNode<K, V>,
  sibling: BPlusTreeNode<K, V>
): void {
  if (child.isLeaf) {
    child.keys = child.keys.concat(sibling.keys);
    child.values = child.values.concat(sibling.values);
    // Link leaf sibling lists
    child.next = sibling.next;
    if (sibling.next) {
      sibling.next.prev = child;
    }
  } else {
    // Pull down parent routing key
    child.keys.push(node.keys[i]);
    child.keys = child.keys.concat(sibling.keys);
    child.children = child.children.concat(sibling.children);
  }
  // Remove parent routing key and the right sibling node pointer
  node.keys.splice(i, 1);
  node.children.splice(i + 1, 1);
}

/**
 * Traverses the tree to find and update obsolete internal routing keys.
 * Used when a leaf node's first key has been updated during a remove operation.
 * * =========================================================================
 * VISUAL EXAMPLE: Updating an obsolete routing key from 10 to 12.
 * Note: Data values only exist in the leaf nodes, while internal nodes
 * carry only routing keys to guide the traversal.
 * * BEFORE UPDATE (Key '10' was removed from the right leaf, making '12' the new minimum):
 * * Internal Parent Keys:   [ 10 ]
 * Internal Parent Values: [ null ]
 * /      \
 * Left Leaf Node               Right Leaf Node
 * Keys:   [ 2 | 5 ]            Keys:   [ 12 | 15 ]
 * Values: [ B | E ]            Values: [  L |  O ]
 * * AFTER UPDATE (updateRoutingKeys(root, 10, 12)):
 * - The obsolete routing key '10' in the internal node is updated to '12'.
 * - Leaf data values remain completely unchanged and safely associated with their keys.
 * * Internal Parent Keys:   [ 12 ]
 * Internal Parent Values: [ null ]
 * /      \
 * Left Leaf Node               Right Leaf Node
 * Keys:   [ 2 | 5 ]            Keys:   [ 12 | 15 ]
 * Values: [ B | E ]            Values: [  L |  O ]
 */
function updateRoutingKeys<K, V>(node: BPlusTreeNode<K, V>, oldKey: K, newKey: K): void {
  if (!node || node.isLeaf) return;

  // Scan internal routing keys for the obsolete key
  for (let i = 0; i < node.keys.length; i++) {
    if (node.keys[i] === oldKey) {
      node.keys[i] = newKey;
      return; // Found and updated; routing keys are unique per path
    }
  }

  // Recursively search down the children if not found at this level
  for (const child of node.children) {
    updateRoutingKeys(child, oldKey, newKey);
  }
}
