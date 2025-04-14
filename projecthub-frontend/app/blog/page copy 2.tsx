'use client';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { searchPlugin } from '@react-pdf-viewer/search';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Share2, ThumbsUp, Eye, Printer, Flag } from 'lucide-react';

export default function ArticlePage() {
    const [downloadProgress, setDownloadProgress] = useState(0);

    const handleDownload = () => {
        setDownloadProgress(0);
        const interval = setInterval(() => {
            setDownloadProgress((prev) => {
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

    const contentRef = useRef<HTMLDivElement | null>(null);
    const [toc, setToc] = useState<
        { id: string; text: string | null; level: string }[]
    >([]);

    useEffect(() => {
        const headings = contentRef.current?.querySelectorAll(
            'h1, h2, h3, h4, h5, h6'
        );
        if (headings) {
            const tocItems = Array.from(headings).map((heading) => {
                const slug = heading.textContent
                    ?.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '') ?? '';
                heading.id = slug;
                return {
                    id: slug,
                    text: heading.textContent,
                    level: heading.tagName.toLowerCase(),
                };
            });
            setToc(tocItems);
        }
    }, []);


    const adBanners = [
        {
            id: 1,
            size: 'large',
            image: '/ads/techstar.png',
            link: '#',
            alt: 'Learn React Now',
        },
        {
            id: 2,
            size: 'medium',
            image: '/ads/data-analysis.png',
            link: '#',
            alt: 'Flask for Beginners',
        },
        {
            id: 3,
            size: 'small',
            image: '/ads/web-dev.png',
            link: '#',
            alt: 'JavaScript Bootcamp',
        },
        {
            id: 4,
            size: 'cta',
            title: 'Want to Advertise Here?',
            description: 'Reach thousands of tech learners every day. Click to book your ad space now!',
            link: '/ads/book-space',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % adBanners.length);
        }, 5000); // Change banner every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentAd = adBanners[currentIndex];


    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar (Table of Contents) */}
            <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4 sticky top-16 h-max">
                <h3 className="text-xl font-semibold mb-4">Table of Contents</h3>
                <div className="space-y-2">
                    {toc.map((item, index) => (
                        <a
                            key={index}
                            href={`#${item.id}`}
                            className={`block p-2 rounded hover:bg-gray-100 transition ${item.level === 'h2'
                                ? 'pl-2 font-medium text-gray-800'
                                : item.level === 'h3'
                                    ? 'pl-4 text-gray-600 text-sm'
                                    : 'pl-0 font-bold text-black'
                                }`}
                        >
                            {item.text}
                        </a>
                    ))}
                </div>
            </div>

            {/* Middle Content Area */}
            <div className="lg:w-2/4 bg-white shadow-md p-6 mb-6 flex flex-col" ref={contentRef}>
                {/* Article Image */}
                <img
                    src="/assets/img/react-course.png"
                    alt="Article"
                    className="w-full h-64 object-cover mb-4"
                />

                {/* Article Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Design and Implementation of Face-based Attendance System using React and Flask
                </h1>

                {/* Article Description */}
                <p className="text-gray-600 mb-4">
                    This document is a technical report submitted by Isaac Adejoh Emmanuel, a student
                    of the Federal Polytechnic Nasarawa, in partial fulfillment of the requirements
                    for a National Diploma in Computer Science.
                </p>

                {/* Article Metadata */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>
                        Uploaded by{' '}
                        <a href="#" className="text-green-500 underline">
                            Ismail Mainbay
                        </a>{' '}
                        on Jun 30, 2021
                    </span>
                </div>

                {/* Article Interaction Buttons */}
                <div className="flex my-4 flex-wrap gap-2">
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Bookmark size={18} className="text-blue-600" />
                        <span>Bookmark</span>
                        <span className="font-semibold">12</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Share2 size={18} className="text-green-600" />
                        <span>Share</span>
                        <span className="font-semibold">8</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <ThumbsUp size={18} className="text-yellow-500" />
                        <span>Likes</span>
                        <span className="font-semibold">45</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Eye size={18} />
                        <span>View</span>
                        <span className="font-semibold">200</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Flag size={18} className="text-red-500" />
                        <span>Report</span>
                    </button>
                </div>

                <hr className="my-4" />

                {/* Main Content with Headings */}
                <div>
                    <h2>Introduction</h2>
                    <p className="text-gray-600 mb-4">
                        This section provides an overview of the topic, importance, and objectives.
                    </p>

                    <h2>Methodology</h2>
                    <p className="text-gray-600 mb-4">
                        Describes the steps taken to implement the project using React and Flask.
                    </p>

                    <h3>React Frontend</h3>
                    <p className="text-gray-600 mb-4">
                        Details the React components, state management, and routes used.
                    </p>

                    <h3>Flask Backend</h3>
                    <p className="text-gray-600 mb-4">
                        Covers API development, face recognition model integration, and database setup.
                    </p>

                    <h2>Results</h2>
                    <p className="text-gray-600 mb-4">
                        Summarizes the outcome, screenshots, and test results.
                    </p>

                    <h2>Conclusion</h2>
                    <p className="text-gray-600 mb-4">
                        Reflects on project success and possible future improvements.
                    </p>
                </div>
            </div>

            <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4 sticky top-16">
                <h3 className="text-xl font-semibold mb-4">Advertisements</h3>

                <div className="w-full flex flex-col items-center space-y-4">
                    {currentAd.size !== 'cta' ? (
                        <a
                            href={currentAd.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full rounded-lg overflow-hidden border shadow hover:shadow-lg transition-all cursor-pointer ${currentAd.size === 'large' ? 'h-64' :
                                currentAd.size === 'medium' ? 'h-48' :
                                    'h-32'
                                }`}
                        >
                            <img
                                src={currentAd.image}
                                alt={currentAd.alt}
                                className="w-full h-full object-cover"
                            />
                        </a>
                    ) : (
                        <a
                            href={currentAd.link}
                            className="w-full p-4 border border-dashed text-center bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h4 className="text-lg font-semibold text-blue-600 mb-1">
                                {currentAd.title}
                            </h4>
                            <p className="text-sm text-gray-600">{currentAd.description}</p>
                        </a>
                    )}
                </div>

                {/* Optional: static call-to-action at bottom */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Interested in advertising?{' '}
                    <a href="/ads/book-space" className="text-blue-600 font-semibold hover:underline">
                        Click here
                    </a>
                </div>
            </div>
        </div>
    );
}
