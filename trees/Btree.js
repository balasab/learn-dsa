class BTreeNode {
  constructor(isLeaf) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
    /*
      Property,Minimum,Maximum
      Keys,t-1,2t-1
      Children,t,2t
    */
  }
}
class BTree {
  constructor(t) {
    this.root = new BTreeNode(true);
    this.t = t; // Minimum degree of keys and children
  }

  // Search for a key
  search(node, k) {
    let i = 0;
    while (i < node.keys.length && k > node.keys[i]) {
      i++;
    }

    if (node.keys[i] === k) return node;
    if (node.isLeaf) return null;

    return this.search(node.children[i], k);
  }

  // Insert a new key
  insert(k) {
    let root = this.root;

    // if keys are full, split the root
    if (root.keys.length === 2 * this.t - 1) {
      /*
        Algorithm:
        1. Create a new node
        2. Make the new node as the root
        3. attach old root as the left most child of the new root
        4. split the old root
        5. insert the key into the new root
      */
      let newNode = new BTreeNode(false);
      this.root = newNode;
      newNode.children.push(root);
      this.splitChild(newNode, 0, root);
      this.insertNonFull(newNode, k);
    } else {
      // insert the key into the non full root
      this.insertNonFull(root, k);
    }
  }

  splitChild(parent, i, fullNode) {
    let t = this.t;
    // Create a new node
    let newNode = new BTreeNode(fullNode.isLeaf);
    // move the second half keys to the new node
    newNode.keys = fullNode.keys.splice(t, t - 1);
    // if the node is not a leaf, move the second half of the children to the new node
    if (!fullNode.isLeaf) {
      newNode.children = fullNode.children.splice(t, t);
    }
    // remove the middle key from the full node
    let middleKey = fullNode.keys.pop();
    // insert the middle key into the parent after the given index
    parent.keys.splice(i, 0, middleKey);
    // insert the new node as the child of the parent after the given index
    parent.children.splice(i + 1, 0, newNode);
  }

  insertNonFull(node, k) {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      // leaf node and it is not full yet so find a place to insert the key
      // Just move all the key to the right until you find a smaller one.
      node.keys.push(null);
      while (i >= 0 && node.keys[i] > k) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = k;
    } else {

      while (i >= 0 && node.keys[i] > k) {
        i--;
      }
      i++;
      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i, node.children[i]);
        if (node.keys[i] < k) i++;
      }
      this.insertNonFull(node.children[i], k);
    }
  }
}