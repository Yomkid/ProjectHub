// app/blog/page.tsx
"use client";

import { Clock, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";

const tabs = ["For you", "Following", "Featured", "Docker", "Math", "Data Engineering", "Angular"];

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
        title: "Microsoft Quietly Blocked Cursor from Using Its VSCode Extension—Here’s the Line of Code That...",
        description: "Users of Cursor just hit a wall. A single line buried in a 485-line JSON file...",
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
        image: "/assets/img/frontend-shift.jpg",
        author: "Mayomi Odewaye",
    },
    {
        id: 3,
        title: "Top 5 Docker Tricks You Didn’t Know",
        description: "Boost your Docker workflow with these underrated tips...",
        date: "Apr 10",
        views: 849,
        comments: 32,
        image: "/assets/img/docker-tips.png",
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

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("For you");

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Main Feed */}
            <div className="md:col-span-2 space-y-8">

                {/* Scrollable Tabs */}
                <div className="sticky top-0 bg-white z-10 pb-2">
                    <div className="flex overflow-x-auto no-scrollbar space-x-4 border-b border-gray-200 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm whitespace-nowrap font-medium transition border-b-2 ${tab === activeTab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
                                    } px-1 pb-1`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles */}
                {articles.map((article) => (
                    <div key={article.id} className="border-b border-gray-200 pb-6 flex gap-4 items-start">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">{article.author}</p>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900">{article.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">{article.description}</p>
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
                        <img
                            src={article.image}
                            alt="article"
                            className="w-32 h-24 object-cover rounded shrink-0"
                        />
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Staff Picks</h3>
                <div className="space-y-4 text-sm text-gray-700">
                    {staffPicks.map((pick, index) => (
                        <div key={index}>
                            <p className="font-medium">{pick.title}</p>
                            <p className="text-xs text-gray-500">{pick.author} — {pick.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}