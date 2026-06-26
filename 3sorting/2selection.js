/**
Algorithm:
1. Iterate through the array.
2. Find the minimum element in the unsorted part of the array.
3. Swap the minimum element with the first element of the unsorted part.
4. Repeat until the array is sorted.
  */
class selectionSort {
    constructor(arr) {
        this.arr = arr;
    }
    sort() {
        for (let i = 0; i < this.arr.length; i++) {
            let min = this.arr[i];
            for (let j = i + 1; j < this.arr.length; j++) {
                if (this.arr[j] < min) {
                    min = this.arr[j];
                }
            }
            this.arr[i] = min;
        }
    }
}

const arr = [1, 2, 3, 4, 5];
// Time Complexity: O(n^2)
// Space Complexity: O(1)