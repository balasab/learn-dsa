import { BPlusTreeNode } from "./BPlusTreeNode";
import { BPlusTree } from "./BPlusTree";

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
    // Return true if underflow
    return parent !== null && node.keys.length < t - 1;
  }

  // Internal node: find child index
  let i = 0;
  while (i < node.keys.length && key >= node.keys[i]) {
    i++;
  }

  const underflow = removeRec(node, node.children[i], i, key, t);
  if (!underflow) return false;

  // Resolve child underflow
  const child = node.children[i];

  // Try borrowing from left sibling
  if (i > 0) {
    const sibling = node.children[i - 1];
    if (sibling.keys.length > t - 1) {
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
      return false;
    }
  }

  // Try borrowing from right sibling
  if (i < node.children.length - 1) {
    const sibling = node.children[i + 1];
    if (sibling.keys.length > t - 1) {
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
      return false;
    }
  }

  // Merge siblings
  if (i > 0) {
    // Merge child into left sibling
    const sibling = node.children[i - 1];
    if (child.isLeaf) {
      sibling.keys = sibling.keys.concat(child.keys);
      sibling.values = sibling.values.concat(child.values);
      // Link leaf lists
      sibling.next = child.next;
      if (child.next) child.next.prev = sibling;
    } else {
      // Pull down parent key
      sibling.keys.push(node.keys[i - 1]);
      sibling.keys = sibling.keys.concat(child.keys);
      sibling.children = sibling.children.concat(child.children);
    }
    // Remove pointer and key from parent
    node.keys.splice(i - 1, 1);
    node.children.splice(i, 1);
  } else {
    // Merge right sibling into child
    const sibling = node.children[i + 1];
    if (child.isLeaf) {
      child.keys = child.keys.concat(sibling.keys);
      child.values = child.values.concat(sibling.values);
      // Link leaf lists
      child.next = sibling.next;
      if (sibling.next) sibling.next.prev = child;
    } else {
      // Pull down parent key
      child.keys.push(node.keys[i]);
      child.keys = child.keys.concat(sibling.keys);
      child.children = child.children.concat(sibling.children);
    }
    // Remove pointer and key from parent
    node.keys.splice(i, 1);
    node.children.splice(i + 1, 1);
  }

  // Check if current node underflows
  return parent !== null && node.keys.length < t - 1;
}

function updateRoutingKeys<K, V>(node: BPlusTreeNode<K, V>, oldKey: K, newKey: K): void {
  if (!node || node.isLeaf) return;
  for (let i = 0; i < node.keys.length; i++) {
    if (node.keys[i] === oldKey) {
      node.keys[i] = newKey;
      return;
    }
  }
  for (const child of node.children) {
    updateRoutingKeys(child, oldKey, newKey);
  }
}
