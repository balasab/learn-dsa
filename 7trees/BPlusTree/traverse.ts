import { BPlusTreeNode } from "./BPlusTreeNode";

export function traverseDFS<K, V>(node: BPlusTreeNode<K, V>): void {
  if (node.isLeaf) {
    for (let i = 0; i < node.keys.length; i++) {
      console.log(`Key: ${node.keys[i]}, Value: ${node.values[i]}`);
    }
    return;
  }
  let i;
  for (i = 0; i < node.keys.length; i++) {
    traverseDFS(node.children[i]);
  }
  traverseDFS(node.children[i]);
}

export function traverseLeaves<K, V>(root: BPlusTreeNode<K, V>): void {
  // Find the first leaf node
  let curr = root;
  while (!curr.isLeaf) {
    curr = curr.children[0];
  }

  // Follow leaf list next pointers
  let leaf: BPlusTreeNode<K, V> | null = curr;
  while (leaf) {
    for (let i = 0; i < leaf.keys.length; i++) {
      console.log(`Key: ${leaf.keys[i]}, Value: ${leaf.values[i]}`);
    }
    leaf = leaf.next;
  }
}
