'use client';
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry"; // Important for Webpack

const documents = [
    { title: "Computer Science SIWES REPORT", rating: "90% (5)", pages: "24 pages", pdfUrl: "/documents/siwes.pdf" },
    { title: "IT SIWES SAMPLE Report For Computer Science", rating: "No ratings yet", pages: "10 pages", pdfUrl: "/documents/it-report.pdf" },
    { title: "SIWES Report On Web Development", rating: "90% (50)", pages: "19 pages", pdfUrl: "/documents/webdev.pdf" }
];

const RecommendedDocuments = () => {
    const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        documents.forEach((doc) => {
            generateThumbnail(doc.pdfUrl).then((imageUrl) => {
                setThumbnails((prev) => ({ ...prev, [doc.pdfUrl]: imageUrl }));
            });
        });
    }, []);

    // Function to extract the first page as an image
    const generateThumbnail = async (pdfUrl: string) => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // First page

        const scale = 1.5; // Adjust for quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context!, viewport }).promise;

        return canvas.toDataURL("image/png"); // Convert to image URL
    };

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-16">
                <h2 className="text-xl font-semibold mb-4">You might also like</h2>
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex space-x-3"
                        >
                            {/* PDF Thumbnail as Image */}
                            <div className="w-16 h-20 overflow-hidden">
                                {thumbnails[doc.pdfUrl] ? (
                                    <img src={thumbnails[doc.pdfUrl]} alt="PDF Thumbnail" className="w-full h-full object-cover rounded" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        Loading...
                                    </div>
                                )}
                            </div>

                            {/* Document Info */}
                            <div>
                                <h3 className="font-medium text-gray-800">{doc.title}</h3>
                                <div className="flex justify-between mt-2 text-sm text-gray-500">
                                    <span>{doc.rating}</span>
                                    <span>{doc.pages}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendedDocuments;
