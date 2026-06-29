/*
  Represents a node in a B+ Tree.
   B+ Tree Structural Properties:
  1. Internal Nodes:
  - Store only search/routing keys and children pointers.
  - Do not store values (values array is empty).
  - Only act as a road Map doesn't hold the keys
  2. Leaf Nodes:
  - Store actual key-value pairs (both keys and values arrays are populated).
  - Have no children pointers (children array is empty).
  - Maintain links to sibling leaf nodes (next, prev) for fast sequential scans.
  - Parent key will be duplicated in the first position of the next node
  - the last key of the prev node
  [ Root Node ]
                                             | Keys: [ 25 ] |
                                             /                \
                                            /                  \
                                           v                    v
                          [ Internal Node L1 ]                 [ Internal Node L2 ]
                          | Keys: [ 10, 18 ] |                      | Keys: [ 35, 45 ] |
                         /         |        \                       /          |        \
         +--------------+          |         +---+                  +---+      |         +--------------+
         |                         |             |                  |          |                        |
         v                         v             v                  v          v                        v
    [ Leaf Node A ] <---> [ Leaf Node B ] <---> [ Leaf C ] <---> [ Leaf D ] <---> [ Leaf E ] <---> [ Leaf F ]
    Keys: [2, 5, 8]       Keys: [10, 12, 15]    Keys:    `       Keys:    `       Keys:    `       Keys:    `
    Vals: [Two,Five,      Vals: [Ten,Twelve,    [18, 20, 22]     [25,28,30,32]    [35, 40]          [45,50,55,60]
           Eight]                Fifteen]       Vals:            Vals:            Vals:             Vals:
                                                [Eighteen,       [TwentyFive,    [ThirtyFive,     [FortyFive,
                                                 Twenty,         TwentyEight,    Forty]           Fifty,
                                                 TwentyTwo]      Thirty,                          FiftyFive,
                                                                 ThirtyTwo]                       Sixty]
 */
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