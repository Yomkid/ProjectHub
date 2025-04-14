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


    const adBanners = {
        large: [
            {
                id: 101,  // Unique within large banners
                image: '/ads/techstar.png',
                link: '#',
                alt: 'Learn React Now',
            },
            {
                id: 102,  // Different from above, but could be any unique number
                image: '/ads/web-dev.png',
                link: '#',
                alt: 'Another Large Ad',
            },
            {
                id: 103,  // Unique within CTAs
                title: 'Buy this space',
                description: 'Reach thousands of customers',
                link: '/ads/book-space',
            },
        ],
        medium: [
            {
                id: 201,  // Unique within medium banners (can overlap with large IDs)
                image: '/ads/data-analysis.png',
                link: '#',
                alt: 'Flask for Beginners',
            },
            {
                id: 202,
                image: '/ads/web-dev.png',
                link: '#',
                alt: 'Medium Banner 2',
            },
            {
                id: 202,  // Unique within CTAs
                title: 'Want to Advertise Here?',
                description: 'Reach thousands of tech learners...',
                link: '/ads/book-space',
            },
        ],
        small: [
            {
                id: 301,  // Unique within small banners
                image: '/ads/web-dev.png',
                link: '#',
                alt: 'JavaScript Bootcamp',
            },
            {
                id: 302,
                image: '/ads/web-dev.png',
                link: '#',
                alt: 'Small Banner 2',
            },
            {
                id: 303,  // Unique within CTAs
                title: 'Want to Advertise Here?',
                description: 'Reach thousands of tech learners...',
                link: '/ads/book-space',
            },
        ],
        cta: [
            {
                id: 401,  // Unique within CTAs
                title: 'Want to Advertise Here?',
                description: 'Reach thousands of tech learners...',
                link: '/ads/book-space',
            }
        ]
    };

    const [currentLargeIndex, setCurrentLargeIndex] = useState(0);
    const [currentMediumIndex, setCurrentMediumIndex] = useState(0);
    const [currentSmallIndex, setCurrentSmallIndex] = useState(0);
    const [currentCtaIndex, setCurrentCtaIndex] = useState(0);
    useEffect(() => {
        const largeInterval = setInterval(() => {
            setCurrentLargeIndex(prev => (prev + 1) % adBanners.large.length);
        }, 5000);

        const mediumInterval = setInterval(() => {
            setCurrentMediumIndex(prev => (prev + 1) % adBanners.medium.length);
        }, 5000);

        const smallInterval = setInterval(() => {
            setCurrentSmallIndex(prev => (prev + 1) % adBanners.small.length);
        }, 5000);

        const ctaInterval = setInterval(() => {
            setCurrentCtaIndex(prev => (prev + 1) % adBanners.cta.length);
        }, 5000);

        return () => {
            clearInterval(largeInterval);
            clearInterval(mediumInterval);
            clearInterval(smallInterval);
            clearInterval(ctaInterval);
        };
    }, []);


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
                {/* <p className="text-gray-600 mb-4">
                    This document is a technical report submitted by Isaac Adejoh Emmanuel, a student
                    of the Federal Polytechnic Nasarawa, in partial fulfillment of the requirements
                    for a National Diploma in Computer Science.
                </p> */}

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

            <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4 sticky top-16 flex flex-col">
                <h3 className="text-xl font-semibold mb-4">Advertisements</h3>

                <div className="flex-1 flex flex-col gap-4">
                    {/* Large Banner Section */}
                    {adBanners.large.length > 0 && (
                        <div className="w-full">
                            {adBanners.large[currentLargeIndex].image ? (
                                <a
                                    href={adBanners.large[currentLargeIndex].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                    <img
                                        src={adBanners.large[currentLargeIndex].image}
                                        alt={adBanners.large[currentLargeIndex].alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/fallback-ad-image.png';
                                            e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                                        }}
                                    />
                                </a>
                            ) : (
                                <a
                                    href={adBanners.large[currentLargeIndex].link}
                                    className="block w-full h-64 p-6 border-2 border-dashed border-gray-300 text-center bg-gray-50 rounded-lg hover:shadow-md transition-all hover:border-blue-200 flex flex-col justify-center"
                                >
                                    <h4 className="text-xl font-semibold text-blue-600 mb-2">
                                        {adBanners.large[currentLargeIndex].title}
                                    </h4>
                                    <p className="text-md text-gray-600">{adBanners.large[currentLargeIndex].description}</p>
                                </a>
                            )}
                        </div>
                    )}

                    {/* Medium Banner Section */}
                    {adBanners.medium.length > 0 && (
                        <div className="w-full">
                            {adBanners.medium[currentMediumIndex].image ? (
                                <a
                                    href={adBanners.medium[currentMediumIndex].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                    <img
                                        src={adBanners.medium[currentMediumIndex].image}
                                        alt={adBanners.medium[currentMediumIndex].alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/fallback-ad-image.png';
                                            e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                                        }}
                                    />
                                </a>
                            ) : (
                                <a
                                    href={adBanners.medium[currentMediumIndex].link}
                                    className="block w-full h-48 p-4 border-2 border-dashed border-gray-300 text-center bg-gray-50 rounded-lg hover:shadow-md transition-all hover:border-blue-200 flex flex-col justify-center"
                                >
                                    <h4 className="text-lg font-semibold text-blue-600 mb-2">
                                        {adBanners.medium[currentMediumIndex].title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{adBanners.medium[currentMediumIndex].description}</p>
                                </a>
                            )}
                        </div>
                    )}

                    {/* Small Banner Section */}
                    {adBanners.small.length > 0 && (
                        <div className="w-full">
                            {adBanners.small[currentSmallIndex].image ? (
                                <a
                                    href={adBanners.small[currentSmallIndex].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                    <img
                                        src={adBanners.small[currentSmallIndex].image}
                                        alt={adBanners.small[currentSmallIndex].alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/fallback-ad-image.png';
                                            e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                                        }}
                                    />
                                </a>
                            ) : (
                                <a
                                    href={adBanners.small[currentSmallIndex].link}
                                    className="block w-full h-32 p-3 border-2 border-dashed border-gray-300 text-center bg-gray-50 rounded-lg hover:shadow-md transition-all hover:border-blue-200 flex flex-col justify-center"
                                >
                                    <h4 className="text-md font-semibold text-blue-600 mb-1">
                                        {adBanners.small[currentSmallIndex].title}
                                    </h4>
                                    <p className="text-xs text-gray-600 line-clamp-2">{adBanners.small[currentSmallIndex].description}</p>
                                </a>
                            )}
                        </div>
                    )}

                    {/* CTA Section */}
                    {adBanners.cta.length > 0 && (
                        <div className="w-full">
                            <a
                                href={adBanners.cta[currentCtaIndex].link}
                                className="block w-full p-4 border-2 border-dashed border-gray-300 text-center bg-gray-50 rounded-lg hover:shadow-md transition-all hover:border-blue-200"
                            >
                                <h4 className="text-lg font-semibold text-blue-600 mb-1">
                                    {adBanners.cta[currentCtaIndex].title}
                                </h4>
                                <p className="text-sm text-gray-600">{adBanners.cta[currentCtaIndex].description}</p>
                            </a>
                        </div>
                    )}
                </div>

                {/* Static CTA Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                    Interested in advertising?{' '}
                    <a
                        href="/ads/book-space"
                        className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors"
                    >
                        Click here
                    </a>
                </div>
            </div>
        </div>
    );
}
