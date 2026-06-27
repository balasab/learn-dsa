import { BPlusTreeNode } from "./BPlusTreeNode";

export function searchNode<K, V>(node: BPlusTreeNode<K, V>, key: K): V | null {
  let curr = node;
  while (!curr.isLeaf) {
    let i = 0;
    while (i < curr.keys.length && key >= curr.keys[i]) {
      i++;
    }
    curr = curr.children[i];
  }

  // Now we are at a leaf node
  let i = 0;
  while (i < curr.keys.length && key > curr.keys[i]) {
    i++;
  }

  if (i < curr.keys.length && key === curr.keys[i]) {
    return curr.values[i];
  }

  return null;
}
