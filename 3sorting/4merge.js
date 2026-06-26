/*
Merge Algorithm:
1. Left and right array as input
2. Create a result array
3. Compare the first element of the left array with the first element of the right array
4. If the first element of the left array is smaller than the first element of the right array, add it to the result array
5. If the first element of the right array is smaller than the first element of the left array, add it to the result array
6. Result array is sorted
sort algorithm:
1. base case: if the array has 1 element, return it 
2. Divide the array into left half and right half
3. recursively sort the left half and right half
4. merge the sorted left half and right half
*/
class mergeSort {
    constructor(arr) {
        this.arr = arr;
    }
    sort() {
        if (this.arr.length <= 1) {
            return this.arr;
        }
        const mid = Math.floor(this.arr.length / 2); // 1.5 will be floored as 1
        const left = this.arr.slice(0, mid); // slice(0, 1) => [1]
        const right = this.arr.slice(mid); // slice(1) => [2, 3, 4, 5]
        return this.merge(this.sort(left), this.sort(right));
    }
    merge(left, right) {
        let result = [];
        while (left.length > 0 && right.length > 0) {
            if (left[0] < right[0]) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }
        return result.concat(left).concat(right);
    }
}

const arr = [1, 2, 3, 4, 5];
// Time Complexity: O(n log n)
// Space Complexity: O(n)