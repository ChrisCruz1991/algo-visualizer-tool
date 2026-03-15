# Algorithm Visualizer — Project Specification

## Overview

A web application designed to help computer science students learn and understand Data Structures & Algorithms through interactive visualizations, code walkthroughs, and complexity analysis. The app provides step-by-step animated execution of sorting and searching algorithms, synchronized with highlighted source code, real-time metrics, and structured educational content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Animation | Custom step-engine using JS Generators (`function*`) |
| Charts/Visuals | Custom SVG or Canvas via React |

---

## Scope — v1

### Algorithms Included

**Sorting**
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort

**Searching**
- Linear Search
- Binary Search

> **v2:** BFS, DFS, Tree traversals (inorder, preorder, postorder). Dijkstra, A\*, and Bellman-Ford are deferred to v3.

---

## Application Layout

### Global Layout

```
+--------------------------------------------------+
|  Navbar: Logo | Algorithm Visualizer             |
+--------------------------------------------------+
|  Sidebar         |  Main Content Area            |
|  (Algorithm      |                               |
|   Selection)     |  [Visualizer / Info Panel]    |
+--------------------------------------------------+
```

The layout is a two-column design:
- **Left sidebar:** Algorithm category list and selection
- **Main area:** Tabbed panel with Visualizer, Code, and Info tabs

---

## Feature Specifications

### 1. Algorithm Selection Sidebar

- Algorithms are grouped by category: **Sorting** and **Searching**
- Each algorithm is a clickable list item
- The active algorithm is highlighted
- Selecting an algorithm loads its full context into the main panel (resets any in-progress visualization)

---

### 2. Main Panel — Tabs

Each selected algorithm has three tabs:

#### Tab 1: Visualizer

This is the primary interactive panel.

**Controls Bar (top)**

| Control | Description |
|---|---|
| Input Mode Toggle | Switch between `Manual Input` and `Random Generate` |
| Array Input Field | Visible in manual mode; accepts comma-separated integers (e.g. `5, 3, 8, 1`) |
| Array Size Slider | Visible in random mode; range 5–100 elements |
| Speed Slider | Controls animation delay; range from `Slow (1000ms)` to `Fast (50ms)` |
| Run Button | Starts the visualization from the beginning |
| Pause / Resume Button | Pauses or resumes a running visualization |
| Step Forward Button | Advances one step at a time (only active when paused) |
| Reset Button | Clears the visualization and resets to the initial state |

**Visualization Canvas**

- **Sorting algorithms:** Render the array as a bar chart. Each bar represents an element; bar height maps to value.
- **Searching algorithms:** Render the array as a row of labeled boxes/cells.
- Bar/cell color states:
  - `Default` — neutral gray
  - `Comparing` — yellow / amber highlight
  - `Swapping` — red / orange highlight
  - `Sorted / Found` — green
  - `Target (search)` — blue
- Smooth CSS transitions between states (Tailwind transition utilities)

**Step Description Bar**

Below the canvas, a text label describes the current step in plain English:
> _"Comparing index 3 (value: 8) with index 4 (value: 5) — swapping."_

**Metrics Bar**

Live counters displayed during execution:
- Comparisons: `N`
- Swaps / Accesses: `N`
- Elapsed Steps: `N / Total`

---

#### Tab 2: Code

- Displays the full algorithm implementation in **TypeScript**
- A highlighted line (yellow background) tracks which line of code corresponds to the current execution step
- Code highlighting is driven by the same step-engine that powers the visualizer — they are in sync
- Syntax highlighting via a lightweight library (e.g. `highlight.js` or `shiki`)
- Code is read-only and non-editable

---

#### Tab 3: Info

Structured educational content for the selected algorithm, divided into sections:

1. **What is it?** — Plain-language description of the algorithm
2. **How it works** — Step-by-step conceptual explanation (not code)
3. **How to implement** — Key implementation decisions and patterns (e.g. partitioning strategy for Quick Sort)
4. **Time & Space Complexity** — Big-O table:

| Case | Time Complexity | Space Complexity |
|---|---|---|
| Best | O(...) | O(...) |
| Average | O(...) | O(...) |
| Worst | O(...) | O(...) |

5. **Real-world use cases** — Practical contexts where this algorithm is used (e.g. Merge Sort in external sorting, Binary Search in database indexing)
6. **Comparison note** — Brief note on when to prefer this algorithm vs alternatives

---

## Step Execution Engine

This is the core architectural concern of the application.

### Design

Each algorithm is implemented as a **TypeScript generator function** (`function*`) that `yield`s a state snapshot at every meaningful step. The visualizer consumes these snapshots one at a time, driven by a timer or user interaction.

### Step State Object (example)

```typescript
type SortStep = {
  array: number[];           // Current state of the array
  comparingIndices: number[]; // Indices currently being compared
  swappingIndices: number[];  // Indices currently being swapped
  sortedIndices: number[];    // Indices confirmed as sorted
  highlightedLines: number[]; // Line numbers to highlight in the code panel
  description: string;        // Plain-English description of this step
  comparisons: number;        // Running comparison count
  swaps: number;              // Running swap count
};
```

### Engine Responsibilities

- `play()` — starts a `setInterval` that advances the generator on each tick
- `pause()` — clears the interval, holds current state
- `step()` — manually advances the generator by one step
- `reset()` — re-initializes the generator with the original input
- Speed is controlled by adjusting the interval delay

---

## Data & Content Structure

Each algorithm module exports a consistent shape:

```typescript
type AlgorithmModule = {
  id: string;                   // e.g. "bubble-sort"
  name: string;                 // e.g. "Bubble Sort"
  category: "sorting" | "searching";
  description: AlgorithmInfo;   // Info tab content
  complexity: ComplexityTable;  // Big-O table data
  code: string;                 // TypeScript source as a string (for display)
  codeLineCount: number;
  generator: (input: number[], target?: number) => Generator<SortStep | SearchStep>;
};
```

All algorithms live under `src/algorithms/` with one file per algorithm.

---

## Pages & Routing

| Route | Description |
|---|---|
| `/` | Redirects to `/visualizer/bubble-sort` (default) |
| `/visualizer/[algorithmId]` | Main visualizer page for a given algorithm |

The `algorithmId` param drives which module is loaded and which sidebar item is active.

---

## Component Tree (High-Level)

```
<Layout>
  <Navbar />
  <Sidebar>
    <AlgorithmList />          // grouped by category
  </Sidebar>
  <MainPanel>
    <TabBar />                 // Visualizer | Code | Info
    <VisualizerTab>
      <ControlsBar />
      <VisualizationCanvas />  // SortingCanvas or SearchingCanvas
      <StepDescriptionBar />
      <MetricsBar />
    </VisualizerTab>
    <CodeTab>
      <CodeViewer />           // syntax-highlighted, line-highlighted
    </CodeTab>
    <InfoTab>
      <AlgorithmInfo />        // description, complexity table, use cases
    </InfoTab>
  </MainPanel>
</Layout>
```

---

## UX & Interaction Notes

- Selecting a new algorithm while a visualization is running should **auto-reset** the current run
- The **Run** button is disabled while an animation is in progress; it becomes re-enabled after completion or reset
- **Step Forward** is only active when paused — it is grayed out during live playback
- On mobile, the sidebar collapses into a top dropdown or drawer
- Tailwind `transition-all duration-200` used on bar color changes for smooth visual feedback
- The visualizer should be responsive down to tablet width (768px); full desktop layout is the primary target

---

## Known Constraints & Engineering Notes

- **Generator-based engine is mandatory.** Running the actual sort/search algorithm directly provides no opportunity for step-level animation. Every algorithm must be re-implemented as a generator.
- **Code line highlighting requires manual mapping.** For each `yield` in the generator, the corresponding line numbers in the display code string must be recorded. This is a manual but one-time effort per algorithm.
- **Live benchmark timings are misleading at small sizes.** Do not display `ms` execution time for arrays under ~1,000 elements. The Big-O table is sufficient for v1.
- **Binary Search requires a sorted input.** The UI should auto-sort the input array before running Binary Search and display a notice: _"Binary Search requires a sorted array. Input has been sorted."_
- **Speed slider lower bound.** Set minimum animation speed at 50ms per step to prevent rendering from being skipped by the browser.

---

## Out of Scope (v1)

- User authentication or saved sessions
- BFS, DFS, and tree traversal algorithms (v2)
- Weighted graph algorithms — Dijkstra, A\*, Bellman-Ford (v3)
- Live ms benchmark timing
- Mobile-first layout (responsive to tablet is sufficient)
- Dark/light mode toggle (pick one and ship it)
- Algorithm comparison mode (side-by-side)
- Export or share functionality

---

## Suggested Development Order

1. Set up Next.js + Tailwind project scaffold
2. Build layout: Navbar, Sidebar, MainPanel shell with tab routing
3. Implement the step execution engine (generic, algorithm-agnostic)
4. Implement Bubble Sort as the reference algorithm (generator + code + info)
5. Build `VisualizationCanvas` and `CodeViewer` components against Bubble Sort
6. Validate the full loop: input → run → step → highlight → reset
7. Implement remaining sorting algorithms using the same pattern
8. Implement Linear Search and Binary Search (adapt canvas to search state)
9. Populate Info tab content for all algorithms
10. Polish: transitions, speed control, metrics bar, mobile sidebar

---

---

# Scope — v2: Graph Traversal & Tree Algorithms

## Algorithms Included

**Graph Traversal**
- Breadth-First Search (BFS)
- Depth-First Search (DFS)

**Tree Traversals**
- Inorder (Left → Root → Right)
- Preorder (Root → Left → Right)
- Postorder (Left → Right → Root)

> **v3 (out of scope for v2):** Dijkstra's Shortest Path, A\* Search, Bellman-Ford. These require weighted edge support and a more complex priority-queue step model.

---

## New Canvas Types

v2 introduces two new visualizer canvas paradigms alongside the existing bar/cell canvas from v1.

### 1. Node-Edge Canvas (BFS & DFS)

Used for graph traversal algorithms. Renders a directed or undirected graph as circular nodes connected by lines.

- **Input:** Preset graphs only (no user-drawn graphs in v2)
- **Presets include:**
  - Small sparse graph (6–8 nodes)
  - Medium connected graph (10–12 nodes)
  - Disconnected graph (to demonstrate DFS visiting multiple components)
- **Node color states:**

| State | Color |
|---|---|
| Unvisited | Gray |
| In Queue / Stack | Yellow / Amber |
| Currently Visiting | Orange |
| Visited / Complete | Green |
| Start Node | Blue |

- **Edge states:** Edges that have been traversed are highlighted (thicker stroke, accent color)
- Node positions are fixed per preset (no physics/force layout in v2)
- Rendered in SVG for crisp scaling and easy state-driven re-renders

### 2. Binary Tree Canvas (Tree Traversals)

Used for inorder, preorder, and postorder traversals. Renders a binary tree with a fixed hierarchical layout.

- **Input:** Preset trees only
- **Presets include:**
  - Balanced binary tree (7 nodes, 3 levels)
  - Unbalanced tree (skewed left or right)
  - Full binary tree (15 nodes, 4 levels)
- **Node color states:** Same palette as graph traversal (unvisited → visiting → visited)
- **Visit order list:** A running ordered list below the canvas shows the sequence of visited nodes as they are processed — e.g. `[4, 2, 5, 1, 6, 3, 7]`
- Tree layout uses a simple recursive coordinate algorithm (no external library needed at this scale)
- Rendered in SVG

---

## Algorithm Details & Approach Notes

### BFS — Breadth-First Search

**Data structure:** Queue (FIFO)

**How it works:** Start from a source node. Enqueue it, then repeatedly dequeue a node, mark it visited, and enqueue all unvisited neighbors. This guarantees shortest-path discovery on unweighted graphs.

**Visualization approach:**
- Each `yield` represents one dequeue + neighbor-enqueue cycle
- Nodes in the queue are shown in amber; the currently dequeued node is orange; fully processed nodes turn green
- A queue state indicator (horizontal list of node IDs) is shown below the canvas to make the FIFO structure visible to students

**Performance:**

| Case | Time | Space |
|---|---|---|
| All | O(V + E) | O(V) |

where V = vertices, E = edges. Space is O(V) for the queue in the worst case (wide graph).

**Best for:** Level-order traversal, shortest path on unweighted graphs, web crawlers, social network friend-of-friend queries.

**Implementation note:** Use a `Set` for visited tracking, not an array, to get O(1) membership checks. An array visited check is O(V) per lookup and degrades to O(V²) overall on dense graphs.

---

### DFS — Depth-First Search

**Data structure:** Call stack (recursive) or explicit Stack (LIFO)

**How it works:** Start from a source node. Recursively (or iteratively with a stack) visit a neighbor, go as deep as possible along that branch, then backtrack and explore the next unvisited neighbor.

**Visualization approach:**
- Each `yield` represents visiting a node (push onto stack) or backtracking (pop from stack)
- A stack state indicator (vertical list) is shown beside the canvas to contrast with BFS's queue
- Backtracking steps are a distinct animation state (node briefly dims before returning to visited-green) so students can see the backtrack happen

**Performance:**

| Case | Time | Space |
|---|---|---|
| All | O(V + E) | O(V) |

Space is O(V) for the recursion stack (worst case: linear chain graph = maximum recursion depth).

**Best for:** Cycle detection, topological sort, maze solving, connected component discovery, game tree search.

**Implementation note:** Use the **iterative stack** version for the generator, not the recursive version. Recursive DFS cannot be paused mid-execution (the call stack is opaque to the generator engine). The iterative version gives full step-level control.

**BFS vs DFS teaching moment:** The side-by-side queue/stack indicator is intentional — it lets students see that BFS and DFS are structurally identical except for the data structure used, which is one of the most important pedagogical insights in graph theory.

---

### Inorder Traversal (Left → Root → Right)

**Produces:** Sorted output for a Binary Search Tree (BST).

**Visualization approach:**
- Each `yield` fires when a node is "visited" (i.e. processed, not merely entered)
- The traversal pointer animates left-then-root-then-right, dimming nodes that have been entered but not yet processed
- The running visit-order list updates as each node is fully processed

**Performance:**

| Case | Time | Space |
|---|---|---|
| All | O(N) | O(H) |

where N = number of nodes, H = height of tree. Space is O(log N) for a balanced tree, O(N) worst case for a skewed tree.

**Best for:** Printing BST values in sorted order, validating BST property, flattening a tree to a sorted array.

**Implementation note:** Like DFS, implement as an iterative stack-based generator rather than recursive, for the same reason — the recursive call stack cannot yield mid-execution.

---

### Preorder Traversal (Root → Left → Right)

**Produces:** A copy-order sequence — the order in which nodes must be inserted to reconstruct the same tree.

**Visualization approach:**
- Node is highlighted (visited) immediately upon entry, before descending to children
- This makes the "root first" nature immediately visible in the animation

**Performance:** Identical to Inorder — O(N) time, O(H) space.

**Best for:** Serializing/copying a tree, expression trees (prefix notation), directory structure printing.

---

### Postorder Traversal (Left → Right → Root)

**Produces:** A deletion-safe sequence — children are always processed before their parent.

**Visualization approach:**
- Node dims (entered but not yet processed) when first reached, and only lights up green when both children have been fully visited
- This makes the "root last" nature visible — students can watch the leaves resolve first before their parents

**Performance:** Identical to Inorder — O(N) time, O(H) space.

**Best for:** Deleting a tree safely, evaluating expression trees (postfix notation), computing directory sizes (leaf files before parent folders).

---

## Updated `AlgorithmModule` Type

v2 extends the v1 module contract to support graph and tree inputs:

```typescript
type GraphNode = {
  id: string;
  label: string;
  x: number; // fixed SVG coordinate
  y: number;
};

type GraphEdge = {
  from: string;
  to: string;
};

type TreeNode = {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
};

type PresetGraph = {
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
};

type PresetTree = {
  name: string;
  root: TreeNode;
};

type GraphStep = {
  visitedNodes: string[];       // Node IDs fully visited
  activeNode: string | null;    // Node currently being processed
  queueOrStack: string[];       // Current queue (BFS) or stack (DFS) contents
  traversedEdges: string[];     // Edge IDs that have been followed
  highlightedLines: number[];
  description: string;
};

type TreeStep = {
  visitedNodes: string[];       // Node IDs processed (in visit order)
  activeNode: string | null;
  enteredNodes: string[];       // Nodes entered but not yet processed (dimmed state)
  visitOrder: number[];         // Running ordered list of visited values
  highlightedLines: number[];
  description: string;
};

// Extended AlgorithmModule union
type AlgorithmModule =
  | SortSearchModule   // v1 (sorting / searching)
  | GraphModule        // v2 graph traversal
  | TreeModule;        // v2 tree traversal

type GraphModule = {
  id: string;
  name: string;
  category: "graph";
  presets: PresetGraph[];
  description: AlgorithmInfo;
  complexity: ComplexityTable;
  code: string;
  generator: (graph: PresetGraph, startNodeId: string) => Generator<GraphStep>;
};

type TreeModule = {
  id: string;
  name: string;
  category: "tree";
  presets: PresetTree[];
  description: AlgorithmInfo;
  complexity: ComplexityTable;
  code: string;
  generator: (tree: PresetTree) => Generator<TreeStep>;
};
```

---

## Updated Sidebar

The sidebar gains two new category groups in v2:

```
Sorting
  Bubble Sort
  Selection Sort
  Insertion Sort
  Merge Sort
  Quick Sort
  Heap Sort

Searching
  Linear Search
  Binary Search

Graph Traversal         ← NEW
  BFS
  DFS

Tree Traversal          ← NEW
  Inorder
  Preorder
  Postorder
```

---

## Updated Controls Bar (Graph & Tree)

Graph and tree algorithms replace the array input controls with a **Preset Selector**:

| Control | Description |
|---|---|
| Preset Dropdown | Select from named preset graphs or trees |
| Start Node Selector | (Graph only) Choose which node to begin traversal from |
| Speed Slider | Same as v1 |
| Run / Pause / Step / Reset | Same behavior as v1 |

The queue/stack indicator panel (for BFS/DFS) and visit-order list (for tree traversals) are new additions below the main canvas, specific to these algorithm types.

---

## Updated Component Tree

```
<Layout>
  <Navbar />
  <Sidebar>
    <AlgorithmList />   // now includes Graph Traversal + Tree Traversal groups
  </Sidebar>
  <MainPanel>
    <TabBar />
    <VisualizerTab>
      <ControlsBar />         // switches between array controls and preset selector
      <VisualizationCanvas /> // SortingCanvas | SearchingCanvas | NodeEdgeCanvas | BinaryTreeCanvas
      <QueueStackIndicator /> // BFS/DFS only
      <VisitOrderList />      // Tree traversals only
      <StepDescriptionBar />
      <MetricsBar />
    </VisualizerTab>
    <CodeTab>
      <CodeViewer />
    </CodeTab>
    <InfoTab>
      <AlgorithmInfo />
    </InfoTab>
  </MainPanel>
</Layout>
```

---

## v2 Engineering Constraints & Notes

- **No recursive generators.** All tree and graph algorithms must be implemented iteratively with an explicit stack or queue so the generator can `yield` at every step. This is non-negotiable for the step engine to work.
- **SVG is preferred over Canvas for graph/tree rendering.** SVG elements are React-friendly, inspectable in devtools, and trivially styled with Tailwind/CSS classes. HTML Canvas requires an imperative draw loop that fights React's render model. Only switch to Canvas if SVG performance degrades noticeably (unlikely at these graph sizes).
- **Fixed node positions per preset.** Do not introduce a force-directed layout algorithm (e.g. D3-force) in v2. Fixed coordinates per preset are simpler, more predictable for teaching, and eliminate the need for a physics simulation.
- **Disconnected graphs for DFS.** DFS on a disconnected graph must restart from an unvisited node after exhausting one component. The generator must handle this gracefully, and the step description should tell the student: _"Component complete. Starting new traversal from node E."_
- **Tree layout algorithm.** A simple recursive x-coordinate assignment (Reingold-Tilford lite) is sufficient for trees up to 4 levels deep. No external tree layout library is needed.

---

## v2 Suggested Development Order

1. Design and finalize preset graph and tree data files under `src/data/presets/`
2. Build `NodeEdgeCanvas` SVG component with static rendering (no animation yet)
3. Build `BinaryTreeCanvas` SVG component with static rendering
4. Implement BFS generator + step model; wire to `NodeEdgeCanvas`
5. Add `QueueStackIndicator` component; validate BFS end-to-end
6. Implement DFS generator; re-use `NodeEdgeCanvas` and `QueueStackIndicator` (stack mode)
7. Implement Inorder traversal generator; wire to `BinaryTreeCanvas`
8. Add `VisitOrderList` component
9. Implement Preorder and Postorder traversal generators
10. Update Sidebar with new category groups and preset selector controls
11. Populate Info tab content for all 5 new algorithms
12. Polish: edge traversal animations, backtrack dimming, disconnected-graph DFS restart

---

---

# Scope — v3: Linked List Data Structure

## Overview

v3 introduces the **Linked List** as a fully interactive data structure — not a single algorithm, but a structure with multiple discrete operations that the user selects and executes one at a time. This is a UX paradigm shift from v1/v2: instead of "pick an algorithm, press Run", the user builds and mutates a list step-by-step by choosing operations.

Three list variants are supported, each sharing the same four operation categories:

| Variant | Description |
|---|---|
| Singly Linked List | Each node holds a value and a `next` pointer |
| Doubly Linked List | Each node holds a value, a `next` pointer, and a `prev` pointer |
| Circular Linked List | Singly linked, but the tail's `next` points back to the head |

---

## Operations (All Three Variants)

| Operation | Variants |
|---|---|
| **Insert** — at head, tail, or index | All three |
| **Delete** — at head, tail, or index | All three |
| **Search / Traversal** — find a value, animate pointer walk | All three |
| **Reverse** — reverse the list in-place | All three |

All operations are visualized step-by-step using the same generator-based step engine from v1/v2. Each operation is its own generator that yields a `LinkedListStep` at every meaningful pointer change.

---

## Canvas Design

### Singly Linked List

Nodes are rendered left-to-right as labeled rectangles. Each node has two compartments: the value on the left, and the `next` pointer slot on the right. A right-pointing arrow connects each node's pointer slot to the next node. The tail's pointer slot displays `null`.

```
┌───┬──┐   ┌───┬──┐   ┌───┬──┐
│ 3 │ ──→  │ 7 │ ──→  │ 1 │ /│
└───┴──┘   └───┴──┘   └───┴──┘
 head                   tail (next = null)
```

### Doubly Linked List

Same left-to-right layout but each node has three compartments: `prev` pointer on the left, value in the center, `next` pointer on the right. Two rows of arrows are rendered — a forward row (→) and a backward row (←) — to show both directions explicitly.

```
    ┌──┬───┬──┐   ┌──┬───┬──┐   ┌──┬───┬──┐
/←  │  │ 3 │ ──→  │  │ 7 │ ──→  │  │ 1 │  │ →null
    └──┴───┴──┘ ← └──┴───┴──┘ ← └──┴───┴──┘
  (prev=null)                    (next=null)
```

### Circular Linked List

Same left-to-right node layout as singly linked. The tail's `next` arrow curves **below** the node row and loops back to the head with an arc, clearly communicating the circular structure. The arc is an SVG `<path>` with a cubic bezier curve and an arrowhead at the head node.

```
┌───┬──┐   ┌───┬──┐   ┌───┬──┐
│ 3 │ ──→  │ 7 │ ──→  │ 1 │ ─┐
└───┴──┘   └───┴──┘   └───┴──┘
  ↑_________________________________|
```

---

## Node Color States

| State | Color | When Used |
|---|---|---|
| Default | Gray | Resting node |
| Active / Current | Orange | Pointer is currently here |
| Target | Blue | Node being searched for / operated on |
| Inserted | Green | Newly inserted node |
| Deleted | Red + fade out | Node being removed |
| Affected | Yellow / Amber | Nodes whose pointers are being rewired |

Pointer arrows animate when being rewired — they fade out from the old target and fade in to the new target using CSS transitions.

---

## Operation Details & Step Models

### Insert

**Sub-operations:** Insert at head, Insert at tail, Insert at index `i`

**Step model — Insert at index `i` (most complex case):**
1. Create new node (highlight it green, detached above the list)
2. Traverse from head to node at index `i-1` (pointer walks step-by-step, orange highlight)
3. Set `newNode.next = current.next` (animate arrow from new node to `i`th node)
4. Set `current.next = newNode` (animate arrow from `i-1`th node to new node)
5. For doubly: additionally set `newNode.prev = current` and `newNode.next.prev = newNode`
6. New node snaps into position in the list row

**Performance:**

| Operation | Time | Space |
|---|---|---|
| Insert at head | O(1) | O(1) |
| Insert at tail | O(N) singly / O(1) with tail pointer | O(1) |
| Insert at index | O(N) | O(1) |

**Implementation note:** Maintain an explicit `tail` pointer in the list state so tail insertion is O(1) without traversal. Show this in the code and call it out in the Info tab — it's a common interview point.

---

### Delete

**Sub-operations:** Delete at head, Delete at tail, Delete at index `i`

**Step model — Delete at index `i`:**
1. Traverse from head to node at index `i-1` (pointer walk, orange highlight)
2. Highlight the target node (index `i`) in red
3. Set `current.next = target.next` (animate arrow bypassing the target)
4. For doubly: set `target.next.prev = current`
5. Target node fades out and is removed from the canvas
6. For circular: if deleting tail, update `tail.next = head`

**Performance:**

| Operation | Time | Space |
|---|---|---|
| Delete at head | O(1) | O(1) |
| Delete at tail | O(N) singly / O(1) doubly (with `prev`) | O(1) |
| Delete at index | O(N) | O(1) |

**Implementation note:** Deleting the tail of a singly linked list still requires O(N) traversal to find the second-to-last node (to set its `next = null`). This is a key teaching point — it's one of the concrete advantages of a doubly linked list.

---

### Search / Traversal

**Step model:**
1. Set pointer to `head`, highlight it orange
2. Compare current node value to target — if match, turn blue and display "Found at index N"
3. If no match, advance pointer to `next`, briefly show arrow animation between nodes
4. Repeat until found or `null` (or back to `head` for circular)
5. If not found, display "Value not found after traversing N nodes"

**Performance:**

| Case | Time | Space |
|---|---|---|
| Best (head) | O(1) | O(1) |
| Average / Worst | O(N) | O(1) |

**Implementation note:** For circular lists, the traversal termination condition is `current.next === head`, not `current.next === null`. The generator must handle this difference explicitly, and the step description should call it out: _"Circular list — stopping when we return to head."_

---

### Reverse

**Step model (singly linked list — iterative three-pointer approach):**
1. Initialize `prev = null`, `current = head`, `next = null` — show all three pointer labels on canvas
2. Each step: set `next = current.next`, then `current.next = prev`
3. Animate the arrow on `current` flipping direction (rotate/redraw from right-pointing to left-pointing)
4. Advance `prev = current`, `current = next`
5. Repeat until `current === null`
6. Set `head = prev` — animate head label moving to the new first node

**For doubly linked list:** Swap `next` and `prev` on every node instead of just reversing `next`. Each step shows both arrows being swapped simultaneously.

**For circular linked list:** Same three-pointer logic as singly, but re-link `tail.next = head` (new head) at the end.

**Performance:**

| Case | Time | Space |
|---|---|---|
| All | O(N) | O(1) |

**Implementation note:** The three-pointer reverse is the canonical O(1)-space approach. Highlight it in the Info tab because students often first think of a stack-based O(N) space solution. The animation of the arrow literally flipping direction makes the pointer manipulation intuitive in a way that pseudocode alone cannot achieve.

---

## Input Model

### Manual Input

- A text field accepts comma-separated integers: `3, 7, 1, 9, 4`
- Values are parsed and the list is built and rendered immediately as a static visualization
- Maximum list length: **12 nodes** (beyond this the canvas becomes unreadable at standard viewport widths)
- An error message is shown for invalid input (non-integers, empty values)

### Presets

Preset lists are curated to demonstrate each operation clearly:

| Preset Name | Values | Good for |
|---|---|---|
| Short list | `[3, 7, 1]` | Quick insert/delete demos |
| Medium list | `[5, 2, 8, 4, 9, 1]` | Traversal, reverse |
| Already sorted | `[1, 3, 5, 7, 9]` | Search best/worst case |
| Single node | `[42]` | Edge case: delete head = empty list |
| Two nodes | `[1, 2]` | Edge case: reverse, delete tail |

---

## Controls Bar (Linked List)

The controls bar for linked lists is significantly different from v1/v2. It combines list-building controls with operation selection:

| Control | Description |
|---|---|
| List Type Selector | Toggle: `Singly` / `Doubly` / `Circular` |
| Input Mode Toggle | `Manual Input` or `Preset` |
| Value Input / Preset Dropdown | Shown based on input mode |
| Operation Selector | Dropdown: `Insert` / `Delete` / `Search` / `Reverse` |
| Sub-operation Selector | Shown for Insert/Delete: `At Head` / `At Tail` / `At Index` |
| Index Input | Shown when "At Index" is selected; integer field |
| Value Input (operation) | Shown for Insert and Search; the value to insert or find |
| Speed Slider | Same as v1/v2 |
| Run / Pause / Step / Reset | Same behavior as v1/v2 |

**UX note:** The controls bar should update contextually — sub-operation fields appear/disappear based on the selected operation. This keeps the UI uncluttered and avoids presenting irrelevant fields.

---

## `LinkedListModule` Type

```typescript
type ListVariant = "singly" | "doubly" | "circular";

type ListNode = {
  id: string;
  value: number;
  next: string | null;  // ID of next node, or null
  prev: string | null;  // ID of prev node (doubly only), or null
};

type LinkedListState = {
  nodes: ListNode[];
  headId: string | null;
  tailId: string | null;
  variant: ListVariant;
};

type LinkedListOperation =
  | { type: "insert"; position: "head" | "tail" | "index"; index?: number; value: number }
  | { type: "delete"; position: "head" | "tail" | "index"; index?: number }
  | { type: "search"; value: number }
  | { type: "reverse" };

type LinkedListStep = {
  nodes: ListNode[];              // Full current node list (immutable snapshot)
  headId: string | null;
  tailId: string | null;
  activeNodeId: string | null;   // Currently visited pointer position
  targetNodeId: string | null;   // Node being inserted/deleted/found
  affectedNodeIds: string[];     // Nodes whose pointers are being rewired
  insertedNodeId: string | null; // Newly created node (green)
  deletedNodeId: string | null;  // Node being removed (red, fading)
  pointerLabels: {               // Named pointer positions (e.g. prev/current/next for reverse)
    [label: string]: string | null;
  };
  highlightedLines: number[];
  description: string;
};

type LinkedListModule = {
  id: string;                    // e.g. "linked-list-singly"
  name: string;                  // e.g. "Singly Linked List"
  variant: ListVariant;
  category: "linked-list";
  presets: { name: string; values: number[] }[];
  operations: LinkedListOperation["type"][];
  description: AlgorithmInfo;
  complexityByOperation: Record<string, ComplexityTable>;
  codeByOperation: Record<LinkedListOperation["type"], string>;
  generatorByOperation: {
    insert: (state: LinkedListState, op: Extract<LinkedListOperation, { type: "insert" }>) => Generator<LinkedListStep>;
    delete: (state: LinkedListState, op: Extract<LinkedListOperation, { type: "delete" }>) => Generator<LinkedListStep>;
    search: (state: LinkedListState, op: Extract<LinkedListOperation, { type: "search" }>) => Generator<LinkedListStep>;
    reverse: (state: LinkedListState) => Generator<LinkedListStep>;
  };
};
```

**Key design decision:** `codeByOperation` and `complexityByOperation` are keyed by operation so the Code tab and Info tab update to show the relevant code and Big-O table when the user selects a different operation — not just when they select a different list type.

---

## Updated Sidebar (v3)

```
Sorting
  Bubble Sort
  Selection Sort
  Insertion Sort
  Merge Sort
  Quick Sort
  Heap Sort

Searching
  Linear Search
  Binary Search

Graph Traversal
  BFS
  DFS

Tree Traversal
  Inorder
  Preorder
  Postorder

Linked Lists              ← NEW
  Singly Linked List
  Doubly Linked List
  Circular Linked List
```

---

## Updated Component Tree (v3)

```
<Layout>
  <Navbar />
  <Sidebar>
    <AlgorithmList />     // now includes Linked Lists group
  </Sidebar>
  <MainPanel>
    <TabBar />
    <VisualizerTab>
      <LinkedListControlsBar />   // list type, operation selector, sub-op, value/index inputs
      <LinkedListCanvas />        // SinglyCanvas | DoublyCanvas | CircularCanvas
      <PointerLabelOverlay />     // named pointer labels (prev / current / next) for reverse
      <StepDescriptionBar />
      <MetricsBar />              // nodes visited, pointer rewires, steps elapsed
    </VisualizerTab>
    <CodeTab>
      <CodeViewer />              // updates based on selected operation, not just list type
    </CodeTab>
    <InfoTab>
      <AlgorithmInfo />           // Info + complexity table updates per selected operation
    </InfoTab>
  </MainPanel>
</Layout>
```

---

## v3 Engineering Constraints & Notes

- **State is immutable per step.** Each `LinkedListStep` must be a deep snapshot of the full node list, not a reference. Mutating the live list state between steps will corrupt the step history and break pause/step-back behavior.
- **The Code tab must update when the operation changes.** `codeByOperation` makes this straightforward — the `CodeViewer` receives the currently selected operation as a prop and renders the corresponding string.
- **Circular list SVG arc.** The wrap-around arrow for circular lists is an SVG `<path>` using a cubic bezier (`C` command) that dips below the node row. Compute the arc's control points based on the total canvas width so it scales correctly when the list length changes.
- **Doubly linked list arrow layering.** Forward (→) and backward (←) arrows must be offset vertically (forward arrows slightly above center, backward arrows slightly below) so they don't overlap. Use SVG `marker-end` for arrowheads.
- **Maximum 12 nodes enforced at the UI layer.** If the user manually enters more than 12 values, trim the list and display a warning. This is a canvas readability constraint, not a data model constraint.
- **Pointer labels for Reverse.** The three-pointer reverse (`prev`, `current`, `next`) must render as floating labels above the relevant nodes at each step. These are driven by `pointerLabels` in the step state and rendered by `PointerLabelOverlay`.
- **Empty list edge case.** All operations must handle an empty list gracefully. Inserting into an empty list should animate the node appearing from nothing and setting `head = tail = newNode`. Deleting from a single-node list should animate the node fading out and display "List is now empty."

---

## v3 Suggested Development Order

1. Design `LinkedListState` and `LinkedListStep` types; write test fixtures for all three variants
2. Build `SinglyCanvas` SVG component with static rendering (nodes + arrows, no animation)
3. Implement Insert generator for singly linked list (head, tail, index); wire to canvas
4. Build `LinkedListControlsBar` with contextual field visibility logic
5. Implement Delete generator for singly linked list
6. Implement Search / Traversal generator for singly linked list
7. Implement Reverse generator for singly linked list; add `PointerLabelOverlay`
8. Extend canvas to `DoublyCanvas` — add `prev` arrows, bidirectional layout
9. Adapt all four operation generators for doubly variant (add `prev` pointer rewiring steps)
10. Build `CircularCanvas` — add bezier wrap-around arc for tail → head arrow
11. Adapt all four operation generators for circular variant (termination condition, tail rewiring)
12. Wire `codeByOperation` and `complexityByOperation` to Code tab and Info tab
13. Populate Info tab content for all three variants and all four operations
14. Polish: node insert/delete animations, arrow flip animation for reverse, empty list edge cases