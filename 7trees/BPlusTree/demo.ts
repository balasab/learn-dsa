import { BPlusTree } from "./BPlusTree";

// Initialize a B+ Tree with minimum degree t = 3
// Max keys = 5
const btree = new BPlusTree<number, string>(3);

console.log("=== Inserting keys ===");
btree.insert(10, "Ten");
btree.insert(20, "Twenty");
btree.insert(5, "Five");
btree.insert(6, "Six");
btree.insert(12, "Twelve");
btree.insert(30, "Thirty");
btree.insert(15, "Fifteen");
btree.insert(25, "Twenty Five");

console.log("\n=== Search Tests ===");
console.log("Search for 12:", btree.search(12)); // Output: "Twelve"
console.log("Search for 15:", btree.search(15)); // Output: "Fifteen"
console.log("Search for 100:", btree.search(100)); // Output: null

console.log("\n=== In-Order DFS Traversal ===");
btree.traverse();

console.log("\n=== Leaf List Traversal (Sequential) ===");
btree.traverseLeaves();

console.log("\n=== Removing keys ===");
console.log("Removing 6...");
btree.remove(6);

console.log("Removing 15...");
btree.remove(15);

console.log("\n=== Leaf List Traversal after removal ===");
btree.traverseLeaves();

console.log("\n=== Search for removed 6 (should be null):", btree.search(6));
console.log("=== Search for removed 15 (should be null):", btree.search(15));
