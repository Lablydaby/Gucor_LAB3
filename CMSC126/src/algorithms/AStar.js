class AStar {
    static async findPath(grid, animationDelay = 10) {
        const visitedNodesInOrder = [];
        const startNode = grid.startNode;
        const endNode = grid.endNode;

        if (!startNode || !endNode) return { visitedNodesInOrder: [], path: [] };

        startNode.g = 0;
        startNode.h = this.heuristic(startNode, endNode);
        startNode.f = startNode.g + startNode.h;

        const openList = new PriorityQueue();
        openList.enqueue(startNode, startNode.f);

        while (!openList.isEmpty()) {
            const { node: currentNode } = openList.dequeue();

            if (currentNode.visited) continue;

            currentNode.visited = true;
            visitedNodesInOrder.push(currentNode);

            if (currentNode === endNode) {
                const path = this.getNodesInShortestPath(endNode);
                return { visitedNodesInOrder, path };
            }

            const neighbors = grid.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (neighbor.visited) continue;

                const tentativeG = currentNode.g + neighbor.weight;

                if (tentativeG < neighbor.g) {
                    neighbor.previousNode = currentNode;
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    openList.enqueue(neighbor, neighbor.f);
                }
            }

            if (animationDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, animationDelay));
            }
        }

        return { visitedNodesInOrder, path: [] };
    }

    static heuristic(node, endNode) {
        // Manhattan distance
        return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
    }

    static getNodesInShortestPath(endNode) {
        const path = [];
        let currentNode = endNode;

        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        return path;
    }
} 