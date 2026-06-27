import { BTreeNode } from "./BTreeNode";

export function searchNode<K, V>(node: BTreeNode<K, V>, key: K): V | null {
  let i = 0;
  while (i < node.keys.length && key > node.keys[i]) {
    i++;
  }

  if (i < node.keys.length && key === node.keys[i]) {
    return node.values[i];
  }

  if (node.isLeaf) {
    return null;
  }

  return searchNode(node.children[i], key);
}
