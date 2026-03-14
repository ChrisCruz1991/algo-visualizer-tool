import type { GraphModule, GraphStep, PresetGraph } from "@/engine/types";
import { graphPresets } from "@/data/presets/graphs";

const code = `function bfs(graph: Graph, startId: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startId];
  const order: string[] = [];
  visited.add(startId);

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const neighbor of graph.adjacency[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
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

function* bfsGenerator(
  graph: PresetGraph,
  startNodeId: string
): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph);
  const visited = new Set<string>([startNodeId]);
  const queue: string[] = [startNodeId];
  const traversedEdges: Array<{ from: string; to: string }> = [];
  let operationCount = 0;

  yield {
    type: "graph",
    visitedNodes: [],
    activeNode: startNodeId,
    queueOrStack: [...queue],
    traversedEdges: [],
    highlightedLines: [2, 3],
    description: `Start BFS from node ${startNodeId}. Add it to the queue.`,
    operationCount,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    operationCount++;

    yield {
      type: "graph",
      visitedNodes: [...visited],
      activeNode: current,
      queueOrStack: [...queue],
      traversedEdges: [...traversedEdges],
      highlightedLines: [7, 8],
      description: `Dequeue node ${current}. Explore its neighbors.`,
      operationCount,
    };

    const neighbors = adjacency.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        traversedEdges.push({ from: current, to: neighbor });
        operationCount++;

        yield {
          type: "graph",
          visitedNodes: [...visited],
          activeNode: current,
          queueOrStack: [...queue],
          traversedEdges: [...traversedEdges],
          highlightedLines: [11, 12, 13],
          description: `Found unvisited neighbor ${neighbor} from ${current}. Enqueue it.`,
          operationCount,
        };
      }
    }

    yield {
      type: "graph",
      visitedNodes: [...visited],
      activeNode: null,
      queueOrStack: [...queue],
      traversedEdges: [...traversedEdges],
      highlightedLines: [9],
      description: `Node ${current} fully processed.`,
      operationCount,
    };
  }

  yield {
    type: "graph",
    visitedNodes: [...visited],
    activeNode: null,
    queueOrStack: [],
    traversedEdges: [...traversedEdges],
    highlightedLines: [16],
    description: `BFS complete. Visited ${visited.size} node${visited.size !== 1 ? "s" : ""}.`,
    operationCount,
  };
}

export const bfs: GraphModule = {
  id: "bfs",
  name: "BFS",
  category: "graph",
  presets: graphPresets,
  code,
  codeLineCount: 18,
  complexity: [
    { case: "Best",    time: "O(V + E)", space: "O(V)" },
    { case: "Average", time: "O(V + E)", space: "O(V)" },
    { case: "Worst",   time: "O(V + E)", space: "O(V)" },
  ],
  description: {
    what: "Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbors of a node before moving to nodes at the next depth level. It uses a queue (FIFO) to track which nodes to visit next.",
    how: [
      "Start at the chosen source node and mark it as visited. Add it to the queue.",
      "While the queue is not empty, dequeue the front node and process it.",
      "For each unvisited neighbor of the current node, mark it visited and enqueue it.",
      "Repeat until the queue is empty — all reachable nodes have been visited.",
    ],
    implementation: [
      "Use a Set for visited tracking to get O(1) membership checks. An array check is O(V) per lookup.",
      "Use a FIFO queue (array with .shift()) so nodes are processed level by level.",
      "For disconnected graphs, loop over all nodes and restart BFS from any unvisited node.",
    ],
    useCases: [
      "Finding the shortest path in an unweighted graph (e.g., network routing).",
      "Level-order traversal of a tree.",
      "Web crawlers discovering pages by following links layer by layer.",
      "Social network 'friend of a friend' queries.",
      "Checking if a graph is bipartite.",
    ],
    comparisonNote:
      "BFS is ideal when you need the shortest path on an unweighted graph or when you want to explore nodes level by level. Use DFS instead when you need to detect cycles, do topological sorting, or explore as deep as possible before backtracking.",
  },
  generator: bfsGenerator,
};
