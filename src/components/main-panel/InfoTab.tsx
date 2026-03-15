import type { AlgorithmModule, ComplexityRow } from "@/engine/types";

type Props = {
  algorithm: AlgorithmModule;
  complexityOverride?: ComplexityRow[];
  /** Alternative complexity rows (e.g. recursive variant — Binary Search O(log n) space) */
  complexityAlternative?: ComplexityRow[];
  /** Whether the alternative (Recursive) variant is currently active */
  showAlternative?: boolean;
};

export default function InfoTab({
  algorithm,
  complexityOverride,
  complexityAlternative,
  showAlternative,
}: Props) {
  const { description } = algorithm;

  // Pick the complexity table to display:
  // 1. Linked-list per-operation override
  // 2. Alternative (recursive) complexity when that variant is active
  // 3. Default iterative complexity
  const complexity =
    complexityOverride ??
    (showAlternative && complexityAlternative ? complexityAlternative : algorithm.complexity);

  const complexityLabel =
    !complexityOverride && showAlternative && complexityAlternative
      ? "Recursive"
      : !complexityOverride && complexityAlternative
      ? "Iterative"
      : undefined;

  const iterativeComplexity =
    !complexityOverride && complexityAlternative && !showAlternative
      ? algorithm.complexity
      : undefined;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">What is it?</h2>
        <p className="text-gray-700 leading-relaxed">{description.what}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">How it works</h2>
        <ol className="list-decimal list-inside space-y-1">
          {description.how.map((step, i) => (
            <li key={i} className="text-gray-700 leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">How to implement</h2>
        <ul className="list-disc list-inside space-y-1">
          {description.implementation.map((point, i) => (
            <li key={i} className="text-gray-700 leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Time &amp; Space Complexity
        </h2>

        {/* When both variants exist, show both tables labeled clearly */}
        {complexityAlternative && !complexityOverride ? (
          <div className="space-y-4">
            <ComplexityTable
              rows={showAlternative ? complexityAlternative : algorithm.complexity}
              label={showAlternative ? "Recursive" : "Iterative"}
            />
            <p className="text-xs text-gray-500 italic">
              {showAlternative
                ? "Recursive variant uses O(log n) stack space for the call stack depth."
                : "Switch to Recursive in the Code panel to see recursive space complexity (O(log n))."}
            </p>
          </div>
        ) : (
          <ComplexityTable rows={complexity} label={complexityLabel} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Real-world use cases
        </h2>
        <ul className="list-disc list-inside space-y-1">
          {description.useCases.map((uc, i) => (
            <li key={i} className="text-gray-700 leading-relaxed">
              {uc}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          When to use this algorithm
        </h2>
        <p className="text-gray-700 leading-relaxed">{description.comparisonNote}</p>
      </section>
    </div>
  );
}

function ComplexityTable({ rows, label }: { rows: ComplexityRow[]; label?: string }) {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
      )}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Case
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Time Complexity
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Space Complexity
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.case} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {row.case}
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-indigo-700">
                {row.time}
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-indigo-700">
                {row.space}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
