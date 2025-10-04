class RecursiveBacktracker {
    constructor(grid) {
        this.grid = grid;
    }

    *generate(startRow = 0, startCol = 0) {
        const stack = [];
        const startCell = this.grid.cells[startRow][startCol];
        startCell.visited = true;
        stack.push(startCell);
        let steps = 0;

        while (stack.length > 0) {
            const current = stack.pop();
            const neighbors = this.grid.getNeighbors(current).filter(n => !n.visited);

            if (neighbors.length > 0) {
                stack.push(current);
                const randomIndex = Math.floor(Math.random() * neighbors.length);
                const randomNeighbor = neighbors[randomIndex];

                this.grid.removeWalls(current, randomNeighbor);
                steps++;
                randomNeighbor.visited = true;
                stack.push(randomNeighbor);
                yield { steps }; // Yield for animation
            }
        }
        return { steps };
    }
}

export { RecursiveBacktracker };
