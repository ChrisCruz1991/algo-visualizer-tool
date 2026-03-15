import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

// line 1:  function insertionSort(arr: number[]): number[] {
// line 2:    for (let i = 1; i < arr.length; i++) {
// line 3:      const key = arr[i];
// line 4:      let j = i - 1;
// line 5:      while (j >= 0 && arr[j] > key) {
// line 6:        arr[j + 1] = arr[j];
// line 7:        j--;
// line 8:      }
// line 9:      arr[j + 1] = key;
// line 10:   }
// line 11:   return arr;
// line 12: }

const pyCode = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`;

// line 1:  def insertion_sort(arr):
// line 2:      for i in range(1, len(arr)):
// line 3:          key = arr[i]
// line 4:          j = i - 1
// line 5:          while j >= 0 and arr[j] > key:
// line 6:              arr[j + 1] = arr[j]
// line 7:              j -= 1
// line 8:          arr[j + 1] = key
// line 9:      return arr

const javaCode = `public class InsertionSort {
  public static void sort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
      int key = arr[i];
      int j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
  }
}`;

// line 1:  public class InsertionSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      for (int i = 1; i < arr.length; i++) {
// line 4:        int key = arr[i];
// line 5:        int j = i - 1;
// line 6:        while (j >= 0 && arr[j] > key) {
// line 7:          arr[j + 1] = arr[j];
// line 8:          j--;
// line 9:        }
// line 10:       arr[j + 1] = key;
// line 11:     }
// line 12:   }
// line 13: }

const cppCode = `#include <vector>
using namespace std;
class InsertionSort {
public:
  static void sort(vector<int>& arr) {
    for (int i = 1; i < (int)arr.size(); i++) {
      int key = arr[i];
      int j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class InsertionSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      for (int i = 1; i < (int)arr.size(); i++) {
// line 7:        int key = arr[i];
// line 8:        int j = i - 1;
// line 9:        while (j >= 0 && arr[j] > key) {
// line 10:         arr[j + 1] = arr[j];
// line 11:         j--;
// line 12:       }
// line 13:       arr[j + 1] = key;
// line 14:     }
// line 15:   }
// line 16: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 12,
    lineMap: {
      "pick-key": [3],
      shift: [6],
      insert: [9],
      done: [11],
    },
  },
  python: {
    code: pyCode,
    lineCount: 9,
    lineMap: {
      "pick-key": [3],
      shift: [6],
      insert: [8],
      done: [9],
    },
  },
  java: {
    code: javaCode,
    lineCount: 13,
    lineMap: {
      "pick-key": [4],
      shift: [7],
      insert: [10],
      done: [11],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 16,
    lineMap: {
      "pick-key": [7],
      shift: [10],
      insert: [13],
      done: [14],
    },
  },
};

function* insertionSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // Initially index 0 is "sorted"
  const sorted: number[] = [0];

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [i],
      swappingIndices: [],
      sortedIndices: [...sorted],
      highlightedLines: [3],
      stepLabel: "pick-key",
      description: `Picking up key = ${key} at index ${i} to insert into the sorted portion`,
      comparisons,
      swaps,
    };

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arr[j + 1] = arr[j];
      swaps++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j],
        swappingIndices: [j + 1],
        sortedIndices: sorted.filter((s) => s < j),
        highlightedLines: [6],
        stepLabel: "shift",
        description: `Shifting ${arr[j + 1]} from index ${j} to index ${j + 1} to make room for ${key}`,
        comparisons,
        swaps,
      };
      j--;
    }

    if (j + 1 !== i) {
      arr[j + 1] = key;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [j + 1],
        sortedIndices: [...sorted, j + 1].sort((a, b) => a - b),
        highlightedLines: [9],
        stepLabel: "insert",
        description: `Inserting ${key} at index ${j + 1}`,
        comparisons,
        swaps,
      };
    }

    sorted.push(i);
    sorted.sort((a, b) => a - b);
  }

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    highlightedLines: [11],
    stepLabel: "done",
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const insertionSort: AlgorithmModule = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 12,
  codeByLanguage,
  generator: insertionSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Insertion Sort builds a sorted array one element at a time by picking each element and inserting it into its correct position within the already-sorted portion. It mimics the way people sort playing cards in their hand.",
    how: [
      "Start with the first element — a single-element array is trivially sorted.",
      "Pick the next element (the 'key').",
      "Scan backwards through the sorted portion, shifting each element one position right while it is greater than the key.",
      "Insert the key into the gap left by the shifts.",
      "Repeat until all elements have been inserted.",
    ],
    implementation: [
      "Outer loop starts at index 1, treating index 0 as already sorted.",
      "Inner while loop shifts elements right as long as they exceed the key.",
      "The key is placed at j+1 after the while loop exits — this is where the gap is.",
      "Unlike Bubble Sort, Insertion Sort moves elements with assignments (not swaps), which is faster in practice.",
    ],
    useCases: [
      "Small arrays (n < 50) — used as the base case in hybrid sorts like Timsort and Introsort.",
      "Nearly-sorted data — achieves O(n) time when the array is already almost sorted.",
      "Online sorting — can sort a stream of data as it arrives, one element at a time.",
    ],
    comparisonNote:
      "Insertion Sort is generally the best simple O(n²) algorithm. It outperforms Bubble Sort and Selection Sort on nearly-sorted data and is the algorithm of choice for small sub-arrays in production sort implementations (e.g., Python's Timsort uses it for runs shorter than 64 elements).",
  },
};
