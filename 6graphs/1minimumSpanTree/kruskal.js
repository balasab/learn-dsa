/*
    Disjoint set is a data structure
    Which store non overlapping set of elements
    Also Known as Union Find DS
    
    Basic Operations:
        - makeSet(x): Creates a new set containing only element x 
        - find(x): Returns the representative (or root) of the set containing x
        - union(x, y): Merges the sets containing x and y.
         Now the root of x and y will be same. And the root is the parent of the other element

    Application
        - Detecting cycles in an undirected graph
        - Finding the connected components of a graph
        - Kruskal’s algorithm for Minimum Spanning Trees
        - Image processing (e.g., finding connected components of pixels)
*/
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
        return false; // They are already in the same set
    }

    /**
     * Detects if adding a set of edges creates a cycle.
     * @param {Array<Array<number>>} edges - An array of pairs [[u, v], [x, y], ...] representing graph edges.
     * @returns {boolean} True if a cycle is detected, false otherwise.
     */
    detectCycle(edges) {
        for (const [u, v] of edges) {
            const rootU = this.find(u);
            const rootV = this.find(v);

            // If they share the same root, an edge between them creates a cycle
            if (rootU === rootV) {
                return true;
            }

            // Otherwise, union them
            this.union(u, v);
        }
        return false;
    }

    /**
     * Counts and groups the connected components in the graph.
     * @returns {Object} An object containing the total count and the grouped components.
     */
    connectedComponents() {
        const components = {};

        // 1. Ensure all path compressions are up to date by finding the root for every element
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            if (!components[root]) {
                components[root] = [];
            }
            components[root].push(i);
        }

        // 2. The number of unique roots equals the number of connected components
        const count = Object.keys(components).length;

        return {
            count: count,
            components: Object.values(components)
        };
    }
}
/*
    Kruskals algorithm or MST algorithm
    It is a greedy algorithm
    
    It ensures there are no cycles in the graph as 
    it uses the disjoint set data structure to check
    if the two vertices of the edge are already in the same set
    
    Minimum Spanning Tree (MST) is a subgraph of a weighted 
    undirected graph that connects all the vertices 
    with the minimum possible total edge weight
    span means it must connect all the given vertices
    spanning tree means it must connect all but no cycles

    Applications:
    1. Wiring in the house without crossing wires
    2. Designing networks
    3. Optimizing road networks
    4. Clustering algorithms
    5. Image processing (e.g., finding connected components of pixels)
    6. Finding optimal pipeline network
    7. Finding shortest connection of cities in an airplane network
    8. Finding shortest connection of cities in a road network
    9. Finding shortest connection of cities in a railway network
    
    Time Complexity: O(E log E)
    Space Complexity: O(V + E)  
*/
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