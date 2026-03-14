export type EngineStatus = "idle" | "running" | "paused" | "done";

export type SortStep = {
  type: "sort";
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  highlightedLines: number[];
  description: string;
  comparisons: number;
  swaps: number;
};

export type SearchStep = {
  type: "search";
  array: number[];
  comparingIndices: number[];
  foundIndex: number | null;
  searchedIndices: number[];
  targetIndex: number | null;
  highlightedLines: number[];
  description: string;
  comparisons: number;
};

// --- Graph primitives ---

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type PresetGraph = {
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
};

// --- Tree primitives ---

export type TreeNode = {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
};

export type PresetTree = {
  name: string;
  root: TreeNode;
};

// --- Graph & Tree step types ---

export type GraphStep = {
  type: "graph";
  visitedNodes: string[];
  activeNode: string | null;
  queueOrStack: string[];
  traversedEdges: Array<{ from: string; to: string }>;
  highlightedLines: number[];
  description: string;
  operationCount: number;
};

export type TreeStep = {
  type: "tree";
  visitedNodes: string[];
  activeNode: string | null;
  enteredNodes: string[]; // entered but not yet processed (amber/dimmed)
  visitOrder: number[];
  highlightedLines: number[];
  description: string;
};

export type AlgorithmStep = SortStep | SearchStep | GraphStep | TreeStep;

// --- Shared content types ---

export type ComplexityRow = {
  case: "Best" | "Average" | "Worst";
  time: string;
  space: string;
};

export type AlgorithmInfo = {
  what: string;
  how: string[];
  implementation: string[];
  useCases: string[];
  comparisonNote: string;
};

// --- Algorithm module types ---

export type SortSearchModule = {
  id: string;
  name: string;
  category: "sorting" | "searching";
  description: AlgorithmInfo;
  complexity: ComplexityRow[];
  code: string;
  codeLineCount: number;
  generator: (input: number[], target?: number) => Generator<AlgorithmStep>;
};

export type GraphModule = {
  id: string;
  name: string;
  category: "graph";
  presets: PresetGraph[];
  description: AlgorithmInfo;
  complexity: ComplexityRow[];
  code: string;
  codeLineCount: number;
  generator: (graph: PresetGraph, startNodeId: string) => Generator<GraphStep>;
};

export type TreeModule = {
  id: string;
  name: string;
  category: "tree";
  presets: PresetTree[];
  description: AlgorithmInfo;
  complexity: ComplexityRow[];
  code: string;
  codeLineCount: number;
  generator: (tree: PresetTree) => Generator<TreeStep>;
};

export type AlgorithmModule = SortSearchModule | GraphModule | TreeModule;
