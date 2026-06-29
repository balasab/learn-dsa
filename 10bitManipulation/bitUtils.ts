/**
 * Bit Manipulation Utilities & Common Interview Questions
 */

/**
 * Get the i-th bit of a number (0-indexed)
 * Returns 1 if set, 0 otherwise
 */
export function getBit(num: number, i: number): number {
  return (num & (1 << i)) !== 0 ? 1 : 0;
}

/**
 * Set the i-th bit of a number to 1
 */
export function setBit(num: number, i: number): number {
  return num | (1 << i);
}

/**
 * Clear the i-th bit of a number to 0
 */
export function clearBit(num: number, i: number): number {
  const mask = ~(1 << i);
  return num & mask;
}

/**
 * Update the i-th bit of a number to the given bitValue (0 or 1)
 */
export function updateBit(num: number, i: number, bitValue: number): number {
  const cleared = clearBit(num, i);
  return cleared | (bitValue << i);
}

/**
 * Check if a number is a power of 2
 * Note: Must be greater than 0
 */
export function isPowerOfTwo(n: number): boolean {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
}

/**
 * Count the number of set bits (1s) in a number
 * Uses Brian Kernighan's Algorithm: O(number of set bits)
 */
export function countSetBits(n: number): number {
  let count = 0;
  while (n > 0) {
    n = n & (n - 1); // Clears the lowest set bit
    count++;
  }
  return count;
}

/**
 * Find the single number in an array where every element appears twice except for one.
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
export function findSingleNumber(nums: number[]): number {
  let unique = 0;
  for (const num of nums) {
    unique ^= num; // XOR cancels out duplicate numbers (A ^ A = 0, A ^ 0 = A)
  }
  return unique;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  console.log("Bit Manipulation Operations:");
  const num = 5; // binary: 0101
  console.log(`Initial Number: ${num} (binary: 0101)`);
  console.log(`- 0th bit: ${getBit(num, 0)} (Expected: 1)`);
  console.log(`- 1st bit: ${getBit(num, 1)} (Expected: 0)`);
  console.log(`- Set 1st bit: ${setBit(num, 1)} (Expected: 7 [0111])`);
  console.log(`- Clear 0th bit: ${clearBit(num, 0)} (Expected: 4 [0100])`);
  console.log(`- Update 1st bit to 1: ${updateBit(num, 1, 1)} (Expected: 7)`);
  
  console.log("\nPower of Two Check:");
  console.log(`- Is 16 power of two? ${isPowerOfTwo(16)} (Expected: true)`);
  console.log(`- Is 18 power of two? ${isPowerOfTwo(18)} (Expected: false)`);

  console.log("\nBrian Kernighan's Set Bits Count:");
  console.log(`- Set bits in 7 (0111): ${countSetBits(7)} (Expected: 3)`);
  console.log(`- Set bits in 8 (1000): ${countSetBits(8)} (Expected: 1)`);

  console.log("\nSingle Number in Array:");
  const arr = [4, 1, 2, 1, 2];
  console.log(`Array: [${arr.join(", ")}]`);
  console.log(`Single Number: ${findSingleNumber(arr)} (Expected: 4)`);
}
