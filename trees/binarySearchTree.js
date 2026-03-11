class binarySearchTree {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    insert(value) {
        if (value < this.value) {
            if (this.left === null) {
                this.left = new binarySearchTree(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (this.right === null) {
                this.right = new binarySearchTree(value);
            } else {
                this.right.insert(value);
            }
        }
    }
    find(value) {
        if (this.value === value) {
            return this;
        }
        if (value < this.value) {
            return this.left.find(value);
        }
        return this.right.find(value);
    }
    delete(value) {
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
}