import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, getNodeAt, newNodeId } from "./utils";

// ─── TypeScript code strings ──────────────────────────────────────────────────

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

// ─── Python code strings ──────────────────────────────────────────────────────

const INSERT_CODE_PYTHON = `class Node:
  def __init__(self, value):
    self.value = value
    self.next = None
    self.prev = None

class LinkedList:
  def __init__(self):
    self.head = None
    self.tail = None

  def insert_at_head(self, value):
    new_node = Node(value)
    new_node.next = self.head
    if self.head:
      self.head.prev = new_node
    self.head = new_node
    if not self.tail:
      self.tail = new_node

  def insert_at_tail(self, value):
    new_node = Node(value)
    if not self.head:
      self.head = self.tail = new_node
      return
    new_node.prev = self.tail
    self.tail.next = new_node
    self.tail = new_node

  def insert_at_index(self, index, value):
    if index == 0:
      return self.insert_at_head(value)
    prev = self._get_node_at(index - 1)
    new_node = Node(value)
    new_node.next = prev.next
    new_node.prev = prev
    if prev.next:
      prev.next.prev = new_node
    prev.next = new_node
    if not new_node.next:
      self.tail = new_node`;

// 40 lines
// insert_at_head: create-node=13, link=14-16, update-head=17, update-tail=18-19
// insert_at_tail: create-node=22, update-head=24, link=26-27, update-tail=28
// insert_at_index: traverse=33, create-node=34, link=35-37, update-tail=40

const DELETE_CODE_PYTHON = `class LinkedList:
  def delete_at_head(self):
    if not self.head:
      return
    self.head = self.head.next
    if self.head:
      self.head.prev = None
    else:
      self.tail = None

  def delete_at_tail(self):
    if not self.tail:
      return
    if self.head is self.tail:
      self.head = self.tail = None
      return
    self.tail = self.tail.prev
    self.tail.next = None

  def delete_at_index(self, index):
    if index == 0:
      return self.delete_at_head()
    prev = self._get_node_at(index - 1)
    target = prev.next
    prev.next = target.next
    if target.next:
      target.next.prev = prev
    else:
      self.tail = prev`;

// 29 lines
// delete_at_head: update-head=5, update-tail=7 or 9
// delete_at_tail: unlink=17, update-tail=17-18
// delete_at_index: traverse=23, unlink=25, update-tail=27-29

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

const REVERSE_CODE_PYTHON = `class LinkedList:
  def reverse(self):
    current = self.head
    while current is not None:
      # Swap next and prev pointers
      temp = current.next
      current.next = current.prev
      current.prev = temp
      current = temp
    # Swap head and tail
    self.head, self.tail = self.tail, self.head`;

// 11 lines
// init-pointers=3, save-next=6, reverse-link=7-8, advance=9, update-head=11

// ─── Java code strings ────────────────────────────────────────────────────────

const INSERT_CODE_JAVA = `public class LinkedList<T> {
  private static class Node<T> {
    T value;
    Node<T> next;
    Node<T> prev;
    Node(T v) { value = v; next = null; prev = null; }
  }
  private Node<T> head;
  private Node<T> tail;

  public void insertAtHead(T value) {
    Node<T> newNode = new Node<>(value);
    newNode.next = head;
    if (head != null) head.prev = newNode;
    head = newNode;
    if (tail == null) tail = newNode;
  }

  public void insertAtTail(T value) {
    Node<T> newNode = new Node<>(value);
    if (head == null) {
      head = tail = newNode;
      return;
    }
    newNode.prev = tail;
    tail.next = newNode;
    tail = newNode;
  }

  public void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> newNode = new Node<>(value);
    newNode.next = prev.next;
    newNode.prev = prev;
    if (prev.next != null) prev.next.prev = newNode;
    prev.next = newNode;
    if (newNode.next == null) tail = newNode;
  }
}`;

// 38 lines
// insertAtHead: create-node=12, link=13-14, update-head=15, update-tail=16
// insertAtTail: create-node=20, update-head=22, link=25-26, update-tail=27
// insertAtIndex: traverse=31, create-node=32, link=33-35, update-tail=37

const DELETE_CODE_JAVA = `public class LinkedList<T> {
  private Node<T> head;
  private Node<T> tail;

  public void deleteAtHead() {
    if (head == null) return;
    head = head.next;
    if (head != null) head.prev = null;
    else tail = null;
  }

  public void deleteAtTail() {
    if (tail == null) return;
    if (head == tail) {
      head = tail = null;
      return;
    }
    tail = tail.prev;
    tail.next = null;
  }

  public void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> target = prev.next;
    prev.next = target.next;
    if (target.next != null) target.next.prev = prev;
    else tail = prev;
  }
}`;

// 29 lines
// deleteAtHead: update-head=7, update-tail=8-9
// deleteAtTail: unlink=18, update-tail=18-19
// deleteAtIndex: traverse=23, unlink=25, update-tail=27-28

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

const REVERSE_CODE_JAVA = `public class LinkedList<T> {
  public void reverse() {
    Node<T> current = head;
    while (current != null) {
      // Swap next and prev
      Node<T> temp = current.next;
      current.next = current.prev;
      current.prev = temp;
      current = temp;
    }
    // Swap head and tail
    Node<T> temp = head;
    head = tail;
    tail = temp;
  }
}`;

// 15 lines
// init-pointers=3, save-next=6, reverse-link=7-8, advance=9, update-head=12-14

// ─── C++ code strings ─────────────────────────────────────────────────────────

const INSERT_CODE_CPP = `template<typename T>
class LinkedList {
  struct Node {
    T value;
    Node* next;
    Node* prev;
    Node(T v) : value(v), next(nullptr), prev(nullptr) {}
  };
  Node* head = nullptr;
  Node* tail = nullptr;

public:
  void insertAtHead(T value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    if (head) head->prev = newNode;
    head = newNode;
    if (!tail) tail = newNode;
  }

  void insertAtTail(T value) {
    Node* newNode = new Node(value);
    if (!head) {
      head = tail = newNode;
      return;
    }
    newNode->prev = tail;
    tail->next = newNode;
    tail = newNode;
  }

  void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node* prev = getNodeAt(index - 1);
    Node* newNode = new Node(value);
    newNode->next = prev->next;
    newNode->prev = prev;
    if (prev->next) prev->next->prev = newNode;
    prev->next = newNode;
    if (!newNode->next) tail = newNode;
  }
};`;

// 40 lines
// insertAtHead: create-node=14, link=15-16, update-head=17, update-tail=18
// insertAtTail: create-node=22, update-head=24, link=27-28, update-tail=29
// insertAtIndex: traverse=34, create-node=35, link=36-38, update-tail=40

const DELETE_CODE_CPP = `template<typename T>
class LinkedList {
  Node* head = nullptr;
  Node* tail = nullptr;

public:
  void deleteAtHead() {
    if (!head) return;
    Node* old = head;
    head = head->next;
    if (head) head->prev = nullptr;
    else tail = nullptr;
    delete old;
  }

  void deleteAtTail() {
    if (!tail) return;
    if (head == tail) {
      delete head;
      head = tail = nullptr;
      return;
    }
    tail = tail->prev;
    tail->next = nullptr;
    delete tail->next; // was old tail
  }

  void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node* prev = getNodeAt(index - 1);
    Node* target = prev->next;
    prev->next = target->next;
    if (target->next) target->next->prev = prev;
    else tail = prev;
    delete target;
  }
};`;

// 36 lines
// deleteAtHead: update-head=10, update-tail=11-12
// deleteAtTail: unlink=23, update-tail=23-24
// deleteAtIndex: traverse=30, unlink=32, update-tail=33-34

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

const REVERSE_CODE_CPP = `template<typename T>
class LinkedList {
public:
  void reverse() {
    Node* current = head;
    while (current != nullptr) {
      // Swap next and prev
      Node* temp = current->next;
      current->next = current->prev;
      current->prev = temp;
      current = temp;
    }
    // Swap head and tail
    Node* temp = head;
    head = tail;
    tail = temp;
  }
};`;

// 17 lines
// init-pointers=5, save-next=8, reverse-link=9-10, advance=11, update-head=14-16

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
      stepLabel: "create-node",
      description: `Creating new node with value ${op.value}.`,
    });

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [3],
      stepLabel: "link",
      description: `New node's next → current head${headId ? ` (${map.get(headId)?.value})` : " (null)"}.`,
    });

    if (headId) {
      const oldHead = map.get(headId)!;
      oldHead.prev = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        affectedNodeIds: [oldHead.id],
        highlightedLines: [4],
        stepLabel: "link",
        description: `Old head's prev → new node (doubly link established).`,
      });
    }

    headId = newNode.id;
    if (!tailId) tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [5],
      stepLabel: "update-head",
      description: `New node is now the head. Insert complete.`,
    });
    return;
  }

  if (position === "tail") {
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [10],
      stepLabel: "create-node",
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [12],
        stepLabel: "done",
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
      stepLabel: "link",
      description: `New node's prev → old tail (${oldTail.value}).`,
    });

    oldTail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [oldTail.id],
      highlightedLines: [15],
      stepLabel: "link",
      description: `Old tail's next → new node.`,
    });

    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [16],
      stepLabel: "update-tail",
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
    stepLabel: "create-node",
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
      stepLabel: "traverse",
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    insertedNodeId: newNode.id,
    highlightedLines: [21],
    stepLabel: "traverse",
    description: `Reached node at index ${targetIndex - 1} (value: ${walker.value}).`,
  });

  newNode.next = walker.next;
  newNode.prev = walker.id;
  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [newNode.id],
    highlightedLines: [23, 24],
    stepLabel: "link",
    description: `Set new node's next and prev pointers.`,
  });

  if (walker.next) {
    const nextNode = map.get(walker.next)!;
    nextNode.prev = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [nextNode.id],
      highlightedLines: [25],
      stepLabel: "link",
      description: `Updated next node's prev → new node (backward link).`,
    });
  }

  walker.next = newNode.id;
  if (!newNode.next) tailId = newNode.id;

  yield makeStep(nodes, headId, tailId, {
    insertedNodeId: newNode.id,
    affectedNodeIds: [walker.id],
    highlightedLines: [26],
    stepLabel: "done",
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
        stepLabel: "update-head",
        description: `New head's prev set to null.`,
      });
    } else {
      tailId = null;
    }
    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      highlightedLines: [3],
      stepLabel: "update-head",
      description: `Head removed. ${headId ? `New head: ${map.get(headId)?.value}.` : "List is now empty."}`,
    });
    return;
  }

  if (position === "tail") {
    if (headId === tailId) {
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: tailId,
        highlightedLines: [10],
        stepLabel: "unlink",
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [11],
        stepLabel: "done",
        description: `List is now empty.`,
      });
      return;
    }

    const target = map.get(tailId!)!;
    yield makeStep(nodes, headId, tailId, {
      deletedNodeId: tailId!,
      highlightedLines: [8],
      stepLabel: "unlink",
      description: `Marking tail (value: ${target.value}) for deletion.`,
    });

    const newTail = map.get(target.prev!)!;
    newTail.next = null;
    tailId = newTail.id;

    const remaining = nodes.filter((n) => n.id !== target.id);
    yield makeStep(remaining, headId, tailId, {
      affectedNodeIds: [newTail.id],
      highlightedLines: [13, 14],
      stepLabel: "update-tail",
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
      stepLabel: "done",
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
      stepLabel: "traverse",
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: prevNode.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [20],
    stepLabel: "unlink",
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
      stepLabel: "unlink",
      description: `Rewired forward and backward pointers around deleted node.`,
    });
  } else {
    tailId = prevNode.id;
  }

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    highlightedLines: [22, 23],
    stepLabel: "done",
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

// ─── Reverse generator ───────────────────────────────────────────────────────

function* reverseGenerator(state: LinkedListState): Generator<LinkedListStep> {
  const nodes = cloneNodes(state.nodes);
  const originalHeadId = state.headId;
  const originalTailId = state.tailId;
  const map = buildNodeMap(nodes);

  if (!state.headId) {
    yield makeStep(nodes, state.headId, state.tailId, {
      highlightedLines: [2],
      stepLabel: "done",
      description: `List is empty. Nothing to reverse.`,
    });
    return;
  }

  yield makeStep(nodes, originalHeadId, originalTailId, {
    activeNodeId: state.headId,
    highlightedLines: [2],
    stepLabel: "init-pointers",
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
      stepLabel: "reverse-link",
      description: `Swapped next/prev on node ${currentNode.value}.`,
    });

    currentId = savedNext;
  }

  // Swap head and tail
  const newHeadId = originalTailId;
  const newTailId = originalHeadId;

  yield makeStep(nodes, newHeadId, newTailId, {
    highlightedLines: [11, 12, 13],
    stepLabel: "update-head",
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
  codeByOperationByLanguage: {
    insert: {
      typescript: {
        code: INSERT_CODE,
        lineCount: 27,
        lineMap: {
          "create-node": [2, 10, 22],
          "traverse": [21],
          "link": [3, 4, 14, 15, 23, 24, 25],
          "update-head": [5, 20],
          "update-tail": [6, 16, 27],
          "done": [12, 26],
        },
      },
      python: {
        code: INSERT_CODE_PYTHON,
        lineCount: 40,
        lineMap: {
          "create-node": [13, 22, 34],
          "traverse": [33],
          "link": [14, 15, 16, 26, 27, 35, 36, 37, 38],
          "update-head": [17, 32],
          "update-tail": [18, 19, 28, 40],
          "done": [24, 39],
        },
      },
      java: {
        code: INSERT_CODE_JAVA,
        lineCount: 38,
        lineMap: {
          "create-node": [12, 20, 32],
          "traverse": [31],
          "link": [13, 14, 25, 26, 33, 34, 35],
          "update-head": [15, 30],
          "update-tail": [16, 27, 37],
          "done": [22, 36],
        },
      },
      cpp: {
        code: INSERT_CODE_CPP,
        lineCount: 40,
        lineMap: {
          "create-node": [14, 22, 35],
          "traverse": [34],
          "link": [15, 16, 27, 28, 36, 37, 38],
          "update-head": [17, 33],
          "update-tail": [18, 29, 40],
          "done": [24, 39],
        },
      },
    },
    delete: {
      typescript: {
        code: DELETE_CODE,
        lineCount: 23,
        lineMap: {
          "traverse": [19],
          "unlink": [1, 10, 20],
          "update-head": [3, 4, 18],
          "update-tail": [5, 13, 14, 23],
          "done": [11, 21],
        },
      },
      python: {
        code: DELETE_CODE_PYTHON,
        lineCount: 29,
        lineMap: {
          "traverse": [23],
          "unlink": [5, 14, 24],
          "update-head": [5, 6, 7, 21],
          "update-tail": [8, 9, 17, 18, 28, 29],
          "done": [15, 25],
        },
      },
      java: {
        code: DELETE_CODE_JAVA,
        lineCount: 29,
        lineMap: {
          "traverse": [23],
          "unlink": [6, 13, 24],
          "update-head": [7, 8, 22],
          "update-tail": [9, 18, 19, 27, 28],
          "done": [14, 25],
        },
      },
      cpp: {
        code: DELETE_CODE_CPP,
        lineCount: 36,
        lineMap: {
          "traverse": [30],
          "unlink": [8, 17, 31],
          "update-head": [10, 29],
          "update-tail": [11, 12, 23, 24, 33, 34],
          "done": [20, 32],
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
        lineCount: 13,
        lineMap: {
          "init-pointers": [2],
          "save-next": [5],
          "reverse-link": [6, 7],
          "advance": [8],
          "update-head": [11, 12, 13],
          "done": [13],
        },
      },
      python: {
        code: REVERSE_CODE_PYTHON,
        lineCount: 11,
        lineMap: {
          "init-pointers": [3],
          "save-next": [6],
          "reverse-link": [7, 8],
          "advance": [9],
          "update-head": [11],
          "done": [11],
        },
      },
      java: {
        code: REVERSE_CODE_JAVA,
        lineCount: 15,
        lineMap: {
          "init-pointers": [3],
          "save-next": [6],
          "reverse-link": [7, 8],
          "advance": [9],
          "update-head": [12, 13, 14],
          "done": [14],
        },
      },
      cpp: {
        code: REVERSE_CODE_CPP,
        lineCount: 17,
        lineMap: {
          "init-pointers": [5],
          "save-next": [8],
          "reverse-link": [9, 10],
          "advance": [11],
          "update-head": [14, 15, 16],
          "done": [16],
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
