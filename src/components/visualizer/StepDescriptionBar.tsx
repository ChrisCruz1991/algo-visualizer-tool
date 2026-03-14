type Props = {
  description: string;
};

export default function StepDescriptionBar({ description }: Props) {
  return (
    <div className="min-h-[40px] px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center">
      <p className="text-sm text-gray-700 italic">
        {description || "Press Run to start the visualization."}
      </p>
    </div>
  );
}
