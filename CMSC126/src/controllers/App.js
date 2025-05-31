document.addEventListener('DOMContentLoaded', () => {
    // Initialize grids
    const singleGrid = new Grid(10, 10);
    const dijkstraGrid = new Grid(10, 10);
    const astarGrid = new Grid(10, 10);

    // Initialize grid views
    const singleGridView = new GridView(document.getElementById('grid'), singleGrid);
    const dijkstraGridView = new GridView(document.getElementById('dijkstraGrid'), dijkstraGrid);
    const astarGridView = new GridView(document.getElementById('astarGrid'), astarGrid);

    // Set initial grid size
    document.getElementById('gridSize').value = '10';

    // Statistics elements
    const singleStats = {
        nodesVisited: document.getElementById('nodesVisited'),
        pathLength: document.getElementById('pathLength'),
        executionTime: document.getElementById('executionTime')
    };

    const compareStats = {
        dijkstra: {
            nodesVisited: document.getElementById('dijkstraNodesVisited'),
            pathLength: document.getElementById('dijkstraPathLength'),
            executionTime: document.getElementById('dijkstraTime')
        },
        astar: {
            nodesVisited: document.getElementById('astarNodesVisited'),
            pathLength: document.getElementById('astarPathLength'),
            executionTime: document.getElementById('astarTime')
        }
    };

    // Tool buttons
    const toolButtons = {
        setStart: document.getElementById('setStart'),
        setEnd: document.getElementById('setEnd'),
        addWalls: document.getElementById('addWalls'),
        addWeights: document.getElementById('addWeights'),
        eraser: document.getElementById('eraser')
    };

    // Algorithm selection handling
    document.getElementById('algorithmSelect').addEventListener('change', (e) => {
        const mode = e.target.value;
        const singleGridContainer = document.getElementById('singleGridContainer');
        const compareGridsContainer = document.getElementById('compareGridsContainer');
        const singleStatsContainer = document.getElementById('singleStats');
        const compareStatsContainer = document.getElementById('compareStats');

        if (mode === 'compare') {
            singleGridContainer.classList.add('hidden');
            compareGridsContainer.classList.remove('hidden');
            singleStatsContainer.classList.add('hidden');
            compareStatsContainer.classList.remove('hidden');
            // Sync the comparison grids with the single grid state
            const singleState = singleGrid.toJSON();
            dijkstraGrid.fromJSON(singleState);
            astarGrid.fromJSON(singleState);
            dijkstraGridView.updateGrid();
            astarGridView.updateGrid();
        } else {
            singleGridContainer.classList.remove('hidden');
            compareGridsContainer.classList.add('hidden');
            singleStatsContainer.classList.remove('hidden');
            compareStatsContainer.classList.add('hidden');
            // Sync the single grid with the dijkstra grid state
            const dijkstraState = dijkstraGrid.toJSON();
            singleGrid.fromJSON(dijkstraState);
            singleGridView.updateGrid();
        }
    });

    // Set up grid synchronization for compare mode
    function setupCompareGridInteractions() {
        let isMouseDown = false;

        function handleGridAction(e, row, col) {
            // Get the current tool
            const currentTool = Object.entries(toolButtons).find(([_, btn]) => btn.classList.contains('active'))?.[0];
            if (!currentTool) return;

            // Get nodes from both grids
            const dijkstraNode = dijkstraGridView.grid.getNode(row, col);
            const astarNode = astarGridView.grid.getNode(row, col);
            if (!dijkstraNode || !astarNode) return;

            // Apply the same action to both grids
            switch (currentTool) {
                case 'setStart':
                    if (dijkstraGridView.grid.setStartNode(row, col)) {
                        astarGridView.grid.setStartNode(row, col);
                    }
                    break;
                case 'setEnd':
                    if (dijkstraGridView.grid.setEndNode(row, col)) {
                        astarGridView.grid.setEndNode(row, col);
                    }
                    break;
                case 'addWalls':
                    // Toggle walls in both grids
                    const isWall = dijkstraNode.toggleWall();
                    astarNode.isWall = dijkstraNode.isWall;
                    break;
                case 'addWeights':
                    dijkstraNode.setWeight(5);
                    astarNode.setWeight(5);
                    break;
                case 'eraser':
                    dijkstraNode.erase();
                    astarNode.erase();
                    break;
            }

            // Update both grids
            dijkstraGridView.updateGrid();
            astarGridView.updateGrid();
        }

        // Add event listeners to both grids
        [dijkstraGridView, astarGridView].forEach(gridView => {
            gridView.gridElement.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('cell')) return;
                isMouseDown = true;
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                handleGridAction(e, row, col);
            });

            gridView.gridElement.addEventListener('mouseover', (e) => {
                if (!isMouseDown || !e.target.classList.contains('cell')) return;
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                handleGridAction(e, row, col);
            });
        });

        // Global mouse up handler
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Global mouse leave handler for both grids
        [dijkstraGridView.gridElement, astarGridView.gridElement].forEach(element => {
            element.addEventListener('mouseleave', () => {
                isMouseDown = false;
            });
        });
    }

    // Initialize the compare grid interactions
    setupCompareGridInteractions();

    // Tool button event listeners
    Object.entries(toolButtons).forEach(([tool, button]) => {
        if (!button) return;
        
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            Object.values(toolButtons).forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
            
            // Set the tool for all grid views
            singleGridView.currentTool = tool;
            dijkstraGridView.currentTool = tool;
            astarGridView.currentTool = tool;
        });
    });

    // Grid controls
    document.getElementById('clearBoard').addEventListener('click', () => {
        const mode = document.getElementById('algorithmSelect').value;
        if (mode === 'compare') {
            dijkstraGridView.clearBoard();
            astarGridView.clearBoard();
            updateCompareStats({ dijkstra: null, astar: null });
        } else {
            singleGridView.clearBoard();
            updateStats(0, 0, 0);
        }
    });

    document.getElementById('gridSize').addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        if (isNaN(size) || size < 1) return;
        
        disableControls(true);
        
        try {
            const mode = document.getElementById('algorithmSelect').value;
            if (mode === 'compare') {
                dijkstraGridView.resizeGrid(size, size);
                astarGridView.resizeGrid(size, size);
                updateCompareStats({ dijkstra: null, astar: null });
            } else {
                singleGridView.resizeGrid(size, size);
                updateStats(0, 0, 0);
            }
        } catch (error) {
            console.error('Grid resize error:', error);
        } finally {
            disableControls(false);
        }
    });

    // Algorithm visualization
    document.getElementById('startBtn').addEventListener('click', async () => {
        const speedSelect = document.getElementById('speedControl');
        const speed = speedSelect.value;
        const mode = document.getElementById('algorithmSelect').value;
        
        disableControls(true);

        try {
            if (mode === 'compare') {
                const results = await Promise.all([
                    visualizeAlgorithm(dijkstraGridView, 'dijkstra', speed),
                    visualizeAlgorithm(astarGridView, 'astar', speed)
                ]);
                
                // Check if either algorithm found no path
                if (!results[0].path.length || !results[1].path.length) {
                    alert('No path available! Please ensure there is a valid path between start and end points.');
                }
                
                updateCompareStats({
                    dijkstra: results[0],
                    astar: results[1]
                });
            } else {
                const result = await visualizeAlgorithm(singleGridView, mode, speed);
                if (!result.path.length) {
                    alert('No path available! Please ensure there is a valid path between start and end points.');
                }
                updateStats(
                    result.visitedNodesInOrder.length,
                    result.path.length,
                    result.executionTime
                );
            }
        } catch (error) {
            console.error('Visualization error:', error);
            alert('Please set both start and end points before finding path.');
        } finally {
            disableControls(false);
        }
    });

    // Maze generation
    document.getElementById('generateMaze').addEventListener('click', async () => {
        const speedSelect = document.getElementById('speedControl');
        const speed = speedSelect.value;
        const delays = { fast: 5, medium: 10, slow: 20 };
        
        disableControls(true);

        try {
            const mode = document.getElementById('algorithmSelect').value;
            if (mode === 'compare') {
                // Generate the same maze for both grids using the same seed
                const seed = Math.random();
                await Promise.all([
                    generateMaze(dijkstraGridView, speed, delays, seed),
                    generateMaze(astarGridView, speed, delays, seed)
                ]);
                updateCompareStats({ dijkstra: null, astar: null });
            } else {
                await generateMaze(singleGridView, speed, delays);
                updateStats(0, 0, 0);
            }
        } catch (error) {
            console.error('Maze generation error:', error);
        } finally {
            disableControls(false);
        }
    });

    // Save and load grid
    document.getElementById('saveGrid').addEventListener('click', () => {
        const mode = document.getElementById('algorithmSelect').value;
        if (mode === 'compare') {
            dijkstraGridView.saveToLocalStorage('savedGrid');
        } else {
            singleGridView.saveToLocalStorage('savedGrid');
        }
        alert('Grid saved successfully!');
    });

    document.getElementById('loadGrid').addEventListener('click', () => {
        const mode = document.getElementById('algorithmSelect').value;
        const savedGrid = localStorage.getItem('savedGrid');
        if (!savedGrid) {
            alert('No saved grid found!');
            return;
        }

        if (mode === 'compare') {
            dijkstraGridView.loadFromLocalStorage('savedGrid');
            astarGridView.loadFromLocalStorage('savedGrid');
            updateCompareStats({ dijkstra: null, astar: null });
        } else {
            singleGridView.loadFromLocalStorage('savedGrid');
            updateStats(0, 0, 0);
        }
        alert('Grid loaded successfully!');
    });

    function updateStats(nodesVisited, pathLength, executionTime) {
        singleStats.nodesVisited.textContent = nodesVisited;
        singleStats.pathLength.textContent = Math.max(0, pathLength - 2); // Subtract start and end nodes
        singleStats.executionTime.textContent = executionTime;
    }

    function updateCompareStats(results) {
        if (!results.dijkstra) {
            compareStats.dijkstra.nodesVisited.textContent = '0';
            compareStats.dijkstra.pathLength.textContent = '0';
            compareStats.dijkstra.executionTime.textContent = '0';
        } else {
            compareStats.dijkstra.nodesVisited.textContent = results.dijkstra.visitedNodesInOrder.length;
            compareStats.dijkstra.pathLength.textContent = Math.max(0, results.dijkstra.path.length - 2);
            compareStats.dijkstra.executionTime.textContent = results.dijkstra.executionTime;
        }
        if (!results.astar) {
            compareStats.astar.nodesVisited.textContent = '0';
            compareStats.astar.pathLength.textContent = '0';
            compareStats.astar.executionTime.textContent = '0';
        } else {
            compareStats.astar.nodesVisited.textContent = results.astar.visitedNodesInOrder.length;
            compareStats.astar.pathLength.textContent = Math.max(0, results.astar.path.length - 2);
            compareStats.astar.executionTime.textContent = results.astar.executionTime;
        }
    }

    async function visualizeAlgorithm(gridView, algorithmType, speed) {
        const startTime = performance.now();
        const result = await gridView.visualizeAlgorithm(
            algorithmType === 'dijkstra' ? Dijkstra : AStar,
            speed
        );
        const endTime = performance.now();
        return {
            ...result,
            executionTime: Math.round(endTime - startTime)
        };
    }

    async function generateMaze(gridView, speed, delays, seed = Math.random()) {
        if (seed < 0.5) {
            await MazeGenerator.generateRandomMaze(gridView.grid, delays[speed], seed);
        } else {
            await MazeGenerator.generateRecursiveMaze(gridView.grid, delays[speed], seed);
        }
        gridView.updateGrid();
    }

    function disableControls(disabled) {
        const controls = [
            ...Object.values(toolButtons),
            document.getElementById('clearBoard'),
            document.getElementById('gridSize'),
            document.getElementById('startBtn'),
            document.getElementById('generateMaze'),
            document.getElementById('saveGrid'),
            document.getElementById('loadGrid'),
            document.getElementById('speedControl'),
            document.getElementById('algorithmSelect')
        ];

        controls.forEach(control => {
            if (control) control.disabled = disabled;
        });
    }
}); 