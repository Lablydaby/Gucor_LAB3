# Pathfinding Visualizer

An interactive web-based visualization tool for pathfinding algorithms. This project demonstrates how Dijkstra's Algorithm and A* Search work in finding the shortest path between two points on a grid.

## Features

- Interactive grid where users can:
  - Set start and end points
  - Create walls (obstacles)
  - Add weighted nodes
  - Erase cells
- Visualization of two pathfinding algorithms:
  - Dijkstra's Algorithm
  - A* Search
- Adjustable grid size (10x10, 15x15, 20x20, 25x25)
- Visualization speed control (Fast, Medium, Slow)
- Maze generation with two algorithms:
  - Random maze
  - Recursive division
- Save and load grid configurations using local storage

## How to Use

1. Set up your grid:
   - Click "Set Start" to place your starting point (green)
   - Click "Set End" to place your destination point (red)
   - Use "Add Walls" to create obstacles
   - Use "Add Weights" to create weighted nodes
   - Use "Erase" to remove anything you've placed

2. Start the visualization:
   - Click "Find Path" to watch both algorithms work simultaneously
   - Watch as the algorithms explore (blue cells) and find the optimal path (yellow)

3. Additional features:
   - Use the grid size dropdown to change the grid dimensions
   - Adjust the visualization speed using the speed control
   - Generate random mazes using the "Generate Maze" button
   - Save your grid configuration using the "Save Grid" button
   - Load a previously saved configuration using the "Load Grid" button

## Project Structure

```
/src/
  /models/         # Data models (Grid, Node)
  /algorithms/     # Pathfinding algorithms implementation
  /controllers/    # Game and visualization controllers
  /views/          # UI and grid views
  /utils/          # Utility classes and helpers
  /assets/         # Styles, images, and resources
index.html         # Main HTML file
```

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Start experimenting with the pathfinding algorithms!

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Local Storage API

## Algorithm Details

### Dijkstra's Algorithm
- Guarantees the shortest path
- Explores nodes in order of their distance from the start
- Does not use heuristics
- Optimal for weighted graphs

### A* Search
- Uses heuristics to guide the search
- Generally faster than Dijkstra's Algorithm
- Uses Manhattan distance as the heuristic
- Optimal and complete when using admissible heuristics

## Contributing

Feel free to submit issues and enhancement requests! 
