import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, getNodeAt, newNodeId } from "./utils";

// ─── Code strings (written first; line numbers drive highlightedLines in generators) ───

const INSERT_CODE = `function insertAtHead(list, value) {        // 1
  const newNode = createNode(value);          // 2
  newNode.next = list.head;                   // 3
  list.head = newNode;                        // 4
  if (!list.tail) list.tail = newNode;        // 5
}                                             // 6
                                              // 7
function insertAtTail(list, value) {          // 8
  const newNode = createNode(value);          // 9
  if (!list.head) {                           // 10
    list.head = list.tail = newNode;          // 11
    return;                                   // 12
  }                                           // 13
  list.tail.next = newNode;                   // 14
  list.tail = newNode;                        // 15
}                                             // 16
                                              // 17
function insertAtIndex(list, index, value) {  // 18
  if (index === 0) return insertAtHead(...);  // 19
  let prev = getNodeAt(index - 1);            // 20
  const newNode = createNode(value);          // 21
  newNode.next = prev.next;                   // 22
  prev.next = newNode;                        // 23
  if (!newNode.next) list.tail = newNode;     // 24
}`;

const DELETE_CODE = `function deleteAtHead(list) {              // 1
  if (!list.head) return;                    // 2
  list.head = list.head.next;               // 3
  if (!list.head) list.tail = null;         // 4
}                                            // 5
                                             // 6
function deleteAtTail(list) {               // 7
  if (!list.head) return;                   // 8
  if (list.head === list.tail) {            // 9
    list.head = list.tail = null; return;   // 10
  }                                         // 11
  let prev = list.head;                     // 12
  while (prev.next !== list.tail) {         // 13
    prev = prev.next;                       // 14
  }                                         // 15
  prev.next = null;                         // 16
  list.tail = prev;                         // 17
}                                           // 18
                                            // 19
function deleteAtIndex(list, index) {       // 20
  if (index === 0) return deleteAtHead();   // 21
  let prev = getNodeAt(index - 1);          // 22
  const target = prev.next;                 // 23
  prev.next = target.next;                  // 24
  if (!prev.next) list.tail = prev;        // 25
}`;

const SEARCH_CODE = `function search(list, value) {            // 1
  let current = list.head;                  // 2
  let index = 0;                            // 3
  while (current !== null) {               // 4
    if (current.value === value) {          // 5
      return index; // found                // 6
    }                                       // 7
    current = current.next;                 // 8
    index++;                                // 9
  }                                         // 10
  return -1; // not found                   // 11
}`;

const REVERSE_CODE = `function reverse(list) {                  // 1
  let prev = null;                          // 2
  let current = list.head;                  // 3
  let next = null;                          // 4
  while (current !== null) {               // 5
    next = current.next;                    // 6
    current.next = prev;                    // 7
    prev = current;                         // 8
    current = next;                         // 9
  }                                         // 10
  list.tail = list.head;                    // 11
  list.head = prev;                         // 12
}`;

// ─── Insert generator ───────────────────────────────────────────────────────

function* insertGenerator(
  state: LinkedListState,
  op: Extract<LinkedListOperation, { type: "insert" }>
): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  let headId = state.headId;
  let tailId = state.tailId;
  const map = buildNodeMap(nodes);

  const newNode: ListNode = { id: newNodeId(), value: op.value, next: null, prev: null };

  const position =
    op.position === "index" && op.index === 0
      ? "head"
      : op.position === "index" && op.index === nodes.length
      ? "tail"
      : op.position;

  if (position === "head") {
    // Step 1: create node
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [2],
      description: `Creating new node with value ${op.value}.`,
    });

    // Step 2: wire next
    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [3],
      description: `Pointing new node's next to current head${headId ? ` (${map.get(headId)?.value})` : " (null)"}.`,
    });

    // Step 3: update head
    headId = newNode.id;
    if (!tailId) tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [4],
      description: `New node is now the head. Insert complete.`,
    });
    return;
  }

  if (position === "tail") {
    // Step 1: create node
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [9],
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      // Empty list
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [11],
        description: `List was empty. New node is both head and tail.`,
      });
      return;
    }

    // Step 2: wire old tail → new node
    const oldTail = map.get(tailId!)!;
    oldTail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [oldTail.id],
      highlightedLines: [14],
      description: `Setting tail's next to new node.`,
    });

    // Step 3: update tail
    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [15],
      description: `New node is now the tail. Insert complete.`,
    });
    return;
  }

  // Insert at index
  const targetIndex = op.index ?? 1;

  // Step 1: create node
  nodes.push(newNode);
  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    highlightedLines: [21],
    description: `Creating new node with value ${op.value}.`,
  });

  // Walk to index - 1
  let current = map.get(headId!)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      insertedNodeId: newNode.id,
      highlightedLines: [20],
      description: `Walking to position ${targetIndex - 1} — currently at index ${i} (value: ${current.value}).`,
    });
    current = map.get(current.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: current.id,
    insertedNodeId: newNode.id,
    highlightedLines: [20],
    description: `Reached node at index ${targetIndex - 1} (value: ${current.value}). Inserting after it.`,
  });

  // Wire new node
  newNode.next = current.next;
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: current.id,
    insertedNodeId: newNode.id,
    affectedNodeIds: [newNode.id],
    highlightedLines: [22],
    description: `New node's next points to node at index ${targetIndex}${newNode.next ? ` (value: ${map.get(newNode.next)?.value})` : " (null)"}.`,
  });

  current.next = newNode.id;
  if (!newNode.next) tailId = newNode.id;

  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [current.id],
    highlightedLines: [23],
    description: `Inserted node at index ${targetIndex}. Insert complete.`,
  });
}

// ─── Delete generator ───────────────────────────────────────────────────────

function* deleteGenerator(
  state: LinkedListState,
  op: Extract<LinkedListOperation, { type: "delete" }>
): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  let headId = state.headId;
  let tailId = state.tailId;
  const map = buildNodeMap(nodes);

  if (!headId) {
    yield makeStep(nodes, headId, tailId, {
      highlightedLines: [2],
      description: `List is empty. Nothing to delete.`,
    });
    return;
  }

  const position =
    op.position === "index" && op.index === 0
      ? "head"
      : op.position === "index" && op.index === nodes.length - 1
      ? "tail"
      : op.position;

  if (position === "head") {
    const target = map.get(headId)!;
    yield makeStep(nodes, headId, tailId, {
      deletedNodeId: headId,
      highlightedLines: [1],
      description: `Marking head node (value: ${target.value}) for deletion.`,
    });

    headId = target.next;
    if (!headId) tailId = null;
    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [3],
      description: `Head removed. ${headId ? `New head is value ${map.get(headId)?.value}.` : "List is now empty."}`,
    });
    return;
  }

  if (position === "tail") {
    if (headId === tailId) {
      // Single node
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: tailId,
        highlightedLines: [9],
        description: `Only one node in list (value: ${map.get(tailId!)?.value}). Removing it.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [10],
        description: `List is now empty.`,
      });
      return;
    }

    // Walk to second-to-last
    let prev = map.get(headId)!;
    while (prev.next !== tailId) {
      yield makeStep(nodes, headId, tailId, {
        activeNodeId: prev.id,
        highlightedLines: [13],
        description: `Walking to second-to-last node — at value ${prev.value}.`,
      });
      prev = map.get(prev.next!)!;
    }
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: prev.id,
      deletedNodeId: tailId!,
      highlightedLines: [15],
      description: `Found second-to-last node (value: ${prev.value}). Marking tail for deletion.`,
    });

    prev.next = null;
    tailId = prev.id;
    const remaining = nodes.filter((n) => n.id !== state.tailId);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [17],
      description: `Tail removed. New tail is value ${prev.value}.`,
    });
    return;
  }

  // Delete at index
  const targetIndex = op.index ?? 1;
  const prevNode = getNodeAt(nodes, headId, targetIndex - 1, "singly");
  if (!prevNode || !prevNode.next) {
    yield makeStep(nodes, headId, tailId, {
      highlightedLines: [22],
      description: `Index ${targetIndex} is out of bounds.`,
    });
    return;
  }

  const targetNode = map.get(prevNode.next)!;

  // Walk to prev
  let walker = map.get(headId)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      highlightedLines: [22],
      description: `Walking to index ${targetIndex - 1} — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: prevNode.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [23],
    description: `Found node at index ${targetIndex} (value: ${targetNode.value}). Rewiring pointer.`,
  });

  prevNode.next = targetNode.next;
  if (!prevNode.next) tailId = prevNode.id;

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    affectedNodeIds: [prevNode.id],
    highlightedLines: [24],
    description: `Deleted node at index ${targetIndex}. Delete complete.`,
  });
}

// ─── Search generator ───────────────────────────────────────────────────────

function* searchGenerator(
  state: LinkedListState,
  op: Extract<LinkedListOperation, { type: "search" }>
): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  const { headId, tailId } = state;
  const map = buildNodeMap(nodes);

  if (!headId) {
    yield makeStep(nodes, headId, tailId, {
      highlightedLines: [2],
      description: `List is empty. Nothing to search.`,
    });
    return;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: headId,
    highlightedLines: [2],
    description: `Starting search for value ${op.value} from the head.`,
  });

  let current: ListNode | undefined = map.get(headId);
  let index = 0;

  while (current) {
    if (current.value === op.value) {
      yield makeStep(nodes, headId, tailId, {
        activeNodeId: current.id,
        targetNodeId: current.id,
        highlightedLines: [5, 6],
        description: `Found value ${op.value} at index ${index}!`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      highlightedLines: [4, 5],
      description: `Index ${index}: value ${current.value} ≠ ${op.value}. Moving to next.`,
    });

    if (!current.next) break;
    current = map.get(current.next);
    index++;
  }

  yield makeStep(nodes, headId, tailId, {
    highlightedLines: [11],
    description: `Value ${op.value} not found after searching ${index + 1} node${index + 1 !== 1 ? "s" : ""}.`,
  });
}

// ─── Reverse generator ──────────────────────────────────────────────────────

function* reverseGenerator(state: LinkedListState): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  let headId = state.headId;
  const originalHeadId = headId;
  const map = buildNodeMap(nodes);

  if (!headId) {
    yield makeStep(nodes, headId, state.tailId, {
      highlightedLines: [2],
      description: `List is empty. Nothing to reverse.`,
    });
    return;
  }

  yield makeStep(nodes, headId, state.tailId, {
    pointerLabels: { prev: null, current: headId, next: null },
    highlightedLines: [2, 3],
    description: `Initialize: prev = null, current = head.`,
  });

  let prevId: string | null = null;
  let currentId: string | null = headId;

  while (currentId) {
    const currentNode: ListNode = map.get(currentId)!;
    const nextId = currentNode.next;

    // Save next
    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [6],
      description: `Save next = ${nextId ? `node ${map.get(nextId)?.value}` : "null"}.`,
    });

    // Reverse pointer
    currentNode.next = prevId;
    yield makeStep(nodes, headId, state.tailId, {
      activeNodeId: currentId,
      affectedNodeIds: [currentId],
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [7],
      description: `Reverse: node ${currentNode.value}.next → ${prevId ? `node ${map.get(prevId)?.value}` : "null"}.`,
    });

    // Advance pointers
    prevId = currentId;
    currentId = nextId;

    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: null },
      highlightedLines: [8, 9],
      description: `Advance: prev = node ${map.get(prevId)?.value}, current = ${currentId ? `node ${map.get(currentId)?.value}` : "null"}.`,
    });
  }

  // Update head/tail
  const newTailId = originalHeadId;
  headId = prevId;

  yield makeStep(nodes, headId, newTailId, {
    highlightedLines: [11, 12],
    description: `Reversal complete. New head = ${headId ? `node ${map.get(headId)?.value}` : "null"}.`,
  });
}

// ─── Module export ──────────────────────────────────────────────────────────

export const singlyLinkedList: LinkedListModule = {
  id: "linked-list-singly",
  name: "Singly Linked List",
  variant: "singly",
  category: "linked-list",
  presets: [
    { name: "Short list [3, 7, 1]", values: [3, 7, 1] },
    { name: "Medium list [5, 2, 8, 4, 9, 1]", values: [5, 2, 8, 4, 9, 1] },
    { name: "Sorted [1, 3, 5, 7, 9]", values: [1, 3, 5, 7, 9] },
    { name: "Single node [42]", values: [42] },
    { name: "Two nodes [1, 2]", values: [1, 2] },
  ],
  description: {
    what: "A singly linked list is a linear data structure where each element (node) stores a value and a pointer to the next node. The list is accessed via a head pointer; traversal is one-directional (forward only).",
    how: [
      "Each node contains a value and a next pointer.",
      "The head pointer marks the start; the tail's next is null.",
      "Insert at head is O(1). Insert elsewhere requires traversal.",
      "Delete at head is O(1). Deleting the tail requires O(N) traversal to find the second-to-last node.",
      "Search requires linear traversal from head to tail.",
      "Reverse uses three pointers (prev, current, next) to flip all next pointers in one pass.",
    ],
    implementation: [
      "Maintain both a head and tail pointer for O(1) tail insertion.",
      "Always check for empty list and single-node edge cases before operating.",
      "For reverse, the iterative three-pointer approach uses O(1) space vs O(N) for a stack-based approach.",
    ],
    useCases: [
      "Implementing stacks and queues",
      "Undo/redo history in editors",
      "Adjacency lists in graph representations",
      "Music/video playlists",
    ],
    comparisonNote:
      "Use a singly linked list when you need efficient head insertions/deletions and only traverse forward. Use a doubly linked list when you need O(1) tail deletion or backward traversal. Use an array when you need O(1) random access by index.",
  },
  complexity: [
    { case: "Best", time: "O(1)", space: "O(1)" },
    { case: "Average", time: "O(N)", space: "O(1)" },
    { case: "Worst", time: "O(N)", space: "O(1)" },
  ],
  complexityByOperation: {
    insert: [
      { case: "Best", time: "O(1) — at head/tail", space: "O(1)" },
      { case: "Average", time: "O(N) — at index", space: "O(1)" },
      { case: "Worst", time: "O(N) — at index N-1", space: "O(1)" },
    ],
    delete: [
      { case: "Best", time: "O(1) — at head", space: "O(1)" },
      { case: "Average", time: "O(N) — at index", space: "O(1)" },
      { case: "Worst", time: "O(N) — at tail", space: "O(1)" },
    ],
    search: [
      { case: "Best", time: "O(1) — value at head", space: "O(1)" },
      { case: "Average", time: "O(N)", space: "O(1)" },
      { case: "Worst", time: "O(N) — not found", space: "O(1)" },
    ],
    reverse: [
      { case: "Best", time: "O(N)", space: "O(1)" },
      { case: "Average", time: "O(N)", space: "O(1)" },
      { case: "Worst", time: "O(N)", space: "O(1)" },
    ],
  },
  codeByOperation: {
    insert: INSERT_CODE,
    delete: DELETE_CODE,
    search: SEARCH_CODE,
    reverse: REVERSE_CODE,
  },
  generatorByOperation: {
    insert: insertGenerator,
    delete: deleteGenerator,
    search: searchGenerator,
    reverse: reverseGenerator,
  },
};
