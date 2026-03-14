import { cn } from "@/lib/utils";

export type TabId = "visualizer" | "code" | "info";

type Props = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

const TABS: { id: TabId; label: string }[] = [
  { id: "visualizer", label: "Visualizer" },
  { id: "code", label: "Code" },
  { id: "info", label: "Info" },
];

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div
      role="tablist"
      className="flex border-b border-gray-200 bg-white px-4"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px",
            activeTab === tab.id
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
