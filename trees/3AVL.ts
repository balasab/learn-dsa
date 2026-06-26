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

    private rightRotate(y: AVLNode): AVLNode {
        const x = y.left!; // ! is a non-null assertion operator. It tells the compiler that x is not null.
        const T2 = x.right; // T2 means The second node

        // Perform rotation (Pull x up, y drops right)
        x.right = y;
        y.left = T2;

        // Update heights
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x; // x is the new local root
    }

    // Left Rotation (Fixes RR Imbalance)
    private leftRotate(x: AVLNode): AVLNode {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation (Pull y up, x drops left)
        y.left = x;
        x.right = T2;

        // Update heights
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y; // y is the new local root
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

        // Case 1: Left Left (LL) -> Single Right Rotation
        if (balance > 1 && value < node.left!.value) {
            return this.rightRotate(node);
        }

        // Case 2: Right Right (RR) -> Single Left Rotation
        if (balance < -1 && value > node.right!.value) {
            return this.leftRotate(node);
        }

        // Case 3: Left Right (LR) -> Double Rotation (Left then Right)
        if (balance > 1 && value > node.left!.value) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        // Case 4: Right Left (RL) -> Double Rotation (Right then Left)
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