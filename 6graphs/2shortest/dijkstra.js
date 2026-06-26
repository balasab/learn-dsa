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
/*
    Problem: Find the shortest path from a source vertex to all other vertices in a weighted graph.
    
    Applications:
        - Find the shortest path of road network
    Time Complexity: O(E log V)
    Space Complexity: O(V + E)

    Algorithm:
    1. Input AdjList and start node
    2. Declare a minPriorityQueue
    3. Declare distances object to store the shortest distance from the source to all other nodes
    4. Declare previous object to store the predecessor of each node in the shortest path
    5. Initialize distances object with Infinity for all nodes except the start node which is 0
    6. Initialize previous object with null for all nodes
    7. Enqueue the start node in the priority queue with priority 0
    8. While the priority queue is not empty
        1. Dequeue the node with the smallest priority
        2. For each neighbor of the dequeued node
            1. Calculate the distance to the neighbor
            2. If the calculated distance is smaller than the current distance to the neighbor
                1. Update the distance to the neighbor
                2. Update the predecessor of the neighbor
                3. Enqueue the neighbor in the priority queue with the new distance
    9. Return the distances and previous objects
*/
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