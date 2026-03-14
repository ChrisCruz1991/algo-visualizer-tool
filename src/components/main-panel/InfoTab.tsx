import type { AlgorithmModule } from "@/engine/types";

type Props = {
  algorithm: AlgorithmModule;
};

export default function InfoTab({ algorithm }: Props) {
  const { description, complexity } = algorithm;

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
            {complexity.map((row) => (
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
