class HuntAndKill {
    constructor(grid) {
        this.grid = grid;
    }

    *generate() {
        let current = this.grid.cells[Math.floor(Math.random() * this.grid.rows)][Math.floor(Math.random() * this.grid.cols)];
        current.visited = true;
        let steps = 0;

        while (current) {
            const neighbors = this.grid.getNeighbors(current).filter(n => !n.visited);

            if (neighbors.length > 0) {
                const randomIndex = Math.floor(Math.random() * neighbors.length);
                const randomNeighbor = neighbors[randomIndex];
                this.grid.removeWalls(current, randomNeighbor);
                steps++;
                current = randomNeighbor;
                current.visited = true;
                yield { steps }; // Yield for walk animation
            } else {
                current = null; // End of walk, start hunt
                let found = false;
                for (let r = 0; r < this.grid.rows; r++) {
                    for (let c = 0; c < this.grid.cols; c++) {
                        const cell = this.grid.cells[r][c];
                        if (!cell.visited) {
                            const visitedNeighbors = this.grid.getNeighbors(cell).filter(n => n.visited);
                            if (visitedNeighbors.length > 0) {
                                current = cell;
                                current.visited = true;
                                const randomVisitedNeighbor = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
                                this.grid.removeWalls(current, randomVisitedNeighbor);
                                steps++;
                                yield { steps };
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) break;
                }
            }
        }

        return { steps };
    }
}

export { HuntAndKill };
