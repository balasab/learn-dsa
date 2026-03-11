/* 
Definition: A min heap is a complete binary tree 
in which the value in each node is less than or equal to the values in its children.

*/
class minHeap {
    constructor() {
        this.heap = [];
    }
    insert(value) {
        // Time Complexity: O(log n)
        // Space Complexity: O(1)
        /* Algorithm:
        1. Add the value to the end of the heap
        2. Heapify up
        */
        this.heap.push(value);
        this.heapifyUp();
    }
    heapifyUp() {
        // Time Complexity: O(log n)
        // Space Complexity: O(1)
        /* Algorithm:
        1. Get the index of the last element
        2. Get the parent index
        3. Compare the element with its parent
        4. If the element is smaller than its parent, swap them
        5. Repeat until the element is greater than its parent or it reaches the root
        */
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index] < this.heap[parentIndex]) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }
    extractMin() {
        // Time Complexity: O(log n)
        // Space Complexity: O(1)
        /* Algorithm:
        1. Get the minimum element
        2. Replace the minimum element with the last element
        3. Remove the last element
        4. Heapify down
        */
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }
    heapifyDown() {
        // Time Complexity: O(log n)
        // Space Complexity: O(1)
        /* Algorithm:
        1. Get the index of the root
        2. Get the left child index
        3. Get the right child index
        4. Compare the element with its children
        5. If the element is greater than its children, swap them
        6. Repeat until the element is smaller than its children or it reaches the end
        */
        let index = 0;
        while (index < this.heap.length) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallestIndex = index;
            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
                smallestIndex = rightChildIndex;
            }
            if (smallestIndex !== index) {
                [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
                index = smallestIndex;
            } else {
                break;
            }
        }
    }
    peek() {
        // Time Complexity: O(1)
        // Space Complexity: O(1)
        return this.heap[0];
    }
    size() {
        // Time Complexity: O(1)
        // Space Complexity: O(1)
        return this.heap.length;
    }
    isEmpty() {
        // Time Complexity: O(1)
        // Space Complexity: O(1)
        return this.heap.length === 0;
    }
}