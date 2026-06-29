import { Graph, DirectedGraph } from "./graph";

/**
 * Cycle Detection in Graphs
 */

/**
 * 1. Cycle Detection in Directed Graphs (using DFS and Recursion Stack / Graph Coloring)
 * 
 * We track vertices in three states (colors):
 * - Unvisited (not in visited or visiting)
 * - Visiting (currently in recursion stack - gray color)
 * - Visited (fully processed - black color)
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function hasCycleDirected<T>(graph: DirectedGraph<T>): boolean {
  const visited = new Set<T>();
  const visiting = new Set<T>();

  function dfs(curr: T): boolean {
    visiting.add(curr);

    const neighbors = graph.adjList.get(curr) || [];
    for (const edge of neighbors) {
      const neighbor = edge.node;

      // If neighbor is currently in the recursion stack, we found a cycle (back edge)
      if (visiting.has(neighbor)) {
        return true;
      }

      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      }
    }

    visiting.delete(curr);
    visited.add(curr);
    return false;
  }

  for (const vertex of graph.adjList.keys()) {
    if (!visited.has(vertex)) {
      if (dfs(vertex)) return true;
    }
  }

  return false;
}

/**
 * 2. Cycle Detection in Undirected Graphs (using DFS and tracking Parent)
 * 
 * In an undirected graph, a cycle exists if we visit a vertex that has already 
 * been visited, and it is not the immediate parent of the current vertex.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function hasCycleUndirected<T>(graph: Graph<T>): boolean {
  const visited = new Set<T>();

  function dfs(curr: T, parent: T | null): boolean {
    visited.add(curr);

    const neighbors = graph.adjList.get(curr) || [];
    for (const edge of neighbors) {
      const neighbor = edge.node;

      if (!visited.has(neighbor)) {
        if (dfs(neighbor, curr)) return true;
      } 
      // If neighbor is visited and is not parent, there is a cycle
      else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }

  for (const vertex of graph.adjList.keys()) {
    if (!visited.has(vertex)) {
      if (dfs(vertex, null)) return true;
    }
  }

  return false;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  console.log("=== Undirected Graph Cycle Detection ===");
  const ug = new Graph<number>();
  ug.addEdge(0, 1);
  ug.addEdge(1, 2);
  ug.addEdge(2, 3);
  console.log("Undirected Graph (no cycle):");
  ug.print();
  console.log(`Has cycle? ${hasCycleUndirected(ug)} (Expected: false)`);

  ug.addEdge(3, 0); // Adding cycle 3-0
  console.log("\nUndirected Graph (added cycle 3-0):");
  console.log(`Has cycle? ${hasCycleUndirected(ug)} (Expected: true)`);

  console.log("\n=== Directed Graph Cycle Detection ===");
  const dg = new DirectedGraph<number>();
  dg.addEdge(0, 1);
  dg.addEdge(1, 2);
  dg.addEdge(2, 3);
  console.log("Directed Graph (no cycle):");
  dg.print();
  console.log(`Has cycle? ${hasCycleDirected(dg)} (Expected: false)`);

  dg.addEdge(3, 1); // Adding back-edge 3 -> 1
  console.log("\nDirected Graph (added back-edge 3 -> 1):");
  console.log(`Has cycle? ${hasCycleDirected(dg)} (Expected: true)`);
}
