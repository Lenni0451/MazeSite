
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
        this.visited = false;
    }
}

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.cells = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push(new Cell(r, c));
            }
            this.cells.push(row);
        }
    }

    getNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        if (row > 0) neighbors.push(this.cells[row - 1][col]); // Top
        if (col < this.cols - 1) neighbors.push(this.cells[row][col + 1]); // Right
        if (row < this.rows - 1) neighbors.push(this.cells[row + 1][col]); // Bottom
        if (col > 0) neighbors.push(this.cells[row][col - 1]); // Left

        return neighbors;
    }

    removeWalls(cell1, cell2) {
        const dx = cell1.col - cell2.col;
        if (dx === 1) { // cell1 is to the right of cell2
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (dx === -1) { // cell1 is to the left of cell2
            cell1.walls.right = false;
            cell2.walls.left = false;
        }

        const dy = cell1.row - cell2.row;
        if (dy === 1) { // cell1 is below cell2
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        } else if (dy === -1) { // cell1 is above cell2
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        }
    }

    clone() {
        const newGrid = new Grid(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const oldCell = this.cells[r][c];
                const newCell = newGrid.cells[r][c];
                newCell.walls = { ...oldCell.walls };
            }
        }
        return newGrid;
    }
}

export { Grid, Cell };
