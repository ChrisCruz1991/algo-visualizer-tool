import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

// line 1: function bubbleSort(arr: number[]): number[] {
// line 2:   const n = arr.length;
// line 3:   for (let i = 0; i < n - 1; i++) {
// line 4:     for (let j = 0; j < n - i - 1; j++) {
// line 5:       if (arr[j] > arr[j + 1]) {
// line 6:         [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
// line 7:       }
// line 8:     }
// line 9:   }
// line 10:  return arr;
// line 11: }

const pyCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`;

// line 1: def bubble_sort(arr):
// line 2:     n = len(arr)
// line 3:     for i in range(n - 1):
// line 4:         for j in range(n - i - 1):
// line 5:             if arr[j] > arr[j + 1]:
// line 6:                 arr[j], arr[j + 1] = arr[j + 1], arr[j]
// line 7:     return arr

const javaCode = `public class BubbleSort {
  public static void sort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
      for (int j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  }
}`;

// line 1:  public class BubbleSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      int n = arr.length;
// line 4:      for (int i = 0; i < n - 1; i++) {
// line 5:        for (int j = 0; j < n - i - 1; j++) {
// line 6:          if (arr[j] > arr[j + 1]) {
// line 7:            int temp = arr[j];
// line 8:            arr[j] = arr[j + 1];
// line 9:            arr[j + 1] = temp;
// line 10:         }
// line 11:       }
// line 12:     }
// line 13:   }
// line 14: }

const cppCode = `#include <vector>
using namespace std;
class BubbleSort {
public:
  static void sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
      for (int j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          swap(arr[j], arr[j + 1]);
        }
      }
    }
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class BubbleSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      int n = arr.size();
// line 7:      for (int i = 0; i < n - 1; i++) {
// line 8:        for (int j = 0; j < n - i - 1; j++) {
// line 9:          if (arr[j] > arr[j + 1]) {
// line 10:           swap(arr[j], arr[j + 1]);
// line 11:         }
// line 12:       }
// line 13:     }
// line 14:   }
// line 15: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 11,
    lineMap: {
      compare: [5],
      swap: [6],
      done: [10],
    },
  },
  python: {
    code: pyCode,
    lineCount: 7,
    lineMap: {
      compare: [5],
      swap: [6],
      done: [7],
    },
  },
  java: {
    code: javaCode,
    lineCount: 14,
    lineMap: {
      compare: [6],
      swap: [7, 8, 9],
      done: [12],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 15,
    lineMap: {
      compare: [9],
      swap: [10],
      done: [13],
    },
  },
};

function* bubbleSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sorted],
        highlightedLines: [5],
        stepLabel: "compare",
        description: `Comparing index ${j} (value: ${arr[j]}) with index ${j + 1} (value: ${arr[j + 1]})`,
        comparisons,
        swaps,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sorted],
          highlightedLines: [6],
          stepLabel: "swap",
          description: `Swapping: ${arr[j + 1]} > ${arr[j]} — values at indices ${j} and ${j + 1} exchanged`,
          comparisons,
          swaps,
        };
      }
    }
    sorted.unshift(n - 1 - i);
  }

  sorted.unshift(0);
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sorted],
    highlightedLines: [10],
    stepLabel: "done",
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const bubbleSort: AlgorithmModule = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 11,
  codeByLanguage,
  generator: bubbleSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position on each pass.",
    how: [
      "Start at the beginning of the array.",
      "Compare the first two adjacent elements. If the left is greater than the right, swap them.",
      "Move one position forward and repeat the comparison.",
      "After one full pass, the largest element is at the end — mark it as sorted.",
      "Repeat for the remaining unsorted portion (n-1 passes total).",
    ],
    implementation: [
      "Use two nested loops: outer loop controls passes (0 to n-2), inner loop does comparisons (0 to n-i-2).",
      "The inner loop's upper bound shrinks each pass because the rightmost elements are already sorted.",
      "An optimization: track whether any swap occurred in a pass. If no swaps, the array is already sorted — exit early (achieves O(n) best case).",
    ],
    useCases: [
      "Educational purposes — its simplicity makes it ideal for teaching sorting concepts.",
      "Nearly-sorted small datasets where the early-exit optimization kicks in quickly.",
    ],
    comparisonNote:
      "Bubble Sort is rarely used in production. Prefer Insertion Sort for small or nearly-sorted arrays (same O(n²) worst case but fewer swaps and better cache performance). For general-purpose sorting, use Merge Sort or Quick Sort.",
  },
};
