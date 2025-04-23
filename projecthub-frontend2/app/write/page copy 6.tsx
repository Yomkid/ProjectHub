"use client";

import { useState } from "react";
import TiptapEditor from "./Tiptap";

export default function WriteProject() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { title, content });
    // Send to API or save
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded shadow space-y-6">
      <h1 className="text-3xl font-bold text-center">Write Your Project</h1>

      <input
        type="text"
        placeholder="Project Title"
        className="w-full border p-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TiptapEditor onChange={setContent} />

      <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700">
        Submit Project
      </button>
    </form>
  );
}
