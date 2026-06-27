import { BTreeNode } from "./BTreeNode";
import { BTree } from "./BTree";

export function insert<K, V>(btree: BTree<K, V>, key: K, value: V): void {
  const r = btree.root;
  const t = btree.t;

  // If root is full, the tree grows in height
  if (r.keys.length === 2 * t - 1) {
    const s = new BTreeNode<K, V>(false);
    btree.root = s;
    s.children.push(r);
    splitChild(s, 0, r, t);
    insertNonFull(s, key, value, t);
  } else {
    insertNonFull(r, key, value, t);
  }
}

function insertNonFull<K, V>(node: BTreeNode<K, V>, key: K, value: V, t: number): void {
  let i = node.keys.length - 1;

  if (node.isLeaf) {
    // Find the position to insert and move greater keys ahead
    // We will always insert at the leaf node, but we may need to split the leaf node if it is full 
    // during the traversal
    while (i >= 0 && key < node.keys[i]) {
      node.keys[i + 1] = node.keys[i];
      node.values[i + 1] = node.values[i];
      i--;
    }
    node.keys[i + 1] = key;
    node.values[i + 1] = value;
  } else {
    // Find the child that will have the new key
    // EXAMPLE (t = 3, inserting key = 7):
    // - Initial state:
    //   node.keys = [10]
    //   node.children = [ fullChild([2, 4, 6, 8, 9]), rightChild([15, 20]) ]
    // - Loop:
    //   i = 0. Since key (7) < node.keys[0] (10), i decrements to -1.
    //   After loop, i is incremented to 0. Target child is node.children[0].
    while (i >= 0 && key < node.keys[i]) {
      i--;
    }
    i++;

    // If the child is full, split it first
    // recursively split the childern from the root to the leaf node
    if (node.children[i].keys.length === 2 * t - 1) {
      splitChild(node, i, node.children[i], t);

      // After split (median '6' promoted to parent):
      // - node.keys = [6, 10]
      // - node.children = [ leftNode([2, 4]), rightNode([8, 9]), rightChild([15, 20]) ]
      // - The promoted key is at index i = 0 (value: 6).
      // - Since inserting key (7) > node.keys[0] (6), we must increment i to 1 
      //   to recurse into the correct rightNode [8, 9].
      if (key > node.keys[i]) {
        i++;
      }
    }
    insertNonFull(node.children[i], key, value, t);
  }
}
/*
    Splits a full child node of a B-Tree parent node.
    =========================================================================
    VISUAL EXAMPLE (t = 3) -> Max keys = 5, Max children = 6
    Full child contains 2t - 1 = 5 keys. Median is at index t - 1 = 2.
    i = 0 because fullChild is at index 0 (only child for now)

    BEFORE SPLIT:
    
            Parent Node
            +----+
            | 10 |
            +----+
           /      \
      fullChild   [Other children...]
    +--------------------+
    |  2 |  4 |  6 |  8 |  9 |
    +--------------------+

    AFTER SPLIT (Median '6' promoted):
    
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
function splitChild<K, V>(parent: BTreeNode<K, V>, i: number, fullChild: BTreeNode<K, V>, t: number): void {
  /*
    parent: parent node
    i: index of the child to be split (in parent.children)
    fullChild: child node to be split
    t: minimum degree
  */

  // 1. Initialize a new node. It will occupy the same depth/level as fullChild.
  const newNode = new BTreeNode<K, V>(fullChild.isLeaf);

  // 2. Promote the median element up to the parent node at position 'i'.
  //    Before splice: fullChild.keys = [2, 4, 6, 8, 9], t-1 = 2 (Key: 6)
  parent.keys.splice(i, 0, fullChild.keys[t - 1]); // parent = [6, 10]
  parent.values.splice(i, 0, fullChild.values[t - 1]);

  // 3. Link the new node to the parent right after the original fullChild.
  parent.children.splice(i + 1, 0, newNode);

  // 4. Extract the right half of elements (indices from t to 2t-2) into the newNode.
  //    fullChild.keys.splice(3) removes [8, 9] from fullChild and assigns it to newNode.
  //    State right now:
  //    - fullChild.keys = [2, 4, 6]  (Median '6' is still lingering at the end)
  //    - newNode.keys   = [8, 9]
  newNode.keys = fullChild.keys.splice(t);
  newNode.values = fullChild.values.splice(t);

  // 5. Remove the median element from fullChild since it was promoted in Step 2.
  //    .pop() drops the '6' from the end of fullChild.keys.
  //    Final State: fullChild.keys = [2, 4]
  fullChild.keys.pop();
  fullChild.values.pop();

  // 6. If this is an internal node (!isLeaf), we must re-distribute its child pointers.
  //    EXAMPLE (If t = 3, fullChild had 6 child pointers C0 to C5):
  //    - fullChild.children.splice(3) cuts pointers [C3, C4, C5] out and gives them to newNode.
  //    - fullChild retains [C0, C1, C2].
  if (!fullChild.isLeaf) {
    newNode.children = fullChild.children.splice(t);
  }
}
