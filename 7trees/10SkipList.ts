/*
    Level 2:  [Header] --------------------------> [9] --------------------------> Null
             |                                  |
    Level 1:  [Header] -----------> [3] ---------> [9] -----------> [12] --------> Null
             |                   |              |                 |
    Level 0:  [Header] -> [3:Alice] -> [7:Charlie] -> [9:David] -> [12:Eve] -> Null

    Redis uses a skip list (combined with a hash table) to implement its Sorted Sets (ZSET)
    
*/
class SkipNode<T> {
    public value: T | null;
    public key: number;
    public forward: (SkipNode<T> | null)[];

    constructor(key: number, value: T | null, level: number) {
        this.key = key;
        this.value = value;
        // Array of forward pointers for each level
        this.forward = new Array(level + 1).fill(null);
    }
}

export class SkipList<T> {
    private MAX_LEVEL: number;
    private P: number;
    private level: number;
    private header: SkipNode<T>;

    constructor(maxLevel: number = 16, p: number = 0.5) {
        this.MAX_LEVEL = maxLevel;
        this.P = p;
        this.level = 0;

        // Header node initialization with minus infinity equivalent key
        this.header = new SkipNode<T>(-Infinity, null, this.MAX_LEVEL);
    }

    // Generates a random level for a node based on geometric distribution
    private randomLevel(): number {
        let lvl = 0;
        while (Math.random() < this.P && lvl < this.MAX_LEVEL) {
            lvl++;
        }
        return lvl;
    }

    /**
     * Search for a value by its key
     */
    public search(key: number): T | null {
        let current = this.header;

        // Start from the highest level and move down
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i]!.key < key) {
                current = current.forward[i]!;
            }
        }

        // Move to the level 0 forward pointer
        current = current.forward[0]!;

        // Check if the current node's key matches the target key
        if (current !== null && current.key === key) {
            return current.value;
        }

        return null;
    }

    /**
     * Insert a key-value pair into the skip list
     */
    public insert(key: number, value: T): void {
        const update = new Array<SkipNode<T> | null>(this.MAX_LEVEL + 1).fill(null);
        let current = this.header;

        // Traverse down to find the insertion position
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i]!.key < key) {
                current = current.forward[i]!;
            }
            update[i] = current;
        }

        current = current.forward[0]!;

        // If the key already exists, update its value
        if (current !== null && current.key === key) {
            current.value = value;
            return;
        }

        // If key doesn't exist, determine a random level for the new node
        const rLevel = this.randomLevel();

        // If random level is greater than the list's current maximum level,
        // initialize update array pointers up to the new level
        if (rLevel > this.level) {
            for (let i = this.level + 1; i <= rLevel; i++) {
                update[i] = this.header;
            }
            this.level = rLevel;
        }

        // Create the new node and splice it into the layers
        const newNode = new SkipNode<T>(key, value, rLevel);
        for (let i = 0; i <= rLevel; i++) {
            newNode.forward[i] = update[i]!.forward[i];
            update[i]!.forward[i] = newNode;
        }
    }

    /**
     * Delete a key-value pair from the skip list
     */
    public delete(key: number): boolean {
        const update = new Array<SkipNode<T> | null>(this.MAX_LEVEL + 1).fill(null);
        let current = this.header;

        // Traverse down to track the path of nodes to update
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i]!.key < key) {
                current = current.forward[i]!;
            }
            update[i] = current;
        }

        current = current.forward[0]!;

        // If the element is found, restructure the pointers to bypass it
        if (current !== null && current.key === key) {
            for (let i = 0; i <= this.level; i++) {
                if (update[i]!.forward[i] !== current) break;
                update[i]!.forward[i] = current.forward[i];
            }

            // Recalculate the current level of the skip list
            while (this.level > 0 && this.header.forward[this.level] === null) {
                this.level--;
            }
            return true;
        }

        return false; // Key not found
    }

    /**
     * Helper to visualize the structure in console
     */
    public displayList(): void {
        console.log("\n***** Skip List *****");
        for (let i = 0; i <= this.level; i++) {
            let node: SkipNode<T> | null = this.header.forward[i];
            let line = `Level ${i}: `;
            while (node !== null) {
                line += `${node.key}:${node.value} -> `;
                node = node.forward[i];
            }
            console.log(line + "Null");
        }
    }
}
// Create a Skip List mapping numeric IDs to string names
const skiplist = new SkipList<string>();

skiplist.insert(3, "Alice");
skiplist.insert(6, "Bob");
skiplist.insert(7, "Charlie");
skiplist.insert(9, "David");
skiplist.insert(12, "Eve");

skiplist.displayList();

console.log("\nSearching for key 6:", skiplist.search(6)); // Output: "Bob"
console.log("Searching for key 15:", skiplist.search(15)); // Output: null

console.log("\nDeleting key 6...");
skiplist.delete(6);

skiplist.displayList();

