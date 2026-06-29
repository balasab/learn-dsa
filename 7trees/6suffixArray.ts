/*
    In an interview or real-world application, 
    always prefer the Suffix Array unless 
    you have a strict requirement that absolutely demands a tree structure.

    Choose Suffix Array 
    because it gives you virtually the same algorithmic power 
    as a suffix tree but doesn't crash your system's memory.
    It plays beautifully with CPU caching because it utilizes contiguous memory blocks.
     
    Choose Suffix Tree only if you need to perform pattern matching in strict $O(M)$ time 
    and memory constraints are absolutely not an issue, 
    or if you are solving complex topological problems on strings where a tree hierarchy is mandatory.
*/

interface Suffix {
    index: number;
    rank: [number, number]; // [primary rank, secondary rank]
}

/**
 * Generates a Suffix Array for a given string.
 * Time Complexity: O(N log^2 N) or O(N log N) depending on the sort implementation.
 * Space Complexity: O(N)
 */
export function buildSuffixArray(text: string): number[] {
    const n = text.length;
    let suffixes: Suffix[] = new Array(n);

    // Step 1: Initialize suffixes with their initial characters and ranks
    // At this stage, rank[0] is the ASCII code of the first character, and
    // rank[1] is the ASCII code of the second character (or -1 if none).
    //
    // Example (text = "banana", n = 6):
    // Before: suffixes array is uninitialized.
    // After:
    // [
    //   { index: 0, rank: [98, 97] },   // "ba..."
    //   { index: 1, rank: [97, 110] },  // "an..."
    //   { index: 2, rank: [110, 97] },  // "na..."
    //   { index: 3, rank: [97, 110] },  // "an..."
    //   { index: 4, rank: [110, 97] },  // "na..."
    //   { index: 5, rank: [97, -1] }    // "a"
    // ]
    for (let i = 0; i < n; i++) {
        suffixes[i] = {
            index: i,
            rank: [
                text.charCodeAt(i),
                i + 1 < n ? text.charCodeAt(i + 1) : -1
            ]
        };
    }

    // Step 2: Sort based on the first two characters
    // Suffixes are sorted alphabetically using their initial 2 characters (rank[0] then rank[1]).
    //
    // Example (text = "banana", n = 6):
    // Before: (unsorted array from Step 1)
    // After:
    // [
    //   { index: 5, rank: [97, -1] },   // "a"
    //   { index: 1, rank: [97, 110] },  // "anana"
    //   { index: 3, rank: [97, 110] },  // "ana"
    //   { index: 0, rank: [98, 97] },   // "banana"
    //   { index: 2, rank: [110, 97] },  // "nana"
    //   { index: 4, rank: [110, 97] }   // "na"
    // ]
    const sortSuffixes = (a: Suffix, b: Suffix): number => {
        if (a.rank[0] !== b.rank[0]) return a.rank[0] - b.rank[0];
        return a.rank[1] - b.rank[1];
    };

    suffixes.sort(sortSuffixes);

    // Helper array to map suffix's original index to its current position in suffixes array
    const ind = new Array(n);

    // Step 3: Repeat prefix doubling
    // This loop repeats sorting with doubled prefix lengths (4, 8, 16, etc. characters)
    // by combining the ranks of two adjacent chunks of size k/2.
    //
    // Example (text = "banana", first iteration k = 4, chunk size = 2):
    //
    // Sub-step 3.1: Re-assign primary ranks based on previous iteration's ranking.
    // Suffixes with identical ranks receive the same new primary rank.
    // Ranks before updates:
    //   index 5 -> [97, -1]  => receives rank 0
    //   index 1 -> [97, 110] => receives rank 1
    //   index 3 -> [97, 110] => receives rank 1 (identical to index 1)
    //   index 0 -> [98, 97]  => receives rank 2
    //   index 2 -> [110, 97] => receives rank 3
    //   index 4 -> [110, 97] => receives rank 3 (identical to index 2)
    //
    // Sub-step 3.2: Assign secondary ranks using the rank of the suffix starting at index + 2.
    //   index 5 -> rank[1] = rank of suffix starting at (5+2 = 7) -> out of bounds -> -1
    //   index 1 -> rank[1] = rank of suffix starting at (1+2 = 3) -> rank 1
    //   index 3 -> rank[1] = rank of suffix starting at (3+2 = 5) -> rank 0
    //   index 0 -> rank[1] = rank of suffix starting at (0+2 = 2) -> rank 3
    //   index 2 -> rank[1] = rank of suffix starting at (2+2 = 4) -> rank 3
    //   index 4 -> rank[1] = rank of suffix starting at (4+2 = 6) -> out of bounds -> -1
    //
    // Sub-step 3.3: Sort suffixes by updated ranks:
    // Before Sorting:
    //   [
    //     { index: 5, rank: [0, -1] },
    //     { index: 1, rank: [1, 1] },
    //     { index: 3, rank: [1, 0] },
    //     { index: 0, rank: [2, 3] },
    //     { index: 2, rank: [3, 3] },
    //     { index: 4, rank: [3, -1] }
    //   ]
    // After Sorting:
    //   [
    //     { index: 5, rank: [0, -1] },   // "a"
    //     { index: 3, rank: [1, 0] },    // "ana"
    //     { index: 1, rank: [1, 1] },    // "anana"
    //     { index: 0, rank: [2, 3] },    // "banana"
    //     { index: 4, rank: [3, -1] },   // "na"
    //     { index: 2, rank: [3, 3] }     // "nana"
    //   ]
    for (let k = 4; k < 2 * n; k *= 2) {
        let rank = 0;
        let prevRank0 = suffixes[0].rank[0];
        let prevRank1 = suffixes[0].rank[1];

        suffixes[0].rank[0] = rank;
        ind[suffixes[0].index] = 0;

        // Assign new primary ranks to suffixes
        for (let i = 1; i < n; i++) {
            if (suffixes[i].rank[0] === prevRank0 && suffixes[i].rank[1] === prevRank1) {
                prevRank0 = suffixes[i].rank[0];
                prevRank1 = suffixes[i].rank[1];
                suffixes[i].rank[0] = rank;
            } else {
                prevRank0 = suffixes[i].rank[0];
                prevRank1 = suffixes[i].rank[1];
                suffixes[i].rank[0] = ++rank;
            }
            ind[suffixes[i].index] = i;
        }

        // Assign new secondary ranks using the next 2^(k) chunk
        for (let i = 0; i < n; i++) {
            const nextIndex = suffixes[i].index + Math.floor(k / 2);
            suffixes[i].rank[1] = nextIndex < n ? suffixes[ind[nextIndex]].rank[0] : -1;
        }

        // Sort the suffixes based on updated ranks
        suffixes.sort(sortSuffixes);
    }

    // Step 4: Extract just the sorted indices
    return suffixes.map(s => s.index);
}

/**
 * Performs a binary search pattern matching using the suffix array.
 * Time Complexity: O(M log N) where M is pattern length, N is text length.
 *
 * Example:
 *   text = "banana", pattern = "an"
 *   suffixArray = [5, 3, 1, 0, 4, 2] (sorted suffixes: "a", "ana", "anana", "banana", "na", "nana")
 *
 *   Binary search search range: left = 0, right = 5.
 *   - Iteration 1: mid = 2. suffixArray[2] = 1 (suffix: "anana", length-2 prefix: "an").
 *     Match found!
 *   - Expansion phase:
 *     - Left side: checks mid - 1 (index 1 -> suffix index 3, "ana"). Prefix is "an", matches!
 *     - Left side: checks index 0 (suffix index 5, "a"). Mismatch.
 *     - Right side: checks mid + 1 (index 3 -> suffix index 0, "banana"). Mismatch.
 *   - Collected occurrences (unsorted indices): [1, 3].
 *   - Sorted output occurrences: [1, 3]
 */
export function searchPattern(text: string, pattern: string, suffixArray: number[]): number[] {
    const n = text.length;
    const m = pattern.length;
    let left = 0;
    let right = n - 1;
    const results: number[] = [];

    // Binary search for the first occurrence or match boundaries
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const suffixStr = text.substring(suffixArray[mid], suffixArray[mid] + m);

        if (suffixStr === pattern) {
            // Found a match! Collect all matching contiguous elements in the array
            results.push(suffixArray[mid]);

            // Check left side of mid
            let l = mid - 1;
            while (l >= 0 && text.substring(suffixArray[l], suffixArray[l] + m) === pattern) {
                results.push(suffixArray[l]);
                l--;
            }
            // Check right side of mid
            let r = mid + 1;
            while (r < n && text.substring(suffixArray[r], suffixArray[r] + m) === pattern) {
                results.push(suffixArray[r]);
                r++;
            }
            break;
        }

        if (suffixStr < pattern) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return results.sort((a, b) => a - b); // return indices sorted by occurrence
}