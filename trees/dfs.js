class dfsTwoChildMaxAndOneParent {
    constructor(root) {
        this.root = root;
    }
    dfs() {
        let stack = [this.root];
        while (stack.length > 0) {
            let node = stack.pop();
            if (node.left && node.right) {
                console.log(node.value);
            }
            if (node.left) {
                stack.push(node.left);
            }
            if (node.right) {
                stack.push(node.right);
            }
        }
    }
    inorder() {
        if (this.left) {
            this.left.inorder();
        }
        console.log(this.value);
        if (this.right) {
            this.right.inorder();
        }
    }
    preorder() {
        console.log(this.value);
        if (this.left) {
            this.left.preorder();
        }
        if (this.right) {
            this.right.preorder();
        }
    }
    postorder() {
        if (this.left) {
            this.left.postorder();
        }
        if (this.right) {
            this.right.postorder();
        }
        console.log(this.value);
    }
} 