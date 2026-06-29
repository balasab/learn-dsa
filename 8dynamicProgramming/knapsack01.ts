/**
 * 0/1 Knapsack Problem
 * Given weights and values of N items, put these items in a knapsack of capacity W 
 * to get the maximum total value in the knapsack.
 */

/**
 * Approach 1: Memoization (Top-Down)
 * Time Complexity: O(N * W)
 * Space Complexity: O(N * W) for memoization table + O(N) auxiliary stack space
 */
export function knapsackMemoization(values: number[], weights: number[], capacity: number): number {
  const n = values.length;
  const memo: number[][] = Array.from({ length: n }, () => Array(capacity + 1).fill(-1));

  function solve(index: number, currentCapacity: number): number {
    // Base Case
    if (index === 0) {
      if (weights[0] <= currentCapacity) {
        return values[0];
      }
      return 0;
    }

    // Memo check
    if (memo[index][currentCapacity] !== -1) {
      return memo[index][currentCapacity];
    }

    // Choices: Exclude or Include
    const exclude = solve(index - 1, currentCapacity);
    let include = 0;
    if (weights[index] <= currentCapacity) {
      include = values[index] + solve(index - 1, currentCapacity - weights[index]);
    }

    memo[index][currentCapacity] = Math.max(exclude, include);
    return memo[index][currentCapacity];
  }

  return solve(n - 1, capacity);
}

/**
 * Approach 2: Tabulation (Bottom-Up) with Space Optimization (1D Array)
 * Time Complexity: O(N * W)
 * Space Complexity: O(W)
 */
export function knapsackTabulationSpaceOptimized(values: number[], weights: number[], capacity: number): number {
  const n = values.length;
  // dp[w] stores the maximum value that can be attained with capacity w
  const dp: number[] = Array(capacity + 1).fill(0);

  // Initialize for first item
  for (let w = weights[0]; w <= capacity; w++) {
    dp[w] = values[0];
  }

  // Iterate over remaining items
  for (let i = 1; i < n; i++) {
    // Traverse backwards to prevent using the same item multiple times
    for (let w = capacity; w >= 0; w--) {
      if (weights[i] <= w) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
      }
    }
  }

  return dp[capacity];
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const values = [60, 100, 120];
  const weights = [10, 20, 30];
  const capacity = 50;

  console.log("0/1 Knapsack Solution:");
  console.log("Values: ", values);
  console.log("Weights:", weights);
  console.log("Capacity:", capacity);

  const maxValMemo = knapsackMemoization(values, weights, capacity);
  console.log(`Max Value (Memoization): ${maxValMemo}`); // Expected: 220

  const maxValTab = knapsackTabulationSpaceOptimized(values, weights, capacity);
  console.log(`Max Value (Tabulation - Space Optimized): ${maxValTab}`); // Expected: 220
}
