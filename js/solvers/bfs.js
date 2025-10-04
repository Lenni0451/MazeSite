
class BfsSolver {
    constructor(grid) {
        this.grid = grid;
    }

    *solve(startCell, endCell) {
        const queue = [[startCell]];
        const visited = new Set([startCell]);
        let steps = 0;

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            steps++;

            yield { path, steps }; // Yield for animation

            if (current === endCell) {
                return { path, steps }; // Path found
            }

            const neighbors = this.getValidNeighbors(current);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }

        return null; // No path found
    }

    getValidNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        // Top
        if (!cell.walls.top && row > 0) {
            neighbors.push(this.grid.cells[row - 1][col]);
        }
        // Right
        if (!cell.walls.right && col < this.grid.cols - 1) {
            neighbors.push(this.grid.cells[row][col + 1]);
        }
        // Bottom
        if (!cell.walls.bottom && row < this.grid.rows - 1) {
            neighbors.push(this.grid.cells[row + 1][col]);
        }
        // Left
        if (!cell.walls.left && col > 0) {
            neighbors.push(this.grid.cells[row][col - 1]);
        }

        return neighbors;
    }
}

export { BfsSolver };
