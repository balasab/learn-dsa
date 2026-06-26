import { MinHeap } from "../trees/4minHeap";

function priorityQueue() {
    const minHeap = new MinHeap();
    minHeap.insert(1);
    minHeap.insert(2);
    minHeap.insert(3);
    minHeap.insert(4);
    minHeap.insert(5);
    console.log(minHeap.extractMin());
    console.log(minHeap.extractMin());
    console.log(minHeap.extractMin());
    console.log(minHeap.extractMin());
    console.log(minHeap.extractMin());
}
