import type { AlgorithmModule, SortStep, SupportedLanguage, CodeEntry } from "@/engine/types";


const tsCode = `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`;

// line 1:  function mergeSort(arr: number[]): number[] {
// line 2:    if (arr.length <= 1) return arr;
// line 3:    const mid = Math.floor(arr.length / 2);
// line 4:    const left = mergeSort(arr.slice(0, mid));
// line 5:    const right = mergeSort(arr.slice(mid));
// line 6:    return merge(left, right);
// line 7:  }
// line 8:  (blank)
// line 9:  function merge(left: number[], right: number[]): number[] {
// line 10:   const result: number[] = [];
// line 11:   let i = 0, j = 0;
// line 12:   while (i < left.length && j < right.length) {
// line 13:     if (left[i] <= right[j]) {
// line 14:       result.push(left[i++]);
// line 15:     } else {
// line 16:       result.push(right[j++]);
// line 17:     }
// line 18:   }
// line 19:   return result.concat(left.slice(i)).concat(right.slice(j));
// line 20: }

const pyCode = `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]`;

// line 1:  def merge_sort(arr):
// line 2:      if len(arr) <= 1:
// line 3:          return arr
// line 4:      mid = len(arr) // 2
// line 5:      left = merge_sort(arr[:mid])
// line 6:      right = merge_sort(arr[mid:])
// line 7:      return merge(left, right)
// line 8:  (blank)
// line 9:  def merge(left, right):
// line 10:     result = []
// line 11:     i = j = 0
// line 12:     while i < len(left) and j < len(right):
// line 13:         if left[i] <= right[j]:
// line 14:             result.append(left[i])
// line 15:             i += 1
// line 16:         else:
// line 17:             result.append(right[j])
// line 18:             j += 1
// line 19:     return result + left[i:] + right[j:]

const javaCode = `public class MergeSort {
  public static void sort(int[] arr) {
    if (arr.length <= 1) return;
    int mid = arr.length / 2;
    int[] left = new int[mid];
    int[] right = new int[arr.length - mid];
    System.arraycopy(arr, 0, left, 0, mid);
    System.arraycopy(arr, mid, right, 0, arr.length - mid);
    sort(left);
    sort(right);
    merge(arr, left, right);
  }

  private static void merge(int[] arr, int[] left, int[] right) {
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
  }
}`;

// line 1:  public class MergeSort {
// line 2:    public static void sort(int[] arr) {
// line 3:      if (arr.length <= 1) return;
// line 4:      int mid = arr.length / 2;
// line 5:      int[] left = new int[mid];
// line 6:      int[] right = new int[arr.length - mid];
// line 7:      System.arraycopy(arr, 0, left, 0, mid);
// line 8:      System.arraycopy(arr, mid, right, 0, arr.length - mid);
// line 9:      sort(left);
// line 10:     sort(right);
// line 11:     merge(arr, left, right);
// line 12:   }
// line 13:  (blank)
// line 14:   private static void merge(int[] arr, int[] left, int[] right) {
// line 15:     int i = 0, j = 0, k = 0;
// line 16:     while (i < left.length && j < right.length) {
// line 17:       if (left[i] <= right[j]) {
// line 18:         arr[k++] = left[i++];
// line 19:       } else {
// line 20:         arr[k++] = right[j++];
// line 21:       }
// line 22:     }
// line 23:     while (i < left.length) arr[k++] = left[i++];
// line 24:     while (j < right.length) arr[k++] = right[j++];
// line 25:   }
// line 26: }

const cppCode = `#include <vector>
using namespace std;
class MergeSort {
public:
  static void sort(vector<int>& arr) {
    if (arr.size() <= 1) return;
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    sort(left);
    sort(right);
    merge(arr, left, right);
  }

  static void merge(vector<int>& arr,
                    vector<int>& left, vector<int>& right) {
    int i = 0, j = 0, k = 0;
    while (i < (int)left.size() && j < (int)right.size()) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
    }
    while (i < (int)left.size()) arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
  }
};`;

// line 1:  #include <vector>
// line 2:  using namespace std;
// line 3:  class MergeSort {
// line 4:  public:
// line 5:    static void sort(vector<int>& arr) {
// line 6:      if (arr.size() <= 1) return;
// line 7:      int mid = arr.size() / 2;
// line 8:      vector<int> left(arr.begin(), arr.begin() + mid);
// line 9:      vector<int> right(arr.begin() + mid, arr.end());
// line 10:     sort(left);
// line 11:     sort(right);
// line 12:     merge(arr, left, right);
// line 13:   }
// line 14:  (blank)
// line 15:   static void merge(vector<int>& arr,
// line 16:                     vector<int>& left, vector<int>& right) {
// line 17:     int i = 0, j = 0, k = 0;
// line 18:     while (i < (int)left.size() && j < (int)right.size()) {
// line 19:       if (left[i] <= right[j]) {
// line 20:         arr[k++] = left[i++];
// line 21:       } else {
// line 22:         arr[k++] = right[j++];
// line 23:       }
// line 24:     }
// line 25:     while (i < (int)left.size()) arr[k++] = left[i++];
// line 26:     while (j < (int)right.size()) arr[k++] = right[j++];
// line 27:   }
// line 28: };

const codeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsCode,
    lineCount: 20,
    lineMap: {
      divide: [3],
      compare: [13],
      place: [14],
      "merge-done": [19],
      done: [6],
    },
  },
  python: {
    code: pyCode,
    lineCount: 19,
    lineMap: {
      divide: [4],
      compare: [13],
      place: [14],
      "merge-done": [19],
      done: [7],
    },
  },
  java: {
    code: javaCode,
    lineCount: 26,
    lineMap: {
      divide: [4],
      compare: [17],
      place: [18],
      "merge-done": [23],
      done: [11],
    },
  },
  cpp: {
    code: cppCode,
    lineCount: 28,
    lineMap: {
      divide: [7],
      compare: [19],
      place: [20],
      "merge-done": [25],
      done: [12],
    },
  },
};

// --- Alternative (Iterative) code strings ---

const tsAltCode = `function mergeSort(arr: number[]): number[] {
  const n = arr.length;
  for (let size = 1; size < n; size *= 2) {
    for (let left = 0; left < n - size; left += size * 2) {
      const mid = left + size;
      const right = Math.min(left + size * 2, n);
      merge(arr, left, mid, right);
    }
  }
  return arr;
}

function merge(arr: number[], left: number, mid: number, right: number): void {
  const leftArr = arr.slice(left, mid);
  const rightArr = arr.slice(mid, right);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];
    else arr[k++] = rightArr[j++];
  }
  while (i < leftArr.length) arr[k++] = leftArr[i++];
  while (j < rightArr.length) arr[k++] = rightArr[j++];
}`;

const pyAltCode = `def merge_sort(arr):
    n = len(arr)
    size = 1
    while size < n:
        for left in range(0, n - size, size * 2):
            mid = left + size
            right = min(left + size * 2, n)
            merge(arr, left, mid, right)
        size *= 2
    return arr

def merge(arr, left, mid, right):
    left_arr = arr[left:mid]
    right_arr = arr[mid:right]
    i = j = 0
    k = left
    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1
    while i < len(left_arr):
        arr[k] = left_arr[i]
        i += 1
        k += 1
    while j < len(right_arr):
        arr[k] = right_arr[j]
        j += 1
        k += 1`;

const javaAltCode = `public class MergeSort {
  public static void sort(int[] arr) {
    int n = arr.length;
    for (int size = 1; size < n; size *= 2) {
      for (int left = 0; left < n - size; left += size * 2) {
        int mid = left + size;
        int right = Math.min(left + size * 2, n);
        merge(arr, left, mid, right);
      }
    }
  }

  private static void merge(int[] arr, int left, int mid, int right) {
    int[] leftArr = Arrays.copyOfRange(arr, left, mid);
    int[] rightArr = Arrays.copyOfRange(arr, mid, right);
    int i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];
      else arr[k++] = rightArr[j++];
    }
    while (i < leftArr.length) arr[k++] = leftArr[i++];
    while (j < rightArr.length) arr[k++] = rightArr[j++];
  }
}`;

const cppAltCode = `#include <vector>
using namespace std;
class MergeSort {
public:
  static void sort(vector<int>& arr) {
    int n = arr.size();
    for (int size = 1; size < n; size *= 2) {
      for (int left = 0; left < n - size; left += size * 2) {
        int mid = left + size;
        int right = min(left + size * 2, n);
        merge(arr, left, mid, right);
      }
    }
  }

  static void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> leftArr(arr.begin() + left, arr.begin() + mid);
    vector<int> rightArr(arr.begin() + mid, arr.begin() + right);
    int i = 0, j = 0, k = left;
    while (i < (int)leftArr.size() && j < (int)rightArr.size()) {
      if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];
      else arr[k++] = rightArr[j++];
    }
    while (i < (int)leftArr.size()) arr[k++] = leftArr[i++];
    while (j < (int)rightArr.size()) arr[k++] = rightArr[j++];
  }
};`;

const codeAlternativeByLanguage: Record<SupportedLanguage, CodeEntry> = {
  typescript: {
    code: tsAltCode,
    lineCount: 22,
    lineMap: {
      divide: [3, 4],
      compare: [17],
      place: [17],
      "merge-done": [20],
      done: [9],
    },
  },
  python: {
    code: pyAltCode,
    lineCount: 30,
    lineMap: {
      divide: [4, 5],
      compare: [17],
      place: [18],
      "merge-done": [25],
      done: [9],
    },
  },
  java: {
    code: javaAltCode,
    lineCount: 23,
    lineMap: {
      divide: [4, 5],
      compare: [17],
      place: [17],
      "merge-done": [20],
      done: [10],
    },
  },
  cpp: {
    code: cppAltCode,
    lineCount: 27,
    lineMap: {
      divide: [7, 8],
      compare: [20],
      place: [20],
      "merge-done": [23],
      done: [13],
    },
  },
};

type State = { comparisons: number; swaps: number };

function* mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  if (right - left <= 1) return;

  const mid = Math.floor((left + right) / 2);

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: Array.from({ length: right - left }, (_, i) => left + i),
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    highlightedLines: [3],
    stepLabel: "divide",
    description: `Dividing: splitting indices ${left}–${right - 1} at midpoint ${mid}`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  yield* mergeSortHelper(arr, left, mid, state, sortedIndices);
  yield* mergeSortHelper(arr, mid, right, state, sortedIndices);
  yield* mergeStep(arr, left, mid, right, state, sortedIndices);
}

function* mergeStep(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  const leftArr = arr.slice(left, mid);
  const rightArr = arr.slice(mid, right);
  let i = 0,
    j = 0,
    k = left;

  while (i < leftArr.length && j < rightArr.length) {
    state.comparisons++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [left + i, mid + j],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      highlightedLines: [13],
      stepLabel: "compare",
      description: `Merging: comparing ${leftArr[i]} (left[${i}]) with ${rightArr[j]} (right[${j}])`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    state.swaps++;
    k++;

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [k - 1],
      sortedIndices: [...sortedIndices],
      highlightedLines: [14],
      stepLabel: "place",
      description: `Placing ${arr[k - 1]} at index ${k - 1}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    state.swaps++;
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    state.swaps++;
    j++;
    k++;
  }

  // Mark this merged region as sorted if it covers the full array segment
  const newSorted = [...sortedIndices];
  for (let idx = left; idx < right; idx++) {
    if (!newSorted.includes(idx)) newSorted.push(idx);
  }

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: newSorted,
    highlightedLines: [19],
    stepLabel: "merge-done",
    description: `Merged indices ${left}–${right - 1} into sorted order`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  // Update the caller's sorted tracking
  for (const idx of newSorted) {
    if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
  }
}

function* mergeSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const state: State = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  yield* mergeSortHelper(arr, 0, arr.length, state, sortedIndices);

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

export const mergeSort: AlgorithmModule = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  code: tsCode,
  codeLineCount: 20,
  codeByLanguage,
  codeAlternativeLabel: "Iterative",
  codeAlternative: tsAltCode,
  codeAlternativeByLanguage,
  generator: mergeSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n log n)", space: "O(n)" },
    { case: "Average", time: "O(n log n)", space: "O(n)" },
    { case: "Worst", time: "O(n log n)", space: "O(n)" },
  ],
  description: {
    what: "Merge Sort is a divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and then merges the two sorted halves back together. It guarantees O(n log n) performance in all cases.",
    how: [
      "Divide: Split the array into two halves at the midpoint.",
      "Conquer: Recursively sort each half (base case: an array of 0 or 1 element is already sorted).",
      "Merge: Combine the two sorted halves by repeatedly taking the smaller of the two front elements.",
      "The merge step produces a fully sorted array from two sorted sub-arrays.",
    ],
    implementation: [
      "The recursive split continues until sub-arrays have length 1.",
      "The merge function uses two pointers — one for each half — advancing whichever points to the smaller element.",
      "Merge Sort requires O(n) auxiliary space for the temporary arrays used during merging.",
      "An iterative (bottom-up) variant avoids recursion by starting with sub-arrays of size 1 and doubling the merge size each pass.",
    ],
    useCases: [
      "External sorting — when data doesn't fit in memory, merge sort's sequential access pattern is ideal for disk-based sorting.",
      "Stable sorting — merge sort preserves the relative order of equal elements, required in many database operations.",
      "Linked lists — merge sort works efficiently on linked lists without extra space.",
    ],
    comparisonNote:
      "Merge Sort is the best choice when stability is required or when sorting linked lists. It guarantees O(n log n) unlike Quick Sort, which has O(n²) worst case. The trade-off is O(n) auxiliary space. For in-place sorting with similar performance, consider Heap Sort.",
  },
};
