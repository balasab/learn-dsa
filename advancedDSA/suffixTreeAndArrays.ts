
class SuffixTreeNode {
    children: { [char: string]: SuffixTreeNode };
    indices: number[]; // Stores starting positions of the suffix

    constructor() {
        this.children = {};
        this.indices = [];
    }
}

export class SuffixTree {
    root: SuffixTreeNode;
    text: string;

    constructor(text: string) {
        this.root = new SuffixTreeNode();
        this.text = text;
        this.buildTree();
    }

    buildTree(): void {
        // Insert every suffix: "banana", "anana", "nana", etc.
        for (let i = 0; i < this.text.length; i++) {
            let suffix = this.text.substring(i);
            this.insert(suffix, i);
        }
    }

    insert(suffix: string, index: number): void {
        let node = this.root;
        for (let char of suffix) {
            if (!node.children[char]) {
                node.children[char] = new SuffixTreeNode();
            }
            node = node.children[char];
            node.indices.push(index); // Tracks where this suffix starts
        }
    }

    search(substring: string): number[] {
        let node = this.root;
        for (let char of substring) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return node.indices; // Returns all starting positions
    }
}
/**
 * Generates a Suffix Array for a given string.
 * Time Complexity: O(n^2 log n) due to substring/sort. 
 * (Optimized O(n log n) versions exist but are more verbose).
 */
interface SuffixItem {
    index: number;
    suffix: string;
}

function buildSuffixArray(text: string): number[] {
    const suffixes: SuffixItem[] = [];

    for (let i = 0; i < text.length; i++) {
        suffixes.push({
            index: i,
            suffix: text.substring(i)
        });
    }

    // Sort suffixes alphabetically
    suffixes.sort((a, b) => (a.suffix < b.suffix ? -1 : 1));

    // Return only the starting indices
    return suffixes.map(s => s.index);
}

// Example usage:
const str = "banana";
const suffixArray = buildSuffixArray(str);

console.log("Suffix Array for 'banana':", suffixArray);
// Output: [5, 3, 1, 0, 4, 2] 
// (indices corresponding to: a, ana, anana, banana, na, nana)