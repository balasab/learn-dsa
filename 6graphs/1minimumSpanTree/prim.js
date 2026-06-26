/*
    Prim's algorithm is a greedy algorithm that finds the minimum 
    spanning tree of a weighted undirected graph.
    It starts from an arbitrary vertex and grows the MST by 
    repeatedly adding the cheapest edge that connects a vertex 
    in the MST to a vertex outside the MST.

    Difference from Kruskal's Algorithm:
        - Prim's grows the tree from one vertex outwards
        - Kruskal's builds the tree by merging smaller trees
        - Prim's is better for dense graphs (E is closer to V^2) (Real World: eg. Dense road Network)
        - Kruskal's is better for sparse graphs (E is closer to V) (Real World: eg. Sparse road Network)
    Applications same as kruskal's algorithm

    Time Complexity: O(E log V) with a binary heap
    Space Complexity: O(V + E)

    
*/

class PrimsAlgorithm {
    constructor(vertices) {
        this.vertices = vertices;
        this.adj = new Map();
        for (let i = 0; i < vertices; i++) {
            this.adj.set(i, []);
        }
    }

    addEdge(u, v, weight) {
        this.adj.get(u).push({ node: v, weight: weight });
        this.adj.get(v).push({ node: u, weight: weight });
    }

    findMST() {
        const mst = [];
        const visited = new Array(this.vertices).fill(false);

        // Min-Priority Queue (using a simple array sort for demonstration)
        // For production, use a Binary Heap for O(E log V)
        const pq = [{ u: -1, v: 0, weight: 0 }];

        while (pq.length > 0) {
            // Sort to simulate a priority queue (pull smallest weight)
            pq.sort((a, b) => a.weight - b.weight);
            const { u, v, weight } = pq.shift();

            if (visited[v]) continue;

            visited[v] = true;
            if (u !== -1) {
                mst.push({ from: u, to: v, cost: weight });
            }

            for (let neighbor of this.adj.get(v)) {
                if (!visited[neighbor.node]) {
                    pq.push({ u: v, v: neighbor.node, weight: neighbor.weight });
                }
            }
        }

        return mst;
    }
}

// --- Usage ---
const graph = new PrimsAlgorithm(5);
graph.addEdge(0, 1, 2);
graph.addEdge(0, 3, 6);
graph.addEdge(1, 2, 3);
graph.addEdge(1, 3, 8);
graph.addEdge(1, 4, 5);
graph.addEdge(4, 2, 7);

const result = graph.findMST();
console.log("Minimum Spanning Tree Edges:", result);