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
    {
        name: 'Recursive Backtracker',
        description: 'This is a depth-first search algorithm that creates a maze by carving passages from a grid of cells. It starts from a random cell, and then randomly visits an unvisited neighbor, carving a path. If it gets stuck, it backtracks to the previous cell and tries another path.',
        class: RecursiveBacktracker,
    },
    {
        name: "Prim's Algorithm",
        description: 'Prim\'s algorithm grows the maze by randomly selecting a wall from a list of frontier walls. If the wall connects a visited cell to an unvisited one, the wall is removed, and the new cell is added to the visited set.',
        class: Prims,
    },
    {
        name: "Kruskal's Algorithm",
        description: "Kruskal\'s algorithm works by randomly shuffling all the walls of the grid, and then iterating through them. For each wall, if the cells on either side are not already connected, the wall is removed.",
        class: Kruskals,
    },
    {
        name: 'Aldous-Broder Algorithm',
        description: 'The Aldous-Broder algorithm works by taking a random walk. Starting from a random cell, it moves to a random neighbor. If the neighbor has not been visited, a passage is carved. The walk continues until all cells have been visited.',
        class: AldousBroder,
    },
    {
        name: 'Binary Tree Algorithm',
        description: 'The Binary Tree algorithm is the simplest maze generator. For each cell in the grid, it randomly carves a passage either north or west, creating a maze with a strong diagonal bias.',
        class: BinaryTree,
    },
    {
        name: 'Hunt and Kill Algorithm',
        description: 'The Hunt and Kill algorithm performs a random walk until it hits a dead end. Then, it \'hunts\' by scanning the grid for an unvisited cell adjacent to a visited one, which becomes the new starting point for the walk. This creates more complex and less biased mazes.',
        class: HuntAndKill,
    },
    {
        name: "Wilson's Algorithm",
        description: "Wilson\'s algorithm produces an unbiased maze by performing a loop-erased random walk from an arbitrary unvisited cell. When the walk reaches a cell already in the maze, the entire path is carved into the grid. This is repeated until all cells are visited.",
        class: Wilsons,
    },
    // Add other algorithms here
];

const overviewContainer = document.getElementById('overview-container');

algorithms.forEach((algo, index) => {
    const card = document.createElement('div');
    card.classList.add('algorithm-card');

    const title = document.createElement('h3');
    title.textContent = algo.name;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = algo.description;
    card.appendChild(description);

    const playground = document.createElement('div');
    playground.classList.add('mini-playground');
    card.appendChild(playground);

    const canvas = document.createElement('canvas');
    canvas.id = `canvas-${index}`;
    const cellSize = 15;
    const mazeSize = 20;
    canvas.width = mazeSize * cellSize;
    canvas.height = mazeSize * cellSize;
    playground.appendChild(canvas);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'center';
    playground.appendChild(buttonContainer);

    const generateBtn = document.createElement('button');
    generateBtn.textContent = 'Generate New Maze';
    buttonContainer.appendChild(generateBtn);

    const solveBtn = document.createElement('button');
    solveBtn.textContent = 'Solve';
    buttonContainer.appendChild(solveBtn);

    overviewContainer.appendChild(card);

    const ctx = canvas.getContext('2d');
    let grid = new Grid(mazeSize, mazeSize);
    let renderer = new Renderer(grid, ctx, cellSize);

    const generateMaze = () => {
        grid = new Grid(mazeSize, mazeSize);
        renderer = new Renderer(grid, ctx, cellSize);
        const generator = new algo.class(grid);
        const gen = generator.generate();
        
        // Run generator to completion without animation
        let result = gen.next();
        while (!result.done) {
            result = gen.next();
        }
        renderer.draw();
    };

    const solveMaze = () => {
        const solver = new BfsSolver(grid);
        const start = grid.cells[0][0];
        const end = grid.cells[grid.rows - 1][grid.cols - 1];
        const gen = solver.solve(start, end);
        let result = gen.next();
        while (!result.done) {
            result = gen.next();
        }

        if (result.value) {
            renderer.draw(); // Redraw maze to clear previous solution
            renderer.drawSolution(result.value.path);
        }
    };

    generateBtn.addEventListener('click', generateMaze);
    solveBtn.addEventListener('click', solveMaze);

    // Generate initial maze
    generateMaze();
});
