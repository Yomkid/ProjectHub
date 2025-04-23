import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill"; // React wrapper for Quill
import "react-quill/dist/quill.snow.css"; // Import default styling for Quill

export default function WriteProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quill reference
  const quillRef = useRef(null);

  // Custom image handler
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
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current.getEditor().insertEmbed(range.index, "image", reader.result);
        };
        reader.readAsDataURL(file); // Convert image to base64 before inserting
      }
    };
  };

  useEffect(() => {
    // Add custom toolbar actions for Quill
    const toolbarOptions = [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      ["link", "blockquote", "code-block"],
      [{ align: [] }],
      ["image", "video"],
    ];

    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: handleImageUpload, // Custom image handler
          },
        },
      },
    });

    quill.on("text-change", () => {
      const content = quill.root.innerHTML;
      setProjectDescription(content);
    });

  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Collect data
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
      } else {
        alert("Failed to submit the project.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("An error occurred while submitting the project.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Write Your Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Title */}
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

          {/* Quill Editor */}
          <div className="flex flex-col">
            <label htmlFor="editor" className="text-lg font-medium text-gray-600 mb-2">
              Project Description
            </label>
            <div id="editor" style={{ minHeight: "300px" }} className="border border-gray-300 p-4 rounded-md shadow-sm"></div>
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label htmlFor="tags" className="text-lg font-medium text-gray-600 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              onChange={(e) => setTags(e.target.value.split(","))}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags for your project"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center space-x-2 shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
