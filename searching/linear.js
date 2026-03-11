const arr = [1, 2, 3, 4, 5];

// Time Complexity: O(n)
// Space Complexity: O(1)
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 3) {
        console.log(i);
    }
}