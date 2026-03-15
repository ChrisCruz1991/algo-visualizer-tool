import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, getNodeAt, newNodeId } from "./utils";

// ─── Code strings ────────────────────────────────────────────────────────────

const INSERT_CODE = `function insertAtHead(list, value) {        // 1
  const newNode = createNode(value);          // 2
  newNode.next = list.head;                   // 3
  if (list.head) list.head.prev = newNode;    // 4
  list.head = newNode;                        // 5
  if (!list.tail) list.tail = newNode;        // 6
}                                             // 7
                                              // 8
function insertAtTail(list, value) {          // 9
  const newNode = createNode(value);          // 10
  if (!list.head) {                           // 11
    list.head = list.tail = newNode; return;  // 12
  }                                           // 13
  newNode.prev = list.tail;                   // 14
  list.tail.next = newNode;                   // 15
  list.tail = newNode;                        // 16
}                                             // 17
                                              // 18
function insertAtIndex(list, index, value) {  // 19
  if (index === 0) return insertAtHead(...);  // 20
  let prev = getNodeAt(index - 1);            // 21
  const newNode = createNode(value);          // 22
  newNode.next = prev.next;                   // 23
  newNode.prev = prev;                        // 24
  if (prev.next) prev.next.prev = newNode;    // 25
  prev.next = newNode;                        // 26
  if (!newNode.next) list.tail = newNode;     // 27
}`;

const DELETE_CODE = `function deleteAtHead(list) {              // 1
  if (!list.head) return;                    // 2
  list.head = list.head.next;               // 3
  if (list.head) list.head.prev = null;     // 4
  else list.tail = null;                    // 5
}                                            // 6
                                             // 7
function deleteAtTail(list) {               // 8
  if (!list.tail) return;                   // 9
  if (list.head === list.tail) {            // 10
    list.head = list.tail = null; return;   // 11
  }                                         // 12
  list.tail = list.tail.prev;              // 13
  list.tail.next = null;                   // 14
}                                           // 15
                                            // 16
function deleteAtIndex(list, index) {       // 17
  if (index === 0) return deleteAtHead();   // 18
  let prev = getNodeAt(index - 1);          // 19
  const target = prev.next;                 // 20
  prev.next = target.next;                  // 21
  if (target.next) target.next.prev = prev; // 22
  else list.tail = prev;                    // 23
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
  let current = list.head;                  // 2
  while (current !== null) {               // 3
    // Swap next and prev pointers          // 4
    const temp = current.next;              // 5
    current.next = current.prev;            // 6
    current.prev = temp;                    // 7
    current = temp;                         // 8
  }                                         // 9
  // Swap head and tail                     // 10
  const temp = list.head;                   // 11
  list.head = list.tail;                    // 12
  list.tail = temp;                         // 13
}`;

// ─── Insert generator ────────────────────────────────────────────────────────

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
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [2],
      description: `Creating new node with value ${op.value}.`,
    });

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [3],
      description: `New node's next → current head${headId ? ` (${map.get(headId)?.value})` : " (null)"}.`,
    });

    if (headId) {
      const oldHead = map.get(headId)!;
      oldHead.prev = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        affectedNodeIds: [oldHead.id],
        highlightedLines: [4],
        description: `Old head's prev → new node (doubly link established).`,
      });
    }

    headId = newNode.id;
    if (!tailId) tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [5],
      description: `New node is now the head. Insert complete.`,
    });
    return;
  }

  if (position === "tail") {
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [10],
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [12],
        description: `List was empty. New node is both head and tail.`,
      });
      return;
    }

    const oldTail = map.get(tailId!)!;
    newNode.prev = oldTail.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [14],
      description: `New node's prev → old tail (${oldTail.value}).`,
    });

    oldTail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [oldTail.id],
      highlightedLines: [15],
      description: `Old tail's next → new node.`,
    });

    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [16],
      description: `New node is now the tail. Insert complete.`,
    });
    return;
  }

  // Insert at index
  const targetIndex = op.index ?? 1;

  nodes.push(newNode);
  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    highlightedLines: [22],
    description: `Creating new node with value ${op.value}.`,
  });

  const prevNode = getNodeAt(nodes, headId, targetIndex - 1, "doubly");
  if (!prevNode) return;

  let walker = map.get(headId!)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      insertedNodeId: newNode.id,
      highlightedLines: [21],
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    insertedNodeId: newNode.id,
    highlightedLines: [21],
    description: `Reached node at index ${targetIndex - 1} (value: ${walker.value}).`,
  });

  newNode.next = walker.next;
  newNode.prev = walker.id;
  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [newNode.id],
    highlightedLines: [23, 24],
    description: `Set new node's next and prev pointers.`,
  });

  if (walker.next) {
    const nextNode = map.get(walker.next)!;
    nextNode.prev = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [nextNode.id],
      highlightedLines: [25],
      description: `Updated next node's prev → new node (backward link).`,
    });
  }

  walker.next = newNode.id;
  if (!newNode.next) tailId = newNode.id;

  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [walker.id],
    highlightedLines: [26],
    description: `Inserted at index ${targetIndex}. Insert complete.`,
  });
}

// ─── Delete generator ────────────────────────────────────────────────────────

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
      description: `Marking head (value: ${target.value}) for deletion.`,
    });

    const newHead = target.next ? map.get(target.next) : null;
    headId = newHead?.id ?? null;
    if (newHead) {
      newHead.prev = null;
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: target.id,
        affectedNodeIds: [newHead.id],
        highlightedLines: [4],
        description: `New head's prev set to null.`,
      });
    } else {
      tailId = null;
    }
    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [3],
      description: `Head removed. ${headId ? `New head: ${map.get(headId)?.value}.` : "List is now empty."}`,
    });
    return;
  }

  if (position === "tail") {
    if (headId === tailId) {
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: tailId,
        highlightedLines: [10],
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [11],
        description: `List is now empty.`,
      });
      return;
    }

    const target = map.get(tailId!)!;
    yield makeStep(nodes, headId, tailId, {
      deletedNodeId: tailId!,
      highlightedLines: [8],
      description: `Marking tail (value: ${target.value}) for deletion.`,
    });

    const newTail = map.get(target.prev!)!;
    newTail.next = null;
    tailId = newTail.id;

    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      affectedNodeIds: [newTail.id],
      highlightedLines: [13, 14],
      description: `Tail removed via prev pointer. New tail: ${newTail.value}.`,
    });
    return;
  }

  // Delete at index
  const targetIndex = op.index ?? 1;
  const prevNode = getNodeAt(nodes, headId, targetIndex - 1, "doubly");
  if (!prevNode || !prevNode.next) {
    yield makeStep(nodes, headId, tailId, {
      highlightedLines: [19],
      description: `Index ${targetIndex} is out of bounds.`,
    });
    return;
  }

  const targetNode = map.get(prevNode.next)!;

  let walker = map.get(headId)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      highlightedLines: [19],
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: prevNode.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [20],
    description: `Targeting node at index ${targetIndex} (value: ${targetNode.value}).`,
  });

  prevNode.next = targetNode.next;
  if (targetNode.next) {
    const nextNode = map.get(targetNode.next)!;
    nextNode.prev = prevNode.id;
    yield makeStep(nodes, headId, tailId, {
      affectedNodeIds: [prevNode.id, nextNode.id],
      deletedNodeId: targetNode.id,
      highlightedLines: [21, 22],
      description: `Rewired forward and backward pointers around deleted node.`,
    });
  } else {
    tailId = prevNode.id;
  }

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    highlightedLines: [22, 23],
    description: `Deleted node at index ${targetIndex}. Delete complete.`,
  });
}

// ─── Search generator (identical to singly) ─────────────────────────────────

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

// ─── Reverse generator ───────────────────────────────────────────────────────

function* reverseGenerator(state: LinkedListState): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  const originalHeadId = state.headId;
  const originalTailId = state.tailId;
  const map = buildNodeMap(nodes);

  if (!state.headId) {
    yield makeStep(nodes, state.headId, state.tailId, {
      highlightedLines: [2],
      description: `List is empty. Nothing to reverse.`,
    });
    return;
  }

  yield makeStep(nodes, originalHeadId, originalTailId, {
    activeNodeId: state.headId,
    highlightedLines: [2],
    description: `Start at head. Swap next/prev on every node.`,
  });

  let currentId: string | null = state.headId;

  while (currentId) {
    const currentNode: ListNode = map.get(currentId)!;
    const savedNext = currentNode.next;

    // Swap next and prev
    currentNode.next = currentNode.prev;
    currentNode.prev = savedNext;

    yield makeStep(nodes, originalHeadId, originalTailId, {
      activeNodeId: currentId,
      affectedNodeIds: [currentId],
      highlightedLines: [5, 6, 7],
      description: `Swapped next/prev on node ${currentNode.value}.`,
    });

    currentId = savedNext;
  }

  // Swap head and tail
  const newHeadId = originalTailId;
  const newTailId = originalHeadId;

  yield makeStep(nodes, newHeadId, newTailId, {
    highlightedLines: [11, 12, 13],
    description: `All pointers swapped. New head = ${newHeadId ? map.get(newHeadId)?.value : "null"}. Reversal complete.`,
  });
}

// ─── Module export ───────────────────────────────────────────────────────────

export const doublyLinkedList: LinkedListModule = {
  id: "linked-list-doubly",
  name: "Doubly Linked List",
  variant: "doubly",
  category: "linked-list",
  presets: [
    { name: "Short list [3, 7, 1]", values: [3, 7, 1] },
    { name: "Medium list [5, 2, 8, 4, 9, 1]", values: [5, 2, 8, 4, 9, 1] },
    { name: "Sorted [1, 3, 5, 7, 9]", values: [1, 3, 5, 7, 9] },
    { name: "Single node [42]", values: [42] },
    { name: "Two nodes [1, 2]", values: [1, 2] },
  ],
  description: {
    what: "A doubly linked list is like a singly linked list, but each node also holds a prev pointer to the node before it. This bidirectional linking enables O(1) tail deletion and backward traversal at the cost of one extra pointer per node.",
    how: [
      "Each node holds value, next (forward), and prev (backward) pointers.",
      "Head.prev is always null; tail.next is always null.",
      "Insert at head or tail is O(1). Both next and prev must be wired on the new node.",
      "Delete at head or tail is O(1) — no traversal needed, because tail.prev gives immediate access to the second-to-last node.",
      "Delete in the middle requires O(N) traversal to reach the target, then O(1) pointer updates for both directions.",
      "Reverse swaps next and prev on every node, then swaps head and tail.",
    ],
    implementation: [
      "Every pointer assignment requires two updates — forward (next) and backward (prev).",
      "Tail deletion is O(1) because of the prev pointer: tail = tail.prev; tail.next = null.",
      "This is the key advantage over singly linked lists for deletion-heavy workloads.",
    ],
    useCases: [
      "Browser forward/back navigation history",
      "Most-Recently-Used (LRU) cache implementation",
      "Text editors (cursor movement in both directions)",
      "Deque (double-ended queue) implementation",
    ],
    comparisonNote:
      "Choose doubly linked list over singly when you need O(1) tail deletion or backward traversal. The trade-off is one extra pointer per node and double the pointer-update work on every operation.",
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
      { case: "Best", time: "O(1) — at head or tail", space: "O(1)" },
      { case: "Average", time: "O(N) — at index", space: "O(1)" },
      { case: "Worst", time: "O(N) — at middle index", space: "O(1)" },
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
