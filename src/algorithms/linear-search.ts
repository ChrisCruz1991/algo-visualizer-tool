import type { AlgorithmModule, SearchStep } from "@/engine/types";


const code = `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`;

const codePython = `def linear_search(arr: list[int], target: int) -> int:
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`;

const codeJava = `public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`;

const codeCpp = `#include <vector>
using namespace std;

class LinearSearch {
public:
    static int search(const vector<int>& arr, int target) {
        for (int i = 0; i < (int)arr.size(); i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
};`;

function* linearSearchGenerator(
  input: number[],
  target = 0
): Generator<SearchStep> {
  const arr = [...input];
  const targetIndex = arr.indexOf(target);
  const searched: number[] = [];
  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    yield {
      type: "search",
      array: [...arr],
      comparingIndices: [i],
      foundIndex: null,
      searchedIndices: [...searched],
      targetIndex,
      highlightedLines: [3],
      stepLabel: "compare",
      description: `Checking index ${i}: is ${arr[i]} === ${target}?`,
      comparisons,
    };

    if (arr[i] === target) {
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: i,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [4],
        stepLabel: "found",
        description: `Found! ${target} is at index ${i}.`,
        comparisons,
      };
      return;
    }

    searched.push(i);
  }

  yield {
    type: "search",
    array: [...arr],
    comparingIndices: [],
    foundIndex: null,
    searchedIndices: [...searched],
    targetIndex,
    highlightedLines: [7],
    stepLabel: "not-found",
    description: `${target} was not found in the array after checking all ${arr.length} elements.`,
    comparisons,
  };
}

export const linearSearch: AlgorithmModule = {
  id: "linear-search",
  name: "Linear Search",
  category: "searching",
  code,
  codeLineCount: 8,
  codeByLanguage: {
    typescript: {
      code,
      lineCount: 8,
      lineMap: {
        compare: [3],
        found: [4],
        "not-found": [7],
      },
    },
    python: {
      code: codePython,
      lineCount: 5,
      lineMap: {
        compare: [3],
        found: [4],
        "not-found": [5],
      },
    },
    java: {
      code: codeJava,
      lineCount: 10,
      lineMap: {
        compare: [4],
        found: [5],
        "not-found": [8],
      },
    },
    cpp: {
      code: codeCpp,
      lineCount: 14,
      lineMap: {
        compare: [8],
        found: [9],
        "not-found": [12],
      },
    },
  },
  generator: linearSearchGenerator as (
    input: number[],
    target?: number
  ) => Generator<SearchStep>,
  complexity: [
    { case: "Best", time: "O(1)", space: "O(1)" },
    { case: "Average", time: "O(n)", space: "O(1)" },
    { case: "Worst", time: "O(n)", space: "O(1)" },
  ],
  description: {
    what: "Linear Search sequentially checks each element of a list until a match is found or the list is exhausted. It is the simplest search algorithm and works on any collection, sorted or unsorted.",
    how: [
      "Start at the first element (index 0).",
      "Compare the current element with the target.",
      "If they match, return the current index.",
      "Otherwise, move to the next element.",
      "If the end of the array is reached without a match, return -1.",
    ],
    implementation: [
      "A single loop iterates from index 0 to n-1.",
      "No preprocessing or sorting of the input is needed.",
      "Can be applied to any data structure that supports sequential access (arrays, linked lists).",
      "Can be optimized with early exit — return immediately when the target is found.",
    ],
    useCases: [
      "Unsorted arrays where binary search isn't applicable.",
      "Small arrays where the overhead of sorting or building a hash table isn't justified.",
      "Searching in a linked list (binary search isn't efficient on linked lists).",
      "One-time searches where you don't need to search the same data repeatedly.",
    ],
    comparisonNote:
      "Linear Search is O(n) and works on unsorted data — use it when the array is small or unsorted. For sorted arrays, Binary Search is far more efficient at O(log n). For repeated searches on the same data, consider a hash table for O(1) average lookups.",
  },
};
