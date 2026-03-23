class Node {
    constructor(x, y, walkable = true) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;
        this.g = 0; // Cost from start
        this.h = 0; // Heuristic (est. cost to goal)
        this.f = 0; // Total cost (g + h)
        this.parent = null;
    }
}

class AStar {
    constructor(grid) {
        this.grid = grid; // 2D array of Node objects
    }

    // Manhattan Distance Heuristic
    heuristic(node, goal) {
        return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    }

    findPath(startNode, goalNode) {
        let openList = [startNode];
        let closedList = new Set();

        while (openList.length > 0) {
            // 1. Get node with lowest f score
            let currentIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) currentIndex = i;
            }
            let current = openList[currentIndex];

            // 2. Check if reached goal
            if (current.x === goalNode.x && current.y === goalNode.y) {
                let path = [];
                let temp = current;
                while (temp) {
                    path.push({ x: temp.x, y: temp.y });
                    temp = temp.parent;
                }
                return path.reverse(); // Return path from start to goal
            }

            // 3. Move current from open to closed
            openList.splice(currentIndex, 1);
            closedList.add(`${current.x},${current.y}`);

            // 4. Check neighbors (Up, Down, Left, Right)
            const neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (!neighbor.walkable || closedList.has(`${neighbor.x},${neighbor.y}`)) {
                    continue;
                }

                let tentativeG = current.g + 1; // Assuming cost between neighbors is 1

                if (tentativeG < neighbor.g || !openList.includes(neighbor)) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, goalNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;

                    if (!openList.includes(neighbor)) {
                        openList.push(neighbor);
                    }
                }
            }
        }
        return null; // No path found
    }

    getNeighbors(node) {
        let neighbors = [];
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let [dx, dy] of dirs) {
            let nx = node.x + dx;
            let ny = node.y + dy;
            if (this.grid[ny] && this.grid[ny][nx]) {
                neighbors.push(this.grid[ny][nx]);
            }
        }
        return neighbors;
    }
}
class EuclideanAStar extends AStar {
    constructor(grid) {
        super(grid);
    }

    // Overriding with Euclidean Distance formula
    heuristic(node, goal) {
        const dx = node.x - goal.x;
        const dy = node.y - goal.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Overriding to allow 8-directional movement (including diagonals)
    getNeighbors(node) {
        let neighbors = [];
        // 8 directions: Up, Down, Left, Right + 4 Diagonals
        const dirs = [
            [0, 1], [0, -1], [1, 0], [-1, 0],   // Cardinal
            [1, 1], [1, -1], [-1, 1], [-1, -1]  // Diagonals
        ];

        for (let [dx, dy] of dirs) {
            let nx = node.x + dx;
            let ny = node.y + dy;

            if (this.grid[ny] && this.grid[ny][nx]) {
                let neighbor = this.grid[ny][nx];

                // Calculate movement cost: 1.41 for diagonals, 1 for cardinals
                // This ensures the shortest path is mathematically accurate
                const isDiagonal = Math.abs(dx) === 1 && Math.abs(dy) === 1;
                neighbor.moveCost = isDiagonal ? Math.SQRT2 : 1;

                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
}