'use client';

import { useEffect, useRef, useState } from 'react';
import { Bookmark, Share2, ThumbsUp, Eye, Printer, Flag } from 'lucide-react';
import React from 'react';
import Head from 'next/head';



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
    const contentRef = useRef<HTMLDivElement>(null);


    const TableOfContents = () => {
        const [toc, setToc] = useState<{ id: string; text: string | null; level: string; children?: any[] }[]>([]);
        const [activeId, setActiveId] = useState<string | null>(null);
        const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
        const tocContainerRef = useRef<HTMLDivElement>(null);


        // Build ToC structure with hierarchy
        useEffect(() => {
            if (!contentRef.current) return;

            const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocItems: any[] = [];
            let lastH1: any = null;
            let lastH2: any = null;

            Array.from(headings).forEach((heading) => {
                const slug = heading.textContent
                    ?.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '') ?? '';
                heading.id = slug;

                const item = {
                    id: slug,
                    text: heading.textContent,
                    level: heading.tagName.toLowerCase(),
                };

                // Build hierarchy
                if (heading.tagName === 'H1') {
                    tocItems.push(item);
                    lastH1 = item;
                    lastH2 = null;
                } else if (heading.tagName === 'H2') {
                    if (lastH1) {
                        if (!lastH1.children) lastH1.children = [];
                        lastH1.children.push(item);
                    } else {
                        tocItems.push(item);
                    }
                    lastH2 = item;
                } else if (heading.tagName === 'H3') {
                    if (lastH2) {
                        if (!lastH2.children) lastH2.children = [];
                        lastH2.children.push(item);
                    } else if (lastH1) {
                        if (!lastH1.children) lastH1.children = [];
                        lastH1.children.push(item);
                    } else {
                        tocItems.push(item);
                    }
                } else {
                    tocItems.push(item);
                }
            });

            setToc(tocItems);
            // Initialize all parent items as expanded
            const initialExpanded: Record<string, boolean> = {};
            tocItems.forEach(item => {
                if (item.children) initialExpanded[item.id] = true;
            });
            setExpandedItems(initialExpanded);
        }, []);

        // Track active section while scrolling
        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);

                            // Auto-expand parent items when child becomes active
                            if (entry.target.id) {
                                const parentId = findParentId(entry.target.id);
                                if (parentId) {
                                    setExpandedItems(prev => ({ ...prev, [parentId]: true }));
                                }
                            }
                        }
                    });
                },
                { rootMargin: '0px 0px -50% 0px', threshold: 0.5 }
            );

            toc.forEach((item) => {
                const element = document.getElementById(item.id);
                if (element) observer.observe(element);
            });

            return () => {
                toc.forEach((item) => {
                    const element = document.getElementById(item.id);
                    if (element) observer.unobserve(element);
                });
            };
        }, [toc]);

        const findParentId = (id: string): string | null => {
            for (const item of toc) {
                if (item.children?.some(child => child.id === id)) {
                    return item.id;
                }
                if (item.children) {
                    const foundInChildren = item.children.find(child => child.children?.some((grandChild: { id: string }) => grandChild.id === id));
                    if (foundInChildren) return foundInChildren.id;
                }
            }
            return null;
        };

        const toggleExpand = (id: string) => {
            setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
        };

        const renderTocItems = (items: any[], level = 0) => {
            return items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="mb-1">
                    <div className="flex items-center justify-between">

                        <a
                            href={`#${item.id}`}
                            className={`block py-1 px-2 rounded transition-colors duration-200 
                                ${activeId === item.id ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}
                                ${level === 0 ? 'pl-2 font-medium' : level === 1 ? 'pl-6' : 'pl-10 text-sm'}
                            `}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            {item.text}
                        </a>
                        {item.children && (
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                aria-label={expandedItems[item.id] ? 'Collapse section' : 'Expand section'}
                            >
                                {expandedItems[item.id] ? '−' : '+'}
                            </button>
                        )}
                    </div>
                    {item.children && expandedItems[item.id] && (
                        <div className="ml-4 mt-1">
                            {renderTocItems(item.children, level + 1)}
                        </div>
                    )}
                </div>
            ));
        };

        return (
            <div
                ref={tocContainerRef}
                className="lg:w-1/4 bg-white rounded-lg shadow-md p-4 sticky top-16"
                style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
            >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Table of Contents</h3>
                <div className="space-y-1">
                    {toc.length > 0 ? (
                        renderTocItems(toc)
                    ) : (
                        <p className="text-gray-500 text-sm">No headings found</p>
                    )}
                </div>
            </div>
        );
    };



    // Ad banners data and logic
    const adBanners = {
        large: [
            {
                id: 101,
                image: '/ads/techstar.png',
                link: '#',
                alt: 'Learn React Now',
            },
            {
                id: 102,
                image: '/ads/web-dev.png',
                link: '#',
                alt: 'Another Large Ad',
            },
            {
                id: 103,
                title: 'Buy this space',
                description: 'Reach thousands of customers',
                link: '/ads/book-space',
            },
        ],
        medium: [
            {
                id: 201,
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
                id: 203,
                title: 'Want to Advertise Here?',
                description: 'Reach thousands of tech learners...',
                link: '/ads/book-space',
            },
        ],
        small: [
            {
                id: 301,
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
                id: 303,
                title: 'Want to Advertise Here?',
                description: 'Reach thousands of tech learners...',
                link: '/ads/book-space',
            },
        ],
        cta: [
            {
                id: 401,
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
        const intervals = [
            setInterval(() => setCurrentLargeIndex(prev => (prev + 1) % adBanners.large.length), 5000),
            setInterval(() => setCurrentMediumIndex(prev => (prev + 1) % adBanners.medium.length), 5000),
            setInterval(() => setCurrentSmallIndex(prev => (prev + 1) % adBanners.small.length), 5000),
            setInterval(() => setCurrentCtaIndex(prev => (prev + 1) % adBanners.cta.length), 5000)
        ];
        return () => intervals.forEach(interval => clearInterval(interval));
    }, []);

    const resultData = {
        faces_detected: 2,
        matches: ["User_1", "Unknown"],
        confidence: [0.92, 0.45]
    };

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
            <Head>
                <title>Building a Face Recognition System with React and Flask</title>
                <meta name="description" content="A comprehensive guide to building a face recognition system using React and Flask" />
            </Head>

            {/* Left Sidebar (Table of Contents) */}
            <TableOfContents />

            {/* Middle Content Area */}
            <div className="lg:w-2/4 bg-white shadow-md p-6 mb-6 flex flex-col" ref={contentRef}>
                {/* Article Image */}
                <img
                    src="/assets/img/react-course.png"
                    alt="Article"
                    className="w-full h-64 object-cover mb-4"
                />

                {/* Article Title */}
             
                <div className="text-2xl font-bold text-gray-800 pb-2 mb-2">
                    Building a Face Recognition System with React and Flask
                </div>

                {/* Article Metadata */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>
                        Written by{' '}
                        <a href="#" className="text-green-500 underline">
                            Ismail Mainbay
                        </a>{' '}
                        on Jun 30, 2021
                    </span>
                </div>

                {/* Article Interaction Buttons */}
                <div className="flex mb-2 flex-wrap gap-2">
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Bookmark size={18} className="text-blue-600" />
                        {/* <span>Bookmark</span> */}
                        <span className="font-semibold">12</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Share2 size={18} className="text-green-600" />
                        {/* <span>Share</span> */}
                        <span className="font-semibold">8</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <ThumbsUp size={18} className="text-yellow-500" />
                        {/* <span>Likes</span> */}
                        <span className="font-semibold">45</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Eye size={18} />
                        {/* <span>View</span> */}
                        <span className="font-semibold">200</span>
                    </button>
                    <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Printer size={18} />
                        {/* <span>Print</span> */}
                    </button>
                    {/* <button className="bg-gray-50 px-3 py-1 border flex items-center space-x-1">
                        <Flag size={18} className="text-red-500" />
                        <span>Report</span>
                    </button> */}
                </div>

                <hr className="mb-2  border-green-500" />

                {/* Main Content with Headings */}



                <div className="max-w-4xl mx-auto py-4 font-sans">
                    <article className="prose prose-lg max-w-none">
                        <section id="introduction" className="mb-12">
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Introduction</h2>
                            <p className="text-gray-700 mb-6">
                                Face recognition technology has become increasingly relevant in modern applications, from security systems to personalized user experiences. This project aims to develop a scalable and efficient face recognition system using <strong className="font-medium">React</strong> for the frontend and <strong className="font-medium">Flask</strong> for the backend. The system captures facial data, processes it using machine learning models, and returns recognition results in real time.
                            </p>

                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
                                <h3 className="text-xl font-medium text-gray-800 mb-3">Objectives</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>Develop an intuitive user interface for image upload and face detection</li>
                                    <li>Implement a robust backend API to handle facial recognition tasks</li>
                                    <li>Ensure seamless communication between the frontend and backend</li>
                                    <li>Optimize performance for real-time processing</li>
                                </ul>
                            </div>
                        </section>

                        <section id="methodology" className="mb-12">
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Methodology</h2>
                            <p className="text-gray-700 mb-6">
                                The project follows a <strong className="font-medium">client-server architecture</strong>, with React handling the frontend interactions and Flask managing the backend logic, including face detection and recognition.
                            </p>

                            <div id="react-frontend" className="mb-8">
                                <h3 className="text-xl font-semibold text-teal-700 mb-3">React Frontend</h3>
                                <p className="text-gray-700 mb-4">
                                    The frontend is built with <strong className="font-medium">React.js</strong>, leveraging functional components and hooks for state management. Key features include:
                                </p>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">Component Structure</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">UploadImage</code>: Handles image input via drag-and-drop or file selection</li>
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">FaceDetectionBox</code>: Displays bounding boxes around detected faces</li>
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">ResultsView</code>: Shows recognition results (e.g., matched identities or confidence scores)</li>
                                </ul>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">State Management</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">useState</code> for local component state (e.g., uploaded image preview)</li>
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">useContext</code> for global state (e.g., user authentication status)</li>
                                </ul>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">Routing</h4>
                                <p className="text-gray-700">
                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded">React Router</code> for navigation between pages (e.g., Home, Dashboard, Admin)
                                </p>
                            </div>

                            <div id="flask-backend" className="mb-8">
                                <h3 className="text-xl font-semibold text-teal-700 mb-3">Flask Backend</h3>
                                <p className="text-gray-700 mb-4">
                                    The backend is a <strong className="font-medium">RESTful API</strong> built with Flask and integrates the following:
                                </p>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">Face Recognition Model</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                                    <li>Uses <strong className="font-medium">OpenCV</strong> and <strong className="font-medium">face_recognition</strong> (Python library) to detect and encode facial features</li>
                                    <li>Pre-trained models (e.g., dlib's ResNet) ensure accuracy without extensive training</li>
                                </ul>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">API Endpoints</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">/detect</code>: Accepts image uploads, processes faces, and returns coordinates</li>
                                    <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">/recognize</code>: Compares facial encodings against a database (SQLite/PostgreSQL)</li>
                                </ul>

                                <h4 className="text-lg font-medium text-gray-800 mb-2">Database</h4>
                                <p className="text-gray-700">
                                    Stores facial encodings and user metadata for future recognition tasks
                                </p>
                            </div>
                        </section>

                        <section id="results" className="mb-12">
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Results</h2>
                            <p className="text-gray-700 mb-6">
                                The system achieved the following outcomes:
                            </p>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Real-Time Detection</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                                <li>Processes images in <strong className="font-medium">&lt;500ms</strong> (tested on 500x500px images)</li>
                                <li>Accurately detects multiple faces in a single frame</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Recognition Accuracy</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                                <li><strong className="font-medium">95%</strong> match accuracy under optimal lighting/angle conditions</li>
                            </ul>

                            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
                                <pre className="text-sm font-mono whitespace-pre">
                                    {JSON.stringify(resultData, null, 2)}
                                </pre>
                            </div>

                            <div className="p-4 text-center mb-6">
                                <img
                                    src="/assets/img/face-recognition_interface.png"
                                    alt="Face recognition interface"
                                    className="mx-auto"
                                />
                                <p className="text-gray-600 mb-2">Screenshot of the React app showing detected faces with bounding boxes</p>

                            </div>
                        </section>

                        <section id="challenges" className="mb-12">
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Challenges & Solutions</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Cross-Origin Issues (CORS)</strong>: Solved by configuring Flask's <code className="bg-gray-100 px-1.5 py-0.5 rounded">flask-cors</code> middleware</li>
                                <li><strong>Large Payloads</strong>: Compressed images using <code className="bg-gray-100 px-1.5 py-0.5 rounded">axios</code> transforms before sending to the backend</li>
                                <li><strong>Model Latency</strong>: Optimized by caching known face encodings in memory</li>
                            </ul>
                        </section>

                        <section id="conclusion">
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Conclusion</h2>
                            <p className="text-gray-700 mb-6">
                                The project successfully demonstrates a functional face recognition pipeline using React and Flask. Key accomplishments include a responsive UI, efficient API design, and reliable recognition accuracy.
                            </p>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Future Improvements</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                                <li><strong className="font-medium">Enhanced Security</strong>: Add JWT authentication for API endpoints</li>
                                <li><strong className="font-medium">Scalability</strong>: Deploy with Docker and Kubernetes for cloud readiness</li>
                                <li><strong className="font-medium">Advanced Features</strong>: Implement live video streaming analysis with WebSockets</li>
                            </ul>

                            <p className="text-gray-700">
                                By combining modern web technologies with machine learning, this system lays the groundwork for more sophisticated applications in biometrics and user authentication.
                            </p>
                        </section>
                    </article>
                </div>

            </div>

            {/* Right Sidebar (Advertisements) */}
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
                                            (e.target as HTMLImageElement).src = '/fallback-ad-image.png';
                                            (e.target as HTMLImageElement).className = 'w-full h-full object-contain bg-gray-100 p-4';
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
                                            (e.target as HTMLImageElement).src = '/fallback-ad-image.png';
                                            (e.target as HTMLImageElement).className = 'w-full h-full object-contain bg-gray-100 p-4';
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
                                            (e.target as HTMLImageElement).src = '/fallback-ad-image.png';
                                            (e.target as HTMLImageElement).className = 'w-full h-full object-contain bg-gray-100 p-4';
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