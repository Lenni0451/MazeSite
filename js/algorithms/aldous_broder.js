class AldousBroder {
    constructor(grid) {
        this.grid = grid;
    }

    *generate() {
        let unvisited = this.grid.rows * this.grid.cols - 1;
        let current = this.grid.cells[Math.floor(Math.random() * this.grid.rows)][Math.floor(Math.random() * this.grid.cols)];
        current.visited = true;
        let steps = 0;

        while (unvisited > 0) {
            const neighbors = this.grid.getNeighbors(current);
            const randomIndex = Math.floor(Math.random() * neighbors.length);
            const randomNeighbor = neighbors[randomIndex];

            if (!randomNeighbor.visited) {
                this.grid.removeWalls(current, randomNeighbor);
                steps++;
                randomNeighbor.visited = true;
                unvisited--;
                yield { steps };
            }
            current = randomNeighbor;
        }

        return { steps };
    }
}

export { AldousBroder };
