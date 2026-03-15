import type { TreeModule, TreeStep, TreeNode, PresetTree } from "@/engine/types";
import { treePresets } from "@/data/presets/trees";

const code = `function inorder(root: TreeNode | null): number[] {
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
