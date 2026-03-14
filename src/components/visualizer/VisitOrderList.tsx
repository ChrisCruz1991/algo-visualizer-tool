type Props = {
  visitOrder: number[];
  label: string;
};

export default function VisitOrderList({ visitOrder, label }: Props) {
  return (
    <div className="mt-3 px-4">
      <div className="mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1 flex-wrap min-h-[32px]">
        {visitOrder.length === 0 ? (
          <span className="text-xs text-gray-400 italic">No nodes visited yet</span>
        ) : (
          <>
            <span className="text-xs text-gray-400 mr-1">[</span>
            {visitOrder.map((value, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                           bg-green-100 border border-green-400 text-green-800
                           transition-transform duration-200"
              >
                {value}
              </span>
            ))}
            <span className="text-xs text-gray-400 ml-1">]</span>
          </>
        )}
      </div>
    </div>
  );
}
