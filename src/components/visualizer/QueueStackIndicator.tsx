type Props = {
  items: string[];
  mode: "queue" | "stack";
  label: string;
};

export default function QueueStackIndicator({ items, mode, label }: Props) {
  if (mode === "queue") {
    return (
      <div className="mt-3 px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xs text-gray-400">(front → back)</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap min-h-[32px]">
          {items.length === 0 ? (
            <span className="text-xs text-gray-400 italic">empty</span>
          ) : (
            items.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                           bg-amber-100 border border-amber-400 text-amber-800"
              >
                {item}
                {i === 0 && (
                  <span className="ml-1 text-amber-500 text-[10px]">next</span>
                )}
              </span>
            ))
          )}
        </div>
      </div>
    );
  }

  // Stack mode — vertical, top of stack at top
  return (
    <div className="mt-3 px-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-xs text-gray-400">(top → bottom)</span>
      </div>
      <div className="flex flex-row items-center gap-1 flex-wrap min-h-[32px]">
        {items.length === 0 ? (
          <span className="text-xs text-gray-400 italic">empty</span>
        ) : (
          [...items].reverse().map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                         bg-orange-100 border border-orange-400 text-orange-800"
            >
              {item}
              {i === 0 && (
                <span className="ml-1 text-orange-500 text-[10px]">top</span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
