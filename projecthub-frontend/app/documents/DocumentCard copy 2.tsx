// "use client";
// import { useEffect, useState } from "react";

// interface DocumentProps {
//   id: number;
//   name: string;
//   file: string;
//   price: string;
//   category: string;
// }

// export default function DocumentCard({ id, name, file, price, category }: DocumentProps) {
//   const [thumbnail, setThumbnail] = useState<string | null>(null);
//   const [previewText, setPreviewText] = useState<string | null>(null);
//   const fileExtension = file.split(".").pop()?.toUpperCase() || "UNKNOWN";

//   useEffect(() => {
//     async function fetchPreview() {
//       try {
//         const res = await fetch(`/api/generate-thumbnail?file=${file}`);
//         const data = await res.json();

//         if (data.thumbnail) {
//           setThumbnail(data.thumbnail); // PDF Thumbnail
//         } else if (data.preview) {
//           setPreviewText(data.preview); // DOCX or TXT preview text
//         } else {
//           setThumbnail("/icons/default.png"); // Fallback
//         }
//       } catch (error) {
//         console.error("Error fetching preview", error);
//       }
//     }
//     fetchPreview();
//   }, [file]);

//   return (
//     <div className="border rounded-lg shadow-md p-4 relative">
//       <div className="relative">
//         {thumbnail ? (
//           <img src={thumbnail} alt={name} className="w-full h-48 object-cover rounded-md" />
//         ) : (
//           <div className="w-full h-48 bg-gray-200 flex items-center justify-center p-2 rounded-md">
//             <p className="text-sm text-gray-600 text-center">{previewText || "No preview available"}</p>
//           </div>
//         )}

//         {/* File Type Label */}
//         <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md">
//           {fileExtension}
//         </div>
//       </div>

//       <h2 className="text-lg font-semibold mt-2">{name}</h2>
//       <p className="text-gray-500 text-sm">{category}</p>
//       <p className="text-green-600 font-bold mt-1">${price}</p>
//     </div>
//   );
// }


// "use client";

// export default function DocumentCard({ name = "", type = "", url = "" }) {
//   if (!name || !url) {
//     return (
//       <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg shadow-md">
//         <p>Error: Missing document details</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white">
//       <h3 className="text-lg font-semibold truncate">{name}</h3>
//       <p className="text-sm text-gray-500">{type.toUpperCase()} Document</p>
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-block mt-3 text-green-600 hover:underline"
//       >
//         Open Document
//       </a>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import * as pdfjs from "pdfjs-dist";

// // Explicitly set the worker source
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const getFileIcon = (type) => {
//   const icons = {
//     "pdf": "/icons/pdf-icon.png",
//     "docx": "/icons/word-icon.png",
//     "txt": "/icons/txt-icon.png"
//   };
//   return icons[type] || "/icons/default-file.png";
// };

// export default function DocumentCard({ name, type, url }) {
//   const [thumbnail, setThumbnail] = useState(null);

//   useEffect(() => {
//     if (type === "pdf") {
//       generatePdfThumbnail(url);
//     }
//   }, [url]);

//   const generatePdfThumbnail = async (pdfUrl) => {
//     const loadingTask = pdfjs.getDocument(pdfUrl);
//     const pdf = await loadingTask.promise;
//     const page = await pdf.getPage(1); // Get the first page

//     const viewport = page.getViewport({ scale: 1 });
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     const renderContext = {
//       canvasContext: context,
//       viewport: viewport
//     };

//     await page.render(renderContext).promise;
//     setThumbnail(canvas.toDataURL("image/png"));
//   };

//   return (
//     <div className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white">
//       {/* Thumbnail */}
//       <div className="relative">
//         <img
//           src={thumbnail || getFileIcon(type)}
//           alt={name}
//           className="w-full h-40 object-cover"
//         />
//         <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
//           {type.toUpperCase()}
//         </span>
//       </div>

//       {/* Document Info */}
//       <h3 className="text-lg font-semibold truncate mt-2">{name}</h3>

//       {/* Open Document Link */}
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-block mt-3 text-green-600 hover:underline"
//       >
//         Open Document
//       </a>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentCard = ({ fileUrl }) => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPDF = async () => {
            if (!fileUrl) return;

            try {
                const pdf = await pdfjs.getDocument(fileUrl).promise;
                const page = await pdf.getPage(1); // Get the first page

                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;
                setLoading(false);
            } catch (error) {
                console.error("Error loading PDF:", error);
                setLoading(false);
            }
        };

        loadPDF();
    }, [fileUrl]);

    return (
        <div className="document-card">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <canvas ref={canvasRef}></canvas>
            )}
            <p>PDF Preview</p>
        </div>
    );
};

export default DocumentCard;


