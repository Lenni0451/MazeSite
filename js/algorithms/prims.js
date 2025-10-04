class Prims {
    constructor(grid) {
        this.grid = grid;
    }

    *generate(startRow = 0, startCol = 0) {
        const frontier = [];
        const startCell = this.grid.cells[startRow][startCol];
        startCell.visited = true;
        let steps = 0;

        // Add neighbors of start cell to frontier
        const neighbors = this.grid.getNeighbors(startCell);
        for (const neighbor of neighbors) {
            frontier.push({ cell: neighbor, from: startCell });
        }

        while (frontier.length > 0) {
            const randomIndex = Math.floor(Math.random() * frontier.length);
            const { cell, from } = frontier.splice(randomIndex, 1)[0];

            if (!cell.visited) {
                this.grid.removeWalls(from, cell);
                steps++;
                cell.visited = true;

                const newNeighbors = this.grid.getNeighbors(cell).filter(n => !n.visited);
                for (const neighbor of newNeighbors) {
                    frontier.push({ cell: neighbor, from: cell });
                }
                yield { steps }; // Yield for animation
            }
        }

        return { steps };
    }
}

export { Prims };
