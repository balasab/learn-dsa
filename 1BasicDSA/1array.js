let arr = [1, 2, 3, 4, 5];

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
arr.splice(1, 3); /* output: [2, 3, 4]
 Note: splice(start, deleteCount, item1, item2, ...) 
 deleteCount means number of elements to delete 
 and item1 means elements to be added at the start position
 item2 means elements to be added at the second position
 item3 means elements to be added at the third position
 ... and so on example:  
  arr.splice(1, 2, 10, 20, 30);
  this will start from index 1 and delete 2 elements and add 10, 20, 30 at the start position 
  and the result is [1, 10, 20, 30, 4]
*/
// unshift Time complexity: O(n)
arr.unshift(0); // output: [0, 1, 2, 3, 4, 5] Note: unshift(item1, item2, ...) add elements to the beginning of the array
// shift Time complexity: O(n)
arr.shift(); // output: [1, 2, 3, 4, 5] Note: shift() removes the first element of the array


