/**
 * Longest Increasing Subsequence (LIS)
 * Given an integer array nums, return the length of the longest strictly increasing subsequence.
 */

/**
 * Approach 1: Standard Dynamic Programming
 * Time Complexity: O(N^2)
 * Space Complexity: O(N)
 */
export function lisDP(nums: number[]): number {
  if (nums.length === 0) return 0;

  const n = nums.length;
  const dp: number[] = Array(n).fill(1);
  let maxLIS = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLIS = Math.max(maxLIS, dp[i]);
  }

  return maxLIS;
}

/**
 * Approach 2: Binary Search (Patience Sorting)
 * Time Complexity: O(N log N)
 * Space Complexity: O(N)
 */
export function lisBinarySearch(nums: number[]): number {
  if (nums.length === 0) return 0;

  // tails[i] stores the smallest tail of all increasing subsequences of length i + 1
  const tails: number[] = [];

  for (const num of nums) {
    let left = 0;
    let right = tails.length;

    // Binary search to find the correct insertion position
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // If num is larger than all elements in tails, append it
    if (left === tails.length) {
      tails.push(num);
    } else {
      // Otherwise, update the smallest tail of length (left + 1)
      tails[left] = num;
    }
  }

  return tails.length;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const nums = [10, 9, 2, 5, 3, 7, 101, 18];

  console.log("Longest Increasing Subsequence (LIS) Solution:");
  console.log("Input Array:", nums);

  const lenDP = lisDP(nums);
  console.log(`LIS Length (O(N^2) DP): ${lenDP}`); // Expected: 4 (e.g. [2, 3, 7, 101] or [2, 3, 7, 18])

  const lenBS = lisBinarySearch(nums);
  console.log(`LIS Length (O(N log N) Binary Search): ${lenBS}`); // Expected: 4
}
