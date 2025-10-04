import { Grid } from './maze.js';
import { Renderer } from './renderer.js';
import { RecursiveBacktracker } from './algorithms/recursive_backtracker.js';
import { Prims } from './algorithms/prims.js';
import { Kruskals } from './algorithms/kruskals.js';
import { AldousBroder } from './algorithms/aldous_broder.js';
import { BinaryTree } from './algorithms/binary_tree.js';
import { HuntAndKill } from './algorithms/hunt_and_kill.js';
import { Wilsons } from './algorithms/wilsons.js';

// Solvers
import { BfsSolver } from './solvers/bfs.js';
import { DijkstraSolver } from './solvers/dijkstra.js';
import { AStarSolver } from './solvers/a_star.js';

const algorithmSelect = document.getElementById('algorithm-select');
const solverSelect = document.getElementById('solver-select');
const sizeSelect = document.getElementById('size-select');
const speedSelect = document.getElementById('speed-select');
const generateBtn = document.getElementById('generate-btn');
const solveBtn = document.getElementById('solve-btn');
const clearBtn = document.getElementById('clear-solution-btn');
const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');

// Stats
const genStepsEl = document.getElementById('gen-steps');
const solveStepsEl = document.getElementById('solve-steps');

const algorithms = [
    { name: 'Recursive Backtracker', class: RecursiveBacktracker },
    { name: "Prim's Algorithm", class: Prims },
    { name: "Kruskal's Algorithm", class: Kruskals },
    { name: 'Aldous-Broder Algorithm', class: AldousBroder },
    { name: 'Binary Tree Algorithm', class: BinaryTree },
    { name: 'Hunt and Kill Algorithm', class: HuntAndKill },
    { name: "Wilson's Algorithm", class: Wilsons },
];

const solvers = [
    { name: 'Breadth-First Search', class: BfsSolver },
    { name: "Dijkstra's Algorithm", class: DijkstraSolver },
    { name: 'A* Search', class: AStarSolver },
];

let grid, renderer, animationId;
let isGenerating = false;
let currentGenerator = null;

function initialize() {
    algorithms.forEach((algo, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = algo.name;
        algorithmSelect.appendChild(option);
    });

    solvers.forEach((solver, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = solver.name;
        solverSelect.appendChild(option);
    });

    generateBtn.addEventListener('click', generateMaze);
    solveBtn.addEventListener('click', solveMaze);
    clearBtn.addEventListener('click', clearSolution);

    generateMaze();
}

function clearSolution() {
    if (animationId) cancelAnimationFrame(animationId);
    isGenerating = false; // Also stop any potential generation
    if(renderer) renderer.draw();
    solveStepsEl.textContent = '0';
}

function generateMaze() {
    if (animationId) cancelAnimationFrame(animationId);
    isGenerating = true;
    genStepsEl.textContent = '0';
    solveStepsEl.textContent = '0';

    const size = parseInt(sizeSelect.value);
    const algoIndex = parseInt(algorithmSelect.value);
    const speed = parseInt(speedSelect.value);

    // Responsive canvas sizing
    const canvasContainer = canvas.parentElement;
    const availableWidth = canvasContainer.clientWidth;
    const cellSize = Math.floor(availableWidth / size);
    const canvasSize = size * cellSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    grid = new Grid(size, size);
    renderer = new Renderer(grid, ctx, cellSize);
    const generator = new algorithms[algoIndex].class(grid);
    currentGenerator = generator.generate();

    function animateGeneration() {
        for (let i = 0; i < speed; i++) {
            const result = currentGenerator.next();
            if (result.value && result.value.steps) {
                genStepsEl.textContent = result.value.steps;
            }
            if (result.done) {
                renderer.draw();
                isGenerating = false;
                return;
            }
        }
        renderer.draw();
        animationId = requestAnimationFrame(animateGeneration);
    }

    animateGeneration();
}

function solveMaze() {
    if (animationId) cancelAnimationFrame(animationId);
    solveStepsEl.textContent = '0';

    // If maze is still generating, finish it instantly
    if (isGenerating && currentGenerator) {
        let result = currentGenerator.next();
        while (!result.done) {
            if (result.value && result.value.steps) {
                genStepsEl.textContent = result.value.steps;
            }
            result = currentGenerator.next();
        }
        isGenerating = false;
        renderer.draw();
    }

    const speed = parseInt(speedSelect.value);
    const solverIndex = parseInt(solverSelect.value);
    const solver = new solvers[solverIndex].class(grid);
    
    const start = grid.cells[0][0];
    const end = grid.cells[grid.rows - 1][grid.cols - 1];
    const solveGen = solver.solve(start, end);

    const visitedColor = getComputedStyle(document.documentElement).getPropertyValue('--visited-color').trim();
    const paintedVisited = new Set();

    function animateSolve() {
        let finalPath = null;

        for (let i = 0; i < speed; i++) {
            const result = solveGen.next();
            if (result.done) {
                finalPath = result.value;
                break; // Exit loop if solver is finished
            }

            if (!result.value || !result.value.path) continue;

            if (result.value.steps) {
                solveStepsEl.textContent = result.value.steps;
            }

            const { path } = result.value;
            // Draw visited cells for this step
            ctx.fillStyle = visitedColor;
            path.forEach(cell => {
                if (!paintedVisited.has(cell)) {
                    const x = cell.col * renderer.cellSize;
                    const y = cell.row * renderer.cellSize;
                    ctx.fillRect(x, y, renderer.cellSize, renderer.cellSize);
                    paintedVisited.add(cell);
                }
            });
        }

        if (finalPath) {
            if (finalPath.steps) {
                solveStepsEl.textContent = finalPath.steps;
            }
            renderer.drawSolution(finalPath.path);
            return; // End animation
        }

        animationId = requestAnimationFrame(animateSolve);
    }

    renderer.draw();
    animateSolve();
}

initialize();