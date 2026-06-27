export { };

let str: string = "hello";

// O(n) Traversal
for (let i = 0; i < str.length; i++) {
    console.log(str[i]);
}
// Insert Time complexity: O(n)
str = str + "world";
// Delete Time complexity: O(n)
str = str.slice(0, 2);
// Search Time complexity: O(n)
str.includes("hello");
// Update Time complexity: O(n)
str = str.replace("hello", "world");
// Sort Time complexity: O(n log n)
str = str.split("").sort().join("");
// Reverse Time complexity: O(n)
str = str.split("").reverse().join("");
// slice Time complexity: O(n)
str.slice(1, 3); // output: "el"
// unshift Time complexity: O(n)
str = "h" + str; // output: "hhello"
// shift Time complexity: O(n)
str = str.slice(1); // output: "ello"


