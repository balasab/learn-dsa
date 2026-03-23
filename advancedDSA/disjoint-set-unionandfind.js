class DSU {
    constructor(n) {
        // parent[i] stores the parent of element i
        // Initially, every element is its own parent (its own set)
        this.parent = Array.from({ length: n }, (_, i) => i);

        // rank[i] stores the depth of the tree rooted at i
        this.rank = new Array(n).fill(0);
    }

    // Find the representative (root) of the set containing 'i'
    find(i) {
        if (this.parent[i] === i) {
            return i;
        }

        // Path Compression: recursively find the root and 
        // make it the direct parent of i to speed up future lookups
        return this.parent[i] = this.find(this.parent[i]);
    }

    // Union of two sets containing 'i' and 'j'
    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by Rank: Attach the shorter tree to the root of the taller tree
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootI] = rootJ;
                this.rank[rootJ]++;
            }
            return true; // Union successful (they were in different sets)
        }

        return false; // Already in the same set (indicates a cycle in graphs)
    }
}

// Example Usage:
const dsu = new DSU(5); // Create 5 elements (0 to 4)

dsu.union(0, 1);
dsu.union(1, 2);

console.log(dsu.find(0) === dsu.find(2)); // true (connected)
console.log(dsu.find(0) === dsu.find(3)); // false (not connected)