import type { AlgorithmModule, SearchStep } from "@/engine/types";


const code = `function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`;

const codePython = `def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`;

const codeJava = `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`;

const codeCpp = `#include <vector>
using namespace std;

class BinarySearch {
public:
    static int search(const vector<int>& arr, int target) {
        int low = 0;
        int high = (int)arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
};`;

const codeAlternative = `function binarySearch(arr: number[], target: number, low = 0, high = arr.length - 1): number {
  if (low > high) return -1;
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, high);
  return binarySearch(arr, target, low, mid - 1);
}`;

const codeAlternativePython = `def binary_search(arr: list[int], target: int, low: int = 0, high: int | None = None) -> int:
    if high is None:
        high = len(arr) - 1
    if low > high:
        return -1
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    if arr[mid] < target:
        return binary_search(arr, target, mid + 1, high)
    return binary_search(arr, target, low, mid - 1)`;

const codeAlternativeJava = `public class BinarySearch {
    public static int search(int[] arr, int target) {
        return searchHelper(arr, target, 0, arr.length - 1);
    }

    private static int searchHelper(int[] arr, int target, int low, int high) {
        if (low > high) return -1;
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) return searchHelper(arr, target, mid + 1, high);
        return searchHelper(arr, target, low, mid - 1);
    }
}`;

const codeAlternativeCpp = `#include <vector>
using namespace std;

class BinarySearch {
public:
    static int search(const vector<int>& arr, int target) {
        return searchHelper(arr, target, 0, (int)arr.size() - 1);
    }

    static int searchHelper(const vector<int>& arr, int target, int low, int high) {
        if (low > high) return -1;
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) return searchHelper(arr, target, mid + 1, high);
        return searchHelper(arr, target, low, mid - 1);
    }
};`;

function* binarySearchGenerator(
  input: number[],
  target = 0
): Generator<SearchStep> {
  const arr = [...input];
  const targetIndex = arr.indexOf(target);
  let low = 0;
  let high = arr.length - 1;
  const searched: number[] = [];
  let comparisons = 0;

  yield {
    type: "search",
    array: [...arr],
    comparingIndices: [],
    foundIndex: null,
    searchedIndices: [],
    targetIndex,
    highlightedLines: [2],
    stepLabel: "init",
    description: `Starting Binary Search for ${target}. Search range: [0, ${arr.length - 1}]`,
    comparisons,
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;

    yield {
      type: "search",
      array: [...arr],
      comparingIndices: [mid],
      foundIndex: null,
      searchedIndices: [...searched],
      targetIndex,
      highlightedLines: [5],
      stepLabel: "mid",
      description: `Mid = ${mid}, arr[${mid}] = ${arr[mid]}. Search range: [${low}, ${high}]`,
      comparisons,
    };

    if (arr[mid] === target) {
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: mid,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [6],
        stepLabel: "found",
        description: `Found! ${target} is at index ${mid}.`,
        comparisons,
      };
      return;
    } else if (arr[mid] < target) {
      // Mark left side (below mid) as searched
      for (let i = low; i <= mid; i++) {
        if (!searched.includes(i)) searched.push(i);
      }
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: null,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [8],
        stepLabel: "go-right",
        description: `arr[${mid}] = ${arr[mid]} < ${target}: target is in the right half. New range: [${mid + 1}, ${high}]`,
        comparisons,
      };
      low = mid + 1;
    } else {
      // Mark right side (above mid) as searched
      for (let i = mid; i <= high; i++) {
        if (!searched.includes(i)) searched.push(i);
      }
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: null,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [10],
        stepLabel: "go-left",
        description: `arr[${mid}] = ${arr[mid]} > ${target}: target is in the left half. New range: [${low}, ${mid - 1}]`,
        comparisons,
      };
      high = mid - 1;
    }
  }

  yield {
    type: "search",
    array: [...arr],
    comparingIndices: [],
    foundIndex: null,
    searchedIndices: [...searched],
    targetIndex,
    highlightedLines: [13],
    stepLabel: "not-found",
    description: `${target} was not found in the array. Search exhausted.`,
    comparisons,
  };
}

export const binarySearch: AlgorithmModule = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  code,
  codeLineCount: 15,
  codeByLanguage: {
    typescript: {
      code,
      lineCount: 15,
      lineMap: {
        init: [2, 3],
        mid: [5],
        found: [6, 7],
        "go-right": [8, 9],
        "go-left": [10, 11],
        "not-found": [14],
      },
    },
    python: {
      code: codePython,
      lineCount: 11,
      lineMap: {
        init: [2],
        mid: [4],
        found: [5, 6],
        "go-right": [7, 8],
        "go-left": [9, 10],
        "not-found": [11],
      },
    },
    java: {
      code: codeJava,
      lineCount: 17,
      lineMap: {
        init: [3, 4],
        mid: [6],
        found: [7, 8],
        "go-right": [9, 10],
        "go-left": [11, 12],
        "not-found": [15],
      },
    },
    cpp: {
      code: codeCpp,
      lineCount: 21,
      lineMap: {
        init: [7, 8],
        mid: [10],
        found: [11, 12],
        "go-right": [13, 14],
        "go-left": [15, 16],
        "not-found": [19],
      },
    },
  },
  codeAlternativeLabel: "Recursive",
  codeAlternative,
  codeAlternativeByLanguage: {
    typescript: {
      code: codeAlternative,
      lineCount: 7,
      lineMap: {
        init: [1],
        "not-found": [2],
        mid: [3],
        found: [4],
        "go-right": [5],
        "go-left": [6],
      },
    },
    python: {
      code: codeAlternativePython,
      lineCount: 11,
      lineMap: {
        init: [1],
        "not-found": [4, 5],
        mid: [6],
        found: [7, 8],
        "go-right": [9, 10],
        "go-left": [11],
      },
    },
    java: {
      code: codeAlternativeJava,
      lineCount: 13,
      lineMap: {
        init: [2, 3],
        "not-found": [7],
        mid: [8],
        found: [9],
        "go-right": [10],
        "go-left": [11],
      },
    },
    cpp: {
      code: codeAlternativeCpp,
      lineCount: 17,
      lineMap: {
        init: [5, 6],
        "not-found": [11],
        mid: [12],
        found: [13],
        "go-right": [14],
        "go-left": [15],
      },
    },
  },
  generator: binarySearchGenerator as (
    input: number[],
    target?: number
  ) => Generator<SearchStep>,
  complexity: [
    { case: "Best", time: "O(1)", space: "O(1)" },
    { case: "Average", time: "O(log n)", space: "O(1)" },
    { case: "Worst", time: "O(log n)", space: "O(1)" },
  ],
  complexityAlternative: [
    { case: "Best", time: "O(1)", space: "O(log n)" },
    { case: "Average", time: "O(log n)", space: "O(log n)" },
    { case: "Worst", time: "O(log n)", space: "O(log n)" },
  ],
  description: {
    what: "Binary Search efficiently finds a target value in a sorted array by repeatedly halving the search space. It compares the target to the middle element and discards the half that cannot contain the target.",
    how: [
      "Requires a sorted array as input.",
      "Set low = 0, high = n-1 as the initial search bounds.",
      "Calculate mid = floor((low + high) / 2).",
      "If arr[mid] equals the target, return mid.",
      "If arr[mid] < target, the target is in the right half — set low = mid + 1.",
      "If arr[mid] > target, the target is in the left half — set high = mid - 1.",
      "Repeat until low > high (not found) or the target is found.",
    ],
    implementation: [
      "Use integer division to compute mid — avoid (low + high) / 2 which can overflow in some languages; prefer low + (high - low) / 2.",
      "The loop invariant: if the target exists, it is always within [low, high].",
      "The iterative version is preferred over recursion to avoid stack overhead.",
      "The input must be sorted — binary search gives incorrect results on unsorted arrays.",
    ],
    useCases: [
      "Database indexing — B-trees use binary search principles for fast record lookup.",
      "Standard library search functions — Python's bisect, Java's Collections.binarySearch.",
      "Finding boundaries — binary search is used to find the first/last occurrence of a value.",
      "Solving optimization problems — 'binary search on the answer' technique in competitive programming.",
    ],
    comparisonNote:
      "Binary Search is the gold standard for searching sorted arrays at O(log n). For unsorted data, use Linear Search. For repeated searches on dynamic data, a balanced BST or hash table may be more appropriate. Binary Search is always preferred over Linear Search when the data is sorted.",
  },
};
