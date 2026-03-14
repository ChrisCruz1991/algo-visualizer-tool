import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    siftDown(arr, 0, i);
  }
  return arr;
}

function siftDown(arr: number[], root: number, end: number): void {
  while (true) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < end && arr[left] > arr[largest]) largest = left;
    if (right < end && arr[right] > arr[largest]) largest = right;
    if (largest === root) break;
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    root = largest;
  }
}`;

type State = { comparisons: number; swaps: number };

function* siftDownGen(
  arr: number[],
  root: number,
  end: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  let current = root;

  while (true) {
    let largest = current;
    const left = 2 * current + 1;
    const right = 2 * current + 2;

    const comparing: number[] = [current];
    if (left < end) comparing.push(left);
    if (right < end) comparing.push(right);

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: comparing,
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      highlightedLines: [18],
      description: `Sifting down from index ${current}: comparing with children at ${left < end ? left : "N/A"} and ${right < end ? right : "N/A"}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    if (left < end) {
      state.comparisons++;
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < end) {
      state.comparisons++;
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest === current) break;

    [arr[current], arr[largest]] = [arr[largest], arr[current]];
    state.swaps++;

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [current, largest],
      sortedIndices: [...sortedIndices],
      highlightedLines: [23],
      description: `Swapping ${arr[largest]} (index ${current}) with ${arr[current]} (index ${largest})`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    current = largest;
  }
}

function* heapSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  const state: State = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  // Phase 1: Build max-heap
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    highlightedLines: [3],
    description: "Phase 1: Building max-heap (heapifying from the middle down)",
    comparisons: 0,
    swaps: 0,
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDownGen(arr, i, n, state, sortedIndices);
  }

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    highlightedLines: [7],
    description: "Max-heap built! The largest element is now at index 0. Phase 2: Extracting elements.",
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  // Phase 2: Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    state.swaps++;
    sortedIndices.push(i);

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [0, i],
      sortedIndices: [...sortedIndices],
      highlightedLines: [8],
      description: `Extracting max (${arr[i]}): swapping root with index ${i}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    yield* siftDownGen(arr, 0, i, state, sortedIndices);
  }

  sortedIndices.push(0);
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    highlightedLines: [11],
    description: "Array is fully sorted!",
    comparisons: state.comparisons,
    swaps: state.swaps,
  };
}

export const heapSort: AlgorithmModule = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "sorting",
  code,
  codeLineCount: 25,
  generator: heapSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n log n)", space: "O(1)" },
    { case: "Average", time: "O(n log n)", space: "O(1)" },
    { case: "Worst", time: "O(n log n)", space: "O(1)" },
  ],
  description: {
    what: "Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the input, then repeatedly extracts the maximum element and rebuilds the heap. It achieves guaranteed O(n log n) time and O(1) extra space.",
    how: [
      "Phase 1 — Build max-heap: Rearrange the array into a max-heap, where every parent is greater than its children. Start heapifying from the last non-leaf node and work backwards.",
      "After heapification, the largest element is at index 0 (the root).",
      "Phase 2 — Extract: Swap the root (maximum) with the last element of the heap, reduce the heap size by 1, and restore the heap property with siftDown.",
      "Repeat the extraction until the heap has one element.",
    ],
    implementation: [
      "The heap is stored implicitly in the array: for node at index i, left child is 2i+1 and right child is 2i+2.",
      "siftDown compares a node with its children and swaps with the larger child, continuing down until the heap property is restored.",
      "The heapify phase runs from index floor(n/2)-1 down to 0 — leaf nodes don't need sifting.",
      "Heap Sort is not stable — equal elements may change relative order.",
    ],
    useCases: [
      "Systems with strict memory constraints — the O(1) space requirement is unmatched among O(n log n) algorithms.",
      "Real-time systems requiring guaranteed worst-case performance (unlike Quick Sort's O(n²) worst case).",
      "Priority queue operations — heapification is the foundation of all heap-based data structures.",
    ],
    comparisonNote:
      "Heap Sort guarantees O(n log n) and uses O(1) space, making it theoretically superior to Merge Sort and Quick Sort. In practice, it is slower due to poor cache performance (non-sequential memory access). Use Quick Sort for general purposes, Heap Sort when O(1) space and worst-case guarantees are critical.",
  },
};

