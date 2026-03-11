const { Graph } = require('./graph');

class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue() {
        return this.values.shift();
    }
    isEmpty() {
        return this.values.length === 0;
    }
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

function dijkstra(graph, start) {
    const distances = {};
    const pq = new PriorityQueue();
    const previous = {};
    let smallest;

    // Better iterate over Map
    for (let vertex of graph.adjList.keys()) {
        if (vertex === start) {
            distances[vertex] = 0;
            pq.enqueue(vertex, 0);
        } else {
            distances[vertex] = Infinity;
            pq.enqueue(vertex, Infinity);
        }
        previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
        smallest = pq.dequeue().val;

        if (distances[smallest] === Infinity) break;

        for (let neighbor of graph.adjList.get(smallest)) {
            // Calculate new distance to neighboring node
            let candidate = distances[smallest] + neighbor.weight;
            let nextNeighbor = neighbor.node;
            if (candidate < distances[nextNeighbor]) {
                // Updating new smallest distance to neighbor
                distances[nextNeighbor] = candidate;
                // Updating previous - How we got to neighbor
                previous[nextNeighbor] = smallest;
                // Enqueue in priority queue with new priority
                pq.enqueue(nextNeighbor, candidate);
            }
        }
    }
    return { distances, previous };
}

module.exports = dijkstra;