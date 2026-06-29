import { BPlusTreeNode } from "./BPlusTreeNode";
import type { BPlusTree } from "./BPlusTree";

/**
 * Inserts a key-value pair into the B+ Tree using a top-down proactive splitting approach.
 * If the root is full, it splits before proceeding down the tree, increasing the tree height by 1.
 * 
 * ### Example:
 * ```typescript
 * import { BPlusTree } from "./BPlusTree";
 * 
 * // Create a B+ Tree with minimum degree t = 2 (Max keys per node = 3, Max children = 4)
 * const btree = new BPlusTree<number, string>(2);
 * 
 * btree.insert(10, "Ten");
 * btree.insert(20, "Twenty");
 * btree.insert(5, "Five"); // At this point, leaf root is full: [5, 10, 20]
 * 
 * btree.insert(15, "Fifteen"); // Triggers split!
 * // Splitting Leaf Node causes key 15 to be promoted to a new internal root.
 * // Resulting structure:
 * //               [ 15 ]
 * //              /      \
 * //      [5, 10] <=====> [15, 20]
 * ```
 */
export function insert<K, V>(btree: BPlusTree<K, V>, key: K, value: V): void {
  const r = btree.root;
  const t = btree.t;

  // If root is full, the tree grows in height
  if (r.keys.length === 2 * t - 1) {
    const s = new BPlusTreeNode<K, V>(false);
    btree.root = s;
    s.children.push(r);
    splitChild(s, 0, r, t);
    insertNonFull(s, key, value, t);
  } else {
    insertNonFull(r, key, value, t);
  }
}

/**
 * Inserts a key-value pair into a non-full node.
 * Traverses down the tree proactively splitting full child nodes along the way.
 */
function insertNonFull<K, V>(node: BPlusTreeNode<K, V>, key: K, value: V, t: number): void {
  let i = node.keys.length - 1;

  if (node.isLeaf) {
    // If key already exists in the leaf, overwrite the value
    let existsIdx = -1;
    for (let j = 0; j < node.keys.length; j++) {
      if (node.keys[j] === key) {
        existsIdx = j;
        break;
      }
    }

    if (existsIdx !== -1) {
      node.values[existsIdx] = value;
      return;
    }

    // Find the position to insert and shift keys/values to the right
    while (i >= 0 && key < node.keys[i]) {
      node.keys[i + 1] = node.keys[i];
      node.values[i + 1] = node.values[i];
      i--;
    }
    node.keys[i + 1] = key;
    node.values[i + 1] = value;
  } else {
    // Find the child that will have the new key
    while (i >= 0 && key < node.keys[i]) {
      i--;
    }
    i++;

    // Proactively split child node if it is full
    if (node.children[i].keys.length === 2 * t - 1) {
      splitChild(node, i, node.children[i], t);

      // In a B+ Tree internal node, the right child has keys >= the routing key.
      // So if the inserting key is greater than or equal to parent.keys[i],
      // we must increment i to traverse into the new right sibling child.
      if (key >= node.keys[i]) {
        i++;
      }
    }
    insertNonFull(node.children[i], key, value, t);
  }
}

/**
 * Splits a full child node of a B+ Tree parent node.
 * Routes to leaf split or internal split helper functions.
 */
function splitChild<K, V>(
  parent: BPlusTreeNode<K, V>,
  i: number,
  fullChild: BPlusTreeNode<K, V>,
  t: number
): void {
  if (fullChild.isLeaf) {
    splitLeafChild(parent, i, fullChild, t);
  } else {
    splitInternalChild(parent, i, fullChild, t);
  }
}

/*
    Splits a full leaf child of a B+ Tree parent node.
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Max keys = 5, Max children = 6
    Full leaf contains 2t - 1 = 5 keys. Split at index t = 3.

    BEFORE SPLIT:
    
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
      fullChild   [Other children...]
    +-------------------------+
    |  2 |  4 |  6 |  8 |  9  |
    +-------------------------+

    AFTER SPLIT (First key of right node '8' promoted; leaf links updated):
    
            Parent Node
            +----+----+
            |  8 | 10 |
            +----+----+
           /     |     \
    fullChild  newNode  [Other children...]
    +----+      +----+
    | 2| 4| 6|->| 8| 9|
    +----+      +----+
 */
function splitLeafChild<K, V>(
  parent: BPlusTreeNode<K, V>,
  i: number,
  fullChild: BPlusTreeNode<K, V>,
  t: number
): void {
  const newNode = new BPlusTreeNode<K, V>(true);
  const mid = t;

  // Split keys and values from index t onwards into the new leaf node
  newNode.keys = fullChild.keys.splice(mid);
  newNode.values = fullChild.values.splice(mid);

  // Adjust leaf sibling links (doubly linked list)
  newNode.next = fullChild.next;
  if (fullChild.next) {
    fullChild.next.prev = newNode;
  }
  fullChild.next = newNode;
  newNode.prev = fullChild;

  // Insert the promoted key (first key of right node) into parent keys
  parent.keys.splice(i, 0, newNode.keys[0]);

  // Insert the new child pointer into parent children
  parent.children.splice(i + 1, 0, newNode);
}

/*
    Splits a full internal child of a B+ Tree parent node.
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Max keys = 5, Max children = 6
    Full internal child contains 2t - 1 = 5 keys. Median is at index t - 1 = 2.

    BEFORE SPLIT:
    
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
      fullChild   [Other children...]
    +-------------------------+
    |  2 |  4 |  6 |  8 |  9  |
    +-------------------------+

    AFTER SPLIT (Median key '6' promoted and removed from children):
    
            Parent Node
            +----+----+
            |  6 | 10 |
            +----+----+
           /     |     \
    fullChild  newNode  [Other children...]
     +----+    +----+
     | 2| 4|    | 8| 9|
     +----+    +----+
 */
function splitInternalChild<K, V>(
  parent: BPlusTreeNode<K, V>,
  i: number,
  fullChild: BPlusTreeNode<K, V>,
  t: number
): void {
  const newNode = new BPlusTreeNode<K, V>(false);
  const mid = t - 1;
  const promoKey = fullChild.keys[mid];

  // Move keys and children from index mid + 1 (which is t) onwards to newNode
  newNode.keys = fullChild.keys.splice(mid + 1);
  newNode.children = fullChild.children.splice(mid + 1);

  // Remove the median element from fullChild since it is promoted
  fullChild.keys.pop(); // removes key at index `mid`

  // Insert the promoted key and the new child pointer into the parent
  parent.keys.splice(i, 0, promoKey);
  parent.children.splice(i + 1, 0, newNode);
}
