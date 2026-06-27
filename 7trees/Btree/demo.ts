import { BTree } from "./BTree";

// Initialize a B-Tree with a minimum degree of 3 
// Max keys per node = 5, Max children = 6
const btree = new BTree<number, string>(3);

// Insert data
btree.insert(10, "Ten");
btree.insert(20, "Twenty");
btree.insert(5, "Five");
btree.insert(6, "Six");
btree.insert(12, "Twelve");
btree.insert(30, "Thirty");

// Search
console.log(btree.search(12)); // Output: "Twelve"
console.log(btree.search(100)); // Output: null

// Print sorted order
console.log("In-order traversal of B-Tree:");
btree.traverse();
