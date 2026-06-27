export class BPlusTreeNode<K, V> {
  keys: K[];
  values: V[]; // Only for leaf nodes
  children: BPlusTreeNode<K, V>[]; // Only for internal nodes
  isLeaf: boolean;
  next: BPlusTreeNode<K, V> | null;
  prev: BPlusTreeNode<K, V> | null;

  constructor(isLeaf: boolean = true) {
    this.keys = [];
    this.values = [];
    this.children = [];
    this.isLeaf = isLeaf;
    this.next = null;
    this.prev = null;
  }
}
