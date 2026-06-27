/*
  Each key holds a value
  Childern is directly linked with the keys, i.e.
  For a node with keys [k1, k2, k3]
  The first child will be less than k1
  The second child will be between k1 and k2
  The third child will be between k2 and k3
  The fourth child will be greater than k3

  For keys length of 4, children length will be 5
  No child = undefined
  In children array, the undefined values can be
    - At the beginning (before first key)
    - In between keys (between k1 and k2, k2 and k3, etc.)
    - At the end (after last key)
  This is why array is needed instead of linked list
  
  iSleaf represents there are no child nodes for this node
*/
export class BTreeNode<K, V> {
  keys: K[];
  values: V[];
  children: BTreeNode<K, V>[];
  isLeaf: boolean;

  constructor(isLeaf: boolean = true) {
    this.keys = [];
    this.values = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}
