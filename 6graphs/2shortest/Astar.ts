/*
  A-Star Algorithm is used to find the shortest path between two nodes in a graph
  Time Complexity: O(E log V)
  Space Complexity: O(V + E)

  Difference from bellman vs dijkstra
  - Bellman-Ford works with negative weights
  - Dijkstra's algorithm does not work with negative weights
  - A* algorithm works with heuristic

  Heuristic Function
  - It is an estimate of the cost from the current node to the target node
  - It is a function that takes the current node and the target node as input and returns the estimated cost

  Dijkstra is just a special case of A* where the heuristic is always zero (h(n) = 0).

  Applications:
  - Used where the graph is too large to traverse completely 
        - and it uses different distance metrics such as Euclidean distance, Manhattan distance, etc.
  - Used in pathfinding in video games
  - Used in GPS navigation systems

  - GPS Navigation (e.g., Driving from New York to Los Angeles)
        - If you use Dijkstra: The algorithm will explore roads leading 
        to Boston, Montreal, Florida, and Chicago at the exact same rate 
        it explores roads leading toward California. 
        - It wastes millions of calculations exploring thousands 
        of miles of roads in the completely wrong direction.
        
        - If you use A*: The heuristic tells the algorithm, "Los Angeles is west." 
        - The algorithm will immediately prioritize roads 
        going west and won't waste time checking if a highway in Maine gets you to California faster.
*/

// 1. Define the Node/Vertex structure
export interface GraphNode {
  id: string;
  // External properties (like X, Y coordinates) can go here for heuristic calculation
}

// 2. Define the Edge structure
export interface Edge {
  nodeId: string;
  weight: number;
}

// 3. Define the Heuristic Function type
// Calculates the estimated cost from a node to the target node
export type HeuristicFunction = (currentNodeId: string, targetNodeId: string) => number;

// 4. The A* Router Class
export class AStarRouter {
  // Graph represented as an adjacency list: Map<NodeId, Edge[]>
  private adjacencyList: Map<string, Edge[]> = new Map();

  constructor() { }

  // Add a node to the graph
  addNode(node: GraphNode): void {
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  // Add a directed edge (for undirected, call this twice swapping source and target)
  addEdge(sourceId: string, targetId: string, weight: number): void {
    if (!this.adjacencyList.has(sourceId) || !this.adjacencyList.has(targetId)) {
      throw new Error("Both source and target nodes must exist in the graph.");
    }
    this.adjacencyList.get(sourceId)!.push({ nodeId: targetId, weight });
  }

  // Find the shortest path using A*
  findShortestPath(
    startId: string,
    targetId: string,
    heuristic: HeuristicFunction
  ): string[] | null {
    if (!this.adjacencyList.has(startId) || !this.adjacencyList.has(targetId)) {
      return null;
    }

    // gScore[v] = actual cost of cheapest path from start to v
    const gScore: Map<string, number> = new Map(); // gScore means actual cost of cheapest path from the start node to the current node
    // fScore[v] = gScore[v] + h(v). Estimated total cost from start to target through v
    const fScore: Map<string, number> = new Map(); // fScore means gScore + heuristic
    // Tracks the best incoming step to rebuild the path later
    const cameFrom: Map<string, string> = new Map(); // cameFrom means parent node

    // The set of discovered nodes that need to be evaluated
    const openSet: Set<string> = new Set([startId]);

    // Initialize scores
    gScore.set(startId, 0);
    fScore.set(startId, heuristic(startId, targetId));

    while (openSet.size > 0) {
      // Find the node in openSet having the lowest fScore
      let currentId = Array.from(openSet).reduce((lowestId, nodeId) => {
        const lowestF = fScore.get(lowestId) ?? Infinity;
        const currentF = fScore.get(nodeId) ?? Infinity;
        return currentF < lowestF ? nodeId : lowestId;
      });

      // If we reached the goal, reconstruct the path
      if (currentId === targetId) {
        return this.reconstructPath(cameFrom, currentId);
      }

      openSet.delete(currentId);
      const neighbors = this.adjacencyList.get(currentId) || [];

      for (const edge of neighbors) {
        const neighborId = edge.nodeId;
        // Tentative gScore is the distance from start to the neighbor through current
        const tentativeGScore = (gScore.get(currentId) ?? Infinity) + edge.weight;

        if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
          // This path to neighbor is better than any previous one!
          cameFrom.set(neighborId, currentId);
          gScore.set(neighborId, tentativeGScore);
          fScore.set(neighborId, tentativeGScore + heuristic(neighborId, targetId));

          if (!openSet.has(neighborId)) {
            openSet.add(neighborId);
          }
        }
      }
    }

    // Open set is empty but goal was never reached -> no path exists
    return null;
  }

  // Helper method to trace backwards from target to start
  private reconstructPath(cameFrom: Map<string, string>, currentId: string): string[] {
    const totalPath: string[] = [currentId];
    while (cameFrom.has(currentId)) {
      currentId = cameFrom.get(currentId)!;
      totalPath.unshift(currentId); // Insert at the beginning
    }
    return totalPath;
  }
}

// 1. Setup sample node coordinates for the heuristic function
const nodePositions: Record<string, { x: number; y: number }> = {
  A: { x: 0, y: 0 },
  B: { x: 2, y: 0 },
  C: { x: 1, y: 2 },
  D: { x: 3, y: 3 },
};

// 2. Define the Euclidean Heuristic
const euclideanHeuristic: HeuristicFunction = (curr, target) => {
  const p1 = nodePositions[curr];
  const p2 = nodePositions[target];
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// 3. Build the Graph
const router = new AStarRouter();

router.addNode({ id: "A" });
router.addNode({ id: "B" });
router.addNode({ id: "C" });
router.addNode({ id: "D" });

// addEdge(source, destination, actual_edge_weight)
router.addEdge("A", "B", 2);
router.addEdge("A", "C", 3);
router.addEdge("B", "D", 5);
router.addEdge("C", "D", 2);

// 4. Find Path from A to D
const shortestPath = router.findShortestPath("A", "D", euclideanHeuristic);
console.log("Cheapest Path:", shortestPath);
// Output: ['A', 'C', 'D'] (Cost 5 is cheaper than A->B->D which costs 7)