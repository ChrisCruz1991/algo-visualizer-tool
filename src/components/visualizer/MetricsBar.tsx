type Props = {
  comparisons: number;
  swapsOrAccesses: number;
  swapsLabel: string;
  stepIndex: number;
  totalSteps: number;
};

export default function MetricsBar({
  comparisons,
  swapsOrAccesses,
  swapsLabel,
  stepIndex,
  totalSteps,
}: Props) {
  return (
    <div className="flex gap-6 px-4 py-2 bg-white border-t border-gray-200 text-sm">
      <Stat label="Comparisons" value={comparisons} />
      <Stat label={swapsLabel} value={swapsOrAccesses} />
      <Stat
        label="Step"
        value={totalSteps > 0 ? `${stepIndex} / ${totalSteps}` : "—"}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-900 tabular-nums">{value}</span>
    </div>
  );
}
