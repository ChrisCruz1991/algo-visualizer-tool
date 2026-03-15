import type { LinkedListStep, LinkedListState, ListVariant, ListNode } from "@/engine/types";

// ─── Layout constants ─────────────────────────────────────────────────────────

const NODE_W = 68;
const NODE_H = 40;
const GAP = 52; // space between nodes (arrow lives here)
const ROW_Y = 100; // vertical center of nodes
const PAD_X = 40;
const NULL_W = 36;
const POINTER_ROW_OFFSET = 26; // how far backward arrows sit below center (doubly)

// ─── Color helpers ────────────────────────────────────────────────────────────

function nodeColor(id: string, step: LinkedListStep | null): string {
  if (!step) return "#9ca3af";
  if (step.insertedNodeId === id) return "#22c55e";
  if (step.deletedNodeId === id) return "#ef4444";
  if (step.affectedNodeIds.includes(id)) return "#f59e0b";
  if (step.targetNodeId === id) return "#3b82f6";
  if (step.activeNodeId === id) return "#f97316";
  return "#9ca3af";
}

function nodeX(index: number): number {
  return PAD_X + index * (NODE_W + GAP);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Arrowhead({ x, y }: { x: number; y: number }) {
  // Small right-pointing triangle
  return (
    <polygon
      points={`${x},${y} ${x - 8},${y - 4} ${x - 8},${y + 4}`}
      fill="#6b7280"
    />
  );
}

function LeftArrowhead({ x, y }: { x: number; y: number }) {
  return (
    <polygon
      points={`${x},${y} ${x + 8},${y - 4} ${x + 8},${y + 4}`}
      fill="#6b7280"
    />
  );
}

function NullBox({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y - NODE_H / 2}
        width={NULL_W}
        height={NODE_H}
        rx={4}
        fill="#f3f4f6"
        stroke="#d1d5db"
        strokeWidth={1}
      />
      <text
        x={x + NULL_W / 2}
        y={y + 5}
        textAnchor="middle"
        fontSize={10}
        fill="#9ca3af"
        fontFamily="monospace"
      >
        null
      </text>
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  step: LinkedListStep | null;
  variant: ListVariant;
  initialState: LinkedListState;
};

export default function LinkedListCanvas({ step, variant, initialState }: Props) {
  const nodes: ListNode[] = step ? step.nodes : initialState.nodes;
  const headId: string | null = step ? step.headId : initialState.headId;
  const tailId: string | null = step ? step.tailId : initialState.tailId;
  const pointerLabels: Record<string, string | null> = step?.pointerLabels ?? {};

  // Build ordered node array from headId
  const ordered: ListNode[] = [];
  if (headId) {
    const map = new Map(nodes.map((n) => [n.id, n]));
    let current = map.get(headId);
    const seen = new Set<string>();
    while (current && !seen.has(current.id)) {
      ordered.push(current);
      seen.add(current.id);
      if (!current.next) break;
      if (variant === "circular" && current.next === headId) break;
      current = map.get(current.next);
    }
  }

  const count = ordered.length;
  const svgWidth =
    count === 0
      ? 200
      : PAD_X + count * (NODE_W + GAP) - GAP + (variant !== "circular" ? GAP + NULL_W : 0) + PAD_X;
  const svgHeight = variant === "doubly" ? 200 : 160;

  // ─── Render empty state ────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="min-w-full">
          <text
            x={svgWidth / 2}
            y={ROW_Y + 5}
            textAnchor="middle"
            fontSize={14}
            fill="#9ca3af"
          >
            Empty list
          </text>
        </svg>
      </div>
    );
  }

  // ─── Build node position map ───────────────────────────────────────────────
  const posMap = new Map<string, number>(); // nodeId → index
  ordered.forEach((n, i) => posMap.set(n.id, i));

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ minWidth: svgWidth }}
      >
        {/* ── Forward arrows (all variants) ─────────────────────────────── */}
        {ordered.map((node, i) => {
          const x = nodeX(i);
          const isLast = i === ordered.length - 1;

          if (variant === "circular" && isLast) {
            // Bezier wrap-around back to head
            const startX = x + NODE_W;
            const endX = nodeX(0);
            const cpY = ROW_Y + 70;
            return (
              <g key={`circ-arrow-${node.id}`}>
                <path
                  d={`M ${startX} ${ROW_Y} C ${startX + 20} ${cpY}, ${endX - 20} ${cpY}, ${endX} ${ROW_Y}`}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead-circ)"
                />
              </g>
            );
          }

          if (!isLast || variant !== "singly") {
            // Normal forward arrow into gap
            const arrowStart = x + NODE_W;
            const arrowEnd = x + NODE_W + GAP - 4;
            return (
              <g key={`fwd-${node.id}`}>
                <line
                  x1={arrowStart}
                  y1={ROW_Y}
                  x2={arrowEnd - 8}
                  y2={ROW_Y}
                  stroke="#6b7280"
                  strokeWidth={1.5}
                />
                <Arrowhead x={arrowEnd} y={ROW_Y} />
              </g>
            );
          }

          // Singly last node → null box
          const arrowStart = x + NODE_W;
          const arrowEnd = arrowStart + 12;
          return (
            <g key={`null-arrow-${node.id}`}>
              <line
                x1={arrowStart}
                y1={ROW_Y}
                x2={arrowEnd - 8}
                y2={ROW_Y}
                stroke="#6b7280"
                strokeWidth={1.5}
              />
              <Arrowhead x={arrowEnd} y={ROW_Y} />
            </g>
          );
        })}

        {/* Null indicator (singly/doubly only) */}
        {variant !== "circular" && count > 0 && (
          <NullBox
            x={nodeX(ordered.length - 1) + NODE_W + GAP - 4}
            y={ROW_Y}
          />
        )}

        {/* ── Backward arrows (doubly only) ─────────────────────────────── */}
        {variant === "doubly" &&
          ordered.slice(1).map((node, i) => {
            const rightX = nodeX(i) + NODE_W; // right edge of prev node
            const leftX = nodeX(i + 1); // left edge of this node
            const arrowY = ROW_Y + POINTER_ROW_OFFSET;
            return (
              <g key={`bwd-${node.id}`}>
                <line
                  x1={leftX}
                  y1={arrowY}
                  x2={rightX + 8}
                  y2={arrowY}
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <LeftArrowhead x={rightX} y={arrowY} />
              </g>
            );
          })}

        {/* SVG marker for circular arrowhead */}
        <defs>
          <marker
            id="arrowhead-circ"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#6b7280" />
          </marker>
        </defs>

        {/* ── Nodes ─────────────────────────────────────────────────────── */}
        {ordered.map((node, i) => {
          const x = nodeX(i);
          const fill = nodeColor(node.id, step);
          const isHead = node.id === headId;
          const isTail = node.id === tailId;

          return (
            <g key={node.id}>
              {/* Head / tail labels */}
              {isHead && (
                <text
                  x={x + NODE_W / 2}
                  y={ROW_Y - NODE_H / 2 - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6366f1"
                  fontWeight="600"
                >
                  head
                </text>
              )}
              {isTail && !isHead && (
                <text
                  x={x + NODE_W / 2}
                  y={ROW_Y - NODE_H / 2 - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6366f1"
                  fontWeight="600"
                >
                  tail
                </text>
              )}
              {isTail && isHead && (
                <text
                  x={x + NODE_W / 2}
                  y={ROW_Y - NODE_H / 2 - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6366f1"
                  fontWeight="600"
                >
                  head/tail
                </text>
              )}

              {/* Node rectangle */}
              <rect
                x={x}
                y={ROW_Y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill={fill}
                stroke="#e5e7eb"
                strokeWidth={1.5}
                style={{ transition: "fill 0.2s ease" }}
              />

              {/* Divider between value and arrow section */}
              <line
                x1={x + NODE_W * 0.65}
                y1={ROW_Y - NODE_H / 2}
                x2={x + NODE_W * 0.65}
                y2={ROW_Y + NODE_H / 2}
                stroke="#e5e7eb"
                strokeWidth={1}
              />

              {/* Value */}
              <text
                x={x + NODE_W * 0.3}
                y={ROW_Y + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="600"
                fill="white"
              >
                {node.value}
              </text>

              {/* Arrow indicator in right section */}
              <text
                x={x + NODE_W * 0.825}
                y={ROW_Y + 5}
                textAnchor="middle"
                fontSize={12}
                fill="white"
                opacity={0.85}
              >
                →
              </text>

              {/* Doubly: prev indicator in left section */}
              {variant === "doubly" && (
                <>
                  <line
                    x1={x + NODE_W * 0.32}
                    y1={ROW_Y - NODE_H / 2}
                    x2={x + NODE_W * 0.32}
                    y2={ROW_Y + NODE_H / 2}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <text
                    x={x + NODE_W * 0.16}
                    y={ROW_Y + 5}
                    textAnchor="middle"
                    fontSize={11}
                    fill="white"
                    opacity={0.85}
                  >
                    ←
                  </text>
                  {/* Value is in the middle section */}
                  <text
                    x={x + NODE_W * 0.57}
                    y={ROW_Y + 5}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight="600"
                    fill="white"
                  >
                    {node.value}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* ── Pointer labels for reverse (prev/current/next) ─────────────── */}
        {Object.entries(pointerLabels).map(([label, nodeId]) => {
          if (!nodeId) return null;
          const idx = posMap.get(nodeId);
          if (idx === undefined) return null;
          const x = nodeX(idx) + NODE_W / 2;
          const labelColors: Record<string, string> = {
            prev: "#7c3aed",
            current: "#ea580c",
            next: "#2563eb",
          };
          const color = labelColors[label] ?? "#374151";
          return (
            <g key={`ptr-${label}`}>
              <rect
                x={x - 20}
                y={ROW_Y - NODE_H / 2 - 28}
                width={40}
                height={18}
                rx={4}
                fill={color}
                opacity={0.9}
              />
              <text
                x={x}
                y={ROW_Y - NODE_H / 2 - 15}
                textAnchor="middle"
                fontSize={10}
                fill="white"
                fontWeight="600"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
