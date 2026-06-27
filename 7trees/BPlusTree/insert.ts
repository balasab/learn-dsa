import { BPlusTreeNode } from "./BPlusTreeNode";
import { BPlusTree } from "./BPlusTree";

interface SplitResult<K, V> {
  promoKey: K;
  leftNode: BPlusTreeNode<K, V>;
  rightNode: BPlusTreeNode<K, V>;
}

export function insert<K, V>(btree: BPlusTree<K, V>, key: K, value: V): void {
  const result = insertRec(btree.root, key, value, btree.t);
  if (result) {
    // Root was split, create a new root
    const { promoKey, leftNode, rightNode } = result;
    const newRoot = new BPlusTreeNode<K, V>(false);
    newRoot.keys = [promoKey];
    newRoot.children = [leftNode, rightNode];
    btree.root = newRoot;
  }
}

function insertRec<K, V>(
  node: BPlusTreeNode<K, V>,
  key: K,
  value: V,
  t: number
): SplitResult<K, V> | null {
  if (node.isLeaf) {
    // Find the position to insert
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    // If key already exists, overwrite value
    if (i < node.keys.length && key === node.keys[i]) {
      node.values[i] = value;
      return null;
    }

    // Insert key-value pair in sorted position
    node.keys.splice(i, 0, key);
    node.values.splice(i, 0, value);

    // Check for overflow (max keys = 2t - 1)
    if (node.keys.length > 2 * t - 1) {
      const newNode = new BPlusTreeNode<K, V>(true);
      const mid = t; // split at index t for leaf node

      newNode.keys = node.keys.splice(mid);
      newNode.values = node.values.splice(mid);

      // Adjust leaf list links
      newNode.next = node.next;
      if (node.next) node.next.prev = newNode;
      node.next = newNode;
      newNode.prev = node;

      // Smallest key in right node is promoted
      return {
        promoKey: newNode.keys[0],
        leftNode: node,
        rightNode: newNode,
      };
    }
    return null;
  } else {
    // Internal node: locate child pointer
    let i = 0;
    while (i < node.keys.length && key >= node.keys[i]) {
      i++;
    }

    const split = insertRec(node.children[i], key, value, t);
    if (split) {
      // Insert the promoted key and right node pointer into this internal node
      node.keys.splice(i, 0, split.promoKey);
      node.children.splice(i + 1, 0, split.rightNode);

      // Check for overflow (max keys = 2t - 1)
      if (node.keys.length > 2 * t - 1) {
        const newNode = new BPlusTreeNode<K, V>(false);
        const mid = t - 1; // split at index t - 1 for internal node
        const promoKey = node.keys[mid];

        newNode.keys = node.keys.splice(mid + 1);
        newNode.children = node.children.splice(mid + 1);

        // Remove the median element which is promoted up
        node.keys.pop(); // removes node.keys[mid]

        return {
          promoKey,
          leftNode: node,
          rightNode: newNode,
        };
      }
    }
    return null;
  }
}
