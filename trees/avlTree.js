/*
    Definition: AVL Tree is a self-balancing binary search tree 
    in which the difference between the heights of the left and right subtrees of any node 
    is at most 1.

    Time Complexity: O(log n)
    Space Complexity: O(n)
*/
class avlTree {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        // each node has a height 
        // which is the number of edges on the longest path from the node to a leaf
        this.height = 1;
    }
    insert(value) {
        // Insert the new node into leaf position
        // Time complexity: O(log n) Space complexity: O(log n) 
        // if the tree is balanced
        if (value < this.value) {
            if (this.left === null) {
                this.left = new avlTree(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (this.right === null) {
                this.right = new avlTree(value);
            } else {
                this.right.insert(value);
            }
        }
        // update the height of the all nodes
        this.updateHeight(this);
        // check the balance factor of the all nodes
        this.checkBalance(this);
    }
    checkBalance(node) {
        // Time complexity: O(1) Space complexity: O(1) 
        // if the tree is balanced
        let balanceFactor = this.getBalanceFactor(node);
        if (balanceFactor > 1) {
            // left heavy so pull the right
            if (this.getBalanceFactor(node.left) < 0) {
                // new node is in the right subtree of the left child
                this.left = this.leftRotate(node.left);
            }
            return this.rightRotate(node);
        }
        if (balanceFactor < -1) {
            // right heavy so pull the left
            if (this.getBalanceFactor(node.right) > 0) {
                // new node is in the left subtree of the right child
                this.right = this.rightRotate(node.right);
            }
            return this.leftRotate(node);
        }
        return node;
    }
    delete(value) {
        // Time complexity: O(log n) Space complexity: O(log n) 
        // if the tree is balanced
        if (this.value === value) {
            if (this.left === null && this.right === null) {
                return null;
            }
            if (this.left === null) {
                return this.right;
            }
            if (this.right === null) {
                return this.left;
            }
            let temp = this.right;
            while (temp.left !== null) {
                temp = temp.left;
            }
            this.value = temp.value;
            this.right = this.right.delete(temp.value);
        } else if (value < this.value) {
            this.left = this.left.delete(value);
        } else {
            this.right = this.right.delete(value);
        }
        return this;
    }
    find(value) {
        // Time complexity: O(log n) Space complexity: O(log n) 
        // if the tree is balanced
        if (this.value === value) {
            return this;
        }
        if (value < this.value) {
            return this.left.find(value);
        }
        return this.right.find(value);
    }
    getHeight(node) {
        if (node === null) {
            return 0;
        }
        return node.height;
    }
    getBalanceFactor(node) {
        // Balance Factor = height of left subtree - height of right subtree
        // Time complexity: O(1) Space complexity: O(1)
        if (node === null) {
            return 0;
        }
        return this.getHeight(node.left) - this.getHeight(node.right);
    }
    updateHeight(node) {
        // Time complexity: O(1) Space complexity: O(1)
        if (node === null) {
            return;
        }
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }
    rightRotate(y) {
        // Time complexity: O(1) Space complexity: O(1)
        // left child will be our new root
        // root will be our new right child
        // left child's right subtree will be our new root's left subtree
        // SWAP root and left child, left child's right subtree will be our new root's left subtree
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }
    leftRotate(x) {
        // Time complexity: O(1) Space complexity: O(1)
        // right child will be our new root
        // root will be our new left child
        // right child's left subtree will be our new root's right subtree
        // SWAP root and right child, right child's left subtree will be our new root's right subtree
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }
}