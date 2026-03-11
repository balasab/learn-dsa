class bfsTwoChildMaxAndOneParent {
    constructor(root) {
        this.root = root;
    }
    bfs() {
        let queue = [this.root];
        while (queue.length > 0) {
            let node = queue.shift();
            if (node.left && node.right) {
                console.log(node.value);
            }
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
    }
} 