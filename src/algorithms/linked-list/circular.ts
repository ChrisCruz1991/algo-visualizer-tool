import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, newNodeId } from "./utils";

// ─── Code strings ────────────────────────────────────────────────────────────

const INSERT_CODE = `function insertAtHead(list, value) {        // 1
  const newNode = createNode(value);          // 2
  if (!list.head) {                           // 3
    newNode.next = newNode; // self-loop       // 4
    list.head = list.tail = newNode; return;  // 5
  }                                           // 6
  newNode.next = list.head;                   // 7
  list.tail.next = newNode; // circular link  // 8
  list.head = newNode;                        // 9
}                                             // 10
                                              // 11
function insertAtTail(list, value) {          // 12
  const newNode = createNode(value);          // 13
  if (!list.head) {                           // 14
    newNode.next = newNode;                   // 15
    list.head = list.tail = newNode; return;  // 16
  }                                           // 17
  newNode.next = list.head; // stay circular  // 18
  list.tail.next = newNode;                   // 19
  list.tail = newNode;                        // 20
}                                             // 21
                                              // 22
function insertAtIndex(list, index, value) {  // 23
  if (index === 0) return insertAtHead(...);  // 24
  let prev = getNodeAt(index - 1);            // 25
  const newNode = createNode(value);          // 26
  newNode.next = prev.next;                   // 27
  prev.next = newNode;                        // 28
  if (newNode.next === list.head)             // 29
    list.tail = newNode; // new tail          // 30
}`;

const DELETE_CODE = `function deleteAtHead(list) {              // 1
  if (!list.head) return;                    // 2
  if (list.head === list.tail) {             // 3
    list.head = list.tail = null; return;    // 4
  }                                          // 5
  list.head = list.head.next;               // 6
  list.tail.next = list.head; // re-link     // 7
}                                            // 8
                                             // 9
function deleteAtTail(list) {               // 10
  if (!list.head) return;                   // 11
  if (list.head === list.tail) {            // 12
    list.head = list.tail = null; return;   // 13
  }                                         // 14
  let prev = list.head;                     // 15
  while (prev.next !== list.tail) {         // 16
    prev = prev.next;                       // 17
  }                                         // 18
  prev.next = list.head; // re-link         // 19
  list.tail = prev;                         // 20
}                                           // 21
                                            // 22
function deleteAtIndex(list, index) {       // 23
  if (index === 0) return deleteAtHead();   // 24
  let prev = getNodeAt(index - 1);          // 25
  const target = prev.next;                 // 26
  prev.next = target.next;                  // 27
  if (target === list.tail) list.tail=prev; // 28
}`;

const SEARCH_CODE = `function search(list, value) {            // 1
  if (!list.head) return -1;               // 2
  let current = list.head;                  // 3
  let index = 0;                            // 4
  do {                                      // 5
    if (current.value === value) {          // 6
      return index; // found                // 7
    }                                       // 8
    current = current.next;                 // 9
    index++;                                // 10
  } while (current !== list.head);          // 11
  return -1; // not found                   // 12
}`;

const REVERSE_CODE = `function reverse(list) {                  // 1
  let prev = null;                          // 2
  let current = list.head;                  // 3
  let next = null;                          // 4
  const originalHead = list.head;           // 5
  do {                                      // 6
    next = current.next;                    // 7
    current.next = prev;                    // 8
    prev = current;                         // 9
    current = next;                         // 10
  } while (current !== originalHead);       // 11
  // Re-link circular: new tail → new head  // 12
  list.tail = originalHead;                 // 13
  list.tail.next = prev; // new head        // 14
  list.head = prev;                         // 15
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

    if (!headId) {
      newNode.next = newNode.id;
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [4, 5],
        description: `List was empty. Node points to itself — circular link established.`,
      });
      return;
    }

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [7],
      description: `New node's next → current head (${map.get(headId)?.value}).`,
    });

    const tail = map.get(tailId!)!;
    tail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [tail.id],
      highlightedLines: [8],
      description: `Tail's next → new node (circular link maintained).`,
    });

    headId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [9],
      description: `New node is now the head. Insert complete.`,
    });
    return;
  }

  if (position === "tail") {
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [13],
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      newNode.next = newNode.id;
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [15, 16],
        description: `List was empty. Node points to itself — circular link established.`,
      });
      return;
    }

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [18],
      description: `New node's next → head (${map.get(headId)?.value}) to stay circular.`,
    });

    const oldTail = map.get(tailId!)!;
    oldTail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [oldTail.id],
      highlightedLines: [19],
      description: `Old tail's next → new node.`,
    });

    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [20],
      description: `New node is the tail. Circular structure intact. Insert complete.`,
    });
    return;
  }

  // Insert at index
  const targetIndex = op.index ?? 1;

  nodes.push(newNode);
  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    highlightedLines: [26],
    description: `Creating new node with value ${op.value}.`,
  });

  let walker = map.get(headId!)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      insertedNodeId: newNode.id,
      highlightedLines: [25],
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    insertedNodeId: newNode.id,
    highlightedLines: [25],
    description: `Reached node at index ${targetIndex - 1} (value: ${walker.value}).`,
  });

  newNode.next = walker.next;
  walker.next = newNode.id;

  // Check if new node is now the tail
  if (newNode.next === headId) {
    tailId = newNode.id;
  }

  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [walker.id],
    highlightedLines: [27, 28],
    description: `Inserted at index ${targetIndex}. Circular structure intact. Insert complete.`,
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

    if (headId === tailId) {
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: headId,
        highlightedLines: [3],
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [4],
        description: `List is now empty.`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      deletedNodeId: headId,
      highlightedLines: [1],
      description: `Marking head (value: ${target.value}) for deletion.`,
    });

    const newHead = map.get(target.next!)!;
    const tail = map.get(tailId!)!;
    headId = newHead.id;
    tail.next = newHead.id;

    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      affectedNodeIds: [tail.id],
      highlightedLines: [6, 7],
      description: `Head removed. Tail's next re-linked to new head (${newHead.value}).`,
    });
    return;
  }

  if (position === "tail") {
    const target = map.get(tailId!)!;

    if (headId === tailId) {
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: tailId,
        highlightedLines: [12],
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [13],
        description: `List is now empty.`,
      });
      return;
    }

    let prev = map.get(headId)!;
    while (prev.next !== tailId) {
      yield makeStep(nodes, headId, tailId, {
        activeNodeId: prev.id,
        deletedNodeId: tailId!,
        highlightedLines: [16],
        description: `Walking — at value ${prev.value}.`,
      });
      prev = map.get(prev.next!)!;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: prev.id,
      deletedNodeId: target.id,
      highlightedLines: [18],
      description: `Reached second-to-last (value: ${prev.value}). Re-linking to head.`,
    });

    prev.next = headId;
    tailId = prev.id;
    const remaining = nodes.filter((n) => n.id !== target.id);

    yield makeStep(remaining, headId, tailId, {
      affectedNodeIds: [prev.id],
      highlightedLines: [19, 20],
      description: `Tail removed. New tail (${prev.value}) points back to head. Circular link maintained.`,
    });
    return;
  }

  // Delete at index
  const targetIndex = op.index ?? 1;

  let walker = map.get(headId)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      highlightedLines: [25],
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  const targetNode = map.get(walker.next!)!;
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [26],
    description: `Targeting node at index ${targetIndex} (value: ${targetNode.value}).`,
  });

  walker.next = targetNode.next;
  if (targetNode.id === tailId) tailId = walker.id;

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    affectedNodeIds: [walker.id],
    highlightedLines: [27, 28],
    description: `Deleted node at index ${targetIndex}. Circular structure intact.`,
  });
}

// ─── Search generator ────────────────────────────────────────────────────────

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
    highlightedLines: [3],
    description: `Starting search for value ${op.value} from head. Will stop when we return to head.`,
  });

  let current: ListNode = map.get(headId)!;
  let index = 0;

  do {
    if (current.value === op.value) {
      yield makeStep(nodes, headId, tailId, {
        activeNodeId: current.id,
        targetNodeId: current.id,
        highlightedLines: [6, 7],
        description: `Found value ${op.value} at index ${index}!`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      highlightedLines: [5, 6],
      description: `Index ${index}: value ${current.value} ≠ ${op.value}. Moving to next.`,
    });

    current = map.get(current.next!)!;
    index++;
  } while (current.id !== headId);

  yield makeStep(nodes, headId, tailId, {
    highlightedLines: [12],
    description: `Returned to head — full circle traversed. Value ${op.value} not found in ${index} node${index !== 1 ? "s" : ""}.`,
  });
}

// ─── Reverse generator ───────────────────────────────────────────────────────

function* reverseGenerator(state: LinkedListState): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  const originalHeadId = state.headId;
  let headId = state.headId;
  const originalTailId = state.tailId;
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
    highlightedLines: [2, 3, 5],
    description: `Initialize: prev = null, current = head. Loop until we return to original head.`,
  });

  let prevId: string | null = null;
  let currentId: string | null = headId;

  // Temporarily break circular link so we can detect end
  const originalTailNode = map.get(originalTailId!)!;
  originalTailNode.next = null; // break the circle for traversal

  while (currentId) {
    const currentNode: ListNode = map.get(currentId)!;
    const nextId = currentNode.next;

    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [7],
      description: `Save next = ${nextId ? `node ${map.get(nextId)?.value}` : "null"}.`,
    });

    currentNode.next = prevId;
    yield makeStep(nodes, headId, state.tailId, {
      activeNodeId: currentId,
      affectedNodeIds: [currentId],
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [8],
      description: `Reverse: node ${currentNode.value}.next → ${prevId ? `node ${map.get(prevId)?.value}` : "null"}.`,
    });

    prevId = currentId;
    currentId = nextId;

    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: null },
      highlightedLines: [9, 10],
      description: `Advance: prev = node ${map.get(prevId!)?.value}, current = ${currentId ? `node ${map.get(currentId)?.value}` : "done"}.`,
    });
  }

  // Re-establish circular link: new tail (originalHead) → new head (prevId)
  const newHeadId = prevId;
  const newTailNode = map.get(originalHeadId!)!;
  newTailNode.next = newHeadId;
  headId = newHeadId;

  yield makeStep(nodes, headId, originalHeadId, {
    affectedNodeIds: [originalHeadId!],
    highlightedLines: [13, 14, 15],
    description: `Reversal complete. New tail (${newTailNode.value}) points back to new head (${headId ? map.get(headId)?.value : "null"}). Circular link restored.`,
  });
}

// ─── Module export ───────────────────────────────────────────────────────────

export const circularLinkedList: LinkedListModule = {
  id: "linked-list-circular",
  name: "Circular Linked List",
  variant: "circular",
  category: "linked-list",
  presets: [
    { name: "Short list [3, 7, 1]", values: [3, 7, 1] },
    { name: "Medium list [5, 2, 8, 4, 9, 1]", values: [5, 2, 8, 4, 9, 1] },
    { name: "Sorted [1, 3, 5, 7, 9]", values: [1, 3, 5, 7, 9] },
    { name: "Single node [42]", values: [42] },
    { name: "Two nodes [1, 2]", values: [1, 2] },
  ],
  description: {
    what: "A circular linked list is a singly linked list where the tail node's next pointer points back to the head instead of null. This creates a continuous loop with no natural end point.",
    how: [
      "Each node holds value and next pointer — identical to singly linked list.",
      "The tail's next points to the head, forming a closed loop.",
      "Traversal stops when current.next === head, not when current.next === null.",
      "Insert at head requires updating the tail's next to point to the new head.",
      "Insert at tail requires wiring the new tail's next to the head.",
      "Delete requires maintaining the circular tail-to-head link on every removal.",
      "Reverse uses the three-pointer approach, then restores the circular link at the end.",
    ],
    implementation: [
      "Termination condition for traversal is current.next === head (not null).",
      "Every insert/delete must preserve the circular link: tail.next must always equal head.",
      "Use a tail pointer to make head and tail insertion O(1) without full traversal.",
    ],
    useCases: [
      "Round-robin scheduling (CPU time-sharing)",
      "Circular buffers and ring buffers",
      "Multiplayer board games (turn cycling)",
      "Media players on repeat (playlist looping)",
    ],
    comparisonNote:
      "Use a circular linked list when your algorithm naturally cycles through elements repeatedly, such as round-robin scheduling. For most other use cases, a singly or doubly linked list is simpler and avoids the risk of infinite loops in buggy traversal code.",
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
