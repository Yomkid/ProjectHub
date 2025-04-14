"use client";
import { useState } from "react";

export default function FilterSidebar({ onFilter }: { onFilter: (category: string) => void }) {
  const categories = ["All", "AI", "Web Development", "UI/UX"];
  const [selected, setSelected] = useState("All");

  return (
    <aside className="bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => {
            setSelected(category);
            onFilter(category);
          }}
          className={`block px-4 py-2 rounded-md w-full text-left ${selected === category ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          {category}
        </button>
      ))}
    </aside>
  );
}
