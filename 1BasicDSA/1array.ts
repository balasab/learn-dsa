export { };

let arr: number[] = [1, 2, 3, 4, 5];

// O(n) Traversal
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
// Insert Time complexity: O(1)
arr.push(6);
// Delete Time complexity: O(1)
arr.pop();
// Search Time complexity: O(n)
arr.find(x => x === 3);
// Update Time complexity: O(1)
arr[0] = 10;
// Sort Time complexity: O(n log n)
arr.sort();
// Reverse Time complexity: O(n)
arr.reverse();
// slice Time complexity: O(n)
arr.slice(1, 3); // output: [2, 3] Note: slice(start, end) end means up to but not including end
// splice Time complexity: O(n)
/*
  Splice is a swiss army knife
  It allows you to remove, replace or add in the array
  Meaning - It modifies the original array
  splice(start, deleteCount, item1, item2, ...)
  start - The index where it requires modifications
  deleteCount (optional) - If 0, no elements are removed. 
    If omitted, it deletes everything from the start.
    If the count is more than remainining, it deletes everything from the start.
  item1, item2 - Adds the new elements at the start index.
  Returns the deleted items array.
*/
let fruits = ['Apple', 'Banana', 'Cherry', 'Date'];

// Remove 2 elements starting at index 1 ('Banana' and 'Cherry')
let deleted = fruits.splice(1, 2, 'Orange', 'Mango', 'Stawberry');
console.log(deleted); // output: ['Banana', 'Cherry']
console.log(fruits); // output: ['Apple', 'Orange', 'Mango', 'Stawberry', 'Date']
// unshift Time complexity: O(n)
arr.unshift(0); // output: [0, 1, 2, 3, 4, 5] Note: unshift(item1, item2, ...) add elements to the beginning of the array
// shift Time complexity: O(n)
arr.shift(); // output: [1, 2, 3, 4, 5] Note: shift() removes the first element of the array
