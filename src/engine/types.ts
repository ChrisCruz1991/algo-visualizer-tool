export type EngineStatus = "idle" | "running" | "paused" | "done";

// --- Multi-language support ---

export type SupportedLanguage = "typescript" | "python" | "java" | "cpp";

export type LineMap = Record<string, number[]>; // stepLabel → line numbers in this language

export type CodeEntry = {
  code: string;
  lineCount: number;
  lineMap: LineMap;
};

// ---

export type SortStep = {
  type: "sort";
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  highlightedLines: number[];
  stepLabel?: string;
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
  stepLabel?: string;
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
  stepLabel?: string;
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
  stepLabel?: string;
  description: string;
};

// --- Linked list primitives ---

export type ListVariant = "singly" | "doubly" | "circular";

export type ListNode = {
  id: string;
  value: number;
  next: string | null;
  prev: string | null; // null for singly/circular
};

export type LinkedListState = {
  nodes: ListNode[];
  headId: string | null;
  tailId: string | null;
  variant: ListVariant;
};

export type LinkedListOperation =
  | { type: "insert"; position: "head" | "tail" | "index"; index?: number; value: number }
  | { type: "delete"; position: "head" | "tail" | "index"; index?: number }
  | { type: "search"; value: number }
  | { type: "reverse" };

export type LinkedListStep = {
  type: "linked-list";
  nodes: ListNode[];
  headId: string | null;
  tailId: string | null;
  activeNodeId: string | null;
  targetNodeId: string | null;
  affectedNodeIds: string[];
  insertedNodeId: string | null;
  deletedNodeId: string | null;
  pointerLabels: Record<string, string | null>; // e.g. { prev: "n1", current: "n2", next: "n3" }
  highlightedLines: number[];
  stepLabel?: string;
  description: string;
};

export type AlgorithmStep = SortStep | SearchStep | GraphStep | TreeStep | LinkedListStep;

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
  /** @deprecated Use codeByLanguage.typescript.code */
  code: string;
  codeLineCount: number;
  codeByLanguage: Record<SupportedLanguage, CodeEntry>;
  codeAlternativeLabel?: "Iterative" | "Recursive";
  /** @deprecated Use codeAlternativeByLanguage */
  codeAlternative?: string;
  codeAlternativeByLanguage?: Record<SupportedLanguage, CodeEntry>;
  generator: (input: number[], target?: number) => Generator<AlgorithmStep>;
};

export type GraphModule = {
  id: string;
  name: string;
  category: "graph";
  presets: PresetGraph[];
  description: AlgorithmInfo;
  complexity: ComplexityRow[];
  /** @deprecated Use codeByLanguage.typescript.code */
  code: string;
  codeLineCount: number;
  codeByLanguage: Record<SupportedLanguage, CodeEntry>;
  codeAlternativeLabel?: "Iterative" | "Recursive";
  codeAlternative?: string;
  codeAlternativeByLanguage?: Record<SupportedLanguage, CodeEntry>;
  generator: (graph: PresetGraph, startNodeId: string) => Generator<GraphStep>;
};

export type TreeModule = {
  id: string;
  name: string;
  category: "tree";
  presets: PresetTree[];
  description: AlgorithmInfo;
  complexity: ComplexityRow[];
  /** @deprecated Use codeByLanguage.typescript.code */
  code: string;
  codeLineCount: number;
  codeByLanguage: Record<SupportedLanguage, CodeEntry>;
  codeAlternativeLabel?: "Iterative" | "Recursive";
  codeAlternative?: string;
  codeAlternativeByLanguage?: Record<SupportedLanguage, CodeEntry>;
  generator: (tree: PresetTree) => Generator<TreeStep>;
};

export type LinkedListModule = {
  id: string;
  name: string;
  variant: ListVariant;
  category: "linked-list";
  presets: { name: string; values: number[] }[];
  description: AlgorithmInfo;
  complexity: ComplexityRow[]; // fallback for InfoTab; per-operation via complexityByOperation
  complexityByOperation: Record<LinkedListOperation["type"], ComplexityRow[]>;
  /** @deprecated Use codeByOperationByLanguage */
  codeByOperation: Record<LinkedListOperation["type"], string>;
  codeByOperationByLanguage: Record<LinkedListOperation["type"], Record<SupportedLanguage, CodeEntry>>;
  generatorByOperation: {
    insert: (
      state: LinkedListState,
      op: Extract<LinkedListOperation, { type: "insert" }>
    ) => Generator<LinkedListStep>;
    delete: (
      state: LinkedListState,
      op: Extract<LinkedListOperation, { type: "delete" }>
    ) => Generator<LinkedListStep>;
    search: (
      state: LinkedListState,
      op: Extract<LinkedListOperation, { type: "search" }>
    ) => Generator<LinkedListStep>;
    reverse: (state: LinkedListState) => Generator<LinkedListStep>;
  };
};

export type AlgorithmModule = SortSearchModule | GraphModule | TreeModule | LinkedListModule;
