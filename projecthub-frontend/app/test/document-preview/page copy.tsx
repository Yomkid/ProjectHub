"use client";
import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import mammoth from "mammoth";

// Correct way to set up the PDF worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";


export default function DocumentPreviewTest() {
  const [documents, setDocuments] = useState<Array<{
    name: string;
    type: string;
    url: string;
  }>>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Get list of documents from public folder
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/get-documents");
        const data = await response.json();
        setDocuments(data);
        if (data.length > 0) {
          setSelectedDoc(data[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    }
    fetchDocuments();
  }, []);

  // Generate preview when selected document changes
  useEffect(() => {
    if (!selectedDoc) return;
    setPdfError(null);

    const fileExt = selectedDoc.split(".").pop()?.toLowerCase();

    if (fileExt === "pdf") {
      setPreviewContent(null); // Will be handled by react-pdf
    } else if (fileExt === "docx" || fileExt === "txt") {
      generateTextPreview(selectedDoc, fileExt);
    }
  }, [selectedDoc]);

  async function generateTextPreview(url: string, type: string) {
    try {
      const response = await fetch(url);
      let text = "";

      if (type === "docx") {
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await response.text();
      }

      setPreviewContent(
        <div className="p-4 bg-gray-100 rounded-md h-96 overflow-auto">
          <pre className="whitespace-pre-wrap">{text.split("\n").slice(0, 50).join("\n")}</pre>
        </div>
      );
    } catch (error) {
      setPreviewContent(
        <div className="p-4 bg-red-100 text-red-600 rounded-md">
          Failed to load preview
        </div>
      );
    }
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF. Please try another document.");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Document Preview Test</h1>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Document:</label>
        <select
          className="p-2 border rounded w-full max-w-md"
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
        >
          {documents.map((doc) => (
            <option key={doc.url} value={doc.url}>
              {doc.name} ({doc.type})
            </option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        
        {pdfError && (
          <div className="p-4 bg-red-100 text-red-600 rounded-md mb-4">
            {pdfError}
          </div>
        )}

        {selectedDoc.endsWith(".pdf") ? (
          <div className="flex justify-center">
            <Document
              file={selectedDoc}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="p-4">Loading PDF...</div>}
              error={<div className="p-4 text-red-500">PDF failed to load</div>}
            >
              <Page
                pageNumber={1}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        ) : (
          previewContent || <div className="p-4">Select a document to preview</div>
        )}

        {selectedDoc.endsWith(".pdf") && numPages > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Page 1 of {numPages}
          </div>
        )}
      </div>
    </div>
  );
}