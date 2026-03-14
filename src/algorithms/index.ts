import type { AlgorithmModule } from "@/engine/types";
import { bubbleSort } from "./bubble-sort";
import { selectionSort } from "./selection-sort";
import { insertionSort } from "./insertion-sort";
import { mergeSort } from "./merge-sort";
import { quickSort } from "./quick-sort";
import { heapSort } from "./heap-sort";
import { linearSearch } from "./linear-search";
import { binarySearch } from "./binary-search";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { inorderTraversal } from "./inorder-traversal";
import { preorderTraversal } from "./preorder-traversal";
import { postorderTraversal } from "./postorder-traversal";

const algorithmRegistry: Record<string, AlgorithmModule> = {
  "bubble-sort": bubbleSort,
  "selection-sort": selectionSort,
  "insertion-sort": insertionSort,
  "merge-sort": mergeSort,
  "quick-sort": quickSort,
  "heap-sort": heapSort,
  "linear-search": linearSearch,
  "binary-search": binarySearch,
  "bfs": bfs,
  "dfs": dfs,
  "inorder": inorderTraversal,
  "preorder": preorderTraversal,
  "postorder": postorderTraversal,
};

export function getAlgorithmById(id: string): AlgorithmModule | undefined {
  return algorithmRegistry[id];
}

export function getAllAlgorithms(): AlgorithmModule[] {
  return Object.values(algorithmRegistry);
}
