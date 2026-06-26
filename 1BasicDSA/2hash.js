// In JS, Map is implemented using Hash Table
let hash = new Map();
// Insert Time complexity: O(1)
hash.set("key", "value");
// Delete Time complexity: O(1)
hash.delete("key");
// Search Time complexity: O(1)
hash.get("key");
// Check if key exists Time complexity: O(1)
hash.has("key");
// Get size Time complexity: O(1)
hash.size;
// Iterate Time complexity: O(n)
hash.forEach((key, value) => {
    console.log(key, value);
});