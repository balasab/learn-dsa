export {};

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
class MergeSort {
    arr: number[];
    constructor(arr: number[]) {
        this.arr = arr;
    }
    sort(array: number[] = this.arr): number[] {
        if (array.length <= 1) {
            return array;
        }
        const mid = Math.floor(array.length / 2); // 1.5 will be floored as 1
        const left = array.slice(0, mid); // slice(0, 1) => [1]
        const right = array.slice(mid); // slice(1) => [2, 3, 4, 5]
        return this.merge(this.sort(left), this.sort(right));
    }
    merge(left: number[], right: number[]): number[] {
        let result: number[] = [];
        const lCopy = [...left];
        const rCopy = [...right];
        while (lCopy.length > 0 && rCopy.length > 0) {
            if (lCopy[0] < rCopy[0]) {
                result.push(lCopy.shift()!);
            } else {
                result.push(rCopy.shift()!);
            }
        }
        return result.concat(lCopy).concat(rCopy);
    }
}

const arr: number[] = [1, 2, 3, 4, 5];
// Time Complexity: O(n log n)
// Space Complexity: O(n)