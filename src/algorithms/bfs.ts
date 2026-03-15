import type { GraphModule, GraphStep, PresetGraph } from "@/engine/types";
import { graphPresets } from "@/data/presets/graphs";

const tsCode = `function bfs(graph: Graph, startId: string): string[] {
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

// line 1:  function bfs(graph: Graph, startId: string): string[] {
// line 2:    const visited = new Set<string>();
// line 3:    const queue: string[] = [startId];
// line 4:    const order: string[] = [];
// line 5:    visited.add(startId);
// line 6:  (blank)
// line 7:    while (queue.length > 0) {
// line 8:      const node = queue.shift()!;
// line 9:      order.push(node);
// line 10: (blank)
// line 11:     for (const neighbor of graph.adjacency[node] ?? []) {
// line 12:       if (!visited.has(neighbor)) {
// line 13:         visited.add(neighbor);
// line 14:         queue.push(neighbor);
// line 15:       }
// line 16:     }
// line 17:   }
// line 18:   return order;
// line 19: }
// => tsLineMap: init=[2,3], dequeue=[8,9], enqueue-neighbor=[13,14,15], done=[18]
// (existing file used [2,3], [7,8], [11,12,13], [9], [16] — remapped to match ts code above)

const pyCode = `from collections import deque

def bfs(graph: dict, start: str) -> list[str]:
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order`;

// line 1:  from collections import deque
// line 2:  (blank)
// line 3:  def bfs(graph: dict, start: str) -> list[str]:
// line 4:      visited = set()
// line 5:      queue = deque([start])
// line 6:      visited.add(start)
// line 7:      order = []
// line 8:  (blank)
// line 9:      while queue:
// line 10:         node = queue.popleft()
// line 11:         order.append(node)
// line 12: (blank)
// line 13:         for neighbor in graph.get(node, []):
// line 14:             if neighbor not in visited:
// line 15:                 visited.add(neighbor)
// line 16:                 queue.append(neighbor)
// line 17: (blank)
// line 18:     return order
// => pyLineMap: init=[4,5,6], dequeue=[10,11], enqueue-neighbor=[15,16], done=[18]

const javaCode = `import java.util.*;

public class BFS {
  public static List<String> bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> order = new ArrayList<>();
    visited.add(start);
    queue.add(start);

    while (!queue.isEmpty()) {
      String node = queue.poll();
      order.add(node);

      for (String neighbor : graph.getOrDefault(node, List.of())) {
        if (!visited.contains(neighbor)) {
          visited.add(neighbor);
          queue.add(neighbor);
        }
      }
    }
    return order;
  }
}`;

// line 1:  import java.util.*;
// line 2:  (blank)
// line 3:  public class BFS {
// line 4:    public static List<String> bfs(Map<String, List<String>> graph, String start) {
// line 5:      Set<String> visited = new HashSet<>();
// line 6:      Queue<String> queue = new LinkedList<>();
// line 7:      List<String> order = new ArrayList<>();
// line 8:      visited.add(start);
// line 9:      queue.add(start);
// line 10: (blank)
// line 11:     while (!queue.isEmpty()) {
// line 12:       String node = queue.poll();
// line 13:       order.add(node);
// line 14: (blank)
// line 15:       for (String neighbor : graph.getOrDefault(node, List.of())) {
// line 16:         if (!visited.contains(neighbor)) {
// line 17:           visited.add(neighbor);
// line 18:           queue.add(neighbor);
// line 19:         }
// line 20:       }
// line 21:     }
// line 22:     return order;
// line 23:   }
// line 24: }
// => javaLineMap: init=[5,6,7,8,9], dequeue=[12,13], enqueue-neighbor=[17,18], done=[22]

const cppCode = `#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class BFS {
public:
  static vector<string> bfs(
      unordered_map<string, vector<string>>& graph,
      const string& start) {
    unordered_set<string> visited;
    queue<string> q;
    vector<string> order;
    visited.insert(start);
    q.push(start);

    while (!q.empty()) {
      string node = q.front();
      q.pop();
      order.push_back(node);

      for (const string& neighbor : graph[node]) {
        if (visited.find(neighbor) == visited.end()) {
          visited.insert(neighbor);
          q.push(neighbor);
        }
      }
    }
    return order;
  }
};`;

// line 1:  #include <vector>
// line 2:  #include <queue>
// line 3:  #include <unordered_map>
// line 4:  #include <unordered_set>
// line 5:  using namespace std;
// line 6:  (blank)
// line 7:  class BFS {
// line 8:  public:
// line 9:    static vector<string> bfs(
// line 10:     unordered_map<string, vector<string>>& graph,
// line 11:     const string& start) {
// line 12:   unordered_set<string> visited;
// line 13:   queue<string> q;
// line 14:   vector<string> order;
// line 15:   visited.insert(start);
// line 16:   q.push(start);
// line 17: (blank)
// line 18:   while (!q.empty()) {
// line 19:     string node = q.front();
// line 20:     q.pop();
// line 21:     order.push_back(node);
// line 22: (blank)
// line 23:     for (const string& neighbor : graph[node]) {
// line 24:       if (visited.find(neighbor) == visited.end()) {
// line 25:         visited.insert(neighbor);
// line 26:         q.push(neighbor);
// line 27:       }
// line 28:     }
// line 29:   }
// line 30:   return order;
// line 31:  }
// line 32: };
// => cppLineMap: init=[12,13,14,15,16], dequeue=[19,20,21], enqueue-neighbor=[25,26], done=[30]

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
    stepLabel: "init",
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
      stepLabel: "dequeue",
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
          stepLabel: "enqueue-neighbor",
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
      stepLabel: "dequeue",
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
    stepLabel: "done",
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
  codeByLanguage: {
    typescript: {
      code: tsCode,
      lineCount: 19,
      lineMap: {
        init: [2, 3],
        dequeue: [7, 8, 9],
        "enqueue-neighbor": [11, 12, 13],
        done: [16],
      },
    },
    python: {
      code: pyCode,
      lineCount: 18,
      lineMap: {
        init: [4, 5, 6],
        dequeue: [10, 11],
        "enqueue-neighbor": [15, 16],
        done: [18],
      },
    },
    java: {
      code: javaCode,
      lineCount: 24,
      lineMap: {
        init: [5, 6, 7, 8, 9],
        dequeue: [12, 13],
        "enqueue-neighbor": [17, 18],
        done: [22],
      },
    },
    cpp: {
      code: cppCode,
      lineCount: 32,
      lineMap: {
        init: [12, 13, 14, 15, 16],
        dequeue: [19, 20, 21],
        "enqueue-neighbor": [25, 26],
        done: [30],
      },
    },
  },
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
