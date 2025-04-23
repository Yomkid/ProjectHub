"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

// To avoid TypeScript complaints about the Quill global
declare global {
  interface Window {
    Quill: any;
  }
}

export default function WriteProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quillRef = useRef<any>(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const range = quillRef.current.getSelection();
          quillRef.current.insertEmbed(range.index, "image", reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  useEffect(() => {
    if (!window.Quill) {
      console.error("Quill is not loaded. Please check your CDN in layout.tsx");
      return;
    }

    const toolbarOptions = [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      ["link", "blockquote", "code-block"],
      [{ align: [] }],
      ["image", "video"],
    ];

    const quill = new window.Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: handleImageUpload,
          },
        },
      },
    });

    quill.on("text-change", () => {
      setProjectDescription(quill.root.innerHTML);
    });

    quillRef.current = quill;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("description", projectDescription);
    formData.append("tags", tags.join(","));

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Project submitted successfully!");
        setProjectTitle("");
        setProjectDescription("");
        setTags([]);
        quillRef.current?.setContents([]);
      } else {
        alert("Failed to submit the project.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Write Your Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-lg font-medium text-gray-600 mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your project title"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="editor" className="text-lg font-medium text-gray-600 mb-2">
              Project Description
            </label>
            <div
              id="editor"
              style={{ minHeight: "300px" }}
              className="border border-gray-300 p-4 rounded-md shadow-sm"
            ></div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="tags" className="text-lg font-medium text-gray-600 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              onChange={(e) => setTags(e.target.value.split(","))}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags for your project (comma-separated)"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center space-x-2 shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <span>Submit Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
