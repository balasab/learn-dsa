/**
Algorithm:
1. Iterate through the array.
2. Take the current element and compare it with the previous elements.
3. Swap the current element with the previous element if it is smaller than the previous element.
4. Repeat until the array is sorted.
  */
class insertionSort {
    constructor(arr) {
        this.arr = arr;
    }
    sort() {
        for (let i = 1; i < this.arr.length; i++) {
            let current = this.arr[i];
            let j = i - 1;
            while (j >= 0 && this.arr[j] > current) {
                this.arr[j + 1] = this.arr[j];
                j--;
            }
            this.arr[j + 1] = current;
        }
    }
}

const arr = [1, 2, 3, 4, 5];
// Time Complexity: O(n^2)
// Space Complexity: O(1)