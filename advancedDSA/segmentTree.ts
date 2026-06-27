class SegmentTree {
    n: number;
    tree: number[];

    constructor(data: number[]) {
        this.n = data.length;
        // The tree size is at most 4 * n
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this.build(data, 1, 0, this.n - 1);
        }
    }

    // Build the tree: O(n)
    build(data: number[], node: number, start: number, end: number): void {
        if (start === end) {
            this.tree[node] = data[start];
            return;
        }
        let mid = Math.floor((start + end) / 2);
        this.build(data, 2 * node, start, mid);
        this.build(data, 2 * node + 1, mid + 1, end);
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    // Update a value at a specific index: O(log n)
    update(idx: number, val: number, node: number = 1, start: number = 0, end: number = this.n - 1): void {
        if (start === end) {
            this.tree[node] = val;
            return;
        }
        let mid = Math.floor((start + end) / 2);
        if (idx <= mid) {
            this.update(idx, val, 2 * node, start, mid);
        } else {
            this.update(idx, val, 2 * node + 1, mid + 1, end);
        }
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    // Query a range [L, R]: O(log n)
    query(L: number, R: number, node: number = 1, start: number = 0, end: number = this.n - 1): number {
        if (R < start || end < L) {
            return 0; // Out of range
        }
        if (L <= start && end <= R) {
            return this.tree[node]; // Full overlap
        }
        let mid = Math.floor((start + end) / 2);
        let leftSum = this.query(L, R, 2 * node, start, mid);
        let rightSum = this.query(L, R, 2 * node + 1, mid + 1, end);
        return leftSum + rightSum;
    }
}

// --- Example Usage ---
const numbers = [1, 3, 5, 7, 9, 11];
const st = new SegmentTree(numbers);

console.log(st.query(1, 3)); // Output: 15 (3 + 5 + 7)
st.update(1, 10);            // Change index 1 from 3 to 10
console.log(st.query(1, 3)); // Output: 22 (10 + 5 + 7)