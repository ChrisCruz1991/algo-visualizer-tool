import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`;

// line 1:  function selectionSort(arr: number[]): number[] {
// line 2:    const n = arr.length;
// line 3:    for (let i = 0; i < n - 1; i++) {
// line 4:      let minIdx = i;
// line 5:      for (let j = i + 1; j < n; j++) {
// line 6:        if (arr[j] < arr[minIdx]) {
// line 7:          minIdx = j;
// line 8:        }
// line 9:      }
// line 10:     if (minIdx !== i) {
// line 11:       [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
// line 12:     }
// line 13:   }
// line 14:   return arr;
// line 15: }

const pyCode = `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`;

// line 1:  def selection_sort(arr):
// line 2:      n = len(arr)
// line 3:      for i in range(n - 1):
// line 4:          min_idx = i
// line 5:          for j in range(i + 1, n):
// line 6:              if arr[j] < arr[min_idx]:
// line 7:                  min_idx = j
// line 8:          if min_idx != i:
// line 9:              arr[i], arr[min_idx] = arr[min_idx], arr[i]
// line 10:     return arr

const javaCode = `public class SelectionSort {
  public static void sort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
      int minIdx = i;
      for (int j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx != i) {
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
      }
    }
  }
}`;

// line 1:  public class SelectionSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      int n = arr.length;
// line 4:      for (int i = 0; i < n - 1; i++) {
// line 5:        int minIdx = i;
// line 6:        for (int j = i + 1; j < n; j++) {
// line 7:          if (arr[j] < arr[minIdx]) {
// line 8:            minIdx = j;
// line 9:          }
// line 10:        }
// line 11:        if (minIdx != i) {
// line 12:          int temp = arr[i];
// line 13:          int arr[i] = arr[minIdx];
// line 14:          arr[minIdx] = temp;
// line 15:        }
// line 16:      }
// line 17:    }
// line 18:  }

const cppCode = `#include <vector>
using namespace std;
class SelectionSort {
public:
  static void sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
      int minIdx = i;
      for (int j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx != i) {
        swap(arr[i], arr[minIdx]);
      }
    }
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class SelectionSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      int n = arr.size();
// line 7:      for (int i = 0; i < n - 1; i++) {
// line 8:        int minIdx = i;
// line 9:        for (int j = i + 1; j < n; j++) {
// line 10:         if (arr[j] < arr[minIdx]) {
// line 11:           minIdx = j;
// line 12:         }
// line 13:       }
// line 14:       if (minIdx != i) {
// line 15:         swap(arr[i], arr[minIdx]);
// line 16:       }
// line 17:     }
// line 18:   }
// line 19: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 15,
    lineMap: {
      "scan-start": [4],
      compare: [6],
      "new-min": [7],
      swap: [11],
      done: [14],
    },
  },
  python: {
    code: pyCode,
    lineCount: 10,
    lineMap: {
      "scan-start": [4],
      compare: [6],
      "new-min": [7],
      swap: [9],
      done: [10],
    },
  },
  java: {
    code: javaCode,
    lineCount: 18,
    lineMap: {
      "scan-start": [5],
      compare: [7],
      "new-min": [8],
      swap: [12, 13, 14],
      done: [16],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 19,
    lineMap: {
      "scan-start": [8],
      compare: [10],
      "new-min": [11],
      swap: [15],
      done: [17],
    },
  },
};

function* selectionSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [i],
      swappingIndices: [],
      sortedIndices: [...sorted],
      highlightedLines: [4],
      stepLabel: "scan-start",
      description: `Pass ${i + 1}: Looking for the minimum in the unsorted portion starting at index ${i}`,
      comparisons,
      swaps,
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j, minIdx],
        swappingIndices: [],
        sortedIndices: [...sorted],
        highlightedLines: [5],
        stepLabel: "compare",
        description: `Comparing index ${j} (value: ${arr[j]}) with current minimum at index ${minIdx} (value: ${arr[minIdx]})`,
        comparisons,
        swaps,
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [minIdx],
          swappingIndices: [],
          sortedIndices: [...sorted],
          highlightedLines: [6],
          stepLabel: "new-min",
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
          comparisons,
          swaps,
        };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sorted],
        highlightedLines: [10],
        stepLabel: "swap",
        description: `Swapping minimum value ${arr[i]} (from index ${minIdx}) into position ${i}`,
        comparisons,
        swaps,
      };
    }

    sorted.push(i);
  }

  sorted.push(n - 1);
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sorted],
    highlightedLines: [14],
    stepLabel: "done",
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const selectionSort: AlgorithmModule = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 15,
  codeByLanguage,
  generator: selectionSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n²)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Selection Sort divides the array into a sorted and unsorted region. On each pass, it finds the minimum element in the unsorted region and moves it to the end of the sorted region. Unlike Bubble Sort, it makes at most n-1 swaps regardless of the input.",
    how: [
      "Start with the entire array as the unsorted region.",
      "Scan the unsorted region to find the index of the minimum value.",
      "Swap the minimum with the first element of the unsorted region.",
      "The sorted region grows by one element. Shrink the unsorted region.",
      "Repeat until the unsorted region has one element.",
    ],
    implementation: [
      "Outer loop runs from index 0 to n-2. At each step, index i is the boundary between sorted and unsorted.",
      "Inner loop scans from i+1 to n-1, tracking the index of the minimum value found so far.",
      "Only perform the swap if minIdx !== i (no unnecessary swaps for already-correct elements).",
      "Selection Sort always performs exactly O(n²) comparisons, but O(n) swaps — ideal when swapping is expensive.",
    ],
    useCases: [
      "Systems where write operations (swaps) are costly, such as flash memory.",
      "Small arrays where simplicity is valued over performance.",
    ],
    comparisonNote:
      "Selection Sort performs the same number of comparisons as Bubble Sort but fewer swaps. However, Insertion Sort is generally preferred for small arrays because it is adaptive (faster on nearly-sorted data). For large inputs, use Merge Sort or Quick Sort.",
  },
};
