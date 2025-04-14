import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "../ProjectData";

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === parseInt(params.id));

  if (!project) return notFound(); // Show 404 if project doesn't exist

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Project Image */}
      <div className="relative w-full h-64 md:h-96">
        <Image src={project.image} alt={project.title} fill className="object-cover rounded-lg shadow-lg" />
      </div>

      {/* Project Info */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>

        {/* Project Details */}
        <div className="mt-4 text-gray-500 text-sm">
          <p><strong>Category:</strong> {project.category}</p>
          <p><strong>Date Created:</strong> {project.date}</p>
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
          Upload <span className="ml-2">📤</span>
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">
          Download Free for 30 Days
        </button>
      </div>
    </div>
  );
}
