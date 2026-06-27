import { Graph } from "../graph";

interface PQItem<T> {
    val: T;
    priority: number;
}

class PriorityQueue<T> {
    values: PQItem<T>[];
    constructor() {
        this.values = [];
    }
    enqueue(val: T, priority: number): void {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue(): PQItem<T> | undefined {
        return this.values.shift();
    }
    isEmpty(): boolean {
        return this.values.length === 0;
    }
    sort(): void {
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
export function dijkstra<T>(graph: Graph<T>, start: T): { distances: Map<T, number>, previous: Map<T, T | null> } {
    const distances = new Map<T, number>();
    const pq = new PriorityQueue<T>();
    const previous = new Map<T, T | null>();
    let smallest: T;

    // Better iterate over Map
    for (let vertex of graph.adjList.keys()) {
        if (vertex === start) {
            distances.set(vertex, 0);
            pq.enqueue(vertex, 0);
        } else {
            distances.set(vertex, Infinity);
            pq.enqueue(vertex, Infinity);
        }
        previous.set(vertex, null);
    }

    while (!pq.isEmpty()) {
        const dequeued = pq.dequeue();
        if (!dequeued) break;
        smallest = dequeued.val;

        if (distances.get(smallest) === Infinity) break;

        const neighbors = graph.adjList.get(smallest);
        if (neighbors) {
            for (let neighbor of neighbors) {
                // Calculate new distance to neighboring node
                let candidate = distances.get(smallest)! + neighbor.weight;
                let nextNeighbor = neighbor.node;
                if (candidate < (distances.get(nextNeighbor) ?? Infinity)) {
                    // Updating new smallest distance to neighbor
                    distances.set(nextNeighbor, candidate);
                    // Updating previous - How we got to neighbor
                    previous.set(nextNeighbor, smallest);
                    // Enqueue in priority queue with new priority
                    pq.enqueue(nextNeighbor, candidate);
                }
            }
        }
    }
    return { distances, previous };
}