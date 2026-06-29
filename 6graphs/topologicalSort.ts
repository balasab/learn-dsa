import { DirectedGraph } from "./graph";

/**
 * Topological Sort for Directed Acyclic Graphs (DAG)
 * 
 * Topological sorting for Directed Acyclic Graph (DAG) is a linear ordering of vertices 
 * such that for every directed edge u -> v, vertex u comes before v in the ordering.
 */

/**
 * Approach 1: Kahn's Algorithm (BFS-based)
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function topologicalSortKahn<T>(graph: DirectedGraph<T>): T[] {
  const inDegree = new Map<T, number>();
  const order: T[] = [];

  // Initialize in-degrees for all vertices
  for (const vertex of graph.adjList.keys()) {
    inDegree.set(vertex, 0);
  }

  // Calculate in-degrees
  for (const [vertex, edges] of graph.adjList.entries()) {
    for (const edge of edges) {
      inDegree.set(edge.node, (inDegree.get(edge.node) || 0) + 1);
    }
  }

  // Queue to store all vertices with in-degree 0
  const queue: T[] = [];
  for (const [vertex, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(vertex);
    }
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    order.push(curr);

    const neighbors = graph.adjList.get(curr) || [];
    for (const neighborEdge of neighbors) {
      const neighbor = neighborEdge.node;
      const updatedDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, updatedDegree);
      if (updatedDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If the topological sort does not contain all vertices, it means the graph has a cycle
  if (order.length !== graph.adjList.size) {
    throw new Error("Graph contains a cycle! Topological sort is only possible on DAGs.");
  }

  return order;
}

/**
 * Approach 2: DFS-based Topological Sort (using Recursion Stack)
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function topologicalSortDFS<T>(graph: DirectedGraph<T>): T[] {
  const visited = new Set<T>();
  const visiting = new Set<T>(); // To detect cycles
  const stack: T[] = [];

  function dfs(vertex: T): boolean {
    visiting.add(vertex);

    const neighbors = graph.adjList.get(vertex) || [];
    for (const edge of neighbors) {
      const neighbor = edge.node;
      if (visiting.has(neighbor)) {
        return false; // Cycle detected
      }
      if (!visited.has(neighbor)) {
        if (!dfs(neighbor)) return false;
      }
    }

    visiting.delete(vertex);
    visited.add(vertex);
    stack.push(vertex); // Add to stack on completion
    return true;
  }

  for (const vertex of graph.adjList.keys()) {
    if (!visited.has(vertex)) {
      if (!dfs(vertex)) {
        throw new Error("Graph contains a cycle! Topological sort is only possible on DAGs.");
      }
    }
  }

  return stack.reverse(); // Topological order is the reverse of DFS post-order
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const g = new DirectedGraph<string>();
  
  // Create a DAG of tasks
  // A -> C
  // B -> C
  // C -> D
  // B -> E
  g.addVertex("A");
  g.addVertex("B");
  g.addVertex("C");
  g.addVertex("D");
  g.addVertex("E");
  
  g.addEdge("A", "C");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("B", "E");

  console.log("DAG structure:");
  g.print();

  console.log("\nTopological Sort (Kahn's):");
  try {
    const kahnOrder = topologicalSortKahn(g);
    console.log(kahnOrder.join(" -> ")); // Expected valid order, e.g., A -> B -> C -> D -> E (or A -> B -> E -> C -> D)
  } catch (e: any) {
    console.error(e.message);
  }

  console.log("\nTopological Sort (DFS):");
  try {
    const dfsOrder = topologicalSortDFS(g);
    console.log(dfsOrder.join(" -> "));
  } catch (e: any) {
    console.error(e.message);
  }

  // Adding a cycle to demonstrate detection
  console.log("\nAdding cycle: D -> A");
  g.addEdge("D", "A");
  try {
    topologicalSortKahn(g);
  } catch (e: any) {
    console.log(`Successfully detected cycle: ${e.message}`);
  }
}
