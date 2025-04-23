"use client";

import React, { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

const TiptapEditor = ({ onChange }: { onChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextStyle,
      Color,
      Image.configure({ inline: false }),
    ],
    content: "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          editor?.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b flex flex-wrap p-2 gap-2 rounded-t-md shadow">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 py-1 bg-gray-200 rounded">Bold</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 py-1 bg-gray-200 rounded">Italic</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 bg-gray-200 rounded">H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 bg-gray-200 rounded">H2</button>
        <button onClick={() => editor?.chain().focus().setColor('#e11d48').run()} className="px-2 py-1 bg-red-500 text-white rounded">Red</button>
        <button onClick={handleImageUpload} className="px-2 py-1 bg-blue-500 text-white rounded">Image</button>
      </div>

      {/* Editor Area */}
      <div className="border border-gray-300 rounded-b-md min-h-[300px] p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
