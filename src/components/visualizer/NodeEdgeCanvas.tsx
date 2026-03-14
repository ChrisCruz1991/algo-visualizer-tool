import type { PresetGraph, GraphStep } from "@/engine/types";

type Props = {
  graph: PresetGraph;
  step: GraphStep | null;
  startNodeId: string;
};

const NODE_RADIUS = 22;

function getNodeColor(
  nodeId: string,
  step: GraphStep | null,
  startNodeId: string
): string {
  if (!step) {
    return nodeId === startNodeId ? "#3b82f6" : "#9ca3af";
  }
  // Priority: default → visited → queue/stack → active → start (once visited, start stays blue)
  let color = "#9ca3af"; // gray — unvisited
  if (step.visitedNodes.includes(nodeId)) color = "#22c55e"; // green
  if (step.queueOrStack.includes(nodeId)) color = "#fbbf24"; // amber
  if (step.activeNode === nodeId) color = "#f97316"; // orange
  // Start node: blue only before it's been fully processed (while in queue/active/initial)
  if (nodeId === startNodeId && !step.visitedNodes.includes(nodeId)) {
    color = "#3b82f6"; // blue
  }
  return color;
}

function isEdgeTraversed(
  from: string,
  to: string,
  traversedEdges: Array<{ from: string; to: string }>,
  directed: boolean
): boolean {
  return traversedEdges.some(
    (e) =>
      (e.from === from && e.to === to) ||
      (!directed && e.from === to && e.to === from)
  );
}

function computeViewBox(graph: PresetGraph): string {
  const pad = 50;
  const xs = graph.nodes.map((n) => n.x);
  const ys = graph.nodes.map((n) => n.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
}

function shortenEndpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  shorten: number
): { x: number; y: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { x: x2, y: y2 };
  return {
    x: x2 - (dx / dist) * shorten,
    y: y2 - (dy / dist) * shorten,
  };
}

export default function NodeEdgeCanvas({ graph, step, startNodeId }: Props) {
  const viewBox = computeViewBox(graph);
  const traversedEdges = step?.traversedEdges ?? [];

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full">
      <svg
        viewBox={viewBox}
        className="w-full h-auto max-h-[420px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Arrowhead marker for directed graphs */}
        {graph.directed && (
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
            </marker>
            <marker
              id="arrowhead-gray"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
            </marker>
          </defs>
        )}

        {/* Edges */}
        {graph.edges.map((edge, i) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;

          const traversed = isEdgeTraversed(
            edge.from,
            edge.to,
            traversedEdges,
            graph.directed
          );

          // Shorten endpoint for directed graphs to show arrowhead at node border
          const end = graph.directed
            ? shortenEndpoint(from.x, from.y, to.x, to.y, NODE_RADIUS + 2)
            : { x: to.x, y: to.y };

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={end.x}
              y2={end.y}
              stroke={traversed ? "#6366f1" : "#d1d5db"}
              strokeWidth={traversed ? 3 : 1.5}
              markerEnd={
                graph.directed
                  ? traversed
                    ? "url(#arrowhead)"
                    : "url(#arrowhead-gray)"
                  : undefined
              }
              style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const color = getNodeColor(node.id, step, startNodeId);
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={color}
                stroke="white"
                strokeWidth={2}
                style={{ transition: "fill 0.2s ease" }}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight={600}
                fill="white"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
