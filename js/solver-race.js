import { Grid } from './maze.js';
import { Renderer } from './renderer.js';

// Generators
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
const sizeSelect = document.getElementById('size-select');
const speedSelect = document.getElementById('speed-select');
const raceBtn = document.getElementById('race-btn');
const solverGrid = document.getElementById('solver-grid');

const generators = [
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

let animationId = null;

function initialize() {
    generators.forEach((gen, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = gen.name;
        algorithmSelect.appendChild(option);
    });

    raceBtn.addEventListener('click', generateAndRace);
    // Initial race
    generateAndRace();
}

function generateAndRace() {
    if (animationId) cancelAnimationFrame(animationId);
    solverGrid.innerHTML = '';

    const size = parseInt(sizeSelect.value);
    const generatorIndex = parseInt(algorithmSelect.value);
    const speed = parseInt(speedSelect.value);

    // 1. Create Master Maze
    const masterGrid = new Grid(size, size);
    const generator = new generators[generatorIndex].class(masterGrid);
    const gen = generator.generate();
    let result = gen.next();
    while (!result.done) {
        result = gen.next();
    }

    const raceInstances = [];
    const tempElements = [];

    // 2. Create DOM elements first
    solvers.forEach((solverInfo) => {
        const item = document.createElement('div');
        item.classList.add('compare-item');

        const title = document.createElement('h4');
        title.textContent = solverInfo.name;
        item.appendChild(title);

        const canvas = document.createElement('canvas');
        item.appendChild(canvas);

        const status = document.createElement('p');
        status.textContent = 'Racing...';
        item.appendChild(status);

        solverGrid.appendChild(item);
        tempElements.push({ canvas, status, solverInfo });
    });

    // 3. Get consistent size and create instances
    const canvasWidth = tempElements[0].canvas.clientWidth;

    tempElements.forEach(({ canvas, status, solverInfo }) => {
        const gridClone = masterGrid.clone();

        canvas.width = canvasWidth;
        canvas.height = canvasWidth;
        const cellSize = canvasWidth / size;

        const ctx = canvas.getContext('2d');
        const renderer = new Renderer(gridClone, ctx, cellSize);
        renderer.draw();

        const solver = new solverInfo.class(gridClone);
        const solveGen = solver.solve(gridClone.cells[0][0], gridClone.cells[size - 1][size - 1]);

        raceInstances.push({ 
            renderer,
            solveGen,
            statusEl: status,
            finished: false,
            startTime: performance.now(),
            paintedVisited: new Set(),
        });
    });

    // 4. Start Race
    animateRace(raceInstances, speed);
}

function animateRace(instances, speed) {
    const visitedColor = getComputedStyle(document.documentElement).getPropertyValue('--visited-color').trim();
    let finishedCount = 0;

    function raceLoop() {
        instances.forEach((instance) => {
            if (instance.finished) return;

            for (let i = 0; i < speed; i++) {
                const result = instance.solveGen.next();

                if (result.done) {
                    instance.finished = true;
                    finishedCount++;
                    const endTime = performance.now();
                    const timeTaken = ((endTime - instance.startTime) / 1000).toFixed(2);
                    const finalSteps = result.value ? result.value.steps : instance.lastSteps || 0;
                    instance.statusEl.textContent = `Finished in ${timeTaken}s (${finalSteps} steps)`;
                    
                    if(result.value) {
                        instance.renderer.drawSolution(result.value.path);
                    }
                    break; // Exit speed loop
                }

                if (result.value && result.value.path) {
                    instance.lastSteps = result.value.steps;
                    instance.statusEl.textContent = `Racing... (${result.value.steps} steps)`;
                    const ctx = instance.renderer.ctx;
                    ctx.fillStyle = visitedColor;
                    result.value.path.forEach(cell => {
                        if (!instance.paintedVisited.has(cell)) {
                            const x = cell.col * instance.renderer.cellSize;
                            const y = cell.row * instance.renderer.cellSize;
                            ctx.fillRect(x, y, instance.renderer.cellSize, instance.renderer.cellSize);
                            instance.paintedVisited.add(cell);
                        }
                    });
                }
            }
        });

        if (finishedCount < instances.length) {
            animationId = requestAnimationFrame(raceLoop);
        }
    }

    raceLoop();
}

initialize();