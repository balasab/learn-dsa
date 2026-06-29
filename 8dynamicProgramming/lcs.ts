/**
 * Longest Common Subsequence (LCS)
 * Given two strings text1 and text2, return the length of their longest common subsequence.
 * A subsequence of a string is a new string generated from the original string with some 
 * characters (can be none) deleted without changing the relative order of the remaining characters.
 */

/**
 * Approach 1: 2D Tabulation
 * Time Complexity: O(M * N)
 * Space Complexity: O(M * N)
 */
export function lcs2D(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // dp[i][j] stores the LCS of text1[0...i-1] and text2[0...j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Approach 2: Space Optimized Tabulation (Using 2 rows)
 * Time Complexity: O(M * N)
 * Space Complexity: O(N) where N is the length of text2
 */
export function lcsSpaceOptimized(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  let prev: number[] = Array(n + 1).fill(0);
  let curr: number[] = Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = 1 + prev[j - 1];
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    // Move to next row: prev becomes current
    prev = [...curr];
  }

  return prev[n];
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const text1 = "abcde";
  const text2 = "ace";

  console.log("Longest Common Subsequence (LCS) Solution:");
  console.log(`Text 1: "${text1}"`);
  console.log(`Text 2: "${text2}"`);

  const length2D = lcs2D(text1, text2);
  console.log(`LCS Length (2D Tabulation): ${length2D}`); // Expected: 3 ("ace")

  const lengthOpt = lcsSpaceOptimized(text1, text2);
  console.log(`LCS Length (Space Optimized): ${lengthOpt}`); // Expected: 3
}
