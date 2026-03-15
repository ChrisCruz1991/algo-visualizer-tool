# Algorithm Visualizer

An interactive web application for learning Data Structures & Algorithms through step-by-step animated visualizations, synchronized code walkthroughs, and complexity analysis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

- **16 algorithms + 3 data structures** across five categories with full animated visualizations
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

### Linked Lists (v3)

Three variants, each with four interactive operations:

| Variant | Description |
|---|---|
| Singly Linked List | Each node holds a value and a `next` pointer |
| Doubly Linked List | Each node holds a value, `next`, and `prev` pointer |
| Circular Linked List | Singly linked, but tail's `next` points back to head |

**Operations per variant:**

| Operation | Singly | Doubly | Circular |
|---|---|---|---|
| Insert at head | O(1) | O(1) | O(1) |
| Insert at tail | O(1)* | O(1) | O(1) |
| Insert at index | O(N) | O(N) | O(N) |
| Delete at head | O(1) | O(1) | O(1) |
| Delete at tail | O(N) | O(1)** | O(N) |
| Delete at index | O(N) | O(N) | O(N) |
| Search | O(N) | O(N) | O(N) |
| Reverse | O(N) | O(N) | O(N) |

\* With a maintained `tail` pointer. &nbsp; \*\* O(1) because doubly linked lists can use `tail.prev`.

**Linked list visualizer features:**
- SVG canvas renders nodes left-to-right as labeled rectangles with pointer arrows
- Doubly variant shows bidirectional arrows (forward above, backward dashed below)
- Circular variant shows a bezier wrap-around arrow from tail back to head
- Color-coded node states: gray (default), orange (active pointer), blue (target/found), green (inserted), red (deleted), amber (pointer being rewired)
- Floating pointer labels (`prev`, `current`, `next`) appear during the reverse operation
- **Stateful operations**: the list mutates after each operation completes — run insert, then search, then reverse on the updated list
- Code tab and Info tab update dynamically when you switch between operations (Insert / Delete / Search / Reverse)

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

Linked list modules follow a different contract — `LinkedListModule` — with `generatorByOperation` (one generator per operation) and `codeByOperation`/`complexityByOperation` (one code string and complexity table per operation) instead of a single generator and code string.

### Project Structure

```
src/
├── algorithms/
│   ├── linked-list/     # Singly, doubly, circular modules + shared utils
│   └── *.ts             # One file per sorting/searching/graph/tree algorithm
├── app/
│   ├── page.tsx         # Redirects to /visualizer/bubble-sort
│   └── visualizer/
│       └── [algorithmId]/page.tsx
├── components/
│   ├── layout/          # Navbar, Sidebar, AlgorithmList
│   ├── main-panel/      # MainPanel, TabBar, VisualizerTab, CodeTab, InfoTab,
│   │                    # GraphVisualizerTab, TreeVisualizerTab, LinkedListVisualizerTab
│   └── visualizer/      # SortingCanvas, SearchingCanvas, NodeEdgeCanvas,
│                        # BinaryTreeCanvas, LinkedListCanvas, ControlsBar, etc.
├── engine/
│   ├── types.ts         # SortStep, SearchStep, GraphStep, TreeStep, LinkedListStep
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

## Usage

### Linked List Operations

1. Select **Singly**, **Doubly**, or **Circular Linked List** from the sidebar
2. Choose **Manual** or **Preset** to set the initial list (max 12 nodes)
3. Pick an operation: **Insert**, **Delete**, **Search**, or **Reverse**
4. Configure sub-options (position, value, index) — controls update contextually
5. Click **Run** to animate the operation step-by-step
6. After the animation completes, the list state is updated — run another operation on the modified list
7. The **Code** tab shows the implementation for the currently selected operation; the **Info** tab shows its Big-O table

## Roadmap

- **v1** — Sorting (6) + Searching (2)
- **v2** — Graph traversal (BFS, DFS) + Tree traversals (Inorder, Preorder, Postorder)
- **v3** — Linked Lists (Singly, Doubly, Circular) with Insert, Delete, Search, and Reverse operations
- **v4** _(planned)_ — Weighted graph algorithms: Dijkstra, A\*, Bellman-Ford

## License

MIT
