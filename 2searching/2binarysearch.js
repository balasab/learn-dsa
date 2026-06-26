/**
Algorithm:
1. Initialize left and right pointers to the start and end of the array.
2. While left <= right:
3. Calculate the middle index.
4. If the middle element is the target, return the index.
5. If the middle element is less than the target, move the left pointer to the right.
6. If the middle element is greater than the target, move the right pointer to the left.
7. If the target is not found, return -1.
 */
const arr = [1, 2, 3, 4, 5];

// Time Complexity: O(log n)
// Space Complexity: O(1)
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

console.log(binarySearch(arr, 3));