import type { TreeModule, TreeStep, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const code = `function preorder(root: TreeNode | null): number[] {
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
