// In JS, Map is implemented using Hash Table
let hash: Map<string, string> = new Map<string, string>();
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
hash.forEach((value: string, key: string) => {
    console.log(key, value);
});
for (const [key, value] of hash) {
    console.log(key, value);
}

for (const [key, value] of hash.entries()) {
    console.log(key, value);
}
for (const key of hash.keys()) {
    console.log(key, hash.get(key));
}
for (const value of hash.values()) {
    console.log(value);
}

let record: Record<string, string> = {};

// Insert Time complexity: O(1)
record["key"] = "value";
// Delete Time complexity: O(1)
delete record["key"];
// Search Time complexity: O(1)
record["key"];
// Check if key exists Time complexity: O(1)
record["key"] !== undefined;

// Iterate Time complexity: O(n)
for (const key in record) {
    console.log(key, record[key]);
}

for (const [key, value] of Object.entries(record)) {
    console.log(key, value);
}
for (const key of Object.keys(record)) {
    console.log(key, record[key]);
}
for (const value of Object.values(record)) {
    console.log(value);
}