/**
 * Greatest Common Divisor (GCD) & Least Common Multiple (LCM)
 * Implements the Euclidean Algorithm.
 */

/**
 * Recursive Euclidean Algorithm to compute GCD
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(log(min(a, b))) call stack
 */
export function gcdRecursive(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcdRecursive(b, a % b);
}

/**
 * Iterative Euclidean Algorithm to compute GCD
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(1)
 */
export function gcdIterative(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Least Common Multiple (LCM)
 * Relies on the formula: LCM(a, b) = (a * b) / GCD(a, b)
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(1)
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  // Division is done first to prevent potential integer overflow from product (a * b)
  return Math.abs(a) * (Math.abs(b) / gcdIterative(a, b));
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const num1 = 36;
  const num2 = 60;

  console.log(`Inputs: a = ${num1}, b = ${num2}`);
  console.log(`GCD (Recursive): ${gcdRecursive(num1, num2)} (Expected: 12)`);
  console.log(`GCD (Iterative): ${gcdIterative(num1, num2)} (Expected: 12)`);
  console.log(`LCM:             ${lcm(num1, num2)} (Expected: 180)`);
}
