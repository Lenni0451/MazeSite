class AStarSolver {
    constructor(grid) {
        this.grid = grid;
    }

    *solve(startCell, endCell) {
        const openSet = new Set([startCell]);
        const cameFrom = new Map();
        let steps = 0;

        const gScore = new Map();
        gScore.set(startCell, 0);

        const fScore = new Map();
        fScore.set(startCell, this.heuristic(startCell, endCell));

        while (openSet.size > 0) {
            let current = null;
            let minFScore = Infinity;
            for (const cell of openSet) {
                const score = fScore.get(cell) ?? Infinity;
                if (score < minFScore) {
                    minFScore = score;
                    current = cell;
                }
            }

            if (current === endCell) {
                steps++;
                yield { path: [current], steps };
                const path = [current];
                let temp = current;
                while (cameFrom.has(temp)) {
                    temp = cameFrom.get(temp);
                    path.unshift(temp);
                }
                return { path, steps };
            }

            openSet.delete(current);
            steps++;
            yield { path: [current], steps }; // Yield for animation

            const neighbors = this.getValidNeighbors(current);
            for (const neighbor of neighbors) {
                const tentativeGScore = (gScore.get(current) ?? Infinity) + 1;
                if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, endCell));
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        return null; // No path found
    }


    heuristic(cellA, cellB) {
        // Manhattan distance
        return Math.abs(cellA.col - cellB.col) + Math.abs(cellA.row - cellB.row);
    }

    getValidNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        if (!cell.walls.top) neighbors.push(this.grid.cells[row - 1][col]);
        if (!cell.walls.right) neighbors.push(this.grid.cells[row][col + 1]);
        if (!cell.walls.bottom) neighbors.push(this.grid.cells[row + 1][col]);
        if (!cell.walls.left) neighbors.push(this.grid.cells[row][col - 1]);

        return neighbors.filter(Boolean);
    }
}

export { AStarSolver };
