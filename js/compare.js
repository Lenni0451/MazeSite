import { Grid } from './maze.js';
import { Renderer } from './renderer.js';
import { RecursiveBacktracker } from './algorithms/recursive_backtracker.js';
import { Prims } from './algorithms/prims.js';
import { Kruskals } from './algorithms/kruskals.js';
import { AldousBroder } from './algorithms/aldous_broder.js';
import { BinaryTree } from './algorithms/binary_tree.js';
import { HuntAndKill } from './algorithms/hunt_and_kill.js';
import { Wilsons } from './algorithms/wilsons.js';
import { BfsSolver } from './solvers/bfs.js';

const algorithms = [
    { name: 'Recursive Backtracker', class: RecursiveBacktracker },
    { name: "Prim's Algorithm", class: Prims },
    { name: "Kruskal's Algorithm", class: Kruskals },
    { name: 'Aldous-Broder Algorithm', class: AldousBroder },
    { name: 'Binary Tree Algorithm', class: BinaryTree },
    { name: 'Hunt and Kill Algorithm', class: HuntAndKill },
    { name: "Wilson's Algorithm", class: Wilsons },
];

const compareGridEl = document.getElementById('compare-grid');
const regenerateBtn = document.getElementById('regenerate-all-btn');
const solveBtn = document.getElementById('solve-all-btn');

const mazeSize = 25;
const cellSize = 16;
const mazeInstances = [];

function generateAllMazes() {
    compareGridEl.innerHTML = '';
    mazeInstances.length = 0;

    algorithms.forEach((algo, index) => {
        const item = document.createElement('div');
        item.classList.add('compare-item');

        const title = document.createElement('h4');
        title.textContent = algo.name;
        item.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.id = `canvas-compare-${index}`;
        canvas.width = mazeSize * cellSize;
        canvas.height = mazeSize * cellSize;
        item.appendChild(canvas);

        compareGridEl.appendChild(item);

        const ctx = canvas.getContext('2d');
        const grid = new Grid(mazeSize, mazeSize);
        const renderer = new Renderer(grid, ctx, cellSize);
        
        mazeInstances.push({ grid, renderer, algo });

        const generator = new algo.class(grid);
        const gen = generator.generate();

        let result = gen.next();
        while (!result.done) {
            result = gen.next();
        }

        renderer.draw();
    });
}

function solveAllMazes() {
    mazeInstances.forEach(instance => {
        const { grid, renderer } = instance;
        const solver = new BfsSolver(grid);
        const start = grid.cells[0][0];
        const end = grid.cells[grid.rows - 1][grid.cols - 1];
        
        const gen = solver.solve(start, end);
        let result = gen.next();
        while(!result.done) {
            result = gen.next();
        }
        
        if (result.value) {
            renderer.draw(); // Redraw to clear previous solution
            renderer.drawSolution(result.value.path);
        }
    });
}

regenerateBtn.addEventListener('click', generateAllMazes);
solveBtn.addEventListener('click', solveAllMazes);

// Initial generation
generateAllMazes();