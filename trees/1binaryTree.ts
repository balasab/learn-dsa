/*
    Binary tree properties:
    - Each node can have at most 2 children
    - A tree with n nodes has n-1 edges
    - A tree with n nodes has at least 1 and at most n leaf nodes
    
    Types of Binary tree:
        1. Skewed Binary Tree (Bad for Search Time Complexity: O(n)) 
            - Tree is like a linked list
            - All nodes are on the left or all nodes are on the right
        2. Balanced Binary Tree (Good for Search Time Complexity: O(log n))
            - Height of the tree is minimized
            - Balance factor of every node is 0 or 1 or -1 (Height of left subtree - Height of right subtree)  
        3. Complete Binary Tree
            - All levels are completely filled except possibly the last level
            - Last level is filled from left to right
        4. Perfect Binary Tree
            - All levels are completely filled
        5. Full Binary Tree 
            - All nodes have 0 or 2 children

    Traversals: 
        1. Inorder Traversal (Left -> Root -> Right) [Sorted for BST]
        2. Preorder Traversal (Root -> Left -> Right) [Copy of Tree]
        3. Postorder Traversal (Left -> Right -> Root) [Delete Tree]
        4. Level Order Traversal (Breadth-First Search)
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    Insertion: O(n)
    Deletion: O(n)
    Search: O(n)
    Space Complexity (Worst Case): O(n)
    Space Complexity (Average Case): O(log n)
*/
class BinaryTree {
    value: number;
    left: BinaryTree | null;
    right: BinaryTree | null;
    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    bfs() {
        const queue: BinaryTree[] = [this];
        while (queue.length) {
            const node: BinaryTree | undefined = queue.shift();
            if (!node) continue;
            console.log(node.value);
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
    }
    /*
        Applications: 
        1. File Directory search
        2. Deep copy
        3. Expression Trees Regex matching
    */
    dfsPreOrder() {
        if (this === null) return;
        console.log(this.value);
        this.dfsPreOrder.call(this.left);
        this.dfsPreOrder.call(this.right);
    }
    /*
        Applications: 
        1. Check if the tree is a Binary Search Tree (BST)
        2. Used where precendence matters for operations such as {}, [],()
    */
    dfsInOrder() {
        if (this === null) return;
        this.dfsInOrder.call(this.left);
        console.log(this.value);
        this.dfsInOrder.call(this.right);
    }
    /*
        Applications: 
        1. Delete Tree
        2. Free up memory
        3. File Directory Size calc
        4. Bottom up calculation
    */
    dfsPostOrder() {
        if (this === null) return;
        this.dfsPostOrder.call(this.left);
        this.dfsPostOrder.call(this.right);
        console.log(this.value);
    }
}

