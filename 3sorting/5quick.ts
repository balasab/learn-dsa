/**
 * Swaps two elements in an array.
 */
function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * Partitions the array by choosing the last element as the pivot.
 * Elements smaller than the pivot are moved to its left, larger to its right.
 */
function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }

    // Move the pivot to its correct sorted position
    swap(arr, i + 1, high);
    return i + 1;
}

/**
 * Recursive Quick Sort function.
 */
function quickSortHelper(arr: number[], low: number, high: number): void {
    if (low < high) {
        // pi is the partitioning index
        const pi = partition(arr, low, high);

        // Recursively sort elements before and after partition
        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
    }
}

/**
 * Main Quick Sort function that returns a sorted copy or sorts in-place.
 * @param arr - The array of numbers to sort
 * @independently - Optional flag if you want to avoid mutating the original array
 */
export function quickSort(arr: number[], mutate: boolean = true): number[] {
    const arrayToSort = mutate ? arr : [...arr];
    quickSortHelper(arrayToSort, 0, arrayToSort.length - 1);
    return arrayToSort;
}

// --- Example Usage ---
const numbers = [24, 9, 2, 10, 4, 15, 1];
console.log("Original:", numbers);

const sorted = quickSort(numbers, false); // Pass false to keep original intact
console.log("Sorted:  ", sorted);