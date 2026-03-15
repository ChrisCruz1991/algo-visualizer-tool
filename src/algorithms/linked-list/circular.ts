import type {
  LinkedListModule,
  LinkedListState,
  LinkedListStep,
  LinkedListOperation,
  ListNode,
} from "@/engine/types";
import { cloneNodes, makeStep, buildNodeMap, newNodeId } from "./utils";

// ─── TypeScript code strings ──────────────────────────────────────────────────

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

// ─── Python code strings ──────────────────────────────────────────────────────

const INSERT_CODE_PYTHON = `class Node:
  def __init__(self, value):
    self.value = value
    self.next = None

class CircularLinkedList:
  def __init__(self):
    self.head = None
    self.tail = None

  def insert_at_head(self, value):
    new_node = Node(value)
    if not self.head:
      new_node.next = new_node
      self.head = self.tail = new_node
      return
    new_node.next = self.head
    self.tail.next = new_node
    self.head = new_node

  def insert_at_tail(self, value):
    new_node = Node(value)
    if not self.head:
      new_node.next = new_node
      self.head = self.tail = new_node
      return
    new_node.next = self.head
    self.tail.next = new_node
    self.tail = new_node

  def insert_at_index(self, index, value):
    if index == 0:
      return self.insert_at_head(value)
    prev = self._get_node_at(index - 1)
    new_node = Node(value)
    new_node.next = prev.next
    prev.next = new_node
    if new_node.next is self.head:
      self.tail = new_node`;

const DELETE_CODE_PYTHON = `class CircularLinkedList:
  def delete_at_head(self):
    if not self.head:
      return
    if self.head is self.tail:
      self.head = self.tail = None
      return
    self.head = self.head.next
    self.tail.next = self.head

  def delete_at_tail(self):
    if not self.head:
      return
    if self.head is self.tail:
      self.head = self.tail = None
      return
    prev = self.head
    while prev.next is not self.tail:
      prev = prev.next
    prev.next = self.head
    self.tail = prev

  def delete_at_index(self, index):
    if index == 0:
      return self.delete_at_head()
    prev = self._get_node_at(index - 1)
    target = prev.next
    prev.next = target.next
    if target is self.tail:
      self.tail = prev`;

const SEARCH_CODE_PYTHON = `class CircularLinkedList:
  def search(self, value):
    if not self.head:
      return -1
    current = self.head
    index = 0
    while True:
      if current.value == value:
        return index  # found
      current = current.next
      index += 1
      if current is self.head:
        break
    return -1  # not found`;

const REVERSE_CODE_PYTHON = `class CircularLinkedList:
  def reverse(self):
    prev = None
    current = self.head
    original_head = self.head
    while True:
      next_node = current.next
      current.next = prev
      prev = current
      current = next_node
      if current is original_head:
        break
    self.tail = original_head
    self.tail.next = prev
    self.head = prev`;

// ─── Java code strings ────────────────────────────────────────────────────────

const INSERT_CODE_JAVA = `public class CircularLinkedList<T> {
  private static class Node<T> {
    T value;
    Node<T> next;
    Node(T v) { value = v; next = null; }
  }
  private Node<T> head;
  private Node<T> tail;

  public void insertAtHead(T value) {
    Node<T> newNode = new Node<>(value);
    if (head == null) {
      newNode.next = newNode;
      head = tail = newNode;
      return;
    }
    newNode.next = head;
    tail.next = newNode;
    head = newNode;
  }

  public void insertAtTail(T value) {
    Node<T> newNode = new Node<>(value);
    if (head == null) {
      newNode.next = newNode;
      head = tail = newNode;
      return;
    }
    newNode.next = head;
    tail.next = newNode;
    tail = newNode;
  }

  public void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> newNode = new Node<>(value);
    newNode.next = prev.next;
    prev.next = newNode;
    if (newNode.next == head) tail = newNode;
  }
}`;

const DELETE_CODE_JAVA = `public class CircularLinkedList<T> {
  private Node<T> head;
  private Node<T> tail;

  public void deleteAtHead() {
    if (head == null) return;
    if (head == tail) {
      head = tail = null;
      return;
    }
    head = head.next;
    tail.next = head;
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
    prev.next = head;
    tail = prev;
  }

  public void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node<T> prev = getNodeAt(index - 1);
    Node<T> target = prev.next;
    prev.next = target.next;
    if (target == tail) tail = prev;
  }
}`;

const SEARCH_CODE_JAVA = `public class CircularLinkedList<T> {
  public int search(T value) {
    if (head == null) return -1;
    Node<T> current = head;
    int index = 0;
    do {
      if (current.value.equals(value)) {
        return index; // found
      }
      current = current.next;
      index++;
    } while (current != head);
    return -1; // not found
  }
}`;

const REVERSE_CODE_JAVA = `public class CircularLinkedList<T> {
  public void reverse() {
    Node<T> prev = null;
    Node<T> current = head;
    Node<T> originalHead = head;
    do {
      Node<T> next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    } while (current != originalHead);
    tail = originalHead;
    tail.next = prev;
    head = prev;
  }
}`;

// ─── C++ code strings ─────────────────────────────────────────────────────────

const INSERT_CODE_CPP = `template<typename T>
class CircularLinkedList {
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
    if (!head) {
      newNode->next = newNode;
      head = tail = newNode;
      return;
    }
    newNode->next = head;
    tail->next = newNode;
    head = newNode;
  }

  void insertAtTail(T value) {
    Node* newNode = new Node(value);
    if (!head) {
      newNode->next = newNode;
      head = tail = newNode;
      return;
    }
    newNode->next = head;
    tail->next = newNode;
    tail = newNode;
  }

  void insertAtIndex(int index, T value) {
    if (index == 0) { insertAtHead(value); return; }
    Node* prev = getNodeAt(index - 1);
    Node* newNode = new Node(value);
    newNode->next = prev->next;
    prev->next = newNode;
    if (newNode->next == head) tail = newNode;
  }
};`;

const DELETE_CODE_CPP = `template<typename T>
class CircularLinkedList {
  Node* head = nullptr;
  Node* tail = nullptr;

public:
  void deleteAtHead() {
    if (!head) return;
    if (head == tail) {
      delete head;
      head = tail = nullptr;
      return;
    }
    Node* old = head;
    head = head->next;
    tail->next = head;
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
    prev->next = head;
    tail = prev;
  }

  void deleteAtIndex(int index) {
    if (index == 0) { deleteAtHead(); return; }
    Node* prev = getNodeAt(index - 1);
    Node* target = prev->next;
    prev->next = target->next;
    if (target == tail) tail = prev;
    delete target;
  }
};`;

const SEARCH_CODE_CPP = `template<typename T>
class CircularLinkedList {
public:
  int search(T value) {
    if (!head) return -1;
    Node* current = head;
    int index = 0;
    do {
      if (current->value == value) {
        return index; // found
      }
      current = current->next;
      index++;
    } while (current != head);
    return -1; // not found
  }
};`;

const REVERSE_CODE_CPP = `template<typename T>
class CircularLinkedList {
public:
  void reverse() {
    Node* prev = nullptr;
    Node* current = head;
    Node* originalHead = head;
    do {
      Node* next = current->next;
      current->next = prev;
      prev = current;
      current = next;
    } while (current != originalHead);
    tail = originalHead;
    tail->next = prev;
    head = prev;
  }
};`;

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

    if (!headId) {
      newNode.next = newNode.id;
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [4, 5],
        stepLabel: "done",
        description: `List was empty. Node points to itself — circular link established.`,
      });
      return;
    }

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [7],
      stepLabel: "link",
      description: `New node's next → current head (${map.get(headId)?.value}).`,
    });

    const tail = map.get(tailId!)!;
    tail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [tail.id],
      highlightedLines: [8],
      stepLabel: "link",
      description: `Tail's next → new node (circular link maintained).`,
    });

    headId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [9],
      stepLabel: "update-head",
      description: `New node is now the head. Insert complete.`,
    });
    return;
  }

  if (position === "tail") {
    nodes.push(newNode);
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [13],
      stepLabel: "create-node",
      description: `Creating new node with value ${op.value}.`,
    });

    if (!headId) {
      newNode.next = newNode.id;
      headId = newNode.id;
      tailId = newNode.id;
      yield makeStep(nodes, headId, tailId, {
        insertedNodeId: newNode.id,
        highlightedLines: [15, 16],
        stepLabel: "done",
        description: `List was empty. Node points to itself — circular link established.`,
      });
      return;
    }

    newNode.next = headId;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [newNode.id],
      highlightedLines: [18],
      stepLabel: "link",
      description: `New node's next → head (${map.get(headId)?.value}) to stay circular.`,
    });

    const oldTail = map.get(tailId!)!;
    oldTail.next = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      affectedNodeIds: [oldTail.id],
      highlightedLines: [19],
      stepLabel: "link",
      description: `Old tail's next → new node.`,
    });

    tailId = newNode.id;
    yield makeStep(nodes, headId, tailId, {
      insertedNodeId: newNode.id,
      highlightedLines: [20],
      stepLabel: "update-tail",
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
    stepLabel: "create-node",
    description: `Creating new node with value ${op.value}.`,
  });

  let walker = map.get(headId!)!;
  for (let i = 0; i < targetIndex - 1; i++) {
    yield makeStep(nodes, headId, tailId, {
      activeNodeId: walker.id,
      insertedNodeId: newNode.id,
      highlightedLines: [25],
      stepLabel: "traverse",
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    insertedNodeId: newNode.id,
    highlightedLines: [25],
    stepLabel: "traverse",
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
    stepLabel: "done",
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

    if (headId === tailId) {
      yield makeStep(nodes, headId, tailId, {
        deletedNodeId: headId,
        highlightedLines: [3],
        stepLabel: "unlink",
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [4],
        stepLabel: "done",
        description: `List is now empty.`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      deletedNodeId: headId,
      highlightedLines: [1],
      stepLabel: "unlink",
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
      stepLabel: "update-head",
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
        stepLabel: "unlink",
        description: `Single node list. Removing the only node.`,
      });
      yield makeStep([], null, null, {
        highlightedLines: [13],
        stepLabel: "done",
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
        stepLabel: "traverse",
        description: `Walking — at value ${prev.value}.`,
      });
      prev = map.get(prev.next!)!;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: prev.id,
      deletedNodeId: target.id,
      highlightedLines: [18],
      stepLabel: "unlink",
      description: `Reached second-to-last (value: ${prev.value}). Re-linking to head.`,
    });

    prev.next = headId;
    tailId = prev.id;
    const remaining = nodes.filter((n) => n.id !== target.id);

    yield makeStep(remaining, headId, tailId, {
      affectedNodeIds: [prev.id],
      highlightedLines: [19, 20],
      stepLabel: "update-tail",
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
      stepLabel: "traverse",
      description: `Walking — at index ${i} (value: ${walker.value}).`,
    });
    walker = map.get(walker.next!)!;
  }

  const targetNode = map.get(walker.next!)!;
  yield makeStep(nodes, headId, tailId, {
    activeNodeId: walker.id,
    deletedNodeId: targetNode.id,
    highlightedLines: [26],
    stepLabel: "unlink",
    description: `Targeting node at index ${targetIndex} (value: ${targetNode.value}).`,
  });

  walker.next = targetNode.next;
  if (targetNode.id === tailId) tailId = walker.id;

  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  yield makeStep(remaining, headId, tailId, {
    affectedNodeIds: [walker.id],
    highlightedLines: [27, 28],
    stepLabel: "done",
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
      stepLabel: "not-found",
      description: `List is empty. Nothing to search.`,
    });
    return;
  }

  yield makeStep(nodes, headId, tailId, {
    activeNodeId: headId,
    highlightedLines: [3],
    stepLabel: "start",
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
        stepLabel: "found",
        description: `Found value ${op.value} at index ${index}!`,
      });
      return;
    }

    yield makeStep(nodes, headId, tailId, {
      activeNodeId: current.id,
      highlightedLines: [5, 6],
      stepLabel: "compare",
      description: `Index ${index}: value ${current.value} ≠ ${op.value}. Moving to next.`,
    });

    current = map.get(current.next!)!;
    index++;
  } while (current.id !== headId);

  yield makeStep(nodes, headId, tailId, {
    highlightedLines: [12],
    stepLabel: "not-found",
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
      stepLabel: "done",
      description: `List is empty. Nothing to reverse.`,
    });
    return;
  }

  yield makeStep(nodes, headId, state.tailId, {
    pointerLabels: { prev: null, current: headId, next: null },
    highlightedLines: [2, 3, 5],
    stepLabel: "init-pointers",
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
      stepLabel: "save-next",
      description: `Save next = ${nextId ? `node ${map.get(nextId)?.value}` : "null"}.`,
    });

    currentNode.next = prevId;
    yield makeStep(nodes, headId, state.tailId, {
      activeNodeId: currentId,
      affectedNodeIds: [currentId],
      pointerLabels: { prev: prevId, current: currentId, next: nextId },
      highlightedLines: [8],
      stepLabel: "reverse-link",
      description: `Reverse: node ${currentNode.value}.next → ${prevId ? `node ${map.get(prevId)?.value}` : "null"}.`,
    });

    prevId = currentId;
    currentId = nextId;

    yield makeStep(nodes, headId, state.tailId, {
      pointerLabels: { prev: prevId, current: currentId, next: null },
      highlightedLines: [9, 10],
      stepLabel: "advance",
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
    stepLabel: "update-head",
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
  codeByOperationByLanguage: {
    insert: {
      typescript: {
        code: INSERT_CODE,
        lineCount: 30,
        lineMap: {
          "create-node": [2, 13, 26],
          "traverse": [25],
          "link": [7, 8, 18, 19, 27, 28],
          "update-head": [9, 24],
          "update-tail": [20, 29, 30],
          "done": [4, 5, 15, 16, 28],
        },
      },
      python: {
        code: INSERT_CODE_PYTHON,
        lineCount: 38,
        lineMap: {
          "create-node": [12, 22, 33],
          "traverse": [32],
          "link": [17, 18, 26, 27, 35, 36],
          "update-head": [19, 31],
          "update-tail": [28, 37, 38],
          "done": [13, 14, 15, 23, 24, 25, 36],
        },
      },
      java: {
        code: INSERT_CODE_JAVA,
        lineCount: 39,
        lineMap: {
          "create-node": [11, 22, 34],
          "traverse": [33],
          "link": [17, 18, 29, 30, 36, 37],
          "update-head": [19, 32],
          "update-tail": [31, 38],
          "done": [13, 14, 15, 24, 25, 26, 37],
        },
      },
      cpp: {
        code: INSERT_CODE_CPP,
        lineCount: 41,
        lineMap: {
          "create-node": [13, 24, 36],
          "traverse": [35],
          "link": [19, 20, 31, 32, 38, 39],
          "update-head": [21, 34],
          "update-tail": [33, 40],
          "done": [15, 16, 17, 26, 27, 28, 39],
        },
      },
    },
    delete: {
      typescript: {
        code: DELETE_CODE,
        lineCount: 28,
        lineMap: {
          "traverse": [16, 17, 25],
          "unlink": [3, 12, 26],
          "update-head": [6, 7, 24],
          "update-tail": [19, 20, 28],
          "done": [4, 13, 27],
        },
      },
      python: {
        code: DELETE_CODE_PYTHON,
        lineCount: 28,
        lineMap: {
          "traverse": [17, 18, 25],
          "unlink": [5, 14, 26],
          "update-head": [8, 9, 23],
          "update-tail": [19, 20, 27, 28],
          "done": [6, 7, 15, 16, 27],
        },
      },
      java: {
        code: DELETE_CODE_JAVA,
        lineCount: 30,
        lineMap: {
          "traverse": [19, 20, 26],
          "unlink": [6, 15, 27],
          "update-head": [10, 11, 25],
          "update-tail": [22, 23, 29],
          "done": [7, 8, 16, 17, 28],
        },
      },
      cpp: {
        code: DELETE_CODE_CPP,
        lineCount: 34,
        lineMap: {
          "traverse": [26, 27, 33],
          "unlink": [9, 22, 34],
          "update-head": [14, 15, 32],
          "update-tail": [30, 31, 36],
          "done": [11, 12, 23, 24, 35],
        },
      },
    },
    search: {
      typescript: {
        code: SEARCH_CODE,
        lineCount: 12,
        lineMap: {
          "start": [3, 4],
          "compare": [5, 6],
          "advance": [9, 10],
          "found": [6, 7],
          "not-found": [12],
        },
      },
      python: {
        code: SEARCH_CODE_PYTHON,
        lineCount: 13,
        lineMap: {
          "start": [5, 6],
          "compare": [7, 8],
          "advance": [10, 11],
          "found": [8, 9],
          "not-found": [13],
        },
      },
      java: {
        code: SEARCH_CODE_JAVA,
        lineCount: 13,
        lineMap: {
          "start": [4, 5],
          "compare": [6, 7],
          "advance": [9, 10],
          "found": [7, 8],
          "not-found": [12],
        },
      },
      cpp: {
        code: SEARCH_CODE_CPP,
        lineCount: 16,
        lineMap: {
          "start": [5, 6],
          "compare": [8, 9],
          "advance": [11, 12],
          "found": [9, 10],
          "not-found": [15],
        },
      },
    },
    reverse: {
      typescript: {
        code: REVERSE_CODE,
        lineCount: 15,
        lineMap: {
          "init-pointers": [2, 3, 4, 5],
          "save-next": [7],
          "reverse-link": [8],
          "advance": [9, 10],
          "update-head": [13, 14, 15],
          "done": [15],
        },
      },
      python: {
        code: REVERSE_CODE_PYTHON,
        lineCount: 14,
        lineMap: {
          "init-pointers": [3, 4, 5],
          "save-next": [7],
          "reverse-link": [8],
          "advance": [9, 10],
          "update-head": [12, 13, 14],
          "done": [14],
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
          "update-head": [12, 13, 14],
          "done": [14],
        },
      },
      cpp: {
        code: REVERSE_CODE_CPP,
        lineCount: 17,
        lineMap: {
          "init-pointers": [5, 6, 7],
          "save-next": [9],
          "reverse-link": [10],
          "advance": [11, 12],
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
