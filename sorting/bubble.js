/**
Algorithm:
1. Iterate through the array.
2. Compare the current element with the next element.
3. If the current element is greater than the next element, swap them.
4. Repeat until the array is sorted.
  */
class bubbleSort {
    constructor(arr) {
        this.arr = arr;
    }
    sort() {
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr.length - i - 1; j++) {
                if (this.arr[j] > this.arr[j + 1]) {
                    [this.arr[j], this.arr[j + 1]] = [this.arr[j + 1], this.arr[j]];
                }
            }
        }
    }
}

const arr = [1, 2, 3, 4, 5];
// Time Complexity: O(n^2)
// Space Complexity: O(1)
