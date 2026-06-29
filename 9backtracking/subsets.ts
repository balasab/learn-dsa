/**
 * Subsets (Power Set)
 * Given an integer array nums of unique elements, return all possible subsets (the power set).
 * The solution set must not contain duplicate subsets. Return the solution in any order.
 */

export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  function backtrack(startIndex: number): void {
    // Add a copy of current subset to results
    result.push([...current]);

    for (let i = startIndex; i < nums.length; i++) {
      // Choose element
      current.push(nums[i]);

      // Recurse with the next index
      backtrack(i + 1);

      // Backtrack (unchoose element)
      current.pop();
    }
  }

  backtrack(0);
  return result;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const nums = [1, 2, 3];
  console.log("Generating Subsets (Power Set) for:", nums);
  const powerSet = subsets(nums);
  console.log("Subsets:", powerSet);
  // Expected output:
  // [
  //   [],          [1],
  //   [1, 2],      [1, 2, 3],
  //   [1, 3],      [2],
  //   [2, 3],      [3]
  // ]
}
