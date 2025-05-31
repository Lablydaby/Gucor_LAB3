class GridView {
    constructor(gridElement, grid) {
        this.gridElement = gridElement;
        this.grid = grid;
        this.currentTool = null;
        this.isMouseDown = false;
        this.setupGrid();
        this.setupEventListeners();
    }

    setupGrid() {
        // Clear the grid element
        while (this.gridElement.firstChild) {
            this.gridElement.removeChild(this.gridElement.firstChild);
        }
        
        // Set fixed grid size (based on 15x15 reference)
        const GRID_SIZE = 550; // 15 cells * 50px = 750px (original cell size)
        const GAP_SIZE = 1; // 1px gap between cells
        const cellSize = Math.floor((GRID_SIZE - (Math.max(this.grid.rows, this.grid.cols) - 1) * GAP_SIZE) / Math.max(this.grid.rows, this.grid.cols));
        
        // Set the grid template columns and size
        this.gridElement.style.gridTemplateColumns = `repeat(${this.grid.cols}, ${cellSize}px)`;
        const totalWidth = cellSize * this.grid.cols + (this.grid.cols - 1) * GAP_SIZE + 4; // +4 for padding and border
        const totalHeight = cellSize * this.grid.rows + (this.grid.rows - 1) * GAP_SIZE + 4;
        this.gridElement.style.width = `${totalWidth}px`;
        this.gridElement.style.height = `${totalHeight}px`;
        
        // Create and append cells
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                this.gridElement.appendChild(cell);
            }
        }

        // Update the grid state
        this.updateGrid();
    }

    setupEventListeners() {
        // Mouse down event
        this.gridElement.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent dragging
            if (!e.target.classList.contains('cell')) return;
            
            this.isMouseDown = true;
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            this.handleCellInteraction(row, col);
        });

        // Mouse enter event (for drag effect)
        this.gridElement.addEventListener('mouseover', (e) => {
            if (!this.isMouseDown || !e.target.classList.contains('cell')) return;
            
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            this.handleCellInteraction(row, col);
        });

        // Mouse up event
        this.gridElement.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        // Mouse leave event
        this.gridElement.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
        });
    }

    handleCellInteraction(row, col) {
        const node = this.grid.getNode(row, col);
        if (!node) return;

        switch (this.currentTool) {
            case 'setStart':
                if (node.isEnd || node.isWall) return;
                // Remove previous start node
                if (this.grid.startNode) {
                    this.grid.startNode.isStart = false;
                }
                node.isStart = true;
                this.grid.startNode = node;
                break;
            case 'setEnd':
                if (node.isStart || node.isWall) return;
                // Remove previous end node
                if (this.grid.endNode) {
                    this.grid.endNode.isEnd = false;
                }
                node.isEnd = true;
                this.grid.endNode = node;
                break;
            case 'addWalls':
                node.toggleWall();
                break;
            case 'addWeights':
                node.setWeight(5);
                break;
            case 'eraser':
                node.erase();
                break;
        }

        this.updateGrid();
    }

    setTool(tool) {
        this.currentTool = tool;
    }

    updateGrid() {
        const cells = Array.from(this.gridElement.children);
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (isNaN(row) || isNaN(col)) return;
            
            const node = this.grid.getNode(row, col);
            if (!node) return;
            
            cell.className = `cell ${node.getClassName()}`;
        });
    }

    resizeGrid(rows, cols) {
        // Validate input
        if (rows < 1 || cols < 1) return;
        
        // Resize the grid model
        this.grid.resizeGrid(rows, cols);
        
        // Setup the new grid
        this.setupGrid();
        
        // Reset state
        this.isMouseDown = false;
    }

    clearBoard() {
        this.grid.clearBoard();
        this.updateGrid();
    }

    resetPath() {
        this.grid.resetPath();
        this.updateGrid();
    }

    async visualizeAlgorithm(algorithm, speed = 'medium') {
        this.grid.resetPath();
        this.updateGrid();

        const delays = {
            fast: 5,
            medium: 25,
            slow: 100
        };

        const { visitedNodesInOrder, path } = await algorithm.findPath(
            this.grid,
            delays[speed]
        );

        // Animate the path
        for (const node of path) {
            node.isPath = true;
            this.updateGrid();
            await new Promise(resolve => setTimeout(resolve, delays[speed]));
        }

        return { visitedNodesInOrder, path };
    }

    saveToLocalStorage(key = 'savedGrid') {
        localStorage.setItem(key, JSON.stringify(this.grid.toJSON()));
    }

    loadFromLocalStorage(key = 'savedGrid') {
        const savedGrid = localStorage.getItem(key);
        if (savedGrid) {
            this.grid.fromJSON(JSON.parse(savedGrid));
            this.setupGrid();
        }
    }
} 