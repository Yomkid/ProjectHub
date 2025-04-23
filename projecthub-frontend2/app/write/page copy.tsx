"use client";
import { useState } from "react";
import { FiUpload, FiSave } from "react-icons/fi";

export default function WriteProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedia(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("description", projectDescription);
    formData.append("tags", tags.join(","));
    if (media) {
      formData.append("media", media);
    }

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
        setMedia(null);
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

          {/* Project Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-lg font-medium text-gray-600 mb-2">
              Project Description
            </label>
            <textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-72"
              placeholder="Describe your project"
              required
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label htmlFor="tags" className="text-lg font-medium text-gray-600 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              onChange={handleTagChange}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags for your project"
            />
            <div className="mt-2 text-sm text-gray-500">
              {tags.length > 0 && <span>Tags: {tags.join(", ")}</span>}
            </div>
          </div>

          {/* Media Upload */}
          <div className="flex flex-col">
            <label htmlFor="media" className="text-lg font-medium text-gray-600 mb-2">
              Upload Media (Optional)
            </label>
            <input
              type="file"
              id="media"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="border border-gray-300 p-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {media && <p className="mt-2 text-sm text-gray-500">Selected file: {media.name}</p>}
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
                  <FiSave />
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
