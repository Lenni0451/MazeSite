class Wilsons {
    constructor(grid) {
        this.grid = grid;
    }

    *generate() {
        const unvisited = new Set();
        for (const row of this.grid.cells) {
            for (const cell of row) {
                unvisited.add(cell);
            }
        }

        // Mark a random cell as visited and part of the maze
        const firstCell = Array.from(unvisited)[Math.floor(Math.random() * unvisited.size)];
        unvisited.delete(firstCell);
        firstCell.visited = true; // Using visited to mean 'in the maze'
        let steps = 0;

        while (unvisited.size > 0) {
            let walk = [];
            let current = Array.from(unvisited)[0]; // Start walk from any unvisited cell
            walk.push(current);

            while (unvisited.has(current)) {
                const neighbors = this.grid.getNeighbors(current);
                const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

                const existingIndex = walk.indexOf(randomNeighbor);
                if (existingIndex !== -1) {
                    // Loop detected, erase it
                    walk = walk.slice(0, existingIndex + 1);
                } else {
                    walk.push(randomNeighbor);
                }
                current = randomNeighbor;
            }

            // Carve the walk into the maze
            for (let i = 0; i < walk.length - 1; i++) {
                this.grid.removeWalls(walk[i], walk[i + 1]);
                steps++;
                unvisited.delete(walk[i]);
                walk[i].visited = true;
            }
            yield { steps }; // Yield to show the carved path
        }

        return { steps };
    }
}

export { Wilsons };
