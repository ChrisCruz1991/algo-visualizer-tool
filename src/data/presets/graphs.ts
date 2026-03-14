import type { PresetGraph } from "@/engine/types";

export const graphPresets: PresetGraph[] = [
  {
    name: "Small Sparse Graph (6 nodes)",
    directed: false,
    nodes: [
      { id: "A", label: "A", x: 200, y: 60 },
      { id: "B", label: "B", x: 90,  y: 180 },
      { id: "C", label: "C", x: 310, y: 180 },
      { id: "D", label: "D", x: 40,  y: 320 },
      { id: "E", label: "E", x: 180, y: 320 },
      { id: "F", label: "F", x: 340, y: 320 },
    ],
    edges: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "B", to: "E" },
      { from: "C", to: "F" },
    ],
  },
  {
    name: "Medium Connected Graph (10 nodes)",
    directed: false,
    nodes: [
      { id: "1",  label: "1",  x: 250, y: 50  },
      { id: "2",  label: "2",  x: 100, y: 150 },
      { id: "3",  label: "3",  x: 400, y: 150 },
      { id: "4",  label: "4",  x: 40,  y: 280 },
      { id: "5",  label: "5",  x: 175, y: 280 },
      { id: "6",  label: "6",  x: 325, y: 280 },
      { id: "7",  label: "7",  x: 460, y: 280 },
      { id: "8",  label: "8",  x: 100, y: 400 },
      { id: "9",  label: "9",  x: 270, y: 400 },
      { id: "10", label: "10", x: 430, y: 400 },
    ],
    edges: [
      { from: "1",  to: "2"  },
      { from: "1",  to: "3"  },
      { from: "2",  to: "4"  },
      { from: "2",  to: "5"  },
      { from: "3",  to: "6"  },
      { from: "3",  to: "7"  },
      { from: "5",  to: "8"  },
      { from: "5",  to: "9"  },
      { from: "6",  to: "9"  },
      { from: "7",  to: "10" },
    ],
  },
  {
    name: "Disconnected Graph (8 nodes, 2 components)",
    directed: false,
    nodes: [
      // Component 1 (triangle)
      { id: "A", label: "A", x: 110, y: 100 },
      { id: "B", label: "B", x: 240, y: 100 },
      { id: "C", label: "C", x: 175, y: 230 },
      // Component 2 (triangle)
      { id: "D", label: "D", x: 380, y: 100 },
      { id: "E", label: "E", x: 510, y: 100 },
      { id: "F", label: "F", x: 445, y: 230 },
      // Two isolated nodes
      { id: "G", label: "G", x: 130, y: 370 },
      { id: "H", label: "H", x: 450, y: 370 },
    ],
    edges: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "A", to: "C" },
      { from: "D", to: "E" },
      { from: "E", to: "F" },
      { from: "D", to: "F" },
    ],
  },
];
