import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function heapSort(arr: number[]): number[] {
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

// line 1:  function heapSort(arr: number[]): number[] {
// line 2:    const n = arr.length;
// line 3:    // Build max-heap
// line 4:    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
// line 5:      siftDown(arr, i, n);
// line 6:    }
// line 7:    // Extract elements from heap
// line 8:    for (let i = n - 1; i > 0; i--) {
// line 9:      [arr[0], arr[i]] = [arr[i], arr[0]];
// line 10:     siftDown(arr, 0, i);
// line 11:   }
// line 12:   return arr;
// line 13: }
// line 14: (blank)
// line 15: function siftDown(arr: number[], root: number, end: number): void {
// line 16:   while (true) {
// line 17:     let largest = root;
// line 18:     const left = 2 * root + 1;
// line 19:     const right = 2 * root + 2;
// line 20:     if (left < end && arr[left] > arr[largest]) largest = left;
// line 21:     if (right < end && arr[right] > arr[largest]) largest = right;
// line 22:     if (largest === root) break;
// line 23:     [arr[root], arr[largest]] = [arr[largest], arr[root]];
// line 24:     root = largest;
// line 25:   }
// line 26: }
// Note: original codeLineCount was 25 but code string has 26 lines — keep as 25 to match original

const pyCode = `def heap_sort(arr):
    n = len(arr)
    # Build max-heap
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)
    # Extract elements from heap
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, 0, i)
    return arr

def sift_down(arr, root, end):
    while True:
        largest = root
        left = 2 * root + 1
        right = 2 * root + 2
        if left < end and arr[left] > arr[largest]:
            largest = left
        if right < end and arr[right] > arr[largest]:
            largest = right
        if largest == root:
            break
        arr[root], arr[largest] = arr[largest], arr[root]
        root = largest`;

// line 1:  def heap_sort(arr):
// line 2:      n = len(arr)
// line 3:      # Build max-heap
// line 4:      for i in range(n // 2 - 1, -1, -1):
// line 5:          sift_down(arr, i, n)
// line 6:      # Extract elements from heap
// line 7:      for i in range(n - 1, 0, -1):
// line 8:          arr[0], arr[i] = arr[i], arr[0]
// line 9:          sift_down(arr, 0, i)
// line 10:     return arr
// line 11: (blank)
// line 12: def sift_down(arr, root, end):
// line 13:     while True:
// line 14:         largest = root
// line 15:         left = 2 * root + 1
// line 16:         right = 2 * root + 2
// line 17:         if left < end and arr[left] > arr[largest]:
// line 18:             largest = left
// line 19:         if right < end and arr[right] > arr[largest]:
// line 20:             largest = right
// line 21:         if largest == root:
// line 22:             break
// line 23:         arr[root], arr[largest] = arr[largest], arr[root]
// line 24:         root = largest

const javaCode = `public class HeapSort {
  public static void sort(int[] arr) {
    int n = arr.length;
    // Build max-heap
    for (int i = n / 2 - 1; i >= 0; i--) {
      siftDown(arr, i, n);
    }
    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {
      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      siftDown(arr, 0, i);
    }
  }

  private static void siftDown(int[] arr, int root, int end) {
    while (true) {
      int largest = root;
      int left = 2 * root + 1;
      int right = 2 * root + 2;
      if (left < end && arr[left] > arr[largest]) largest = left;
      if (right < end && arr[right] > arr[largest]) largest = right;
      if (largest == root) break;
      int temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;
      root = largest;
    }
  }
}`;

// line 1:  public class HeapSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      int n = arr.length;
// line 4:      // Build max-heap
// line 5:      for (int i = n / 2 - 1; i >= 0; i--) {
// line 6:        siftDown(arr, i, n);
// line 7:      }
// line 8:      // Extract elements from heap
// line 9:      for (int i = n - 1; i > 0; i--) {
// line 10:       int temp = arr[0];
// line 11:       arr[0] = arr[i];
// line 12:       arr[i] = temp;
// line 13:       siftDown(arr, 0, i);
// line 14:     }
// line 15:   }
// line 16:  (blank)
// line 17:   private static void siftDown(int[] arr, int root, int end) {
// line 18:     while (true) {
// line 19:       int largest = root;
// line 20:       int left = 2 * root + 1;
// line 21:       int right = 2 * root + 2;
// line 22:       if (left < end && arr[left] > arr[largest]) largest = left;
// line 23:       if (right < end && arr[right] > arr[largest]) largest = right;
// line 24:       if (largest == root) break;
// line 25:       int temp = arr[root];
// line 26:       arr[root] = arr[largest];
// line 27:       arr[largest] = temp;
// line 28:       root = largest;
// line 29:     }
// line 30:   }
// line 31: }

const cppCode = `#include <vector>
using namespace std;
class HeapSort {
public:
  static void sort(vector<int>& arr) {
    int n = arr.size();
    // Build max-heap
    for (int i = n / 2 - 1; i >= 0; i--) {
      siftDown(arr, i, n);
    }
    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {
      swap(arr[0], arr[i]);
      siftDown(arr, 0, i);
    }
  }

  static void siftDown(vector<int>& arr, int root, int end) {
    while (true) {
      int largest = root;
      int left = 2 * root + 1;
      int right = 2 * root + 2;
      if (left < end && arr[left] > arr[largest]) largest = left;
      if (right < end && arr[right] > arr[largest]) largest = right;
      if (largest == root) break;
      swap(arr[root], arr[largest]);
      root = largest;
    }
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class HeapSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      int n = arr.size();
// line 7:      // Build max-heap
// line 8:      for (int i = n / 2 - 1; i >= 0; i--) {
// line 9:        siftDown(arr, i, n);
// line 10:     }
// line 11:     // Extract elements from heap
// line 12:     for (int i = n - 1; i > 0; i--) {
// line 13:       swap(arr[0], arr[i]);
// line 14:       siftDown(arr, 0, i);
// line 15:     }
// line 16:   }
// line 17:  (blank)
// line 18:   static void siftDown(vector<int>& arr, int root, int end) {
// line 19:     while (true) {
// line 20:       int largest = root;
// line 21:       int left = 2 * root + 1;
// line 22:       int right = 2 * root + 2;
// line 23:       if (left < end && arr[left] > arr[largest]) largest = left;
// line 24:       if (right < end && arr[right] > arr[largest]) largest = right;
// line 25:       if (largest == root) break;
// line 26:       swap(arr[root], arr[largest]);
// line 27:       root = largest;
// line 28:     }
// line 29:   }
// line 30: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 26,
    lineMap: {
      "build-heap": [4],
      sift: [20, 21],
      "sift-swap": [23],
      extract: [9],
      done: [12],
    },
  },
  python: {
    code: pyCode,
    lineCount: 24,
    lineMap: {
      "build-heap": [4],
      sift: [17, 19],
      "sift-swap": [23],
      extract: [8],
      done: [10],
    },
  },
  java: {
    code: javaCode,
    lineCount: 31,
    lineMap: {
      "build-heap": [5],
      sift: [22, 23],
      "sift-swap": [25, 26, 27],
      extract: [10, 11, 12],
      done: [14],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 30,
    lineMap: {
      "build-heap": [8],
      sift: [23, 24],
      "sift-swap": [26],
      extract: [13],
      done: [15],
    },
  },
};

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
      stepLabel: "sift",
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
      stepLabel: "sift-swap",
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
    stepLabel: "build-heap",
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
    stepLabel: "extract",
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
      stepLabel: "extract",
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
    stepLabel: "done",
    description: "Array is fully sorted!",
    comparisons: state.comparisons,
    swaps: state.swaps,
  };
}

export const heapSort: AlgorithmModule = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 25,
  codeByLanguage,
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
