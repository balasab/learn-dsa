/*
    Bellman-Ford Algorithm
    Time Complexity: O(V * E)
    Space Complexity: O(V)
    Diff from dijkstra
    1. Dijkstra is faster than Bellman-Ford
    2. Bellman-Ford can handle negative weight cycles
    3. Dijkstra can't handle negative weight cycles
    4. Dijkstra uses a priority queue
    5. Bellman-Ford uses a simple array
    6. Dijkstra is a greedy algorithm
    7. Bellman-Ford is not a greedy algorithm
    Applications:
        - Graph which has negative weights

    Algorithm:
    1. Input AdjList and start node
    2. Declare distances object to store the shortest distance from the source to all other nodes
    3. Declare previous object to store the predecessor of each node in the shortest path
    4. Initialize distances object with Infinity for all nodes except the start node which is 0
    5. Initialize previous object with null for all nodes
    6. Relax edges |V| - 1 times
        1. For each edge in the graph
            1. If the distance to the source is not Infinity and the distance to the source plus the weight of the edge is smaller than the distance to the destination
                1. Update the distance to the destination
                2. Update the predecessor of the destination
    7. Check for negative weight cycles
        1. For each edge in the graph
            1. If the distance to the source is not Infinity and the distance to the source plus the weight of the edge is smaller than the distance to the destination
                1. Throw an error
    8. Return the distances and previous objects
*/
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

        // Relax edges |V| - 1 times => why because in worst case we have to travel V-1 edges
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
                throw new Error("Graph contains a negative weight cycle!"); // means it can reduce the distance even after V-1 iterations => it can be reduced infinite times so it will be never reachable
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