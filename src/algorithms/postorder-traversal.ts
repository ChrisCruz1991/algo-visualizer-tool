import type { TreeModule, TreeStep, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const code = `function postorder(root: TreeNode | null): number[] {
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
