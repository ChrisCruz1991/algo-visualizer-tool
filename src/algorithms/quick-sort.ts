import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

// line 1:  function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
// line 2:    if (low < high) {
// line 3:      const pivotIdx = partition(arr, low, high);
// line 4:      quickSort(arr, low, pivotIdx - 1);
// line 5:      quickSort(arr, pivotIdx + 1, high);
// line 6:    }
// line 7:    return arr;
// line 8:  }
// line 9:  (blank)
// line 10: function partition(arr: number[], low: number, high: number): number {
// line 11:   const pivot = arr[high];
// line 12:   let i = low - 1;
// line 13:   for (let j = low; j < high; j++) {
// line 14:     if (arr[j] <= pivot) {
// line 15:       i++;
// line 16:       [arr[i], arr[j]] = [arr[j], arr[i]];
// line 17:     }
// line 18:   }
// line 19:   [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
// line 20:   return i + 1;
// line 21: }  (but codeLineCount=20, so file ends at line 20 in original)
// Note: original had codeLineCount: 20 — code string has 20 lines (no trailing blank)

const pyCode = `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`;

// line 1:  def quick_sort(arr, low=0, high=None):
// line 2:      if high is None:
// line 3:          high = len(arr) - 1
// line 4:      if low < high:
// line 5:          pivot_idx = partition(arr, low, high)
// line 6:          quick_sort(arr, low, pivot_idx - 1)
// line 7:          quick_sort(arr, pivot_idx + 1, high)
// line 8:      return arr
// line 9:  (blank)
// line 10: def partition(arr, low, high):
// line 11:     pivot = arr[high]
// line 12:     i = low - 1
// line 13:     for j in range(low, high):
// line 14:         if arr[j] <= pivot:
// line 15:             i += 1
// line 16:             arr[i], arr[j] = arr[j], arr[i]
// line 17:     arr[i + 1], arr[high] = arr[high], arr[i + 1]
// line 18:     return i + 1

const javaCode = `public class QuickSort {
  public static void sort(int[] arr) {
    sort(arr, 0, arr.length - 1);
  }

  private static void sort(int[] arr, int low, int high) {
    if (low < high) {
      int pivotIdx = partition(arr, low, high);
      sort(arr, low, pivotIdx - 1);
      sort(arr, pivotIdx + 1, high);
    }
  }

  private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
  }
}`;

// line 1:  public class QuickSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      sort(arr, 0, arr.length - 1);
// line 4:    }
// line 5:  (blank)
// line 6:    private static void sort(int[] arr, int low, int high) {
// line 7:      if (low < high) {
// line 8:        int pivotIdx = partition(arr, low, high);
// line 9:        sort(arr, low, pivotIdx - 1);
// line 10:       sort(arr, pivotIdx + 1, high);
// line 11:     }
// line 12:   }
// line 13:  (blank)
// line 14:   private static int partition(int[] arr, int low, int high) {
// line 15:     int pivot = arr[high];
// line 16:     int i = low - 1;
// line 17:     for (int j = low; j < high; j++) {
// line 18:       if (arr[j] <= pivot) {
// line 19:         i++;
// line 20:         int temp = arr[i];
// line 21:         arr[i] = arr[j];
// line 22:         arr[j] = temp;
// line 23:       }
// line 24:     }
// line 25:     int temp = arr[i + 1];
// line 26:     arr[i + 1] = arr[high];
// line 27:     arr[high] = temp;
// line 28:     return i + 1;
// line 29:   }
// line 30: }

const cppCode = `#include <vector>
using namespace std;
class QuickSort {
public:
  static void sort(vector<int>& arr) {
    sort(arr, 0, (int)arr.size() - 1);
  }

  static void sort(vector<int>& arr, int low, int high) {
    if (low < high) {
      int pivotIdx = partition(arr, low, high);
      sort(arr, low, pivotIdx - 1);
      sort(arr, pivotIdx + 1, high);
    }
  }

  static int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        swap(arr[i], arr[j]);
      }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class QuickSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      sort(arr, 0, (int)arr.size() - 1);
// line 7:    }
// line 8:  (blank)
// line 9:    static void sort(vector<int>& arr, int low, int high) {
// line 10:     if (low < high) {
// line 11:       int pivotIdx = partition(arr, low, high);
// line 12:       sort(arr, low, pivotIdx - 1);
// line 13:       sort(arr, pivotIdx + 1, high);
// line 14:     }
// line 15:   }
// line 16:  (blank)
// line 17:   static int partition(vector<int>& arr, int low, int high) {
// line 18:     int pivot = arr[high];
// line 19:     int i = low - 1;
// line 20:     for (int j = low; j < high; j++) {
// line 21:       if (arr[j] <= pivot) {
// line 22:         i++;
// line 23:         swap(arr[i], arr[j]);
// line 24:       }
// line 25:     }
// line 26:     swap(arr[i + 1], arr[high]);
// line 27:     return i + 1;
// line 28:   }
// line 29: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 20,
    lineMap: {
      pivot: [11],
      compare: [14],
      swap: [16],
      "place-pivot": [19],
      done: [7],
    },
  },
  python: {
    code: pyCode,
    lineCount: 18,
    lineMap: {
      pivot: [11],
      compare: [14],
      swap: [16],
      "place-pivot": [17],
      done: [8],
    },
  },
  java: {
    code: javaCode,
    lineCount: 30,
    lineMap: {
      pivot: [15],
      compare: [18],
      swap: [20, 21, 22],
      "place-pivot": [25, 26, 27],
      done: [11],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 29,
    lineMap: {
      pivot: [18],
      compare: [21],
      swap: [23],
      "place-pivot": [26],
      done: [13],
    },
  },
};

// --- Alternative (Iterative) code strings ---

const tsAltCode = `function quickSort(arr: number[]): number[] {
  const stack: Array<[number, number]> = [[0, arr.length - 1]];
  while (stack.length > 0) {
    const [low, high] = stack.pop()!;
    if (low < high) {
      const pivotIdx = partition(arr, low, high);
      stack.push([low, pivotIdx - 1]);
      stack.push([pivotIdx + 1, high]);
    }
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

const pyAltCode = `def quick_sort(arr):
    stack = [(0, len(arr) - 1)]
    while stack:
        low, high = stack.pop()
        if low < high:
            pivot_idx = partition(arr, low, high)
            stack.append((low, pivot_idx - 1))
            stack.append((pivot_idx + 1, high))
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`;

const javaAltCode = `public class QuickSort {
  public static void sort(int[] arr) {
    Deque<int[]> stack = new ArrayDeque<>();
    stack.push(new int[]{0, arr.length - 1});
    while (!stack.isEmpty()) {
      int[] range = stack.pop();
      int low = range[0], high = range[1];
      if (low < high) {
        int pivotIdx = partition(arr, low, high);
        stack.push(new int[]{low, pivotIdx - 1});
        stack.push(new int[]{pivotIdx + 1, high});
      }
    }
  }

  private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
      }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
  }
}`;

const cppAltCode = `#include <vector>
#include <stack>
using namespace std;
class QuickSort {
public:
  static void sort(vector<int>& arr) {
    stack<pair<int,int>> st;
    st.push({0, (int)arr.size() - 1});
    while (!st.empty()) {
      auto [low, high] = st.top(); st.pop();
      if (low < high) {
        int pivotIdx = partition(arr, low, high);
        st.push({low, pivotIdx - 1});
        st.push({pivotIdx + 1, high});
      }
    }
  }

  static int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (arr[j] <= pivot) { i++; swap(arr[i], arr[j]); }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
  }
};`;

const codeAlternativeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsAltCode,
    lineCount: 24,
    lineMap: {
      pivot: [14],
      compare: [17],
      swap: [19],
      "place-pivot": [22],
      done: [10],
    },
  },
  python: {
    code: pyAltCode,
    lineCount: 19,
    lineMap: {
      pivot: [12],
      compare: [15],
      swap: [16],
      "place-pivot": [18],
      done: [8],
    },
  },
  java: {
    code: javaAltCode,
    lineCount: 26,
    lineMap: {
      pivot: [16],
      compare: [19],
      swap: [21],
      "place-pivot": [23],
      done: [12],
    },
  },
  cpp: {
    code: cppAltCode,
    lineCount: 28,
    lineMap: {
      pivot: [19],
      compare: [22],
      swap: [22],
      "place-pivot": [24],
      done: [15],
    },
  },
};

type State = { comparisons: number; swaps: number };

function* partitionStep(
  arr: number[],
  low: number,
  high: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep, number> {
  const pivot = arr[high];
  let i = low - 1;

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [high],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    highlightedLines: [10],
    stepLabel: "pivot",
    description: `Partitioning indices ${low}–${high}. Pivot = ${pivot} (index ${high})`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  for (let j = low; j < high; j++) {
    state.comparisons++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [j, high],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      highlightedLines: [13],
      stepLabel: "compare",
      description: `Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        state.swaps++;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [high],
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
          highlightedLines: [15],
          stepLabel: "swap",
          description: `${arr[j]} ≤ pivot ${pivot}: swapping indices ${i} and ${j}`,
          comparisons: state.comparisons,
          swaps: state.swaps,
        };
      }
    }
  }

  // Place pivot in final position
  const pivotIdx = i + 1;
  if (pivotIdx !== high) {
    [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
    state.swaps++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [pivotIdx, high],
      sortedIndices: [...sortedIndices],
      highlightedLines: [18],
      stepLabel: "place-pivot",
      description: `Placing pivot ${pivot} at its final position (index ${pivotIdx})`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };
  }

  sortedIndices.push(pivotIdx);

  return pivotIdx;
}

function* quickSortHelper(
  arr: number[],
  low: number,
  high: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  if (low >= high) {
    if (low === high) sortedIndices.push(low);
    return;
  }

  const pivotIdx: number = yield* partitionStep(arr, low, high, state, sortedIndices);

  yield* quickSortHelper(arr, low, pivotIdx - 1, state, sortedIndices);
  yield* quickSortHelper(arr, pivotIdx + 1, high, state, sortedIndices);
}

function* quickSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const state: State = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  yield* quickSortHelper(arr, 0, arr.length - 1, state, sortedIndices);

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    highlightedLines: [6],
    stepLabel: "done",
    description: "Array is fully sorted!",
    comparisons: state.comparisons,
    swaps: state.swaps,
  };
}

export const quickSort: AlgorithmModule = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 20,
  codeByLanguage,
  codeAlternativeLabel: "Iterative",
  codeAlternative: tsAltCode,
  codeAlternativeByLanguage,
  generator: quickSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n log n)", space: "O(log n)" },
    { case: "Average", time: "O(n log n)", space: "O(log n)" },
    { case: "Worst", time: "O(n²)", space: "O(n)" },
  ],
  description: {
    what: "Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element, partitions the array into elements less than and greater than the pivot, then recursively sorts each partition. It is the most widely used sorting algorithm in practice.",
    how: [
      "Choose a pivot element (this implementation uses the last element).",
      "Partition: rearrange the array so all elements ≤ pivot are to its left, and all elements > pivot are to its right.",
      "The pivot is now in its final sorted position.",
      "Recursively apply Quick Sort to the left and right partitions.",
      "Base case: partitions of size 0 or 1 are already sorted.",
    ],
    implementation: [
      "The partition function uses the Lomuto scheme: pivot is the last element, and a pointer i tracks the boundary of the 'less-than' region.",
      "For each element j, if arr[j] ≤ pivot, increment i and swap arr[i] with arr[j].",
      "After the loop, swap the pivot (arr[high]) with arr[i+1] to place it in its final position.",
      "Pivot choice matters: random pivots or median-of-three avoid the O(n²) worst case on sorted inputs.",
    ],
    useCases: [
      "General-purpose in-memory sorting — used in C's qsort, Java's Arrays.sort for primitives, and many standard libraries.",
      "Cache-friendly access patterns make it faster than Merge Sort in practice despite the same asymptotic complexity.",
    ],
    comparisonNote:
      "Quick Sort is typically the fastest practical sorting algorithm but has O(n²) worst case on already-sorted data with a bad pivot choice. Merge Sort guarantees O(n log n) and is stable but uses O(n) extra space. For a guaranteed-O(n log n) in-place sort, use Heap Sort.",
  },
};
