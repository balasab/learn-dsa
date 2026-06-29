
/**
 * Swaps two elements in an array.
 */
function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * Sorts an array in-place using the Cyclic Sort algorithm.
 * Assumes the array contains distinct numbers from 1 to n.
 * * @param arr - The array of numbers to sort
 * @returns The sorted array
 */
export function cyclicSort(arr: number[]): number[] {
    let i = 0;

    while (i < arr.length) {
        // Since numbers are 1 to n, the correct index for value 'x' is 'x - 1'
        // If your range is 0 to n, change this to: const correctIndex = arr[i];
        const correctIndex = arr[i] - 1;

        // If the current element is not at its correct index, swap it
        if (arr[i] !== arr[correctIndex]) {
            swap(arr, i, correctIndex);
        } else {
            // Move to the next element only when the current index has the correct number
            i++;
        }
    }

    return arr;
}

// --- Example Usage ---
const numbers = [3, 5, 2, 1, 4];
console.log("Original:", numbers);

cyclicSort(numbers);
console.log("Sorted:  ", numbers); // Output: [1, 2, 3, 4, 5]