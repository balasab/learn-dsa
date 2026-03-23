class DisjointSet {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }

    find(i) {
        if (this.parent[i] === i) return i;
        // Path compression for efficiency
        return (this.parent[i] = this.find(this.parent[i]));
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
}

class KruskalsAlgorithm {
    constructor(vertices) {
        this.vertices = vertices;
        this.edges = [];
    }

    addEdge(u, v, weight) {
        this.edges.push({ u, v, weight });
    }

    findMST() {
        const mst = [];
        const dsu = new DisjointSet(this.vertices);

        // 1. Sort all edges by weight in non-decreasing order
        this.edges.sort((a, b) => a.weight - b.weight);

        for (let edge of this.edges) {
            // 2. If adding the edge doesn't form a cycle, include it
            if (dsu.union(edge.u, edge.v)) {
                mst.push(edge);
            }

            // Optimization: Stop if we have V-1 edges
            if (mst.length === this.vertices - 1) break;
        }

        return mst;
    }
}

// --- Usage ---
const graph = new KruskalsAlgorithm(4);
graph.addEdge(0, 1, 10);
graph.addEdge(0, 2, 6);
graph.addEdge(0, 3, 5);
graph.addEdge(1, 3, 15);
graph.addEdge(2, 3, 4);

const result = graph.findMST();
console.log("Kruskal's MST Edges:", result);