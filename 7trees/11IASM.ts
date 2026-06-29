/*
    Indexed Sequential Access Method (ISAM)
    
*/

interface RecordData {
    id: number;
    name: string;
    value: string;
}

interface IndexEntry {
    lowestKey: number;
    blockIndex: number;
}

class ISAMDatabase {
    private blocks: RecordData[][];
    private primaryIndex: IndexEntry[];
    private maxBlockSize: number;

    constructor(sortedRecords: RecordData[], maxBlockSize: number = 3) {
        this.maxBlockSize = maxBlockSize;
        this.blocks = [];
        this.primaryIndex = [];
        this.initializeDatabase(sortedRecords);
    }

    // Chunks the sorted data into blocks and creates the index
    private initializeDatabase(records: RecordData[]): void {
        // Ensure data is sorted by key initially
        const sorted = [...records].sort((a, b) => a.id - b.id);

        for (let i = 0; i < sorted.length; i += this.maxBlockSize) {
            const block = sorted.slice(i, i + this.maxBlockSize);
            this.blocks.push(block);

            // Store the lowest key of each block in the index
            this.primaryIndex.push({
                lowestKey: block[0].id,
                blockIndex: this.blocks.length - 1
            });
        }
    }

    // Find a record using the index
    public find(id: number): RecordData | null {
        if (this.primaryIndex.length === 0) return null;

        // 1. Search the index to find which block might contain the key
        let targetBlockIdx = 0;
        for (let i = 0; i < this.primaryIndex.length; i++) {
            if (id >= this.primaryIndex[i].lowestKey) {
                targetBlockIdx = this.primaryIndex[i].blockIndex;
            } else {
                break;
            }
        }

        // 2. Search sequentially within the localized block
        const block = this.blocks[targetBlockIdx];
        console.log(`[ISAM] Searching in Block ${targetBlockIdx}...`);

        for (const record of block) {
            if (record.id === id) {
                return record;
            }
        }

        return null; // Not found
    }

    // Print structure for visualization
    public debugView(): void {
        console.log("--- Primary Index ---");
        console.table(this.primaryIndex);
        console.log("--- Data Blocks ---");
        this.blocks.forEach((block, idx) => {
            console.log(`Block ${idx}:`, JSON.stringify(block));
        });
    }
}

// ====================
// Usage Example
// ====================

const initialRecords: RecordData[] = [
    { id: 10, name: "Alice", value: "A" },
    { id: 20, name: "Bob", value: "B" },
    { id: 30, name: "Charlie", value: "C" },
    { id: 40, name: "Diana", value: "D" },
    { id: 50, name: "Ethan", value: "E" },
    { id: 60, name: "Fiona", value: "F" }
];

// Instantiate ISAM with a block size of 2 records per block
const db = new ISAMDatabase(initialRecords, 2);

db.debugView();

console.log("\nFetching Record 40:");
const finalrecord = db.find(40);
console.log("Result:", finalrecord);