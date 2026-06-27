/*
 Can degenerate to O(n) in worst case (very slow) 
 Can be flatted a Linked list
 Time Complexity: O(n) 
 Space Complexity: O(n)
*/
export class DSUWithoutRank {
    parent: number[];
    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, i) => i);
    }

    find(i: number): number {
        if (this.parent[i] === i) return i;
        // Path compression
        return this.parent[i] = this.find(this.parent[i]);
    }

    union(i: number, j: number): void {
        let rootI = this.find(i);
        let rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ; // Arbitrary attachment
        }
    }
}
/*
    Uses Union by Rank (Optimised)
    Time Complexity: O(log n) as we store the height of the tree bound by 2^height >= N
    Space Complexity: O(n) as we store the rank of each element
*/
export class DSUWithRank {
    parent: number[];
    rank: number[];
    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(0); // Tracks tree height bound
    }

    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]); // Path compression
    }

    union(i: number, j: number): void {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by Rank
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootJ] = rootI;
                this.rank[rootI]++; // Only increases if depths were equal
            }
        }
    }
}