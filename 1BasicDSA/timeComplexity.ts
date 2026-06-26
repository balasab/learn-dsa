class TimeComplexity {
    constant(a: number, b: number) {
        // timecomplexity is O(1)
        return a + b;
    }
    linear(arr: number[]) {
        // timecomplexity is O(n)
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i]);
        }
    }
    logarithmic(n: number) {
        // timecomplexity is O(log n)
        for (let i = 1; i < n; i *= 2) {
            console.log(i);
        }
    }
    polynomial(n: number) {
        // timecomplexity is O(n^2)
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                console.log(i, j);
            }
        }
    }
    exponential(n: number) {
        // timecomplexity is O(2^n)
        for (let i = 0; i < Math.pow(2, n); i++) {
            console.log(i);
        }
    }
    factorial(n: number) {
        // timecomplexity is O(n!)
        for (let i = 0; i < fact(n); i++) {
            console.log(i);
        }
    }
    quasilinear(arr: number[]) {
        // timecomplexity is O(n log n)
        arr.sort((a, b) => a - b);
    }
    alphaN(n: number) {
        // timecomplexity is O(α(n))
        // alpha represents inverse ackermann function
        // which is very slow growing function
        // it is almost constant
        // example: n = 20, alpha(n) = 3
        // n = 40, alpha(n) = 4
        // n = 2^(2^65536), alpha(n) = 5
        /*  
        Example DSU union and 
        complexity appears almost exclusively in the Disjoint-Set (Union-Find) data structure 
        when you use both Path Compression and Union by Rank.
        */
    }
}
function fact(n: number): number {
    if (n === 0) {
        return 1;
    }
    return n * fact(n - 1);
}