/*
    AVL tree is a self-balancing binary search tree.
    It is named after its inventors G.M. Adelson-Velsky and E.M. Landis.

    Properties:
    1. It is a binary search tree
    2. The height of the left subtree and the height of the right subtree differ by at most 1
    3. The height of the tree is balanced
    4. The height of an empty tree is -1
    5. The height of a tree with one node is 0
    6. The height of a tree with n nodes is O(log n)    
    
    Time Complexity:
    1. Search: O(log n)
    2. Insert: O(log n)
    3. Delete: O(log n)
    4. Space: O(n)

    Why need AVL tree?
    In binary search tree, if we insert elements in increasing order, 
    then the tree will be skewed and the time complexity will be O(n).
    In AVL tree, we keep the tree balanced and the time complexity will be O(log n).

    How to keep the tree balanced?
    We use rotations to keep the tree balanced.
    There are 4 types of rotations:
    1. Left rotation
    2. Right rotation
    3. Left-right rotation
    4. Right-left rotation

    Consider pulling the string when the height has difference of 2
*/
class AVLNode {
    public value: number;
    public left: AVLNode | null = null;
    public right: AVLNode | null = null;
    public height: number = 1; // New nodes start at height 1

    constructor(value: number) {
        this.value = value;
    }
}

export class AVLTree {
    private root: AVLNode | null = null;

    // Get the height of a node safely
    private getHeight(node: AVLNode | null): number {
        return node ? node.height : 0;
    }

    // Calculate the Balance Factor of a node
    private getBalanceFactor(node: AVLNode | null): number {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    // --- ROTATIONS ("String Pulls") ---

    // Right Rotation (Fixes LL Imbalance)
    /* 
        30 (y)
       /  \
     20(x) 40
     /  \
    10  25 (T2)

    After Rotation:
        20 (x)
       /    \
     10      30 (y)
     /      /  \
    5     25    40
         (T2)
    */

    private rightRotate(y: AVLNode): AVLNode {
        // 1. x becomes Node 20
        const x = y.left!;

        // 2. T2 captures Node 25 
        const T2 = x.right;

        // --- Perform rotation ---

        // 3. Node 20's right pointer shifts from 25 to point to Node 30 (y)
        x.right = y;

        // 4. Node 30's left pointer shifts from 20 to pick up Node 25 (T2)
        y.left = T2;

        // --- Update heights ---
        // 5. y (30) now has left (25, ht 1) and right (40, ht 1) -> height = 2
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        // 6. x (20) now has left (10, ht 2) and right (30, ht 2) -> height = 3
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        // 7. Node 20 is returned as the new root of this section
        return x;
    }

    // Left Rotation (Fixes RR Imbalance)
    /*
        10 (x)
       /  \
      5   20 (y)
         /  \
       15    30
      (T2)

      After rotation:
           20 (y)
         /    \
       10      30
      /  \       \
     5   15       35
        (T2)
    */
    private leftRotate(x: AVLNode): AVLNode {
        // 1. y becomes Node 20 (x's right child)
        const y = x.right!;

        // 2. T2 captures Node 15 (y's left child)
        const T2 = y.left;

        // --- Perform rotation ---

        // 3. Node 20's left pointer shifts from 15 to point down to Node 10 (x)
        y.left = x;

        // 4. Node 10's right pointer shifts from 20 to pick up Node 15 (T2)
        x.right = T2;

        // --- Update heights ---
        // 5. x (10) now has left (5, ht 1) and right (15, ht 1) -> height = 2
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        // 6. y (20) now has left (10, ht 2) and right (30, ht 2) -> height = 3
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        // 7. Node 20 is returned as the new local root
        return y;
    }

    // Public insert method
    public insert(value: number): void {
        this.root = this.insertNode(this.root, value);
    }

    // Recursive helper to insert a number and rebalance
    private insertNode(node: AVLNode | null, value: number): AVLNode {
        // 1. Standard BST insertion
        if (node === null) {
            return new AVLNode(value);
        }

        if (value < node.value) {
            node.left = this.insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.insertNode(node.right, value);
        } else {
            return node; // Duplicates are ignored
        }

        // 2. Update height of this ancestor node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // 3. Check Balance Factor
        const balance = this.getBalanceFactor(node);

        // --- Rebalancing Logic ---
        /*
        Case 1: Left Left (LL) -> Single Right Rotation
        Imbalance occurs because a node was inserted into the left child's left subtree.
        
              Before Rotation (Unbalanced):          After rightRotate(30):
                        30 (node)                              20
                       /                                      /  \
                      20 (node.left)                         10   30
                     /                                     
              insert(10)                                     
        */
        if (balance > 1 && value < node.left!.value) {
            return this.rightRotate(node);
        }
        /*  
        Case 2: Right Right (RR) -> Single Left Rotation
        Imbalance occurs because a node was inserted into the right child's right subtree.
        
              Before Rotation (Unbalanced):          After leftRotate(10):
                        10 (node)                              20
                         \                                    /  \
                          20 (node.right)                    10   30
                           \
                            30 (inserted value)
        */
        if (balance < -1 && value > node.right!.value) {
            return this.leftRotate(node);
        }
        /*
        Case 3: Left Right (LR) -> Double Rotation (Left then Right)
        Imbalance occurs because a node was inserted into the left child's right subtree.
        
              Before Rotation:             Step 1: leftRotate(node.left)        Step 2: rightRotate(30)
                 30 (node)                             30 (node)                           20
                /                                     /                                   /  \
               10 (node.left)                        20 (node.left)                      10   30
                \                                   /
                 20 (inserted value)               10
        */
        if (balance > 1 && value > node.left!.value) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        /*
        Case 4: Right Left (RL) -> Double Rotation (Right then Left)
        Imbalance occurs because a node was inserted into the right child's left subtree.
        
              Before Rotation:             Step 1: rightRotate(node.right)      Step 2: leftRotate(10)
                 10 (node)                             10 (node)                           20
                  \                                     \                                 /  \
                   30 (node.right)                       20 (node.right)                 10   30
                  /                                       \
                 20 (inserted value)                       30
        
        */
        if (balance < -1 && value < node.right!.value) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        return node;
    }

    // Utility to print the tree structure sideways in the console
    public printTree(): void {
        this.printSpacer(this.root, 0);
    }

    private printSpacer(curr: AVLNode | null, space: number): void {
        const COUNT = 6;
        if (curr === null) return;

        space += COUNT;
        this.printSpacer(curr.right, space);
        console.log(" ".repeat(space - COUNT) + `-> ${curr.value} (h:${curr.height})`);
        this.printSpacer(curr.left, space);
    }
}

// --- Quick Test Execution ---
const tree = new AVLTree();

console.log("Building AVL Tree dynamically...");
tree.insert(40);
tree.insert(20);
tree.insert(10); // Triggers LL rotation around 40
tree.insert(25);
tree.insert(30); // Triggers LR double rotation around 20

tree.printTree();