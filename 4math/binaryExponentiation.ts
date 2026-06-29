/**
 * Binary Exponentiation (Fast Exponentiation)
 * Computes x^n efficiently in O(log n) time.
 */

/**
 * Standard Binary Exponentiation
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export function fastPower(base: number, exp: number): number {
  if (exp < 0) {
    base = 1 / base;
    exp = -exp;
  }

  let result = 1;
  let currentProduct = base;

  while (exp > 0) {
    // If exponent is odd, multiply result by current power
    if (exp % 2 === 1) {
      result *= currentProduct;
    }
    // Square the base
    currentProduct *= currentProduct;
    // Divide the exponent by 2
    exp = Math.floor(exp / 2);
  }

  return result;
}

/**
 * Modular Exponentiation: computes (base^exp) % mod
 * Avoids overflow by applying modulo operation at each multiplication step.
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export function modularPower(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  
  // Handle negative base
  let result = 1;
  base = base % mod;
  if (base < 0) base += mod;

  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }

  return result;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  console.log("=== Fast Exponentiation ===");
  console.log(`2^10 = ${fastPower(2, 10)} (Expected: 1024)`);
  console.log(`3^5  = ${fastPower(3, 5)}  (Expected: 243)`);
  console.log(`2^-3 = ${fastPower(2, -3)} (Expected: 0.125)`);

  console.log("\n=== Modular Exponentiation ===");
  // (2^10) % 1000 = 1024 % 1000 = 24
  console.log(`(2^10) % 1000 = ${modularPower(2, 10, 1000)} (Expected: 24)`);
  // (5^13) % 13 = 5 (using Fermat's Little Theorem: a^(p) % p = a % p)
  console.log(`(5^13) % 13   = ${modularPower(5, 13, 13)}   (Expected: 5)`);
}
