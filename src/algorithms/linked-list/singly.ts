import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, getNodeAt, newNodeId } from "./utils";

// ─── TypeScript code strings ─────────────────────────────────────────────────

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

// ─── Python code strings ──────────────────────────────────────────────────────

const INSERT_CODE_PYTHON = `class Node:
  def __init__(self, value):
    self.value = value
    self.next = None

class LinkedList:
  def __init__(self):
    self.head = None
    self.tail = None

  def insert_at_head(self, value):
    new_node = Node(value)
    new_node.next = self.head
    self.head = new_node
    if not self.tail:
      self.tail = new_node

  def insert_at_tail(self, value):
    new_node = Node(value)
    if not self.head:
      self.head = self.tail = new_node
      return
    self.tail.next = new_node
    self.tail = new_node

  def insert_at_index(self, index, value):
    if index == 0:
      return self.insert_at_head(value)
    prev = self._get_node_at(index - 1)
    new_node = Node(value)
    new_node.next = prev.next
    prev.next = new_node
    if not new_node.next:
      self.tail = new_node`;

// Line counts: 32 lines
// insert_at_head: create-node=12, link=13, update-head=14, update-tail=15-16, done=14
// insert_at_tail: create-node=19, update-head=21, link=23, update-tail=24, done=24
// insert_at_index: create-node=30, traverse=28, link=31, update-tail=32-33, done=32

const DELETE_CODE_PYTHON = `class LinkedList:
  def delete_at_head(self):
    if not self.head:
      return
    self.head = self.head.next
    if not self.head:
      self.tail = None

  def delete_at_tail(self):
    if not self.head:
      return
    if self.head is self.tail:
      self.head = self.tail = None
      return
    prev = self.head
    while prev.next is not self.tail:
      prev = prev.next
    prev.next = None
    self.tail = prev

  def delete_at_index(self, index):
    if index == 0:
      return self.delete_at_head()
    prev = self._get_node_at(index - 1)
    target = prev.next
    prev.next = target.next
    if not prev.next:
      self.tail = prev`;

// 28 lines
// delete_at_head: update-head=5, update-tail=6-7
// delete_at_tail: traverse=15-17, unlink=18, update-tail=19
// delete_at_index: traverse=24, unlink=25-26, update-tail=27-28

const SEARCH_CODE_PYTHON = `class LinkedList:
  def search(self, value):
    current = self.head
    index = 0
    while current is not None:
      if current.value == value:
        return index  # found
      current = current.next
      index += 1
    return -1  # not found`;

// 10 lines
// start=3, compare=5-6, advance=8-9, found=6-7, not-found=10

const REVERSE_CODE_PYTHON = `class LinkedList:
  def reverse(self):
    prev = None
    current = self.head
    while current is not None:
      next_node = current.next
      current.next = prev
      prev = current
      current = next_node
    self.tail = self.head
    self.head = prev`;

// 11 lines
// init-pointers=3-4, save-next=6, reverse-link=7, advance=8-9, update-head=10-11, done=11

// ─── Java code strings ────────────────────────────────────────────────────────

const INSERT_CODE_JAVA = `public class LinkedList<T> {
  private static class Node<T> {
    T value;
    Node<T> next;
    Node(T v) { value = v; next = null; }
  }
  private Node<T> head;
  private Node<T> tail;

  public void insertAtHead(T value) {
    Node<T> newNode = new Node<>(value);
    newNode.next = head;
    head = newNode;
    if (tail == null) tail = newNode;
  }

  public void insertAtTail(T value) {
    Node<T> newNode = new Node<>(value);
    if (head == null) {
      head = tail = newNode;
      return;
    }
    tail.next = newNode;
    tail = newNode;
  }

  public void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> newNode = new Node<>(value);
    newNode.next = prev.next;
    prev.next = newNode;
    if (newNode.next == null) tail = newNode;
  }
}`;

// 33 lines
// insertAtHead: create-node=11, link=12, update-head=13, update-tail=14, done=13
// insertAtTail: create-node=18, update-head=20, link=23, update-tail=24, done=24
// insertAtIndex: traverse=28, create-node=29, link=30-31, update-tail=32, done=31

const DELETE_CODE_JAVA = `public class LinkedList<T> {
  private Node<T> head;
  private Node<T> tail;

  public void deleteAtHead() {
    if (head == null) return;
    head = head.next;
    if (head == null) tail = null;
  }

  public void deleteAtTail() {
    if (head == null) return;
    if (head == tail) {
      head = tail = null;
      return;
    }
    Node<T> prev = head;
    while (prev.next != tail) {
      prev = prev.next;
    }
    prev.next = null;
    tail = prev;
  }

  public void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> target = prev.next;
    prev.next = target.next;
    if (prev.next == null) tail = prev;
  }
}`;

// 30 lines
// deleteAtHead: update-head=7, update-tail=8
// deleteAtTail: traverse=17-19, unlink=21, update-tail=22
// deleteAtIndex: traverse=26, unlink=28, update-tail=29

const SEARCH_CODE_JAVA = `public class LinkedList<T> {
  public int search(T value) {
    Node<T> current = head;
    int index = 0;
    while (current != null) {
      if (current.value.equals(value)) {
        return index; // found
      }
      current = current.next;
      index++;
    }
    return -1; // not found
  }
}`;

// 13 lines
// start=3-4, compare=5-6, advance=9-10, found=6-7, not-found=12

const REVERSE_CODE_JAVA = `public class LinkedList<T> {
  public void reverse() {
    Node<T> prev = null;
    Node<T> current = head;
    Node<T> next = null;
    while (current != null) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    tail = head;
    head = prev;
  }
}`;

// 14 lines
// init-pointers=3-5, save-next=7, reverse-link=8, advance=9-10, update-head=12-13, done=13

// ─── C++ code strings ─────────────────────────────────────────────────────────

const INSERT_CODE_CPP = `template<typename T>
class LinkedList {
  struct Node {
    T value;
    Node* next;
    Node(T v) : value(v), next(nullptr) {}
  };
  Node* head = nullptr;
  Node* tail = nullptr;

public:
  void insertAtHead(T value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    head = newNode;
    if (!tail) tail = newNode;
  }

  void insertAtTail(T value) {
    Node* newNode = new Node(value);
    if (!head) {
      head = tail = newNode;
      return;
    }
    tail->next = newNode;
    tail = newNode;
  }

  void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node* prev = getNodeAt(index - 1);
    Node* newNode = new Node(value);
    newNode->next = prev->next;
    prev->next = newNode;
    if (!newNode->next) tail = newNode;
  }
};`;

// 36 lines
// insertAtHead: create-node=13, link=14, update-head=15, update-tail=16, done=15
// insertAtTail: create-node=20, update-head=22, link=25, update-tail=26, done=26
// insertAtIndex: traverse=31, create-node=32, link=33-34, update-tail=35, done=34

const DELETE_CODE_CPP = `template<typename T>
class LinkedList {
  Node* head = nullptr;
  Node* tail = nullptr;

public:
  void deleteAtHead() {
    if (!head) return;
    Node* old = head;
    head = head->next;
    if (!head) tail = nullptr;
    delete old;
  }

  void deleteAtTail() {
    if (!head) return;
    if (head == tail) {
      delete head;
      head = tail = nullptr;
      return;
    }
    Node* prev = head;
    while (prev->next != tail) {
      prev = prev->next;
    }
    prev->next = nullptr;
    tail = prev;
    delete tail->next; // was tail
  }

  void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node* prev = getNodeAt(index - 1);
    Node* target = prev->next;
    prev->next = target->next;
    if (!prev->next) tail = prev;
    delete target;
  }
};`;

// 37 lines
// deleteAtHead: update-head=10, update-tail=11
// deleteAtTail: traverse=22-24, unlink=25, update-tail=26
// deleteAtIndex: traverse=32, unlink=34, update-tail=35

const SEARCH_CODE_CPP = `template<typename T>
class LinkedList {
public:
  int search(T value) {
    Node* current = head;
    int index = 0;
    while (current != nullptr) {
      if (current->value == value) {
        return index; // found
      }
      current = current->next;
      index++;
    }
    return -1; // not found
  }
};`;

// 15 lines
// start=5-6, compare=7-8, advance=11-12, found=8-9, not-found=14

const REVERSE_CODE_CPP = `template<typename T>
class LinkedList {
public:
  void reverse() {
    Node* prev = nullptr;
    Node* current = head;
    Node* next = nullptr;
    while (current != nullptr) {
      next = current->next;
      current->next = prev;
      prev = current;
      current = next;
    }
    tail = head;
    head = prev;
  }
};`;

// 16 lines
// init-pointers=5-7, save-next=9, reverse-link=10, advance=11-12, update-head=14-15, done=15

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
      stepLabel: "create-node",
      description: `Creating new node with value ${op.value}.`,
    });

    // Step 2: wire next
    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [3],
      stepLabel: "link",
      description: `Pointing new node's next to current head${headId ? ` (${map.get(headId)?.value})` : " (null)"}.`,
    });

    // Step 3: update head
    headId = newNode.id;
    if (!tailId) tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [4],
      stepLabel: "update-head",
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
      stepLabel: "create-node",
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      // Empty list
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [11],
        stepLabel: "done",
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
      stepLabel: "link",
      description: `Setting tail's next to new node.`,
    });

    // Step 3: update tail
    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [15],
      stepLabel: "update-tail",
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
    stepLabel: "create-node",
    description: `Creating new node with value ${op.value}.`,
  });

  // Walk to index - 1
  let current = map.get(headId!)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      insertedNodeId: newNode.id,
      highlightedLines: [20],
      stepLabel: "traverse",
      description: `Walking to position ${targetIndex - 1} — currently at index ${i} (value: ${current.value}).`,
    });
    current = map.get(current.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: current.id,
    insertedNodeId: newNode.id,
    highlightedLines: [20],
    stepLabel: "traverse",
    description: `Reached node at index ${targetIndex - 1} (value: ${current.value}). Inserting after it.`,
  });

  // Wire new node
  newNode.next = current.next;
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: current.id,
    insertedNodeId: newNode.id,
    affectedNodeIds: [newNode.id],
    highlightedLines: [22],
    stepLabel: "link",
    description: `New node's next points to node at index ${targetIndex}${newNode.next ? ` (value: ${map.get(newNode.next)?.value})` : " (null)"}.`,
  });

  current.next = newNode.id;
  if (!newNode.next) tailId = newNode.id;

  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [current.id],
    highlightedLines: [23],
    stepLabel: "done",
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
      stepLabel: "done",
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
      stepLabel: "unlink",
      description: `Marking head node (value: ${target.value}) for deletion.`,
    });

    headId = target.next;
    if (!headId) tailId = null;
    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [3],
      stepLabel: "update-head",
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
        stepLabel: "unlink",
        description: `Only one node in list (value: ${map.get(tailId!)?.value}). Removing it.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [10],
        stepLabel: "done",
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
        stepLabel: "traverse",
        description: `Walking to second-to-last node — at value ${prev.value}.`,
      });
      prev = map.get(prev.next!)!;
    }
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: prev.id,
      deletedNodeId: tailId!,
      highlightedLines: [15],
      stepLabel: "unlink",
      description: `Found second-to-last node (value: ${prev.value}). Marking tail for deletion.`,
    });

    prev.next = null;
    tailId = prev.id;
    const remaining = nodes.filter((n) => n.id !== state.tailId);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [17],
      stepLabel: "update-tail",
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
      stepLabel: "done",
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
      stepLabel: "traverse",
      description: `Walking to index ${targetIndex - 1} — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: prevNode.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [23],
    stepLabel: "unlink",
    description: `Found node at index ${targetIndex} (value: ${targetNode.value}). Rewiring pointer.`,
  });

  prevNode.next = targetNode.next;
  if (!prevNode.next) tailId = prevNode.id;

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    affectedNodeIds: [prevNode.id],
    highlightedLines: [24],
    stepLabel: "done",
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
      stepLabel: "not-found",
      description: `List is empty. Nothing to search.`,
    });
    return;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: headId,
    highlightedLines: [2],
    stepLabel: "start",
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
        stepLabel: "found",
        description: `Found value ${op.value} at index ${index}!`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      highlightedLines: [4, 5],
      stepLabel: "compare",
      description: `Index ${index}: value ${current.value} ≠ ${op.value}. Moving to next.`,
    });

    if (!current.next) break;
    current = map.get(current.next);
    index++;
  }

  yield makeStep(nodes, headId, tailId, {
    highlightedLines: [11],
    stepLabel: "not-found",
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
      stepLabel: "done",
      description: `List is empty. Nothing to reverse.`,
    });
    return;
  }

  yield makeStep(nodes, headId, state.tailId, {
    pointerLabels: { prev: null, current: headId, next: null },
    highlightedLines: [2, 3],
    stepLabel: "init-pointers",
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
      stepLabel: "save-next",
      description: `Save next = ${nextId ? `node ${map.get(nextId)?.value}` : "null"}.`,
    });

    // Reverse pointer
    currentNode.next = prevId;
    yield makeStep(nodes, headId, state.tailId, {
      activeNodeId: currentId,
      affectedNodeIds: [currentId],
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [7],
      stepLabel: "reverse-link",
      description: `Reverse: node ${currentNode.value}.next → ${prevId ? `node ${map.get(prevId)?.value}` : "null"}.`,
    });

    // Advance pointers
    prevId = currentId;
    currentId = nextId;

    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: null },
      highlightedLines: [8, 9],
      stepLabel: "advance",
      description: `Advance: prev = node ${map.get(prevId)?.value}, current = ${currentId ? `node ${map.get(currentId)?.value}` : "null"}.`,
    });
  }

  // Update head/tail
  const newTailId = originalHeadId;
  headId = prevId;

  yield makeStep(nodes, headId, newTailId, {
    highlightedLines: [11, 12],
    stepLabel: "update-head",
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
  codeByOperationByLanguage: {
    insert: {
      typescript: {
        code: INSERT_CODE,
        lineCount: 24,
        lineMap: {
          "create-node": [2, 9, 21],
          "traverse": [20],
          "link": [3, 14, 22, 23],
          "update-head": [4, 19],
          "update-tail": [5, 15, 24],
          "done": [11, 23],
        },
      },
      python: {
        code: INSERT_CODE_PYTHON,
        lineCount: 32,
        lineMap: {
          "create-node": [12, 19, 28],
          "traverse": [27],
          "link": [13, 23, 29, 30],
          "update-head": [14, 26],
          "update-tail": [15, 24, 31],
          "done": [21, 30],
        },
      },
      java: {
        code: INSERT_CODE_JAVA,
        lineCount: 33,
        lineMap: {
          "create-node": [11, 18, 29],
          "traverse": [28],
          "link": [12, 23, 30, 31],
          "update-head": [13, 27],
          "update-tail": [14, 24, 32],
          "done": [20, 31],
        },
      },
      cpp: {
        code: INSERT_CODE_CPP,
        lineCount: 36,
        lineMap: {
          "create-node": [13, 20, 32],
          "traverse": [31],
          "link": [14, 25, 33, 34],
          "update-head": [15, 30],
          "update-tail": [16, 26, 35],
          "done": [22, 34],
        },
      },
    },
    delete: {
      typescript: {
        code: DELETE_CODE,
        lineCount: 25,
        lineMap: {
          "traverse": [13, 14, 22],
          "unlink": [1, 9, 23],
          "update-head": [3, 21],
          "update-tail": [4, 17, 25],
          "done": [10, 24],
        },
      },
      python: {
        code: DELETE_CODE_PYTHON,
        lineCount: 28,
        lineMap: {
          "traverse": [15, 16, 17, 23],
          "unlink": [5, 12, 24],
          "update-head": [5, 22],
          "update-tail": [6, 7, 18, 19, 27, 28],
          "done": [13, 25],
        },
      },
      java: {
        code: DELETE_CODE_JAVA,
        lineCount: 30,
        lineMap: {
          "traverse": [17, 18, 19, 25],
          "unlink": [6, 13, 27],
          "update-head": [7, 24],
          "update-tail": [8, 21, 22, 29],
          "done": [14, 28],
        },
      },
      cpp: {
        code: DELETE_CODE_CPP,
        lineCount: 37,
        lineMap: {
          "traverse": [22, 23, 24, 32],
          "unlink": [9, 17, 34],
          "update-head": [10, 31],
          "update-tail": [11, 25, 26, 35],
          "done": [19, 33],
        },
      },
    },
    search: {
      typescript: {
        code: SEARCH_CODE,
        lineCount: 11,
        lineMap: {
          "start": [2, 3],
          "compare": [4, 5],
          "advance": [8, 9],
          "found": [5, 6],
          "not-found": [11],
        },
      },
      python: {
        code: SEARCH_CODE_PYTHON,
        lineCount: 10,
        lineMap: {
          "start": [3, 4],
          "compare": [5, 6],
          "advance": [8, 9],
          "found": [6, 7],
          "not-found": [10],
        },
      },
      java: {
        code: SEARCH_CODE_JAVA,
        lineCount: 13,
        lineMap: {
          "start": [3, 4],
          "compare": [5, 6],
          "advance": [9, 10],
          "found": [6, 7],
          "not-found": [12],
        },
      },
      cpp: {
        code: SEARCH_CODE_CPP,
        lineCount: 15,
        lineMap: {
          "start": [5, 6],
          "compare": [7, 8],
          "advance": [11, 12],
          "found": [8, 9],
          "not-found": [14],
        },
      },
    },
    reverse: {
      typescript: {
        code: REVERSE_CODE,
        lineCount: 12,
        lineMap: {
          "init-pointers": [2, 3, 4],
          "save-next": [6],
          "reverse-link": [7],
          "advance": [8, 9],
          "update-head": [11, 12],
          "done": [12],
        },
      },
      python: {
        code: REVERSE_CODE_PYTHON,
        lineCount: 11,
        lineMap: {
          "init-pointers": [3, 4],
          "save-next": [6],
          "reverse-link": [7],
          "advance": [8, 9],
          "update-head": [10, 11],
          "done": [11],
        },
      },
      java: {
        code: REVERSE_CODE_JAVA,
        lineCount: 14,
        lineMap: {
          "init-pointers": [3, 4, 5],
          "save-next": [7],
          "reverse-link": [8],
          "advance": [9, 10],
          "update-head": [12, 13],
          "done": [13],
        },
      },
      cpp: {
        code: REVERSE_CODE_CPP,
        lineCount: 16,
        lineMap: {
          "init-pointers": [5, 6, 7],
          "save-next": [9],
          "reverse-link": [10],
          "advance": [11, 12],
          "update-head": [14, 15],
          "done": [15],
        },
      },
    },
  },
  generatorByOperation: {
    insert: insertGenerator,
    delete: deleteGenerator,
    search: searchGenerator,
    reverse: reverseGenerator,
  },
};
