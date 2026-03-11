class Graph {
    constructor() {
        this.adjList = new Map();
    }

    addVertex(vertex) {
        if (!this.adjList.has(vertex)) {
            this.adjList.set(vertex, []);
        }
    }

    addEdge(v1, v2, weight = 1) {
        if (!this.adjList.has(v1)) this.addVertex(v1);
        if (!this.adjList.has(v2)) this.addVertex(v2);

        this.adjList.get(v1).push({ node: v2, weight });
        this.adjList.get(v2).push({ node: v1, weight });
    }

    removeEdge(v1, v2) {
        if (this.adjList.has(v1)) {
            this.adjList.set(v1, this.adjList.get(v1).filter(edge => edge.node !== v2));
        }
        if (this.adjList.has(v2)) {
            this.adjList.set(v2, this.adjList.get(v2).filter(edge => edge.node !== v1));
        }
    }

    removeVertex(vertex) {
        for (let [node, edges] of this.adjList) {
            this.removeEdge(node, vertex);
        }
        this.adjList.delete(vertex);
    }

    print() {
        for (let [vertex, edges] of this.adjList) {
            console.log(`${vertex} -> ${edges.map(e => `${e.node}(${e.weight})`).join(', ')}`);
        }
    }

    bfs(start) {
        if (!start) start = this.adjList.keys().next().value;
        if (!start) return;

        let queue = [start];
        let visited = new Set([start]);

        while (queue.length > 0) {
            let vertex = queue.shift();
            console.log(vertex);

            this.adjList.get(vertex).forEach(edge => {
                if (!visited.has(edge.node)) {
                    visited.add(edge.node);
                    queue.push(edge.node);
                }
            });
        }
    }

    dfs(start) {
        if (!start) start = this.adjList.keys().next().value;
        if (!start) return;

        let visited = new Set();
        this._dfsUtil(start, visited);
    }

    _dfsUtil(vertex, visited) {
        visited.add(vertex);
        console.log(vertex);

        this.adjList.get(vertex).forEach(edge => {
            if (!visited.has(edge.node)) {
                this._dfsUtil(edge.node, visited);
            }
        });
    }
}

class DirectedGraph extends Graph {
    addEdge(v1, v2, weight = 1) {
        if (!this.adjList.has(v1)) this.addVertex(v1);
        if (!this.adjList.has(v2)) this.addVertex(v2);

        this.adjList.get(v1).push({ node: v2, weight });
    }

    removeEdge(v1, v2) {
        if (this.adjList.has(v1)) {
            this.adjList.set(v1, this.adjList.get(v1).filter(edge => edge.node !== v2));
        }
    }
}

module.exports = { Graph, DirectedGraph };