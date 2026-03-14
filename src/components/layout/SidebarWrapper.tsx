"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AlgorithmList from "./AlgorithmList";

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-3 right-4 z-50 p-2 rounded-md bg-white border border-gray-200 shadow-sm"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 overflow-y-auto
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:z-auto md:shrink-0
        `}
        style={{ top: "56px" }}
      >
        <AlgorithmList onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}
