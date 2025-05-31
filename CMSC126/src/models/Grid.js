class Grid {
    constructor(rows = 10, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
        this.initializeGrid();
    }

    initializeGrid() {
        // Clear existing grid
        this.grid = [];
        this.startNode = null;
        this.endNode = null;

        // Create new grid with specified dimensions
        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                currentRow.push(new Node(row, col));
            }
            this.grid.push(currentRow);
        }
    }

    getNode(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }

    setStartNode(row, col) {
        const node = this.getNode(row, col);
        if (!node || node.isEnd || node.isWall) return false;

        if (this.startNode) {
            this.startNode.isStart = false;
        }
        
        node.isStart = true;
        this.startNode = node;
        return true;
    }

    setEndNode(row, col) {
        const node = this.getNode(row, col);
        if (!node || node.isStart || node.isWall) return false;

        if (this.endNode) {
            this.endNode.isEnd = false;
        }
        
        node.isEnd = true;
        this.endNode = node;
        return true;
    }

    resetPath() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].reset();
            }
        }
    }

    clearBoard() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].resetCompletely();
            }
        }
        this.startNode = null;
        this.endNode = null;
    }

    resizeGrid(newRows, newCols) {
        // Store old dimensions
        const oldRows = this.rows;
        const oldCols = this.cols;

        // Update dimensions
        this.rows = newRows;
        this.cols = newCols;

        // Create new grid
        const newGrid = [];
        for (let row = 0; row < newRows; row++) {
            const currentRow = [];
            for (let col = 0; col < newCols; col++) {
                // Create new node
                const newNode = new Node(row, col);
                
                // If within bounds of old grid, copy state
                if (row < oldRows && col < oldCols) {
                    const oldNode = this.grid[row][col];
                    newNode.isStart = oldNode.isStart;
                    newNode.isEnd = oldNode.isEnd;
                    newNode.isWall = oldNode.isWall;
                    newNode.weight = oldNode.weight;
                    
                    // Update start/end node references
                    if (oldNode === this.startNode) {
                        this.startNode = newNode;
                    }
                    if (oldNode === this.endNode) {
                        this.endNode = newNode;
                    }
                }
                
                currentRow.push(newNode);
            }
            newGrid.push(currentRow);
        }

        // Replace old grid with new grid
        this.grid = newGrid;
    }

    getNeighbors(node) {
        const neighbors = [];
        const { row, col } = node;
        const directions = [
            [-1, 0],  // up
            [1, 0],   // down
            [0, -1],  // left
            [0, 1]    // right
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            const neighbor = this.getNode(newRow, newCol);

            if (neighbor && !neighbor.isWall) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    toJSON() {
        return {
            rows: this.rows,
            cols: this.cols,
            grid: this.grid.map(row =>
                row.map(node => ({
                    isStart: node.isStart,
                    isEnd: node.isEnd,
                    isWall: node.isWall,
                    weight: node.weight
                }))
            )
        };
    }

    fromJSON(data) {
        this.rows = data.rows;
        this.cols = data.cols;
        this.initializeGrid();

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const nodeData = data.grid[row][col];
                const node = this.grid[row][col];
                
                node.isStart = nodeData.isStart;
                node.isEnd = nodeData.isEnd;
                node.isWall = nodeData.isWall;
                node.weight = nodeData.weight;

                if (node.isStart) this.startNode = node;
                if (node.isEnd) this.endNode = node;
            }
        }
    }
} 