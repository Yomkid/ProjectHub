"use client";
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import FilterSidebar from "./FilterSidebar";
import { projects } from "./ProjectData";

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = (category: string) => {
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === category));
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredProjects(
      projects.filter((p) =>
        p.title.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Explore Projects</h1>
        <p className="text-gray-600 mt-2">Find innovative projects in AI, Web Dev, and more.</p>
      </header>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects..."
          className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar onFilter={handleFilter} />
        </div>

        {/* Project Listings */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => <ProjectCard key={project.id} {...project} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
