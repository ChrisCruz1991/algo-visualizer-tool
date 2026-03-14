import type { PresetTree } from "@/engine/types";

export const treePresets: PresetTree[] = [
  {
    name: "Balanced Binary Tree (7 nodes, 3 levels)",
    root: {
      id: "n1", value: 1,
      left: {
        id: "n2", value: 2,
        left:  { id: "n4", value: 4 },
        right: { id: "n5", value: 5 },
      },
      right: {
        id: "n3", value: 3,
        left:  { id: "n6", value: 6 },
        right: { id: "n7", value: 7 },
      },
    },
  },
  {
    name: "Right-Skewed Tree (5 nodes)",
    root: {
      id: "n1", value: 1,
      right: {
        id: "n2", value: 2,
        right: {
          id: "n3", value: 3,
          right: {
            id: "n4", value: 4,
            right: { id: "n5", value: 5 },
          },
        },
      },
    },
  },
  {
    name: "Full Binary Tree (15 nodes, 4 levels)",
    root: {
      id: "n1", value: 1,
      left: {
        id: "n2", value: 2,
        left: {
          id: "n4", value: 4,
          left:  { id: "n8",  value: 8  },
          right: { id: "n9",  value: 9  },
        },
        right: {
          id: "n5", value: 5,
          left:  { id: "n10", value: 10 },
          right: { id: "n11", value: 11 },
        },
      },
      right: {
        id: "n3", value: 3,
        left: {
          id: "n6", value: 6,
          left:  { id: "n12", value: 12 },
          right: { id: "n13", value: 13 },
        },
        right: {
          id: "n7", value: 7,
          left:  { id: "n14", value: 14 },
          right: { id: "n15", value: 15 },
        },
      },
    },
  },
];
