class TrieNode {
    children: { [char: string]: TrieNode };
    isEndOfWord: boolean;

    constructor() {
        // Stores child nodes (character -> TrieNode)
        this.children = {};
        // Marks the end of a complete word
        this.isEndOfWord = false;
    }
}

class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Inserts a word into the trie.
     * Time Complexity: O(n), where n is the length of the word.
     */
    insert(word: string): void {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    /**
     * Returns true if the word is in the trie.
     * Time Complexity: O(n)
     */
    search(word: string): boolean {
        let node = this.searchNode(word);
        return node !== null && node.isEndOfWord;
    }

    /**
     * Returns true if there is any word in the trie 
     * that starts with the given prefix.
     */
    startsWith(prefix: string): boolean {
        return this.searchNode(prefix) !== null;
    }

    /**
     * Helper function to navigate to a specific node
     */
    searchNode(str: string): TrieNode | null {
        let node = this.root;
        for (let char of str) {
            if (!node.children[char]) return null;
            node = node.children[char];
        }
        return node;
    }
}

const myTrie = new Trie();

myTrie.insert("apple");
console.log(myTrie.search("apple"));   // true
console.log(myTrie.search("app"));     // false
console.log(myTrie.startsWith("app")); // true

myTrie.insert("app");
console.log(myTrie.search("app"));     // true