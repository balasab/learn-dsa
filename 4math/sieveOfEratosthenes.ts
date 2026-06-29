/**
 * Sieve of Eratosthenes
 * An efficient algorithm to find all prime numbers up to a given limit N.
 * 
 * Time Complexity: O(N log log N)
 * Space Complexity: O(N)
 */

/**
 * Returns a boolean array prime where prime[i] is true if i is prime.
 */
export function sieveOfEratosthenes(n: number): boolean[] {
  if (n < 0) return [];
  
  const isPrime: boolean[] = Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let p = 2; p * p <= n; p++) {
    // If isPrime[p] is not changed, then it is a prime
    if (isPrime[p]) {
      // Update all multiples of p starting from p^2
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }

  return isPrime;
}

/**
 * Helper to get an array of prime numbers up to N
 */
export function getPrimesUpTo(n: number): number[] {
  const isPrime = sieveOfEratosthenes(n);
  const primes: number[] = [];
  
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  
  return primes;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const limit = 50;
  console.log(`Generating prime numbers up to ${limit}:`);
  const primes = getPrimesUpTo(limit);
  console.log(primes.join(", "));
  // Expected: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
}
