"use client";
import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentCardProps {
  id: number;
  name: string;
  file: string;
  type: string;
  url: string;
  price?: string;
  category?: string;
}

export default function DocumentCard({
  id,
  name,
  type,
  url,
  price,
  category,
}: DocumentCardProps) {
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    async function loadPreview() {
      try {
        if (type === "pdf") {
          // PDF will be rendered by react-pdf in the component
          setPreviewContent(null);
        } else if (type === "docx" || type === "txt") {
          const response = await fetch(`/api/document-preview?file=${file}`);
          const data = await response.json();
          setPreviewContent(
            <div className="p-2 text-sm text-gray-600">
              {data.preview || "Preview not available"}
            </div>
          );
        }
      } catch (error) {
        console.error("Error loading preview:", error);
        setPreviewContent(
          <div className="p-2 text-sm text-red-500">Preview error</div>
        );
      }
    }

    loadPreview();
  }, [type, file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const getFileIcon = () => {
    const icons = {
      pdf: "/icons/pdf-icon.png",
      docx: "/icons/word-icon.png",
      txt: "/icons/txt-icon.png",
    };
    return icons[type] || "/icons/default-file.png";
  };

  return (
    <div className="border rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {/* PDF Preview */}
        {type === "pdf" && (
          <div className="w-full h-full flex items-center justify-center">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-sm">Loading PDF...</div>}
              error={<div className="text-sm text-red-500">PDF Error</div>}
            >
              <Page
                pageNumber={1}
                width={250}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        )}

        {/* Text Preview */}
        {type !== "pdf" && (
          <div className="w-full h-full overflow-y-auto">
            {previewContent || (
              <div className="flex items-center justify-center h-full">
                <img
                  src={getFileIcon()}
                  alt={type}
                  className="w-16 h-16 opacity-50"
                />
              </div>
            )}
          </div>
        )}

        {/* File Type Badge */}
        <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md">
          {type.toUpperCase()}
        </div>
      </div>

      {/* Document Info */}
      <div className="mt-3">
        <h2 className="text-lg font-semibold truncate">{name}</h2>
        {category && <p className="text-gray-500 text-sm">{category}</p>}
        {price && <p className="text-green-600 font-bold mt-1">${price}</p>}
      </div>

      {/* Page Count for PDFs */}
      {type === "pdf" && numPages > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {numPages} page{numPages > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}