class Graph {
    constructor(vertices) {
        this.vertices = vertices;
        this.edges = [];
    }

    /**
     * Add a directed edge to the graph
     * @param {number} source 
     * @param {number} destination 
     * @param {number} weight 
     */
    addEdge(source, destination, weight) {
        this.edges.push({ source, destination, weight });
    }

    /**
     * Executes Bellman-Ford algorithm
     * @param {number} startNode 
     * @returns {Object|null} Distances and predecessor map
     */
    findShortestPaths(startNode) {
        const distances = new Array(this.vertices).fill(Infinity);
        const predecessors = new Array(this.vertices).fill(null);

        distances[startNode] = 0;

        // Relax edges |V| - 1 times
        for (let i = 0; i < this.vertices - 1; i++) {
            for (const { source, destination, weight } of this.edges) {
                if (distances[source] !== Infinity && distances[source] + weight < distances[destination]) {
                    distances[destination] = distances[source] + weight;
                    predecessors[destination] = source;
                }
            }
        }

        // Check for negative weight cycles
        for (const { source, destination, weight } of this.edges) {
            if (distances[source] !== Infinity && distances[source] + weight < distances[destination]) {
                throw new Error("Graph contains a negative weight cycle!");
            }
        }

        return { distances, predecessors };
    }
}

// --- Usage ---
const myGraph = new Graph(5);

myGraph.addEdge(0, 1, -1);
myGraph.addEdge(0, 2, 4);
myGraph.addEdge(1, 2, 3);
myGraph.addEdge(1, 3, 2);
myGraph.addEdge(1, 4, 2);
myGraph.addEdge(3, 2, 5);
myGraph.addEdge(3, 1, 1);
myGraph.addEdge(4, 3, -3);

try {
    const { distances } = myGraph.findShortestPaths(0);
    console.log("Distances from node 0:", distances);
} catch (error) {
    console.error(error.message);
}