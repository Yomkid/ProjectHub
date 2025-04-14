'use client';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { searchPlugin } from '@react-pdf-viewer/search';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
// Removed incorrect import as '@react-pdf-viewer/thumbnail' has no exported member 'Thumbnail'.
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { ClassAttributes, HTMLAttributes, JSX, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Download, Save, Share2, Printer, Globe, Flag, Bookmark, ThumbsUp, Eye, FileText } from 'lucide-react';

export default function PDFViewerPage() {
    const fileUrl = '/documents/siwes.pdf';
    const [downloadProgress, setDownloadProgress] = useState(0);

    const handleDownload = () => {
        setDownloadProgress(0);
        const interval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };




    const documents = [
        {
            title: "Computer Science SIWES REPORT",
            rating: "90% (5)",
            pages: "24 pages",
            pdfUrl: "/documents/siwes.pdf"
        },
        {
            title: "IT SIWES SAMPLE Report For Computer Science",
            rating: "No ratings yet",
            pages: "10 pages",
            pdfUrl: "/documents/siwes2.pdf"
        },
        {
            title: "SIWES Report On Web Development",
            rating: "90% (50)",
            pages: "19 pages",
            pdfUrl: "/documents/webdev.pdf"
        }
    ];


    const toolbar = toolbarPlugin();
    const search = searchPlugin();
    const thumbnails = thumbnailPlugin();
    const { Thumbnails } = thumbnails;



    function setTotalPages(numPages: any) {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">

            {/* Recommended Documents */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-16">
                <h3 className="text-xl font-semibold mb-4">Table of contents</h3>
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex space-x-3"
                        >

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

            {/* Sticky Document Header */}
            <div className="bg-white shadow-md p-6 mb-6  top-0 flex flex-col">
                {/* <div className="bg-white shadow-md p-6 mb-6 sticky top-0 z-50 flex flex-col"> */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Design and Implementation of Face-based Attendance System using React and Flask
                    </h1>
                    <p className="text-gray-600 mt-2">
                        This document is a technical report submitted by Isaac Adejoh Emmanuel, a student of the
                        Federal Polytechnic Nasarawa, in partial fulfillment of the requirements for a National Diploma in Computer Science.
                    </p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <span>Uploaded by <a href="#" className="text-green-500 underline">Ismail Mainbay</a> on Jun 30, 2021</span>
                    </div>
                    <div className="flex my-4 space-x-2">
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Bookmark size={18} className="text-blue-600" /> <span>Bookmark</span> <span className="font-semibold">12</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Share2 size={18} className="text-green-600" /> <span>Share</span> <span className="font-semibold">8</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <ThumbsUp size={18} className="text-yellow-500" /> <span>Likes</span> <span className="font-semibold">45</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Eye size={18} className="text-black-500" /> <span>View</span> <span className="font-semibold">200</span></button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Printer size={18} /> <span>Print</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Flag size={18} className="text-red-500" /> <span>Report</span> </button>
                    </div>
                    <hr />
                    <div>
                        <p className="text-gray-600 mt-2">
                            This document is a technical report submitted by Isaac Adejoh Emmanuel, a student of the
                            Federal Polytechnic Nasarawa, in partial fulfillment of the requirements for a National Diploma in Computer Science.
                        </p>
                    </div>

                </div>

            </div>


            {/* Recommended Documents */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-16">
                <h2 className="text-xl font-semibold mb-4">You might also like</h2>
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex space-x-3"
                        >


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
}
