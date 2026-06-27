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
    // Case 2: The key is not present in this node
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

function removeFromLeaf<K, V>(node: BTreeNode<K, V>, idx: number): void {
  node.keys.splice(idx, 1);
  node.values.splice(idx, 1);
}

function removeFromNonLeaf<K, V>(node: BTreeNode<K, V>, idx: number, t: number): void {
  const key = node.keys[idx];

  // Case 2a: The child that precedes key (children[idx]) has at least 't' keys
  if (node.children[idx].keys.length >= t) {
    const [predKey, predVal] = getPredecessor(node.children[idx]);
    node.keys[idx] = predKey;
    node.values[idx] = predVal;
    removeNode(node.children[idx], predKey, t);
  }
  // Case 2b: The child that succeeds key (children[idx+1]) has at least 't' keys
  else if (node.children[idx + 1].keys.length >= t) {
    const [succKey, succVal] = getSuccessor(node.children[idx + 1]);
    node.keys[idx] = succKey;
    node.values[idx] = succVal;
    removeNode(node.children[idx + 1], succKey, t);
  }
  // Case 2c: Both children[idx] and children[idx+1] have less than 't' keys
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
