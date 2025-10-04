class Renderer {
    constructor(grid, ctx, cellSize) {
        this.grid = grid;
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.wallColor = getComputedStyle(document.documentElement).getPropertyValue('--wall-color').trim();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = this.wallColor;
        this.ctx.lineWidth = 1;

        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                const cell = this.grid.cells[r][c];
                const x = c * this.cellSize;
                const y = r * this.cellSize;

                if (cell.walls.top) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + this.cellSize, y);
                    this.ctx.stroke();
                }
                if (cell.walls.right) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize, y);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.stroke();
                }
                if (cell.walls.bottom) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.lineTo(x, y + this.cellSize);
                    this.ctx.stroke();
                }
                if (cell.walls.left) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + this.cellSize);
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawSolution(path) {
        const solutionColor = getComputedStyle(document.documentElement).getPropertyValue('--solution-color').trim();
        this.ctx.strokeStyle = solutionColor;
        this.ctx.lineWidth = Math.max(1, this.cellSize / 4);
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const cell = path[i];
            const x = cell.col * this.cellSize + this.cellSize / 2;
            const y = cell.row * this.cellSize + this.cellSize / 2;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

}

export { Renderer };
