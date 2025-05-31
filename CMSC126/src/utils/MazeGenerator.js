class MazeGenerator {
    static seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    static async generateRandomMaze(grid, animationDelay = 10, seed = Math.random()) {
        grid.clearBoard();
        let currentSeed = seed;
        
        // Add walls with 30% probability
        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {
                if (this.seededRandom(currentSeed++) < 0.3) {
                    grid.getNode(row, col).isWall = true;
                    if (animationDelay > 0) {
                        await new Promise(resolve => setTimeout(resolve, animationDelay));
                    }
                }
            }
        }

        // Place random start and end points
        let startPlaced = false;
        let endPlaced = false;

        while (!startPlaced || !endPlaced) {
            const row = Math.floor(this.seededRandom(currentSeed++) * grid.rows);
            const col = Math.floor(this.seededRandom(currentSeed++) * grid.cols);
            const node = grid.getNode(row, col);

            if (!startPlaced && !node.isWall && !node.isEnd) {
                grid.setStartNode(row, col);
                startPlaced = true;
            } else if (!endPlaced && !node.isWall && !node.isStart) {
                grid.setEndNode(row, col);
                endPlaced = true;
            }
        }
    }

    static async generateRecursiveMaze(grid, animationDelay = 10, seed = Math.random()) {
        grid.clearBoard();
        let currentSeed = seed;

        // Fill the grid with walls
        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {
                grid.getNode(row, col).isWall = true;
            }
        }

        await this.recursiveDivision(
            grid,
            0,
            0,
            grid.rows - 1,
            grid.cols - 1,
            animationDelay,
            currentSeed
        );

        // Place random start and end points
        let startPlaced = false;
        let endPlaced = false;

        while (!startPlaced || !endPlaced) {
            const row = Math.floor(this.seededRandom(currentSeed++) * grid.rows);
            const col = Math.floor(this.seededRandom(currentSeed++) * grid.cols);
            const node = grid.getNode(row, col);

            if (!startPlaced && !node.isWall && !node.isEnd) {
                grid.setStartNode(row, col);
                startPlaced = true;
            } else if (!endPlaced && !node.isWall && !node.isStart) {
                grid.setEndNode(row, col);
                endPlaced = true;
            }
        }
    }

    static async recursiveDivision(grid, startRow, startCol, endRow, endCol, animationDelay, seed) {
        if (endRow - startRow < 2 || endCol - startCol < 2) return;

        // Choose orientation (horizontal or vertical)
        const width = endCol - startCol;
        const height = endRow - startRow;
        const horizontal = width < height;

        if (horizontal) {
            // Create a horizontal wall
            const wallRow = startRow + Math.floor(this.seededRandom(seed++) * (height - 1)) + 1;
            const passageCol = startCol + Math.floor(this.seededRandom(seed++) * width);

            for (let col = startCol; col <= endCol; col++) {
                if (col !== passageCol) {
                    grid.getNode(wallRow, col).isWall = false;
                    if (animationDelay > 0) {
                        await new Promise(resolve => setTimeout(resolve, animationDelay));
                    }
                }
            }

            // Recursively divide the top and bottom sections
            await this.recursiveDivision(grid, startRow, startCol, wallRow - 1, endCol, animationDelay, seed + 1);
            await this.recursiveDivision(grid, wallRow + 1, startCol, endRow, endCol, animationDelay, seed + 2);
        } else {
            // Create a vertical wall
            const wallCol = startCol + Math.floor(this.seededRandom(seed++) * (width - 1)) + 1;
            const passageRow = startRow + Math.floor(this.seededRandom(seed++) * height);

            for (let row = startRow; row <= endRow; row++) {
                if (row !== passageRow) {
                    grid.getNode(row, wallCol).isWall = false;
                    if (animationDelay > 0) {
                        await new Promise(resolve => setTimeout(resolve, animationDelay));
                    }
                }
            }

            // Recursively divide the left and right sections
            await this.recursiveDivision(grid, startRow, startCol, endRow, wallCol - 1, animationDelay, seed + 3);
            await this.recursiveDivision(grid, startRow, wallCol + 1, endRow, endCol, animationDelay, seed + 4);
        }
    }
} 