class DSU {
    constructor(grid) {
        this.parent = new Map();
        for (const row of grid.cells) {
            for (const cell of row) {
                this.parent.set(cell, cell);
            }
        }
    }

    find(cell) {
        if (this.parent.get(cell) === cell) {
            return cell;
        }
        const root = this.find(this.parent.get(cell));
        this.parent.set(cell, root); // Path compression
        return root;
    }

    union(cell1, cell2) {
        const root1 = this.find(cell1);
        const root2 = this.find(cell2);
        if (root1 !== root2) {
            this.parent.set(root2, root1);
            return true;
        }
        return false;
    }
}

class Kruskals {
    constructor(grid) {
        this.grid = grid;
    }

    *generate() {
        const dsu = new DSU(this.grid);
        const walls = [];
        let steps = 0;

        // Get all interior walls
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                if (r > 0) walls.push({ cell1: cell, cell2: this.grid.cells[r - 1][c] }); // Top
                if (c > 0) walls.push({ cell1: cell, cell2: this.grid.cells[r][c - 1] }); // Left
            }
        }

        // Shuffle walls
        for (let i = walls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [walls[i], walls[j]] = [walls[j], walls[i]];
        }

        for (const wall of walls) {
            if (dsu.union(wall.cell1, wall.cell2)) {
                this.grid.removeWalls(wall.cell1, wall.cell2);
                steps++;
                yield { steps };
            }
        }

        return { steps };
    }
}

export { Kruskals };
