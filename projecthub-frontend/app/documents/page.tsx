"use client";
import { useState, useEffect, useMemo } from "react";
import DocumentCard from "./DocumentCard";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        const res = await fetch("/api/documents");
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Memoized Category List to prevent unnecessary re-renders
  const categories = useMemo(() => {
    const categorySet = new Set(["All"]);
    documents.forEach((doc) => categorySet.add(doc.category || "Uncategorized"));
    return Array.from(categorySet);
  }, [documents]);

  // Filter documents based on search term & category
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = filteredCategory === "All" || doc.category === filteredCategory;
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, searchTerm, filteredCategory]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-left mb-10">
        <h1 className="text-4xl font-bold">Project Write-Ups</h1>
        <p className="text-gray-600 mt-2">Discover a wide range of documents across various categories.</p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Category Filter */}
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="w-full md:w-1/4 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading documents...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Documents Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => <DocumentCard key={doc.id} {...doc} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No documents found.</p>
          )}
        </div>
      )}
    </div>
  );
}
