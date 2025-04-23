"use client";

import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Sample tabs
const tabs = [
    "For you",
    "Following",
    "Featured",
    "Docker",
    "Math",
    "Data Engineering",
    "Angular",
    "React",
    "Vue",
    "Go",
    "Python",
    "JavaScript",
    "TypeScript",
    "Rust",
    "Ruby",
    "PHP",
];

type Article = {
    id: number;
    title: string;
    description: string;
    date: string;
    views: number;
    comments: number;
    image: string;
    author: string;
};

const articles: Article[] = [
    {
        id: 1,
        title:
            "Microsoft Quietly Blocked Cursor from Using Its VSCode Extension—Here’s the Line of Code That...",
        description:
            "Users of Cursor just hit a wall. A single line buried in a 485-line JSON file...",
        date: "Apr 5",
        views: 609,
        comments: 26,
        image: "/assets/img/face-recognition_interface.png",
        author: "Tom Smykowski",
    },
    {
        id: 2,
        title: "Why React Server Components Will Change Everything in 2025",
        description: "Explore how RSCs shift the game for frontend frameworks...",
        date: "Apr 7",
        views: 1024,
        comments: 45,
        image: "/assets/img/react-course.png",
        author: "Mayomi Odewaye",
    },
    {
        id: 3,
        title: "Top 5 Docker Tricks You Didn’t Know",
        description: "Boost your Docker workflow with these underrated tips...",
        date: "Apr 10",
        views: 849,
        comments: 32,
        image: "/assets/img/mayomi.png",
        author: "Femi Dev",
    },
];

const staffPicks = [
    {
        title: "What Do “Left” and “Right” Actually Mean?",
        author: "Jonathan Hofer",
        date: "Feb 28",
    },
    {
        title: "Leadership is a fundamentally creative act",
        author: "The Medium Newsletter",
        date: "4d ago",
    },
    {
        title: "Cracking the code of vibe coding",
        author: "Pete Sena",
        date: "Mar 21",
    },
];

// ✅ Scrollable Tabs Component
function ScrollableTabs({
    activeTab,
    setActiveTab,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) {
    const tabRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const checkButtons = () => {
        if (!tabRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = tabRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(scrollLeft + clientWidth < scrollWidth);
    };

    const scrollTabs = (direction: "left" | "right") => {
        if (tabRef.current) {
            const scrollAmount = tabRef.current.clientWidth / 2;
            tabRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        checkButtons();
        const el = tabRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkButtons);
        window.addEventListener("resize", checkButtons);

        return () => {
            el.removeEventListener("scroll", checkButtons);
            window.removeEventListener("resize", checkButtons);
        };
    }, []);

    return (
        <div className="sticky top-18 bg-white z-10 pb-2">
            <div className="relative flex align-middle items-center justify-center">
                {/* Left Chevron */}
                {showLeft && (
                    <button
                        onClick={() => scrollTabs("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Tabs */}
                <div
                    ref={tabRef}
                    className="flex overflow-x-hidden no-scrollbar space-x-4 border-b border-gray-200 py-2 px-8"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm whitespace-nowrap font-medium transition border-b-2 ${tab === activeTab
                                ? "border-black text-black"
                                : "border-transparent text-gray-500 hover:text-black"
                                } px-1 pb-1`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right Chevron */}
                {showRight && (
                    <button
                        onClick={() => scrollTabs("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
}




// ✅ Main Blog Page Component
export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("For you");
    const [showBanner, setShowBanner] = useState(true);

    const suggestedUsers = [
        {
            id: 1,
            name: "Mayomi Odewaye",
            field: "Computer Engineering",
            image: "/assets/img/mayomi.png",
        },
        {
            id: 2,
            name: "Ada Lovelace",
            field: "AI & Robotics",
            image: "https://i.pravatar.cc/100?img=1",
        },
        {
            id: 3,
            name: "Femi Dev",
            field: "Web Development",
            image: "https://i.pravatar.cc/100?img=5",
        },
    ];

    const [following, setFollowing] = useState<number[]>([]);
    const toggleFollow = (userId: number) => {
        setFollowing((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="">
            {showBanner && (
                <div className="bg-yellow-100 text-gray-800 p-2 mb-2 px-6 flex items-center justify-between text-sm rounded-b-xl shadow-md">
                    <div className="flex-1 text-center">
                        <span className="font-medium">Get unlimited access to project writeups, resources, and expert insights on ProjectHub for less than ₦500/week. </span>
                        <a href="/membership" className="text-blue-600 underline font-medium">Become a member</a> today!
                    </div>
                    <button onClick={() => setShowBanner(false)} className="ml-4 text-lg font-bold text-gray-600 hover:text-gray-800">
                        ×
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py- grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-8">


                    {/* Tabs */}
                    <ScrollableTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Articles */}
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="border-b border-gray-200 pb-6 "
                        >
                            <p className="text-sm text-gray-500">{article.author}</p>

                            <div className="flex flex gap-4 items-start">
                                <div className="flex-1">
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">{article.description}</p>

                                </div>
                                <img
                                    src={article.image}
                                    alt="article"
                                    className="w-32 h-24 object-cover shrink-0"
                                />
                            </div>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {article.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" /> {article.views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" /> {article.comments}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="border-t md:border-t-0 md:border-l pt-6 border-gray-200 md:pt-0 md:pl-6">
                    {/* <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Staff Picks</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                        {staffPicks.map((pick, index) => (
                            <div key={index}>
                                <p className="font-medium">{pick.title}</p>
                                <p className="text-xs text-gray-500">
                                    {pick.author} — {pick.date}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-sm text-gray-500">
                        <p>Discover more articles and tutorials on our blog.</p>
                        <a href="/blog" className="text-[var(--primary)] font-semibold">
                            Visit Blog &rarr;
                        </a>
                    </div>
                </div> */}

                    <div className="bg-green-50   p-6 max-w-md w-full space-y-4">
                        <h2 className="text-l font-semibold text-gray-800">Writing Project on ProjectHub</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                            <li>Choose a compelling topic</li>
                            <li>Outline your sections clearly</li>
                            <li>Add visuals or diagrams where needed</li>
                            <li>Review for grammar and clarity</li>
                            <li>Save progress regularly</li>
                        </ul>
                        <button className="mt-4 px-4 py-2 bg-green-700 text-white  hover:bg-green-700 transition">
                            Start Writing Project
                        </button>
                    </div>

                    {/* Recommended Project Topics */}
                    <div className="bg-white   p-6 max-w-md w-full space-y-4">
                        <h2 className="text-l font-semibold text-gray-800">Recommended Project Topics</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                            <li>AI-Powered Chatbot for Campus Helpdesk</li>
                            <li>Online Voting System with Blockchain</li>
                            <li>Smart Attendance using Face Recognition</li>
                            <li>Data Visualization Dashboard for Academic Stats</li>
                        </ul>
                    </div>

                    {/* Who to Follow */}
                    <div className="bg-white l p-6 max-w-md w-full space-y-4">
                        <h2 className="text-l font-semibold text-gray-800">Who to Follow</h2>
                        <div className="space-y-4">
                            {suggestedUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.field}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFollow(user.id)}
                                        className={`text-sm px-3 py-1 rounded-lg bg-white text-green-700 hover:bg-green-700 hover:text-white border-1 border-green-600 transition ${following.includes(user.id)
                                            ? "bg-gray-300 text-gray-800"
                                            : "bg-green-500 text-green-700 hover:bg-green-700"
                                            }`}
                                    >
                                        {following.includes(user.id) ? "Following" : "Follow"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400 mt-4">Powered by ProjectHub</p>
                        <p className="text-xs text-gray-400">© 2023 ProjectHub. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
