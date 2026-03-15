import { notFound } from "next/navigation";
import { getAlgorithmById } from "@/algorithms/index";
import MainPanel from "@/components/main-panel/MainPanel";

type Props = {
  params: Promise<{ algorithmId: string }>;
};

export default async function VisualizerPage({ params }: Props) {
  const { algorithmId } = await params;
  // Validate the ID server-side; show 404 for unknown routes
  const algorithm = getAlgorithmById(algorithmId);
  if (!algorithm) notFound();

  // Pass only the serializable string to the Client Component
  // MainPanel will do the registry lookup client-side
  return <MainPanel key={algorithmId} algorithmId={algorithmId} />;
}

export function generateStaticParams() {
  return [
    { algorithmId: "bubble-sort" },
    { algorithmId: "selection-sort" },
    { algorithmId: "insertion-sort" },
    { algorithmId: "merge-sort" },
    { algorithmId: "quick-sort" },
    { algorithmId: "heap-sort" },
    { algorithmId: "linear-search" },
    { algorithmId: "binary-search" },
    { algorithmId: "bfs" },
    { algorithmId: "dfs" },
    { algorithmId: "inorder" },
    { algorithmId: "preorder" },
    { algorithmId: "postorder" },
    { algorithmId: "linked-list-singly" },
    { algorithmId: "linked-list-doubly" },
    { algorithmId: "linked-list-circular" },
  ];
}
