import type { PresetTree, TreeNode, TreeStep } from "@/engine/types";

type Props = {
  preset: PresetTree;
  step: TreeStep | null;
};

const NODE_RADIUS = 22;
const SVG_WIDTH = 560;
const VERTICAL_SPACING = 80;
const TOP_PAD = 50;

type LayoutCoord = { x: number; y: number };

function computeLayout(root: TreeNode): Map<string, LayoutCoord> {
  const coords = new Map<string, LayoutCoord>();
  const queue: Array<{ node: TreeNode; depth: number; index: number }> = [
    { node: root, depth: 0, index: 0 },
  ];

  while (queue.length > 0) {
    const { node, depth, index } = queue.shift()!;
    const slots = Math.pow(2, depth);
    const x = (index + 0.5) * (SVG_WIDTH / slots);
    const y = TOP_PAD + depth * VERTICAL_SPACING;
    coords.set(node.id, { x, y });

    if (node.left) {
      queue.push({ node: node.left, depth: depth + 1, index: index * 2 });
    }
    if (node.right) {
      queue.push({ node: node.right, depth: depth + 1, index: index * 2 + 1 });
    }
  }
  return coords;
}

function getNodeColor(nodeId: string, step: TreeStep | null): string {
  if (!step) return "#9ca3af";
  if (step.visitedNodes.includes(nodeId)) return "#22c55e"; // green
  if (step.activeNode === nodeId) return "#f97316"; // orange
  if (step.enteredNodes.includes(nodeId)) return "#fbbf24"; // amber
  return "#9ca3af"; // gray
}

function collectEdges(
  root: TreeNode
): Array<{ parentId: string; childId: string }> {
  const edges: Array<{ parentId: string; childId: string }> = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.left) {
      edges.push({ parentId: node.id, childId: node.left.id });
      queue.push(node.left);
    }
    if (node.right) {
      edges.push({ parentId: node.id, childId: node.right.id });
      queue.push(node.right);
    }
  }
  return edges;
}

function shortenTowardChild(
  px: number,
  py: number,
  cx: number,
  cy: number
): { x: number; y: number } {
  const dx = cx - px;
  const dy = cy - py;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { x: cx, y: cy };
  const ratio = NODE_RADIUS / dist;
  return {
    x: px + dx * ratio,
    y: py + dy * ratio,
  };
}

// Compute SVG height based on tree depth
function computeTreeDepth(root: TreeNode): number {
  let maxDepth = 0;
  const queue: Array<{ node: TreeNode; depth: number }> = [
    { node: root, depth: 0 },
  ];
  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;
    maxDepth = Math.max(maxDepth, depth);
    if (node.left) queue.push({ node: node.left, depth: depth + 1 });
    if (node.right) queue.push({ node: node.right, depth: depth + 1 });
  }
  return maxDepth;
}

export default function BinaryTreeCanvas({ preset, step }: Props) {
  const layout = computeLayout(preset.root);
  const edges = collectEdges(preset.root);
  const depth = computeTreeDepth(preset.root);
  const svgHeight = TOP_PAD + depth * VERTICAL_SPACING + NODE_RADIUS + 20;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        className="w-full h-auto max-h-[420px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Edges */}
        {edges.map(({ parentId, childId }) => {
          const parent = layout.get(parentId);
          const child = layout.get(childId);
          if (!parent || !child) return null;

          // Draw line from node border to node border
          const start = shortenTowardChild(
            child.x, child.y, parent.x, parent.y
          );
          const end = shortenTowardChild(
            parent.x, parent.y, child.x, child.y
          );

          return (
            <line
              key={`${parentId}-${childId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#d1d5db"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {Array.from(layout.entries()).map(([nodeId, coord]) => {
          const color = getNodeColor(nodeId, step);
          // Find the node's value
          let value: number | null = null;
          const queue: TreeNode[] = [preset.root];
          while (queue.length > 0) {
            const n = queue.shift()!;
            if (n.id === nodeId) { value = n.value; break; }
            if (n.left) queue.push(n.left);
            if (n.right) queue.push(n.right);
          }

          return (
            <g key={nodeId}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={NODE_RADIUS}
                fill={color}
                stroke="white"
                strokeWidth={2}
                style={{ transition: "fill 0.2s ease" }}
              />
              <text
                x={coord.x}
                y={coord.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight={600}
                fill="white"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
