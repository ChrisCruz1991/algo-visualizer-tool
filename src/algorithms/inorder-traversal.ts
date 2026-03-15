import type { TreeModule, TreeStep, TreeNode, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const tsCode = `function inorder(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;

  while (current !== null || stack.length > 0) {
    // Descend left as far as possible
    while (current !== null) {
      stack.push(current);
      current = current.left ?? null;
    }

    // Process the node
    current = stack.pop()!;
    result.push(current.value);

    // Move to right subtree
    current = current.right ?? null;
  }
  return result;
}`;

// TypeScript line map:
// line 1:  function inorder(root: TreeNode | null): number[] {
// line 2:    const result: number[] = [];
// line 3:    const stack: TreeNode[] = [];
// line 4:    let current: TreeNode | null = root;
// line 5:  (blank)
// line 6:    while (current !== null || stack.length > 0) {
// line 7:      // Descend left as far as possible
// line 8:      while (current !== null) {
// line 9:        stack.push(current);
// line 10:       current = current.left ?? null;
// line 11:     }
// line 12: (blank)
// line 13:     // Process the node
// line 14:     current = stack.pop()!;
// line 15:     result.push(current.value);
// line 16: (blank)
// line 17:     // Move to right subtree
// line 18:     current = current.right ?? null;
// line 19:   }
// line 20:   return result;
// line 21: }
// enter=[8,9]  → existing highlightedLines [8,9]   → "enter"
// visit=[13,14] → existing highlightedLines [13,14] → "visit"  (right-move [17] also "visit")
// done=[19]  → existing highlightedLines [19]       → "done"

const pyCode = `def inorder(root) -> list[int]:
    result = []
    stack = []
    current = root

    while current is not None or stack:
        # Descend left as far as possible
        while current is not None:
            stack.append(current)
            current = current.left

        # Process the node
        current = stack.pop()
        result.append(current.value)

        # Move to right subtree
        current = current.right

    return result`;

// line 1:  def inorder(root) -> list[int]:
// line 2:      result = []
// line 3:      stack = []
// line 4:      current = root
// line 5:  (blank)
// line 6:      while current is not None or stack:
// line 7:          # Descend left as far as possible
// line 8:          while current is not None:
// line 9:              stack.append(current)
// line 10:             current = current.left
// line 11: (blank)
// line 12:         # Process the node
// line 13:         current = stack.pop()
// line 14:         result.append(current.value)
// line 15: (blank)
// line 16:         # Move to right subtree
// line 17:         current = current.right
// line 18: (blank)
// line 19:     return result
// => pyLineMap: enter=[8,9,10], visit=[13,14], done=[19]

const javaCode = `import java.util.*;

public class InorderTraversal {
  public static List<Integer> inorder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode current = root;

    while (current != null || !stack.isEmpty()) {
      // Descend left as far as possible
      while (current != null) {
        stack.push(current);
        current = current.left;
      }

      // Process the node
      current = stack.pop();
      result.add(current.value);

      // Move to right subtree
      current = current.right;
    }
    return result;
  }
}`;

// line 1:  import java.util.*;
// line 2:  (blank)
// line 3:  public class InorderTraversal {
// line 4:    public static List<Integer> inorder(TreeNode root) {
// line 5:      List<Integer> result = new ArrayList<>();
// line 6:      Deque<TreeNode> stack = new ArrayDeque<>();
// line 7:      TreeNode current = root;
// line 8:  (blank)
// line 9:      while (current != null || !stack.isEmpty()) {
// line 10:       // Descend left as far as possible
// line 11:       while (current != null) {
// line 12:         stack.push(current);
// line 13:         current = current.left;
// line 14:       }
// line 15: (blank)
// line 16:       // Process the node
// line 17:       current = stack.pop();
// line 18:       result.add(current.value);
// line 19: (blank)
// line 20:       // Move to right subtree
// line 21:       current = current.right;
// line 22:     }
// line 23:     return result;
// line 24:   }
// line 25: }
// => javaLineMap: enter=[11,12,13], visit=[17,18], done=[23]

const cppCode = `#include <vector>
#include <stack>
using namespace std;

class InorderTraversal {
public:
  static vector<int> inorder(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> stk;
    TreeNode* current = root;

    while (current != nullptr || !stk.empty()) {
      // Descend left as far as possible
      while (current != nullptr) {
        stk.push(current);
        current = current->left;
      }

      // Process the node
      current = stk.top();
      stk.pop();
      result.push_back(current->value);

      // Move to right subtree
      current = current->right;
    }
    return result;
  }
};`;

// line 1:  #include <vector>
// line 2:  #include <stack>
// line 3:  using namespace std;
// line 4:  (blank)
// line 5:  class InorderTraversal {
// line 6:  public:
// line 7:    static vector<int> inorder(TreeNode* root) {
// line 8:      vector<int> result;
// line 9:      stack<TreeNode*> stk;
// line 10:     TreeNode* current = root;
// line 11: (blank)
// line 12:     while (current != nullptr || !stk.empty()) {
// line 13:       // Descend left as far as possible
// line 14:       while (current != nullptr) {
// line 15:         stk.push(current);
// line 16:         current = current->left;
// line 17:       }
// line 18: (blank)
// line 19:       // Process the node
// line 20:       current = stk.top();
// line 21:       stk.pop();
// line 22:       result.push_back(current->value);
// line 23: (blank)
// line 24:       // Move to right subtree
// line 25:       current = current->right;
// line 26:     }
// line 27:     return result;
// line 28:   }
// line 29: };
// => cppLineMap: enter=[14,15,16], visit=[20,21,22], done=[27]

const code = tsCode;

function* inorderGenerator(tree: PresetTree): Generator<TreeStep> {
  const stack: TreeNode[] = [];
  const visitedNodes: string[] = [];
  const enteredNodes: string[] = [];
  const visitOrder: number[] = [];
  let current: TreeNode | undefined = tree.root;

  while (current !== undefined || stack.length > 0) {
    // Descend left
    while (current !== undefined) {
      stack.push(current);
      if (!enteredNodes.includes(current.id)) {
        enteredNodes.push(current.id);
      }

      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: current.id,
        enteredNodes: [...enteredNodes],
        visitOrder: [...visitOrder],
        highlightedLines: [8, 9],
        stepLabel: "enter",
        description: `Enter node ${current.value}. Descend left.`,
      };

      current = current.left;
    }

    // Process node
    const node = stack.pop()!;
    visitedNodes.push(node.id);
    visitOrder.push(node.value);
    const enteredIdx = enteredNodes.indexOf(node.id);
    if (enteredIdx !== -1) enteredNodes.splice(enteredIdx, 1);

    yield {
      type: "tree",
      visitedNodes: [...visitedNodes],
      activeNode: node.id,
      enteredNodes: [...enteredNodes],
      visitOrder: [...visitOrder],
      highlightedLines: [13, 14],
      stepLabel: "visit",
      description: `Visit node ${node.value} (left subtree done). Added to result.`,
    };

    current = node.right;

    if (current !== undefined) {
      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: node.id,
        enteredNodes: [...enteredNodes],
        visitOrder: [...visitOrder],
        highlightedLines: [17],
        stepLabel: "visit",
        description: `Move to right subtree of ${node.value}.`,
      };
    }
  }

  yield {
    type: "tree",
    visitedNodes: [...visitedNodes],
    activeNode: null,
    enteredNodes: [],
    visitOrder: [...visitOrder],
    highlightedLines: [19],
    stepLabel: "done",
    description: `Inorder traversal complete. Visit order: [${visitOrder.join(", ")}].`,
  };
}

export const inorderTraversal: TreeModule = {
  id: "inorder",
  name: "Inorder",
  category: "tree",
  presets: treePresets,
  code,
  codeLineCount: 21,
  codeByLanguage: {
    typescript: {
      code: tsCode,
      lineCount: 21,
      lineMap: {
        enter: [8, 9],
        visit: [13, 14, 17],
        done: [19],
      },
    },
    python: {
      code: pyCode,
      lineCount: 19,
      lineMap: {
        enter: [8, 9, 10],
        visit: [13, 14],
        done: [19],
      },
    },
    java: {
      code: javaCode,
      lineCount: 25,
      lineMap: {
        enter: [11, 12, 13],
        visit: [17, 18],
        done: [23],
      },
    },
    cpp: {
      code: cppCode,
      lineCount: 29,
      lineMap: {
        enter: [14, 15, 16],
        visit: [20, 21, 22],
        done: [27],
      },
    },
  },
  codeAlternativeLabel: "Recursive",
  codeAlternative: `function inorder(root: TreeNode | null): number[] {
  if (root === null) return [];
  return [
    ...inorder(root.left ?? null),
    root.value,
    ...inorder(root.right ?? null),
  ];
}`,
  complexity: [
    { case: "Best",    time: "O(N)", space: "O(H)" },
    { case: "Average", time: "O(N)", space: "O(H)" },
    { case: "Worst",   time: "O(N)", space: "O(H)" },
  ],
  description: {
    what: "Inorder traversal visits nodes in Left → Root → Right order. For a Binary Search Tree (BST), this produces nodes in ascending sorted order.",
    how: [
      "Start at the root. Descend left as far as possible, pushing each node onto a stack.",
      "When no left child exists, pop from the stack and visit (process) the node.",
      "Move to the right child of the visited node and repeat the descent.",
      "Continue until both the stack and current pointer are empty.",
    ],
    implementation: [
      "Implement iteratively with an explicit stack — a recursive approach cannot yield mid-execution in a generator engine.",
      "Track 'entered' nodes (on the stack, not yet processed) to show the amber 'in-progress' state.",
      "The current pointer starts at root and becomes null when we need to pop from the stack.",
    ],
    useCases: [
      "Printing BST values in sorted ascending order.",
      "Validating that a binary tree satisfies the BST property.",
      "Flattening a BST to a sorted array.",
      "Expression tree evaluation (infix notation).",
    ],
    comparisonNote:
      "Inorder gives sorted output for BSTs — its primary advantage over preorder and postorder. Use preorder when you need to copy or serialize a tree (root must be written first), and postorder when you need to delete a tree or evaluate postfix expressions.",
  },
  generator: inorderGenerator,
};
