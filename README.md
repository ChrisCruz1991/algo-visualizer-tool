# Algorithm Visualizer

An interactive web application for learning Data Structures & Algorithms through step-by-step animated visualizations, synchronized code walkthroughs, and complexity analysis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

- **13 algorithms** across four categories with full animated visualizations
- **Step execution engine** powered by TypeScript generator functions — play, pause, step forward, and reset at any point
- **Synchronized code highlighting** — the relevant line of code is highlighted in real-time as each step executes
- **Live metrics** — comparison and swap/access counters update on every step
- **Info tab** — plain-language explanations, Big-O complexity tables, and real-world use cases for every algorithm
- **Responsive layout** — sidebar navigation, tabbed main panel, works down to tablet width

## Algorithms

### Sorting
| Algorithm | Best | Average | Worst |
|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Selection Sort | O(n²) | O(n²) | O(n²) |
| Insertion Sort | O(n) | O(n²) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) |

### Searching
| Algorithm | Best | Average | Worst |
|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) |
| Binary Search | O(1) | O(log n) | O(log n) |

### Graph Traversal
| Algorithm | Time | Space |
|---|---|---|
| BFS (Breadth-First Search) | O(V + E) | O(V) |
| DFS (Depth-First Search) | O(V + E) | O(V) |

### Tree Traversal
| Algorithm | Time | Space |
|---|---|---|
| Inorder (Left → Root → Right) | O(n) | O(h) |
| Preorder (Root → Left → Right) | O(n) | O(h) |
| Postorder (Left → Right → Root) | O(n) | O(h) |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation Engine | JS Generators (`function*`) |
| Visualizations | Custom SVG components |
| Syntax Highlighting | react-syntax-highlighter |

## Architecture

### Step Execution Engine

Every algorithm is implemented as a TypeScript generator function that `yield`s a state snapshot at each meaningful step. The engine drives these snapshots via `play()` / `pause()` / `step()` / `reset()`, making any algorithm pauseable and inspectable at any point without running it to completion first.

```typescript
// Each yield produces a full state snapshot
type SortStep = {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  highlightedLines: number[];   // syncs with CodeViewer
  description: string;          // plain-English step label
  comparisons: number;
  swaps: number;
};
```

### Algorithm Modules

Each algorithm is a self-contained module:

```typescript
type AlgorithmModule = {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'tree';
  generator: (...args) => Generator<Step>;
  code: string;                 // TypeScript source for the code tab
  complexity: ComplexityTable;
  description: AlgorithmInfo;
};
```

All modules live under `src/algorithms/` and are registered in `src/algorithms/index.ts`.

### Project Structure

```
src/
├── algorithms/          # One file per algorithm (generator + metadata)
├── app/
│   ├── page.tsx         # Redirects to /visualizer/bubble-sort
│   └── visualizer/
│       └── [algorithmId]/page.tsx
├── components/
│   ├── layout/          # Navbar, Sidebar, AlgorithmList
│   ├── main-panel/      # MainPanel, TabBar, VisualizerTab, CodeTab, InfoTab
│   └── visualizer/      # SortingCanvas, SearchingCanvas, NodeEdgeCanvas,
│                        # BinaryTreeCanvas, ControlsBar, MetricsBar, etc.
├── engine/
│   ├── types.ts         # SortStep, SearchStep, GraphStep, TreeStep
│   └── useStepEngine.ts # play/pause/step/reset hook
└── data/
    └── presets/         # Fixed graph and tree presets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-username/algorithm-visualizer.git
cd algorithm-visualizer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to the Bubble Sort visualizer by default.

### Build

```bash
npm run build
npm run start
```

## Usage

1. **Select an algorithm** from the sidebar (grouped by category)
2. **Configure input** — enter a custom array or generate a random one; set array size and animation speed
3. **Run** the visualization — bars/cells animate through each step
4. **Pause** at any point and use **Step Forward** to advance one step at a time
5. Switch to the **Code tab** to follow the highlighted source line in sync with the animation
6. Switch to the **Info tab** for a full explanation, complexity table, and real-world use cases

> **Binary Search:** the input array is automatically sorted before running, and a notice is displayed.

## Roadmap

- **v1** — Sorting (6) + Searching (2)
- **v2** — Graph traversal (BFS, DFS) + Tree traversals (Inorder, Preorder, Postorder)
- **v3** _(planned)_ — Weighted graph algorithms: Dijkstra, A\*, Bellman-Ford

## License

MIT
