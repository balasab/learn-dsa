/*
    FenwickTree is also known as Binary Indexed Tree (BIT)
    Solves problem same as segment tree. Handle dynamic range queries and updates.
    
    Main Advantage over segment tree: space efficient, cleaner
*/
class FenwickTree {
    tree: number[];
    n: number;

    constructor(size: number) {
        this.n = size;
        this.tree = new Array(size + 1).fill(0);
    }

    // Update value at index (1-based) by delta: O(log n)
    update(idx: number, delta: number): void {
        while (idx <= this.n) {
            this.tree[idx] += delta;
            idx += idx & -idx;
        }
    }

    // Query prefix sum from 1 to idx: O(log n)
    query(idx: number): number {
        let sum = 0;
        while (idx > 0) {
            sum += this.tree[idx];
            idx -= idx & -idx;
        }
        return sum;
    }

    // Query range sum from left to right: O(log n)
    queryRange(left: number, right: number): number {
        return this.query(right) - this.query(left - 1);
    }
}

// Example usage:
const ft = new FenwickTree(5);
ft.update(1, 3);
ft.update(3, 5);
console.log("Sum of first 3 elements:", ft.query(3)); // Output: 8
console.log("Range sum of [2, 4]:", ft.queryRange(2, 4)); // Output: 5
