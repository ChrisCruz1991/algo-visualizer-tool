import CodeViewer from "@/components/code/CodeViewer";

type Props = {
  code: string;
  highlightedLines: number[];
};

export default function CodeTab({ code, highlightedLines }: Props) {
  return (
    <div className="h-full overflow-auto">
      <CodeViewer code={code} highlightedLines={highlightedLines} />
    </div>
  );
}
