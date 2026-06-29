/**
 * N-Queens Problem
 * The n-queens puzzle is the problem of placing n queens on an n x n chessboard 
 * such that no two queens attack each other.
 * This solution returns all distinct solutions.
 */

export function solveNQueens(n: number): string[][] {
  const solutions: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill("."));

  // Sets to track occupied columns and diagonals in O(1) time
  const cols = new Set<number>();
  const mainDiagonals = new Set<number>(); // row - col is constant
  const antiDiagonals = new Set<number>(); // row + col is constant

  function backtrack(row: number): void {
    if (row === n) {
      // Found a valid configuration, capture the board state
      solutions.push(board.map(r => r.join("")));
      return;
    }

    for (let col = 0; col < n; col++) {
      const diag1 = row - col;
      const diag2 = row + col;

      // Check if placing a queen here violates safety
      if (cols.has(col) || mainDiagonals.has(diag1) || antiDiagonals.has(diag2)) {
        continue;
      }

      // Place Queen
      board[row][col] = "Q";
      cols.add(col);
      mainDiagonals.add(diag1);
      antiDiagonals.add(diag2);

      // Recurse to next row
      backtrack(row + 1);

      // Backtrack (Remove Queen)
      board[row][col] = ".";
      cols.delete(col);
      mainDiagonals.delete(diag1);
      antiDiagonals.delete(diag2);
    }
  }

  backtrack(0);
  return solutions;
}

// ====================
// Usage Example
// ====================
declare const require: any;
declare const module: any;

if (require.main === module) {
  const n = 4;
  console.log(`Solving N-Queens for N = ${n}...`);
  const results = solveNQueens(n);
  console.log(`Found ${results.length} solutions:\n`);
  
  results.forEach((sol, index) => {
    console.log(`Solution ${index + 1}:`);
    sol.forEach(row => console.log(row));
    console.log();
  });
}
