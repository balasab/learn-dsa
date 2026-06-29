/**
 * Permutations
 * Given an array nums of distinct integers, return all the possible permutations.
 * You can return the answer in any order.
 */

export function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visited = new Set<number>();

  function backtrack(): void {
    // Base Case: current permutation is complete
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (visited.has(nums[i])) continue;

      // Make choice
      current.push(nums[i]);
      visited.add(nums[i]);

      // Recurse
      backtrack();

      // Undo choice (backtrack)
      current.pop();
      visited.delete(nums[i]);
    }
  }

  backtrack();
  return result;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const nums = [1, 2, 3];
  console.log("Generating Permutations for:", nums);
  const permutations = permute(nums);
  console.log("Permutations:", permutations);
  // Expected output:
  // [
  //   [1, 2, 3], [1, 3, 2],
  //   [2, 1, 3], [2, 3, 1],
  //   [3, 1, 2], [3, 2, 1]
  // ]
}
