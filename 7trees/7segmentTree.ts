/*
    In the real world, it is used where there are frequent search or update on range queries.
    Example: Stock, Map Zoom in and out, etc.

    Applications:
    1. Range Sum Query
*/

class SegmentTree {
    n: number;
    tree: number[];

    constructor(data: number[]) {
        this.n = data.length;
        // The tree size is bounded by 4 * n for a balanced binary tree.
        // We use 1-based indexing for nodes: root is at index 1.
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this.build(data, 1, 0, this.n - 1);
        }
    }

    /**
     * Build the tree: O(n) time complexity
     * * Example with data = [1, 3, 5, 7, 9, 11] (n=6)
     * - Root node 1 handles range [0, 5]
     * - Left child node 2 handles range [0, 2]
     * - Right child node 3 handles range [3, 5]
     */
    build(data: number[], node: number, start: number, end: number): void {
        // Base case: If start equals end, we've reached a leaf node representing a single element.
        if (start === end) {
            this.tree[node] = data[start];
            return;
        }

        let mid = Math.floor((start + end) / 2);

        // 1. Recursively build the left subtree. Left child is always at index: (2 * node)
        this.build(data, 2 * node, start, mid);

        // 2. Recursively build the right subtree. Right child is always at index: (2 * node + 1)
        this.build(data, 2 * node + 1, mid + 1, end);

        // 3. Combine results: Post-order merge. The parent stores the sum of its two children.
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    /**
     * Update a value at a specific index: O(log n) time complexity
     * * Example: st.update(1, 10) on [1, 3, 5, 7, 9, 11]
     * - Root (node 1, [0,5]) sees idx 1 <= mid(2). Moves Left to node 2 ([0,2]).
     * - Node 2 ([0,2]) sees idx 1 > mid(1). Moves Right to node 5 ([1,2]).
     * - Node 5 ([1,2]) sees idx 1 <= mid(1). Moves Left to node 10 ([1,1]).
     * - Node 10 is a leaf! Updates value to 10.
     * - Call stack unwinds, recalculating parent sums up to the root.
     */
    update(idx: number, val: number, node: number = 1, start: number = 0, end: number = this.n - 1): void {
        // Base case: We found the exact leaf node representing the targeted index.
        if (start === end) {
            this.tree[node] = val;
            return;
        }

        let mid = Math.floor((start + end) / 2);

        // Binary search to locate the leaf node containing 'idx'
        if (idx <= mid) {
            // Target index is in the left half
            this.update(idx, val, 2 * node, start, mid);
        } else {
            // Target index is in the right half
            this.update(idx, val, 2 * node + 1, mid + 1, end);
        }

        // After updating the child, re-calculate the current node's sum to keep the tree accurate.
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    /**
     * Query a range [L, R]: O(log n) time complexity
     * * Example: st.query(1, 3) on [1, 3, 5, 7, 9, 11]
     * - Root (node 1, [0,5]) partial overlaps with query [1,3]. Splits query.
     * - Left child (node 2, [0,2]) partial overlaps [1,3] -> Intersects at [1,2]. Splits again.
     * - Node 4 ([0,0]) -> Out of range. Returns 0.
     * - Node 5 ([1,2]) -> Full overlap (since [1,2] is fully inside [1,3]). Returns its total (3+5 = 8).
     * - Right child (node 3, [3,5]) partial overlaps [1,3] -> Intersects at [3,3]. Splits again.
     * - Node 6 ([3,4]) partial overlaps [3,3]. Splits again... eventually returns 7.
     * - Node 7 ([5,5]) -> Out of range. Returns 0.
     * - Total returned: 0 + 8 + 7 + 0 = 15.
     */
    query(L: number, R: number, node: number = 1, start: number = 0, end: number = this.n - 1): number {
        // Case 1: Complete Disjunction / Out of Range
        // The current node segment [start, end] has no overlap with the query segment [L, R].
        if (R < start || end < L) {
            return 0; // Return identity element for addition
        }

        // Case 2: Complete Overlap
        // The current node segment [start, end] is completely buried within the query segment [L, R].
        if (L <= start && end <= R) {
            return this.tree[node];
        }

        // Case 3: Partial Overlap
        // The segment is partially inside and partially outside. Split and ask both children.
        let mid = Math.floor((start + end) / 2);
        let leftSum = this.query(L, R, 2 * node, start, mid);
        let rightSum = this.query(L, R, 2 * node + 1, mid + 1, end);

        return leftSum + rightSum;
    }
}

// --- Verification Output ---
const numbers = [1, 3, 5, 7, 9, 11];
const st = new SegmentTree(numbers);

console.log(`Sum of range [1, 3]: ${st.query(1, 3)}`); // Output: 15 (3 + 5 + 7)
st.update(1, 10);                                     // Index 1 updates from 3 to 10
console.log(`Sum of range [1, 3] after update: ${st.query(1, 3)}`); // Output: 22 (10 + 5 + 7)