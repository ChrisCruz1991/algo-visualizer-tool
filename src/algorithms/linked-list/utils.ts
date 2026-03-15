import type { ListNode, LinkedListState, LinkedListStep, ListVariant } from "@/engine/types";

let nodeCounter = 0;
export function newNodeId(): string {
  return `n${nodeCounter++}`;
}

export function cloneNodes(nodes: ListNode[]): ListNode[] {
  return nodes.map((n) => ({ ...n }));
}

/** Build a full LinkedListState from a flat array of values. */
export function makeInitialListState(
  values: number[],
  variant: ListVariant
): LinkedListState {
  if (values.length === 0) {
    return { nodes: [], headId: null, tailId: null, variant };
  }

  const nodes: ListNode[] = values.map((value) => ({
    id: newNodeId(),
    value,
    next: null,
    prev: null,
  }));

  // Wire next pointers
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1].id;
  }

  // Wire prev pointers for doubly
  if (variant === "doubly") {
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].prev = nodes[i - 1].id;
    }
  }

  // Circular: tail.next = head
  if (variant === "circular") {
    nodes[nodes.length - 1].next = nodes[0].id;
  }

  return {
    nodes,
    headId: nodes[0].id,
    tailId: nodes[nodes.length - 1].id,
    variant,
  };
}

/** Walk from headId and return the node at the given index (0-based). */
export function getNodeAt(
  nodes: ListNode[],
  headId: string | null,
  index: number,
  variant: ListVariant
): ListNode | null {
  const map = buildNodeMap(nodes);
  let current = headId ? map.get(headId) ?? null : null;
  let i = 0;
  while (current && i < index) {
    if (!current.next) return null;
    // For circular, avoid looping back to head
    if (variant === "circular" && current.next === headId) return null;
    current = map.get(current.next) ?? null;
    i++;
  }
  return current;
}

export function buildNodeMap(nodes: ListNode[]): Map<string, ListNode> {
  return new Map(nodes.map((n) => [n.id, n]));
}

/** Produce a complete LinkedListStep with safe defaults for all fields. */
export function makeStep(
  nodes: ListNode[],
  headId: string | null,
  tailId: string | null,
  overrides: Partial<Omit<LinkedListStep, "type" | "nodes" | "headId" | "tailId">>
): LinkedListStep {
  return {
    type: "linked-list",
    nodes: cloneNodes(nodes),
    headId,
    tailId,
    activeNodeId: null,
    targetNodeId: null,
    affectedNodeIds: [],
    insertedNodeId: null,
    deletedNodeId: null,
    pointerLabels: {},
    highlightedLines: [],
    description: "",
    ...overrides,
  };
}
