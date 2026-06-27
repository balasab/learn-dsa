export {};

/**
Algorithm:
1. Iterate through the array.
2. Find the minimum element in the unsorted part of the array.
3. Swap the minimum element with the first element of the unsorted part.
4. Repeat until the array is sorted.
   */
class SelectionSort {
    arr: number[];
    constructor(arr: number[]) {
        this.arr = arr;
    }
    sort(): void {
        for (let i = 0; i < this.arr.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < this.arr.length; j++) {
                if (this.arr[j] < this.arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [this.arr[i], this.arr[minIndex]] = [this.arr[minIndex], this.arr[i]];
            }
        }
    }
}

const arr: number[] = [1, 2, 3, 4, 5];
// Time Complexity: O(n^2)
// Space Complexity: O(1)