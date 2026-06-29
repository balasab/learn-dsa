/*

    Properties:
    1. It has excatly N leaf nodes
    2. 

    Applications:
    1. Find all occurences of a pattern in a text.
    2. Find the longest common substring of two strings.
    3. Find the longest repeated substring of a string.
    4. Find the longest palindromic substring of a string.

    Real World Examples:
    1. Search Engines and Auto Complete
    2. Advanced Find functions in IDE
    Suffix Tree structure for 'BANANA$':

├── "BANANA$" [Suffix Index: 0]
├── "A"
│   ├── "NA"
│   │   ├── "NA$" [Suffix Index: 1]
│   │   └── "$" [Suffix Index: 3]
│   └── "$" [Suffix Index: 5]
├── "NA"
│   ├── "NA$" [Suffix Index: 2]
│   └── "$" [Suffix Index: 4]
└── "$" [Suffix Index: 6]

    Suffix Tree structure for 'MISSISSIPPI$':

└── "MISSISSIPPI$" [0]
├── "I"
│   ├── "SSISSIPPI$" [1]
│   │   ├── "SSIPPI$" [4]
│   │   │   └── "PI$" [8]
│   │   │       └── "$" [11]
│   │   └── "SSIppi$" [7]
│   │       └── "PI$" [9]
│   │           └── "$" [12]
│   └── "PPPI$" [10]
│       └── "$" [13]
├── "S"
│   ├── "SISSIPPI$" [2]
│   │   ├── "SIPPPI$" [5]
│   │   │   └── "PI$" [8]
│   │   │       └── "$" [11]
│   │   └── "SIPPI$" [8]
│   │       └── "PI$" [10]
│   │           └── "$" [13]
│   └── "SIMPI$" [6]
│       └── "PI$" [9]
│           └── "$" [12]
├── "P"
│   └── "PI$" [9]
│       └── "$" [12]
└── "$" [11]

*/

class SuffixTreeNode {
    // Maps the first character of an edge to the child node and the full edge label
    children: Map<string, { edgeLabel: string; node: SuffixTreeNode }> = new Map();
    // Stores the starting index of the suffix if this node represents a leaf
    suffixIndex: number = -1;
}

export class SuffixTree {
    public root: SuffixTreeNode = new SuffixTreeNode();
    private text: string;

    constructor(text: string) {
        // It's standard practice to append a unique character (like '$') 
        // to ensure no suffix is a prefix of another suffix.
        this.text = text.endsWith('$') ? text : text + '$';
        this.buildTree();
    }

    private buildTree(): void {
        for (let i = 0; i < this.text.length; i++) {
            const suffix = this.text.substring(i);
            this.insertSuffix(suffix, i);
        }
    }

    private insertSuffix(suffix: string, suffixIndex: number): void {
        let currentNode = this.root;
        let i = 0;

        while (i < suffix.length) {
            const firstChar = suffix[i];

            // Case 1: No edge starts with this character -> Create a new leaf node
            //
            // Example:
            // Text: "BANANA$"
            // Inserting suffix: "BANANA$" (index: 0) to an empty root.
            // Before:
            //   Root
            // After:
            //   Root
            //   └── "BANANA$" [Suffix Index: 0]
            //
            // Or inserting suffix "NANA$" (index: 2) when root has "BANANA$" [0] and "ANANA$" [1]:
            // Before:
            //   Root
            //   ├── "BANANA$" [0]
            //   └── "ANANA$" [1]
            // After:
            //   Root
            //   ├── "BANANA$" [0]
            //   ├── "ANANA$" [1]
            //   └── "NANA$" [2]
            if (!currentNode.children.has(firstChar)) {
                const leaf = new SuffixTreeNode();
                leaf.suffixIndex = suffixIndex;
                currentNode.children.set(firstChar, {
                    edgeLabel: suffix.substring(i),
                    node: leaf
                });
                return;
            }

            // Case 2: An edge matches the first character -> Find the common prefix
            //
            // Example:
            // Existing tree has edge "ANANA$" from Root.
            // Inserting suffix "ANA$" (index: 3).
            // First character is 'A'. It matches the existing edge "ANANA$".
            // We compare suffix "ANA$" with edge label "ANANA$" to find the longest common prefix.
            // Result: common prefix is "ANA" (length j = 3).
            const edgeData = currentNode.children.get(firstChar)!;
            const edgeLabel = edgeData.edgeLabel;
            const nextNode = edgeData.node;

            let j = 0;
            while (j < edgeLabel.length && i + j < suffix.length && edgeLabel[j] === suffix[i + j]) {
                j++;
            }

            // Case 2a: The entire edge label matches -> Move down to the next node
            //
            // Example:
            // Existing tree branch: Root -> "NA" -> (children: "NA$" [2], "$" [4])
            // Inserting suffix "NA$" (index: 4).
            // At Root, we see edge "NA". The common prefix length is j = 2.
            // Since j (2) equals the edgeLabel length (2), the entire edge matches.
            // Before traversal:
            //   currentNode = Root (looking for "NA$")
            // After traversal:
            //   currentNode = nextNode (the node under "NA", looking for "$")
            if (j === edgeLabel.length) {
                i += j;
                currentNode = nextNode;
            }
            // Case 2b: Mismatch occurs mid-edge -> Split the edge
            //
            // Example:
            // Existing tree has edge "ANANA$" [1] from Root.
            // Inserting suffix "ANA$" (index: 3).
            // The common prefix length is j = 3 ("ANA").
            // Mismatch occurs at index 3: '$' in suffix vs 'N' in edge label.
            // We split "ANANA$" into "ANA" and "NA$".
            // Before:
            //   Root
            //   └── "ANANA$" [Suffix Index: 1]
            // After:
            //   Root
            //   └── "ANA" (new internal split node)
            //       ├── "NA$" [Suffix Index: 1] (remaining of old edge "ANANA$")
            //       └── "$" [Suffix Index: 3] (remaining of new suffix "ANA$")
            else {
                const remainingEdge = edgeLabel.substring(j);
                const remainingSuffix = suffix.substring(i + j);

                // 1. Create a internal split node
                const splitNode = new SuffixTreeNode();

                // 2. Point current node's starting char to the new split node
                currentNode.children.set(firstChar, {
                    edgeLabel: edgeLabel.substring(0, j),
                    node: splitNode
                });

                // 3. Connect the old next node to the split node
                splitNode.children.set(remainingEdge[0], {
                    edgeLabel: remainingEdge,
                    node: nextNode
                });

                // 4. Connect the new suffix leaf node to the split node
                const leafNode = new SuffixTreeNode();
                leafNode.suffixIndex = suffixIndex;
                splitNode.children.set(remainingSuffix[0], {
                    edgeLabel: remainingSuffix,
                    node: leafNode
                });

                return;
            }
        }
    }

    /**
     * Helper method to visualize the tree structure in the console
     */
    public printTree(node: SuffixTreeNode = this.root, indent: string = ""): void {
        for (const [key, edgeData] of node.children.entries()) {
            const leafInfo = edgeData.node.suffixIndex !== -1 ? ` [Suffix Index: ${edgeData.node.suffixIndex}]` : "";
            console.log(`${indent}├── "${edgeData.edgeLabel}"${leafInfo}`);
            this.printTree(edgeData.node, indent + "│   ");
        }
    }
}

// Execution
const tree = new SuffixTree("BANANA");
console.log("Suffix Tree structure for 'BANANA$':\n");
tree.printTree();

