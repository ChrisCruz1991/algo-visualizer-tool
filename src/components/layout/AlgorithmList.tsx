"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ALGORITHM_GROUPS = [
  {
    category: "Sorting",
    algorithms: [
      { id: "bubble-sort", name: "Bubble Sort" },
      { id: "selection-sort", name: "Selection Sort" },
      { id: "insertion-sort", name: "Insertion Sort" },
      { id: "merge-sort", name: "Merge Sort" },
      { id: "quick-sort", name: "Quick Sort" },
      { id: "heap-sort", name: "Heap Sort" },
    ],
  },
  {
    category: "Searching",
    algorithms: [
      { id: "linear-search", name: "Linear Search" },
      { id: "binary-search", name: "Binary Search" },
    ],
  },
  {
    category: "Graph Traversal",
    algorithms: [
      { id: "bfs", name: "BFS" },
      { id: "dfs", name: "DFS" },
    ],
  },
  {
    category: "Tree Traversal",
    algorithms: [
      { id: "inorder", name: "Inorder" },
      { id: "preorder", name: "Preorder" },
      { id: "postorder", name: "Postorder" },
    ],
  },
  {
    category: "Linked Lists",
    algorithms: [
      { id: "linked-list-singly", name: "Singly Linked List" },
      { id: "linked-list-doubly", name: "Doubly Linked List" },
      { id: "linked-list-circular", name: "Circular Linked List" },
    ],
  },
];

export default function AlgorithmList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="p-3">
      {ALGORITHM_GROUPS.map((group) => (
        <div key={group.category} className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-1">
            {group.category}
          </p>
          <ul>
            {group.algorithms.map((algo) => {
              const href = `/visualizer/${algo.id}`;
              const isActive = pathname === href;
              return (
                <li key={algo.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm transition-colors duration-150",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {algo.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
