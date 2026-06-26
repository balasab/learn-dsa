/*
    Propertites:
    1. BinarySearchTree is highly for searching, sorting and retrieving
    2. All the left nodes are smaller than the root node
    3. All the right nodes are greater than the root node
    4. Duplicates are not allowed generally
*/
class BinarySearchTree {
    value: number;
    left: BinarySearchTree | null;
    right: BinarySearchTree | null;
    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    insert(value: number): void {
        if (value < this.value) {
            if (this.left === null) {
                this.left = new BinarySearchTree(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (this.right === null) {
                this.right = new BinarySearchTree(value);
            } else {
                this.right.insert(value);
            }
        }
    }
    search(value: number): BinarySearchTree | null {
        if (this.value === value) {
            return this;
        }
        if (value < this.value) {
            if (this.left === null) {
                return null;
            } else {
                return this.left.search(value);
            }
        } else {
            if (this.right === null) {
                return null;
            } else {
                return this.right.search(value);
            }
        }
    }
    remove(value: number): void {
        if (value < this.value) {
            if (this.left === null) {
                return;
            } else {
                this.left.remove(value);
            }
        } else {
            if (this.right === null) {
                return;
            } else {
                this.right.remove(value);
            }
        }
    }
    sort(): number[] {
        // In-order traversal of BST is sorted
        const result: number[] = [];
        if (this.left !== null) {
            result.push(...this.left.sort());
        }
        result.push(this.value);
        if (this.right !== null) {
            result.push(...this.right.sort());
        }
        return result;
    }
}