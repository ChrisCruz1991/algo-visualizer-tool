import type { TreeModule, TreeStep, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const tsCode = `function preorder(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.value);   // Visit root first

    // Push right before left so left is processed first
    if (node.right) stack.push(node.right);
    if (node.left)  stack.push(node.left);
  }
  return result;
}`;

// TypeScript line map:
// line 1:  function preorder(root: TreeNode | null): number[] {
// line 2:    if (root === null) return [];
// line 3:    const result: number[] = [];
// line 4:    const stack: TreeNode[] = [root];
// line 5:  (blank)
// line 6:    while (stack.length > 0) {
// line 7:      const node = stack.pop()!;
// line 8:      result.push(node.value);   // Visit root first
// line 9:  (blank)
// line 10:     // Push right before left so left is processed first
// line 11:     if (node.right) stack.push(node.right);
// line 12:     if (node.left)  stack.push(node.left);
// line 13:   }
// line 14:   return result;
// line 15: }
// visit=[6,7]   → existing [6,7]   → "visit"    (init uses [3] → "visit")
// descend=[10]  → existing [10]    → "descend"
// descend=[11]  → existing [11]    → "descend"
// done=[14]     → existing [14]    → "done"

const pyCode = `def preorder(root) -> list[int]:
    if root is None:
        return []
    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.value)  # Visit root first

        # Push right before left so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

    return result`;

// line 1:  def preorder(root) -> list[int]:
// line 2:      if root is None:
// line 3:          return []
// line 4:      result = []
// line 5:      stack = [root]
// line 6:  (blank)
// line 7:      while stack:
// line 8:          node = stack.pop()
// line 9:          result.append(node.value)  # Visit root first
// line 10: (blank)
// line 11:         # Push right before left so left is processed first
// line 12:         if node.right:
// line 13:             stack.append(node.right)
// line 14:         if node.left:
// line 15:             stack.append(node.left)
// line 16: (blank)
// line 17:     return result
// => pyLineMap: visit=[8,9], descend=[12,13,14,15], done=[17]

const javaCode = `import java.util.*;

public class PreorderTraversal {
  public static List<Integer> preorder(TreeNode root) {
    if (root == null) return new ArrayList<>();
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);

    while (!stack.isEmpty()) {
      TreeNode node = stack.pop();
      result.add(node.value);  // Visit root first

      // Push right before left so left is processed first
      if (node.right != null) stack.push(node.right);
      if (node.left  != null) stack.push(node.left);
    }
    return result;
  }
}`;

// line 1:  import java.util.*;
// line 2:  (blank)
// line 3:  public class PreorderTraversal {
// line 4:    public static List<Integer> preorder(TreeNode root) {
// line 5:      if (root == null) return new ArrayList<>();
// line 6:      List<Integer> result = new ArrayList<>();
// line 7:      Deque<TreeNode> stack = new ArrayDeque<>();
// line 8:      stack.push(root);
// line 9:  (blank)
// line 10:     while (!stack.isEmpty()) {
// line 11:       TreeNode node = stack.pop();
// line 12:       result.add(node.value);  // Visit root first
// line 13: (blank)
// line 14:       // Push right before left so left is processed first
// line 15:       if (node.right != null) stack.push(node.right);
// line 16:       if (node.left  != null) stack.push(node.left);
// line 17:     }
// line 18:     return result;
// line 19:   }
// line 20: }
// => javaLineMap: visit=[11,12], descend=[15,16], done=[18]

const cppCode = `#include <vector>
#include <stack>
using namespace std;

class PreorderTraversal {
public:
  static vector<int> preorder(TreeNode* root) {
    if (root == nullptr) return {};
    vector<int> result;
    stack<TreeNode*> stk;
    stk.push(root);

    while (!stk.empty()) {
      TreeNode* node = stk.top();
      stk.pop();
      result.push_back(node->value);  // Visit root first

      // Push right before left so left is processed first
      if (node->right) stk.push(node->right);
      if (node->left)  stk.push(node->left);
    }
    return result;
  }
};`;

// line 1:  #include <vector>
// line 2:  #include <stack>
// line 3:  using namespace std;
// line 4:  (blank)
// line 5:  class PreorderTraversal {
// line 6:  public:
// line 7:    static vector<int> preorder(TreeNode* root) {
// line 8:      if (root == nullptr) return {};
// line 9:      vector<int> result;
// line 10:     stack<TreeNode*> stk;
// line 11:     stk.push(root);
// line 12: (blank)
// line 13:     while (!stk.empty()) {
// line 14:       TreeNode* node = stk.top();
// line 15:       stk.pop();
// line 16:       result.push_back(node->value);  // Visit root first
// line 17: (blank)
// line 18:       // Push right before left so left is processed first
// line 19:       if (node->right) stk.push(node->right);
// line 20:       if (node->left)  stk.push(node->left);
// line 21:     }
// line 22:     return result;
// line 23:   }
// line 24: };
// => cppLineMap: visit=[14,15,16], descend=[19,20], done=[22]

const code = tsCode;

function* preorderGenerator(tree: PresetTree): Generator<TreeStep> {
  const stack = [tree.root];
  const visitedNodes: string[] = [];
  const visitOrder: number[] = [];
  let operationCount = 0;

  yield {
    type: "tree",
    visitedNodes: [],
    activeNode: tree.root.id,
    enteredNodes: [tree.root.id],
    visitOrder: [],
    highlightedLines: [3],
    stepLabel: "visit",
    description: `Initialize stack with root node ${tree.root.value}.`,
  };

  while (stack.length > 0) {
    const node = stack.pop()!;
    operationCount++;

    visitedNodes.push(node.id);
    visitOrder.push(node.value);

    yield {
      type: "tree",
      visitedNodes: [...visitedNodes],
      activeNode: node.id,
      enteredNodes: stack.map((n) => n.id),
      visitOrder: [...visitOrder],
      highlightedLines: [6, 7],
      stepLabel: "visit",
      description: `Pop and visit node ${node.value} (root first).`,
    };

    // Push right first so left is popped (processed) first
    if (node.right) {
      stack.push(node.right);
      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: node.id,
        enteredNodes: stack.map((n) => n.id),
        visitOrder: [...visitOrder],
        highlightedLines: [10],
        stepLabel: "descend",
        description: `Push right child ${node.right.value} onto stack.`,
      };
    }
    if (node.left) {
      stack.push(node.left);
      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: node.id,
        enteredNodes: stack.map((n) => n.id),
        visitOrder: [...visitOrder],
        highlightedLines: [11],
        stepLabel: "descend",
        description: `Push left child ${node.left.value} onto stack.`,
      };
    }
  }

  yield {
    type: "tree",
    visitedNodes: [...visitedNodes],
    activeNode: null,
    enteredNodes: [],
    visitOrder: [...visitOrder],
    highlightedLines: [14],
    stepLabel: "done",
    description: `Preorder traversal complete. Visit order: [${visitOrder.join(", ")}].`,
  };
}

export const preorderTraversal: TreeModule = {
  id: "preorder",
  name: "Preorder",
  category: "tree",
  presets: treePresets,
  code,
  codeLineCount: 15,
  codeByLanguage: {
    typescript: {
      code: tsCode,
      lineCount: 15,
      lineMap: {
        visit: [3, 6, 7],
        descend: [10, 11],
        done: [14],
      },
    },
    python: {
      code: pyCode,
      lineCount: 17,
      lineMap: {
        visit: [8, 9],
        descend: [12, 13, 14, 15],
        done: [17],
      },
    },
    java: {
      code: javaCode,
      lineCount: 20,
      lineMap: {
        visit: [11, 12],
        descend: [15, 16],
        done: [18],
      },
    },
    cpp: {
      code: cppCode,
      lineCount: 24,
      lineMap: {
        visit: [14, 15, 16],
        descend: [19, 20],
        done: [22],
      },
    },
  },
  codeAlternativeLabel: "Recursive",
  codeAlternative: `function preorder(root: TreeNode | null): number[] {
  if (root === null) return [];
  return [
    root.value,
    ...preorder(root.left ?? null),
    ...preorder(root.right ?? null),
  ];
}`,
  complexity: [
    { case: "Best",    time: "O(N)", space: "O(H)" },
    { case: "Average", time: "O(N)", space: "O(H)" },
    { case: "Worst",   time: "O(N)", space: "O(H)" },
  ],
  description: {
    what: "Preorder traversal visits nodes in Root → Left → Right order. Each node is processed immediately upon being popped from the stack, before any of its children.",
    how: [
      "Push the root onto the stack.",
      "While the stack is not empty, pop a node and visit it immediately.",
      "Push the right child first, then the left child (so left is popped next).",
      "Repeat until the stack is empty.",
    ],
    implementation: [
      "The key insight: push right child before left child so that left is on top of the stack and gets processed first.",
      "Implement iteratively for generator compatibility — visit node on pop, not on push.",
      "The stack at any time holds the 'pending' nodes that will be processed in the future.",
    ],
    useCases: [
      "Serializing or copying a tree (root must come before children to reconstruct).",
      "Prefix notation in expression trees (operator before operands).",
      "Printing directory structures (folder before its contents).",
      "Creating a structural clone of a tree.",
    ],
    comparisonNote:
      "Preorder visits each node before its children — ideal for serialization and cloning. Inorder gives sorted output for BSTs. Postorder visits children before parents — ideal for deletion and postfix evaluation.",
  },
  generator: preorderGenerator,
};
