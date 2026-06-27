class spaceComplexity {
    constant() {
        // spacecomplexity is O(1)
        let arr = [1, 2, 3, 4, 5];
        return arr[0] + arr[1] + arr[2] + arr[3] + arr[4];
    }
    linear() {
        // spacecomplexity is O(n)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }
    quadratic() {
        // spacecomplexity is O(n^2)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                sum += arr[i] * arr[j];
            }
        }
        return sum;
    }
    logSpace() {
        // spacecomplexity is O(log n)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 1; i < arr.length; i *= 2) {
            sum += arr[i];
        }
        return sum;
    }
    cubeSpace() {
        // spacecomplexity is O(n^3)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                for (let k = 0; k < arr.length; k++) {
                    sum += arr[i] * arr[j] * arr[k];
                }
            }
        }
        return sum;
    }
    exponentialSpace() {
        // spacecomplexity is O(2^n)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < Math.pow(2, arr.length); i++) {
            sum += arr[i];
        }
        return sum;
    }
    factorialSpace() {
        // spacecomplexity is O(n!)
        let arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < fact(arr.length); i++) {
            sum += arr[i];
        }
        return sum;
    }
    recursionStackSpace() {
        // spacecomplexity is O(n)
        function fib(n: number): number {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
        }
        return fib(5);
    }
    binaryTreeSpace() {
        // Space complexity of binary tree is O(n)
        // because each node takes O(1) space
        // and there are n nodes
        let root: TreeNode | null = null;
        root!.left = new TreeNode(2);
        root!.right = new TreeNode(3);
        root!.left.left = new TreeNode(4);
        root!.left.right = new TreeNode(5);
        root!.right.left = new TreeNode(6);
        root!.right.right = new TreeNode(7);
        return root;
    }

    graphSpace() {
        // spacecomplexity is O(V + E)
        let adjList: Map<number, { v: number, w: number }[]> = new Map();
        adjList.set(0, [{ v: 1, w: 2 }, { v: 2, w: 3 }]);
        adjList.set(1, [{ v: 0, w: 2 }, { v: 2, w: 4 }]);
        adjList.set(2, [{ v: 0, w: 3 }, { v: 1, w: 4 }]);
        return adjList;
    }
}

function fact(n: number): number {
    if (n === 0) {
        return 1;
    }
    return n * fact(n - 1);
}
class TreeNode {
    constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) { }
}