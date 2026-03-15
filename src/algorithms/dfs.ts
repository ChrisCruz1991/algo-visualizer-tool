import type { GraphModule, GraphStep, PresetGraph } from "@/engine/types";
import { graphPresets } from "@/data/presets/graphs";

const tsCode = `function dfs(graph: Graph, startId: string): string[] {
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

// TypeScript line map (existing highlightedLines):
// init step uses [26, 27] (new component start) → not mapped to a step label in generator below
// visit: [11, 12, 13]
// deeper/push: [18, 19, 20]  → mapped to "visit" (exploring deeper is part of the visit flow)
// backtrack: [22]
// done: [29]

const pyCode = `def dfs(graph: dict, start: str) -> list[str]:
    visited = set()
    order = []

    def explore(node_id: str):
        stack = [node_id]

        while stack:
            node = stack[-1]

            if node not in visited:
                visited.add(node)
                order.append(node)

            neighbors = graph.get(node, [])
            unvisited = next(
                (n for n in neighbors if n not in visited), None
            )

            if unvisited:
                stack.append(unvisited)
            else:
                stack.pop()

    for node in graph.get("nodes", []):
        if node not in visited:
            explore(node)

    return order`;

// line 1:  def dfs(graph: dict, start: str) -> list[str]:
// line 2:      visited = set()
// line 3:      order = []
// line 4:  (blank)
// line 5:      def explore(node_id: str):
// line 6:          stack = [node_id]
// line 7:  (blank)
// line 8:          while stack:
// line 9:              node = stack[-1]
// line 10: (blank)
// line 11:             if node not in visited:
// line 12:                 visited.add(node)
// line 13:                 order.append(node)
// line 14: (blank)
// line 15:             neighbors = graph.get(node, [])
// line 16:             unvisited = next(
// line 17:                 (n for n in neighbors if n not in visited), None
// line 18:             )
// line 19: (blank)
// line 20:             if unvisited:
// line 21:                 stack.append(unvisited)
// line 22:             else:
// line 23:                 stack.pop()
// line 24: (blank)
// line 25:     for node in graph.get("nodes", []):
// line 26:         if node not in visited:
// line 27:             explore(node)
// line 28: (blank)
// line 29:     return order
// => pyLineMap: init=[2,3], visit=[11,12,13], backtrack=[23], done=[29]

const javaCode = `import java.util.*;

public class DFS {
  public static List<String> dfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    List<String> order = new ArrayList<>();
    Deque<String> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
      String node = stack.peek();

      if (!visited.contains(node)) {
        visited.add(node);
        order.add(node);
      }

      List<String> neighbors = graph.getOrDefault(node, List.of());
      String unvisited = null;
      for (String n : neighbors) {
        if (!visited.contains(n)) { unvisited = n; break; }
      }

      if (unvisited != null) {
        stack.push(unvisited);
      } else {
        stack.pop();
      }
    }
    return order;
  }
}`;

// line 1:  import java.util.*;
// line 2:  (blank)
// line 3:  public class DFS {
// line 4:    public static List<String> dfs(Map<String, List<String>> graph, String start) {
// line 5:      Set<String> visited = new HashSet<>();
// line 6:      List<String> order = new ArrayList<>();
// line 7:      Deque<String> stack = new ArrayDeque<>();
// line 8:      stack.push(start);
// line 9:  (blank)
// line 10:     while (!stack.isEmpty()) {
// line 11:       String node = stack.peek();
// line 12: (blank)
// line 13:       if (!visited.contains(node)) {
// line 14:         visited.add(node);
// line 15:         order.add(node);
// line 16:       }
// line 17: (blank)
// line 18:       List<String> neighbors = graph.getOrDefault(node, List.of());
// line 19:       String unvisited = null;
// line 20:       for (String n : neighbors) {
// line 21:         if (!visited.contains(n)) { unvisited = n; break; }
// line 22:       }
// line 23: (blank)
// line 24:       if (unvisited != null) {
// line 25:         stack.push(unvisited);
// line 26:       } else {
// line 27:         stack.pop();
// line 28:       }
// line 29:     }
// line 30:     return order;
// line 31:   }
// line 32: }
// => javaLineMap: init=[5,6,7,8], visit=[13,14,15], backtrack=[27], done=[30]

const cppCode = `#include <vector>
#include <stack>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class DFS {
public:
  static vector<string> dfs(
      unordered_map<string, vector<string>>& graph,
      const string& start) {
    unordered_set<string> visited;
    vector<string> order;
    stack<string> stk;
    stk.push(start);

    while (!stk.empty()) {
      string node = stk.top();

      if (visited.find(node) == visited.end()) {
        visited.insert(node);
        order.push_back(node);
      }

      string unvisited = "";
      for (const string& n : graph[node]) {
        if (visited.find(n) == visited.end()) {
          unvisited = n;
          break;
        }
      }

      if (!unvisited.empty()) {
        stk.push(unvisited);
      } else {
        stk.pop();
      }
    }
    return order;
  }
};`;

// line 1:  #include <vector>
// line 2:  #include <stack>
// line 3:  #include <unordered_map>
// line 4:  #include <unordered_set>
// line 5:  using namespace std;
// line 6:  (blank)
// line 7:  class DFS {
// line 8:  public:
// line 9:    static vector<string> dfs(
// line 10:     unordered_map<string, vector<string>>& graph,
// line 11:     const string& start) {
// line 12:   unordered_set<string> visited;
// line 13:   vector<string> order;
// line 14:   stack<string> stk;
// line 15:   stk.push(start);
// line 16: (blank)
// line 17:   while (!stk.empty()) {
// line 18:     string node = stk.top();
// line 19: (blank)
// line 20:     if (visited.find(node) == visited.end()) {
// line 21:       visited.insert(node);
// line 22:       order.push_back(node);
// line 23:     }
// line 24: (blank)
// line 25:     string unvisited = "";
// line 26:     for (const string& n : graph[node]) {
// line 27:       if (visited.find(n) == visited.end()) {
// line 28:         unvisited = n;
// line 29:         break;
// line 30:       }
// line 31:     }
// line 32: (blank)
// line 33:     if (!unvisited.empty()) {
// line 34:       stk.push(unvisited);
// line 35:     } else {
// line 36:       stk.pop();
// line 37:     }
// line 38:   }
// line 39:   return order;
// line 40:  }
// line 41: };
// => cppLineMap: init=[12,13,14,15], visit=[20,21,22], backtrack=[36], done=[39]

const code = tsCode;

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
        stepLabel: "init",
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
          stepLabel: "visit",
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
          stepLabel: "visit",
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
          stepLabel: "backtrack",
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
    stepLabel: "done",
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
  codeByLanguage: {
    typescript: {
      code: tsCode,
      lineCount: 31,
      lineMap: {
        init: [26, 27],
        visit: [11, 12, 13],
        backtrack: [22],
        done: [29],
      },
    },
    python: {
      code: pyCode,
      lineCount: 29,
      lineMap: {
        init: [2, 3],
        visit: [11, 12, 13],
        backtrack: [23],
        done: [29],
      },
    },
    java: {
      code: javaCode,
      lineCount: 32,
      lineMap: {
        init: [5, 6, 7, 8],
        visit: [13, 14, 15],
        backtrack: [27],
        done: [30],
      },
    },
    cpp: {
      code: cppCode,
      lineCount: 41,
      lineMap: {
        init: [12, 13, 14, 15],
        visit: [20, 21, 22],
        backtrack: [36],
        done: [39],
      },
    },
  },
  codeAlternativeLabel: "Recursive",
  codeAlternative: `function dfs(graph: Graph, startId: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];

  function explore(nodeId: string) {
    visited.add(nodeId);
    order.push(nodeId);
    for (const neighbor of graph.adjacency[nodeId] ?? []) {
      if (!visited.has(neighbor)) explore(neighbor);
    }
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) explore(node.id);
  }
  return order;
}`,
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
