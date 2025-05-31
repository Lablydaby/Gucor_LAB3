class Dijkstra {
    static async findPath(grid, animationDelay = 10) {
        const visitedNodesInOrder = [];
        const startNode = grid.startNode;
        const endNode = grid.endNode;

        if (!startNode || !endNode) return { visitedNodesInOrder: [], path: [] };

        startNode.distance = 0;
        const unvisitedNodes = new PriorityQueue();
        unvisitedNodes.enqueue(startNode, 0);

        while (!unvisitedNodes.isEmpty()) {
            const { node: currentNode } = unvisitedNodes.dequeue();

            if (currentNode.visited) continue;

            currentNode.visited = true;
            visitedNodesInOrder.push(currentNode);

            if (currentNode === endNode) {
                const path = this.getNodesInShortestPath(endNode);
                return { visitedNodesInOrder, path };
            }

            if (currentNode.distance === Infinity) break;

            const neighbors = grid.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (neighbor.visited) continue;

                const distance = currentNode.distance + neighbor.weight;
                if (distance < neighbor.distance) {
                    neighbor.distance = distance;
                    neighbor.previousNode = currentNode;
                    unvisitedNodes.enqueue(neighbor, distance);
                }
            }

            if (animationDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, animationDelay));
            }
        }

        return { visitedNodesInOrder, path: [] };
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