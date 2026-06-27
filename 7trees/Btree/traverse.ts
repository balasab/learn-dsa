import { BTreeNode } from "./BTreeNode";

export function traverseNode<K, V>(node: BTreeNode<K, V>): void {
  let i;
  for (i = 0; i < node.keys.length; i++) {
    if (!node.isLeaf) {
      traverseNode(node.children[i]);
    }
    console.log(`Key: ${node.keys[i]}, Value: ${node.values[i]}`);
  }
  if (!node.isLeaf) {
    traverseNode(node.children[i]);
  }
}
