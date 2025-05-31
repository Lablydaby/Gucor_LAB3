class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.weight = 1;
        this.distance = Infinity;
        this.previousNode = null;
        this.visited = false;
        this.isPath = false;
        this.f = Infinity;  // f = g + h (for A* algorithm)
        this.g = Infinity;  // Cost from start to current node
        this.h = 0;        // Heuristic (estimated cost from current node to end)
    }

    reset() {
        this.distance = Infinity;
        this.previousNode = null;
        this.visited = false;
        this.isPath = false;
        this.f = Infinity;
        this.g = Infinity;
        this.h = 0;
    }

    resetCompletely() {
        this.reset();
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.weight = 1;
    }

    erase() {
        if (!this.isStart && !this.isEnd) {
            this.isWall = false;
            this.weight = 1;
            return true;
        }
        return false;
    }

    toggleWall() {
        if (!this.isStart && !this.isEnd) {
            this.isWall = !this.isWall;
            return true;
        }
        return false;
    }

    setWeight(weight) {
        if (!this.isStart && !this.isEnd && !this.isWall) {
            this.weight = weight;
            return true;
        }
        return false;
    }

    getClassName() {
        if (this.isStart) return 'start';
        if (this.isEnd) return 'end';
        if (this.isWall) return 'wall';
        if (this.weight > 1) return 'weight';
        if (this.isPath) return 'path';
        if (this.visited) return 'visited';
        return '';
    }
} 