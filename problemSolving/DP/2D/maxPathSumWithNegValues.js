/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxProductPath = function (grid) {
    const MOD = Math.pow(10, 9) + 7
    const m = grid.length;
    const n = grid[0].length;
    const maxDP = Array.from({ length: m }, () => new Array(n).fill(0));
    const minDP = Array.from({ length: m }, () => new Array(n).fill(0));

    maxDP[0][0] = minDP[0][0] = grid[0][0];
    for (let i = 1; i < m; i++) {
        maxDP[i][0] = minDP[i][0] = maxDP[i - 1][0] * grid[i][0];
    }
    for (let i = 1; i < n; i++) {
        maxDP[0][i] = minDP[0][i] = maxDP[0][i - 1] * grid[0][i];
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            // find the max path sum
            const minProduct = Math.min(minDP[i - 1][j], minDP[i][j - 1]);
            // find the min path sum
            const maxProduct = Math.max(maxDP[i - 1][j], maxDP[i][j - 1]);
            if (grid[i][j] >= 0) {
                // maximize the product as curr is +ve
                maxDP[i][j] = maxProduct * grid[i][j];
                // minimie the product as curr is +ve 
                minDP[i][j] = minProduct * grid[i][j];

            } else {
                // choose minpath as curr is -ve
                maxDP[i][j] = minProduct * grid[i][j];
                // choose maxpath as curr is -ve
                minDP[i][j] = maxProduct * grid[i][j];
            }
        }
    }
    const result = maxDP[m - 1][n - 1];
    if (result < 0) return -1;
    if (result > MOD) return result % MOD;
    return result;
};