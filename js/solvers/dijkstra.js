class DijkstraSolver {
    constructor(grid) {
        this.grid = grid;
    }

    *solve(startCell, endCell) {
        const distances = new Map();
        const prev = new Map();
        const pq = new Set();
        let steps = 0;

        for (const row of this.grid.cells) {
            for (const cell of row) {
                distances.set(cell, Infinity);
                prev.set(cell, null);
                pq.add(cell);
            }
        }

        distances.set(startCell, 0);

        while (pq.size > 0) {
            // Get the cell with the smallest distance
            let u = null;
            let minDistance = Infinity;
            for (const cell of pq) {
                if (distances.get(cell) < minDistance) {
                    minDistance = distances.get(cell);
                    u = cell;
                }
            }

            if (u === null) break;

            pq.delete(u);
            steps++;

            yield { path: [u], steps }; // Yield for animation

            if (u === endCell) break; // Break after yielding

            const neighbors = this.getValidNeighbors(u);
            for (const v of neighbors) {
                if (pq.has(v)) {
                    const alt = distances.get(u) + 1; // Weight is always 1
                    if (alt < distances.get(v)) {
                        distances.set(v, alt);
                        prev.set(v, u);
                    }
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = endCell;

        // Check if a path to endCell was found
        if (prev.has(current) || current === startCell) {
            while (current) {
                path.unshift(current);
                current = prev.get(current);
            }
            return { path, steps: steps + 1 };
        } else {
            return null; // No path found
        }
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

export { DijkstraSolver };
