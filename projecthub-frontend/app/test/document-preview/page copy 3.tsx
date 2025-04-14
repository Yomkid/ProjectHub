'use client';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { searchPlugin } from '@react-pdf-viewer/search';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { ClassAttributes, HTMLAttributes, JSX, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Download, Save, Share2, Printer, Globe, Flag, Bookmark, ThumbsUp, Eye, FileText} from 'lucide-react';

export default function PDFViewerPage() {
    const fileUrl = '/documents/siwes.pdf';
    const [downloadProgress, setDownloadProgress] = useState(0);
    const totalPages = ;

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

    const toolbar = toolbarPlugin();
    const search = searchPlugin();
    const thumbnails = thumbnailPlugin();

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
            {/* Sticky Document Header */}
            <div className="bg-white shadow-md p-6 mb-6 sticky top-0 z-50 flex flex-col">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Design and Implementation of Face-based Attendance System using React and Flask
                    </h1>
                    <p className="text-gray-600 mt-2">
                        This document is a technical report submitted by Isaac Adejoh Emmanuel, a student of the
                        Federal Polytechnic Nasarawa, in partial fulfillment of the requirements for a National Diploma in Computer Science.
                    </p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <span>Uploaded by <a href="#" className="text-green-500 underline">Ismail Mainbay</a> on Jun 30, 2021</span>
                        <span className="ml-4">• AI-enhanced title and description</span>
                    </div>
                    <div className="flex mt-4 space-x-2">
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Bookmark size={18} className="text-blue-600" /> <span>Bookmark</span> <span className="font-semibold">12</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <FileText size={18} className="text-gray-700" /> <span className="font-semibold"> {totalPages} pages</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Share2 size={18} className="text-green-600" /> <span>Share</span> <span className="font-semibold">8</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <ThumbsUp size={18} className="text-yellow-500" /> <span>Likes</span> <span className="font-semibold">45</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Eye size={18} className="text-red-500" /> <span>View</span> <span className="font-semibold">200</span></button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Printer size={18} /> <span>Print</span> </button>
                        <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1"> <Flag size={18} /> <span>Report</span> </button>
                    </div>
                    
                </div>



                {/* Action Toolbar */}
                <div className="border-b border-gray-200 bg-gray-50 py-2 shadow-sm bg-white mb-6 flex justify-between items-center sticky top-16 z-40">
                    <div className="flex space-x-2">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
                        >
                            <Download size={18} /> <span>Download now</span>
                            {downloadProgress > 0 && downloadProgress < 100 && (
                                <span className="ml-2">{downloadProgress}%</span>
                            )}
                        </button>
                        {/* <select className="border rounded px-3 py-2">
                            <option>Download as PDF</option>
                            <option>Download as TXT</option>
                        </select> */}
                    </div>

                    <div className="overflow-hidden flex-1">
                        <Worker workerUrl="/pdf.worker.js">
                        <div className="">
                                <toolbar.Toolbar />
                            </div>
                        </Worker>
                    </div>
                </div>


                {/* Main Content Area */}
                {/* Main Content Area - Full width PDF viewer */}
                <div className="w-full h-full">
                    <div className="bg-white h-full flex flex-col border-gray-200">
                        <Worker workerUrl="/pdf.worker.js">
                            {/* Toolbar with subtle shadow */}
                            {/* <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 shadow-sm">
                                <toolbar.Toolbar />
                            </div> */}

                            {/* PDF content area with perfect sizing */}
                            <div className="flex-1 w-full overflow-auto relative">
                                <Viewer
                                    fileUrl={fileUrl}
                                    plugins={[toolbar, search, thumbnails]}
                                    defaultScale={SpecialZoomLevel.PageWidth}
                                    theme={{
                                        theme: 'auto',  // Auto light/dark mode
                                        renderViewer: (props: { containerRef: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>; doc: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; viewer: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
                                            return (
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        position: 'relative'
                                                    }}
                                                    {...props.containerRef}
                                                >
                                                    {props.doc}
                                                    {props.viewer}
                                                </div>
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </Worker>
                    </div>
                </div>
            </div>



            {/* Main Content Area */}
            <div className="">


                {/* Recommended Documents */}
                <div className="">
                    <div className="bg-white rounded-lg shadow-md p-4 sticky top-16">
                        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Computer Science SIWES REPORT", rating: "90% (5)", pages: "24 pages" },
                                { title: "IT SIWES SAMPLE Report For Computer Science", rating: "No ratings yet", pages: "10 pages" },
                                { title: "SIWES Report On Web Development", rating: "90% (50)", pages: "19 pages" }
                            ].map((doc, index) => (
                                <div key={index} className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                                        <span>{doc.rating}</span>
                                        <span>{doc.pages}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
}
