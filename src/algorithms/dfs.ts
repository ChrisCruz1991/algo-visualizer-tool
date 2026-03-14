import type { GraphModule, GraphStep, PresetGraph } from "@/engine/types";
import { graphPresets } from "@/data/presets/graphs";

const code = `function dfs(graph: Graph, startId: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];

  function explore(nodeId: string) {
    const stack: string[] = [nodeId];

    while (stack.length > 0) {
      const node = stack[stack.length - 1];

      if (!visited.has(node)) {
        visited.add(node);
        order.push(node);
      }

      const unvisited = graph.adjacency[node]
        ?.find(n => !visited.has(n));

      if (unvisited) {
        stack.push(unvisited);
      } else {
        stack.pop();
      }
    }
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) explore(node.id);
  }
  return order;
}`;

function buildAdjacency(graph: PresetGraph): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const node of graph.nodes) {
    map.set(node.id, []);
  }
  for (const edge of graph.edges) {
    map.get(edge.from)!.push(edge.to);
    if (!graph.directed) {
      map.get(edge.to)!.push(edge.from);
    }
  }
  return map;
}

function* dfsGenerator(
  graph: PresetGraph,
  startNodeId: string
): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph);
  const visited = new Set<string>();
  const traversedEdges: Array<{ from: string; to: string }> = [];
  let operationCount = 0;

  // Process nodes: start node first, then remaining in declaration order
  const allNodeIds = [
    startNodeId,
    ...graph.nodes.map((n) => n.id).filter((id) => id !== startNodeId),
  ];

  for (const componentStart of allNodeIds) {
    if (visited.has(componentStart)) continue;

    // Announce new component start (if not the first)
    if (visited.size > 0) {
      yield {
        type: "graph",
        visitedNodes: [...visited],
        activeNode: null,
        queueOrStack: [],
        traversedEdges: [...traversedEdges],
        highlightedLines: [26, 27],
        description: `Component complete. Starting new traversal from node ${componentStart}.`,
        operationCount,
      };
    }

    const stack: string[] = [componentStart];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];

      if (!visited.has(current)) {
        visited.add(current);
        operationCount++;

        yield {
          type: "graph",
          visitedNodes: [...visited],
          activeNode: current,
          queueOrStack: [...stack],
          traversedEdges: [...traversedEdges],
          highlightedLines: [11, 12, 13],
          description: `Visiting node ${current}. Push onto stack.`,
          operationCount,
        };
      }

      // Find first unvisited neighbor
      const neighbors = adjacency.get(current) ?? [];
      const unvisited = neighbors.find((n) => !visited.has(n));

      if (unvisited) {
        traversedEdges.push({ from: current, to: unvisited });
        stack.push(unvisited);

        yield {
          type: "graph",
          visitedNodes: [...visited],
          activeNode: current,
          queueOrStack: [...stack],
          traversedEdges: [...traversedEdges],
          highlightedLines: [18, 19, 20],
          description: `Found unvisited neighbor ${unvisited} from ${current}. Exploring deeper.`,
          operationCount,
        };
      } else {
        stack.pop();
        operationCount++;

        yield {
          type: "graph",
          visitedNodes: [...visited],
          activeNode: stack[stack.length - 1] ?? null,
          queueOrStack: [...stack],
          traversedEdges: [...traversedEdges],
          highlightedLines: [22],
          description:
            stack.length > 0
              ? `No unvisited neighbors for ${current}. Backtrack to ${stack[stack.length - 1]}.`
              : `No unvisited neighbors for ${current}. Stack empty.`,
          operationCount,
        };
      }
    }
  }

  yield {
    type: "graph",
    visitedNodes: [...visited],
    activeNode: null,
    queueOrStack: [],
    traversedEdges: [...traversedEdges],
    highlightedLines: [29],
    description: `DFS complete. Visited ${visited.size} node${visited.size !== 1 ? "s" : ""}.`,
    operationCount,
  };
}

export const dfs: GraphModule = {
  id: "dfs",
  name: "DFS",
  category: "graph",
  presets: graphPresets,
  code,
  codeLineCount: 31,
  complexity: [
    { case: "Best",    time: "O(V + E)", space: "O(V)" },
    { case: "Average", time: "O(V + E)", space: "O(V)" },
    { case: "Worst",   time: "O(V + E)", space: "O(V)" },
  ],
  description: {
    what: "Depth-First Search (DFS) is a graph traversal algorithm that explores as far down a branch as possible before backtracking. It uses a stack (LIFO) — either the call stack (recursive) or an explicit stack (iterative).",
    how: [
      "Start at the chosen source node and push it onto the stack.",
      "Peek at the top of the stack. If the node is unvisited, mark it visited.",
      "Find the first unvisited neighbor and push it onto the stack — going deeper.",
      "If no unvisited neighbors exist, pop the current node — backtracking.",
      "Repeat until the stack is empty. For disconnected graphs, restart from any unvisited node.",
    ],
    implementation: [
      "Use an explicit iterative stack rather than recursion — recursive DFS cannot be paused mid-execution in a generator-based engine.",
      "Use a Set for visited tracking to get O(1) membership checks.",
      "Handle disconnected graphs by iterating all nodes and restarting DFS from any that remain unvisited.",
    ],
    useCases: [
      "Cycle detection in directed and undirected graphs.",
      "Topological sorting of a DAG (dependency resolution).",
      "Maze solving and puzzle state exploration.",
      "Finding connected components in a graph.",
      "Game tree search (e.g., chess AI, pathfinding in games).",
    ],
    comparisonNote:
      "DFS and BFS are structurally identical — the only difference is the data structure: DFS uses a stack (LIFO), BFS uses a queue (FIFO). DFS is better for deep exploration, cycle detection, and topological sort. BFS is better for shortest path on unweighted graphs.",
  },
  generator: dfsGenerator,
};
