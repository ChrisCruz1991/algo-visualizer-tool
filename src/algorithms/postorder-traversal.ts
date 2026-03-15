import type { TreeModule, TreeStep, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const tsCode = `function postorder(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const stack1: TreeNode[] = [root];
  const stack2: TreeNode[] = [];

  // Phase 1: push nodes onto stack2 in reverse postorder
  while (stack1.length > 0) {
    const node = stack1.pop()!;
    stack2.push(node);
    if (node.left)  stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }

  // Phase 2: pop stack2 for correct postorder
  while (stack2.length > 0) {
    const node = stack2.pop()!;
    result.push(node.value);
  }
  return result;
}`;

// TypeScript line map:
// line 1:  function postorder(root: TreeNode | null): number[] {
// line 2:    if (root === null) return [];
// line 3:    const result: number[] = [];
// line 4:    const stack1: TreeNode[] = [root];
// line 5:    const stack2: TreeNode[] = [];
// line 6:  (blank)
// line 7:    // Phase 1: push nodes onto stack2 in reverse postorder
// line 8:    while (stack1.length > 0) {
// line 9:      const node = stack1.pop()!;
// line 10:     stack2.push(node);
// line 11:     if (node.left)  stack1.push(node.left);
// line 12:     if (node.right) stack1.push(node.right);
// line 13:   }
// line 14: (blank)
// line 15:   // Phase 2: pop stack2 for correct postorder
// line 16:   while (stack2.length > 0) {
// line 17:     const node = stack2.pop()!;
// line 18:     result.push(node.value);
// line 19:   }
// line 20:   return result;
// line 21: }
// enter=[3,4]   → existing [3,4]   → "enter"     (init)
// enter=[8,9]   → existing [8,9]   → "enter"     (phase 1 pop→stack2)
// enter=[10]    → existing [10]    → "enter"     (push left child)
// enter=[11]    → existing [11]    → "enter"     (push right child)
// visit=[15]    → existing [15]    → "enter"     (phase 1 done / transition)
// visit=[16,17] → existing [16,17] → "visit"     (phase 2 pop→result)
// done=[19]     → existing [19]    → "done"

const pyCode = `def postorder(root) -> list[int]:
    if root is None:
        return []
    result = []
    stack1 = [root]
    stack2 = []

    # Phase 1: push nodes onto stack2 in reverse postorder
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)

    # Phase 2: pop stack2 for correct postorder
    while stack2:
        node = stack2.pop()
        result.append(node.value)

    return result`;

// line 1:  def postorder(root) -> list[int]:
// line 2:      if root is None:
// line 3:          return []
// line 4:      result = []
// line 5:      stack1 = [root]
// line 6:      stack2 = []
// line 7:  (blank)
// line 8:      # Phase 1: push nodes onto stack2 in reverse postorder
// line 9:      while stack1:
// line 10:         node = stack1.pop()
// line 11:         stack2.append(node)
// line 12:         if node.left:
// line 13:             stack1.append(node.left)
// line 14:         if node.right:
// line 15:             stack1.append(node.right)
// line 16: (blank)
// line 17:     # Phase 2: pop stack2 for correct postorder
// line 18:     while stack2:
// line 19:         node = stack2.pop()
// line 20:         result.append(node.value)
// line 21: (blank)
// line 22:     return result
// => pyLineMap: enter=[4,5,6,10,11], visit=[19,20], done=[22]

const javaCode = `import java.util.*;

public class PostorderTraversal {
  public static List<Integer> postorder(TreeNode root) {
    if (root == null) return new ArrayList<>();
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack1 = new ArrayDeque<>();
    Deque<TreeNode> stack2 = new ArrayDeque<>();
    stack1.push(root);

    // Phase 1: push nodes onto stack2 in reverse postorder
    while (!stack1.isEmpty()) {
      TreeNode node = stack1.pop();
      stack2.push(node);
      if (node.left  != null) stack1.push(node.left);
      if (node.right != null) stack1.push(node.right);
    }

    // Phase 2: pop stack2 for correct postorder
    while (!stack2.isEmpty()) {
      TreeNode node = stack2.pop();
      result.add(node.value);
    }
    return result;
  }
}`;

// line 1:  import java.util.*;
// line 2:  (blank)
// line 3:  public class PostorderTraversal {
// line 4:    public static List<Integer> postorder(TreeNode root) {
// line 5:      if (root == null) return new ArrayList<>();
// line 6:      List<Integer> result = new ArrayList<>();
// line 7:      Deque<TreeNode> stack1 = new ArrayDeque<>();
// line 8:      Deque<TreeNode> stack2 = new ArrayDeque<>();
// line 9:      stack1.push(root);
// line 10: (blank)
// line 11:     // Phase 1: push nodes onto stack2 in reverse postorder
// line 12:     while (!stack1.isEmpty()) {
// line 13:       TreeNode node = stack1.pop();
// line 14:       stack2.push(node);
// line 15:       if (node.left  != null) stack1.push(node.left);
// line 16:       if (node.right != null) stack1.push(node.right);
// line 17:     }
// line 18: (blank)
// line 19:     // Phase 2: pop stack2 for correct postorder
// line 20:     while (!stack2.isEmpty()) {
// line 21:       TreeNode node = stack2.pop();
// line 22:       result.add(node.value);
// line 23:     }
// line 24:     return result;
// line 25:   }
// line 26: }
// => javaLineMap: enter=[6,7,8,9,13,14], visit=[21,22], done=[24]

const cppCode = `#include <vector>
#include <stack>
using namespace std;

class PostorderTraversal {
public:
  static vector<int> postorder(TreeNode* root) {
    if (root == nullptr) return {};
    vector<int> result;
    stack<TreeNode*> stack1;
    stack<TreeNode*> stack2;
    stack1.push(root);

    // Phase 1: push nodes onto stack2 in reverse postorder
    while (!stack1.empty()) {
      TreeNode* node = stack1.top();
      stack1.pop();
      stack2.push(node);
      if (node->left)  stack1.push(node->left);
      if (node->right) stack1.push(node->right);
    }

    // Phase 2: pop stack2 for correct postorder
    while (!stack2.empty()) {
      TreeNode* node = stack2.top();
      stack2.pop();
      result.push_back(node->value);
    }
    return result;
  }
};`;

// line 1:  #include <vector>
// line 2:  #include <stack>
// line 3:  using namespace std;
// line 4:  (blank)
// line 5:  class PostorderTraversal {
// line 6:  public:
// line 7:    static vector<int> postorder(TreeNode* root) {
// line 8:      if (root == nullptr) return {};
// line 9:      vector<int> result;
// line 10:     stack<TreeNode*> stack1;
// line 11:     stack<TreeNode*> stack2;
// line 12:     stack1.push(root);
// line 13: (blank)
// line 14:     // Phase 1: push nodes onto stack2 in reverse postorder
// line 15:     while (!stack1.empty()) {
// line 16:       TreeNode* node = stack1.top();
// line 17:       stack1.pop();
// line 18:       stack2.push(node);
// line 19:       if (node->left)  stack1.push(node->left);
// line 20:       if (node->right) stack1.push(node->right);
// line 21:     }
// line 22: (blank)
// line 23:     // Phase 2: pop stack2 for correct postorder
// line 24:     while (!stack2.empty()) {
// line 25:       TreeNode* node = stack2.top();
// line 26:       stack2.pop();
// line 27:       result.push_back(node->value);
// line 28:     }
// line 29:     return result;
// line 30:   }
// line 31: };
// => cppLineMap: enter=[9,10,11,12,16,17,18], visit=[25,26,27], done=[29]

const code = tsCode;

function* postorderGenerator(tree: PresetTree): Generator<TreeStep> {
  const stack1 = [tree.root];
  const stack2: typeof stack1 = [];
  const visitedNodes: string[] = [];
  const enteredNodes: string[] = [tree.root.id];
  const visitOrder: number[] = [];

  yield {
    type: "tree",
    visitedNodes: [],
    activeNode: tree.root.id,
    enteredNodes: [...enteredNodes],
    visitOrder: [],
    highlightedLines: [3, 4],
    stepLabel: "enter",
    description: `Initialize. Push root ${tree.root.value} onto stack1. Stack2 will collect reverse postorder.`,
  };

  // Phase 1: populate stack2
  while (stack1.length > 0) {
    const node = stack1.pop()!;
    stack2.push(node);

    yield {
      type: "tree",
      visitedNodes: [...visitedNodes],
      activeNode: node.id,
      enteredNodes: stack2.map((n) => n.id),
      visitOrder: [...visitOrder],
      highlightedLines: [8, 9],
      stepLabel: "enter",
      description: `Pop ${node.value} from stack1. Push to stack2 (will be visited later).`,
    };

    if (node.left) {
      stack1.push(node.left);
      if (!enteredNodes.includes(node.left.id)) {
        enteredNodes.push(node.left.id);
      }
      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: node.id,
        enteredNodes: stack2.map((n) => n.id),
        visitOrder: [...visitOrder],
        highlightedLines: [10],
        stepLabel: "enter",
        description: `Push left child ${node.left.value} onto stack1.`,
      };
    }

    if (node.right) {
      stack1.push(node.right);
      if (!enteredNodes.includes(node.right.id)) {
        enteredNodes.push(node.right.id);
      }
      yield {
        type: "tree",
        visitedNodes: [...visitedNodes],
        activeNode: node.id,
        enteredNodes: stack2.map((n) => n.id),
        visitOrder: [...visitOrder],
        highlightedLines: [11],
        stepLabel: "enter",
        description: `Push right child ${node.right.value} onto stack1.`,
      };
    }
  }

  yield {
    type: "tree",
    visitedNodes: [],
    activeNode: null,
    enteredNodes: stack2.map((n) => n.id),
    visitOrder: [],
    highlightedLines: [15],
    stepLabel: "enter",
    description: `Stack1 empty. Stack2 holds nodes in reverse postorder. Now popping for final order.`,
  };

  // Phase 2: pop stack2 in postorder
  while (stack2.length > 0) {
    const node = stack2.pop()!;
    visitedNodes.push(node.id);
    visitOrder.push(node.value);

    yield {
      type: "tree",
      visitedNodes: [...visitedNodes],
      activeNode: node.id,
      enteredNodes: stack2.map((n) => n.id),
      visitOrder: [...visitOrder],
      highlightedLines: [16, 17],
      stepLabel: "visit",
      description: `Visit node ${node.value} (children already processed).`,
    };
  }

  yield {
    type: "tree",
    visitedNodes: [...visitedNodes],
    activeNode: null,
    enteredNodes: [],
    visitOrder: [...visitOrder],
    highlightedLines: [19],
    stepLabel: "done",
    description: `Postorder traversal complete. Visit order: [${visitOrder.join(", ")}].`,
  };
}

export const postorderTraversal: TreeModule = {
  id: "postorder",
  name: "Postorder",
  category: "tree",
  presets: treePresets,
  code,
  codeLineCount: 21,
  codeByLanguage: {
    typescript: {
      code: tsCode,
      lineCount: 21,
      lineMap: {
        enter: [3, 4, 8, 9, 10, 11, 15],
        visit: [16, 17],
        done: [19],
      },
    },
    python: {
      code: pyCode,
      lineCount: 22,
      lineMap: {
        enter: [4, 5, 6, 10, 11],
        visit: [19, 20],
        done: [22],
      },
    },
    java: {
      code: javaCode,
      lineCount: 26,
      lineMap: {
        enter: [6, 7, 8, 9, 13, 14],
        visit: [21, 22],
        done: [24],
      },
    },
    cpp: {
      code: cppCode,
      lineCount: 31,
      lineMap: {
        enter: [9, 10, 11, 12, 16, 17, 18],
        visit: [25, 26, 27],
        done: [29],
      },
    },
  },
  codeAlternativeLabel: "Recursive",
  codeAlternative: `function postorder(root: TreeNode | null): number[] {
  if (root === null) return [];
  return [
    ...postorder(root.left ?? null),
    ...postorder(root.right ?? null),
    root.value,
  ];
}`,
  complexity: [
    { case: "Best",    time: "O(N)", space: "O(N)" },
    { case: "Average", time: "O(N)", space: "O(N)" },
    { case: "Worst",   time: "O(N)", space: "O(N)" },
  ],
  description: {
    what: "Postorder traversal visits nodes in Left → Right → Root order. Every node is processed only after both its children have been fully visited. This makes it a 'children before parent' traversal.",
    how: [
      "Use two stacks. Phase 1: pop from stack1, push to stack2, push left then right children to stack1.",
      "After stack1 is empty, stack2 holds all nodes in reverse postorder.",
      "Phase 2: pop from stack2 — each node popped has already had both children processed.",
      "The two-stack approach is the most straightforward iterative implementation for a generator engine.",
    ],
    implementation: [
      "The two-stack approach avoids the complexity of tracking 'has right child been visited' state that single-stack postorder requires.",
      "Space complexity is O(N) due to stack2 holding all nodes simultaneously — slightly worse than inorder/preorder.",
      "An alternative single-stack approach tracks a 'lastVisited' pointer but is harder to read and reason about.",
    ],
    useCases: [
      "Safely deleting a tree (children freed before parent — avoids dangling pointers).",
      "Evaluating postfix expression trees (operands before operators).",
      "Computing sizes of directories (leaf file sizes summed before parent folder).",
      "Dependency resolution where dependencies must be processed before dependents.",
    ],
    comparisonNote:
      "Postorder is the only traversal that guarantees children are fully processed before the parent — essential for deletion and bottom-up computations. Use inorder for sorted output from a BST, and preorder for top-down serialization.",
  },
  generator: postorderGenerator,
};
