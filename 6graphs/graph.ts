export interface GraphEdge<T> {
  node: T;
  weight: number;
}

export class Graph<T = string | number> {
  adjList: Map<T, GraphEdge<T>[]>;

  constructor() {
    this.adjList = new Map<T, GraphEdge<T>[]>();
  }

  addVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }

  addEdge(v1: T, v2: T, weight: number = 1): void {
    if (!this.adjList.has(v1)) this.addVertex(v1);
    if (!this.adjList.has(v2)) this.addVertex(v2);

    this.adjList.get(v1)!.push({ node: v2, weight });
    this.adjList.get(v2)!.push({ node: v1, weight });
  }

  removeEdge(v1: T, v2: T): void {
    if (this.adjList.has(v1)) {
      this.adjList.set(v1, this.adjList.get(v1)!.filter(edge => edge.node !== v2));
    }
    if (this.adjList.has(v2)) {
      this.adjList.set(v2, this.adjList.get(v2)!.filter(edge => edge.node !== v1));
    }
  }

  removeVertex(vertex: T): void {
    for (let [node, edges] of this.adjList) {
      this.removeEdge(node, vertex);
    }
    this.adjList.delete(vertex);
  }

  print(): void {
    for (let [vertex, edges] of this.adjList) {
      console.log(`${vertex} -> ${edges.map(e => `${e.node}(${e.weight})`).join(', ')}`);
    }
  }

  bfs(start?: T): void {
    if (!start) start = this.adjList.keys().next().value;
    if (!start) return;

    let queue: T[] = [start];
    let visited: Set<T> = new Set<T>([start]);

    while (queue.length > 0) {
      let vertex = queue.shift()!;
      console.log(vertex);

      this.adjList.get(vertex)!.forEach(edge => {
        if (!visited.has(edge.node)) {
          visited.add(edge.node);
          queue.push(edge.node);
        }
      });
    }
  }

  dfs(start?: T): void {
    if (!start) start = this.adjList.keys().next().value;
    if (!start) return;

    let visited: Set<T> = new Set<T>();
    this._dfsUtil(start, visited);
  }

  _dfsUtil(vertex: T, visited: Set<T>): void {
    visited.add(vertex);
    console.log(vertex);

    this.adjList.get(vertex)!.forEach(edge => {
      if (!visited.has(edge.node)) {
        this._dfsUtil(edge.node, visited);
      }
    });
  }
}

export class DirectedGraph<T = string | number> extends Graph<T> {
  override addEdge(v1: T, v2: T, weight: number = 1): void {
    if (!this.adjList.has(v1)) this.addVertex(v1);
    if (!this.adjList.has(v2)) this.addVertex(v2);

    this.adjList.get(v1)!.push({ node: v2, weight });
  }

  override removeEdge(v1: T, v2: T): void {
    if (this.adjList.has(v1)) {
      this.adjList.set(v1, this.adjList.get(v1)!.filter(edge => edge.node !== v2));
    }
  }
}