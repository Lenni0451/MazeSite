class BinaryTree {
    constructor(grid) {
        this.grid = grid;
    }

    *generate() {
        let steps = 0;
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                const neighbors = [];
                if (r > 0) neighbors.push(this.grid.cells[r - 1][c]); // North
                if (c > 0) neighbors.push(this.grid.cells[r][c - 1]); // West

                if (neighbors.length > 0) {
                    const randomIndex = Math.floor(Math.random() * neighbors.length);
                    const randomNeighbor = neighbors[randomIndex];
                    this.grid.removeWalls(cell, randomNeighbor);
                    steps++;
                }
                yield { steps };
            }
        }
        return { steps };
    }
}

export { BinaryTree };
