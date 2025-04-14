"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // For active link
import { FiMenu, FiX, FiUpload, FiSearch, FiUser } from "react-icons/fi"; // Icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [scrolling, setScrolling] = useState(false);
  const pathname = usePathname(); // Get current route

  // Simulated search results
  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(["Project 1", "Project 2", "Project 3"].filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolling ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          <span>Project</span>
          <span className="text-green-600">Hub</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1 relative">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none px-2 py-1"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-10 left-0 bg-white shadow-md w-full rounded-md p-2">
              {searchResults.map((result, index) => (
                <div key={index} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/documents", label: "Documents" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href ? "text-green-600 font-semibold" : "text-black"
              } hover:text-gray-600`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right-Side Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/upload" className="bg-green-600 text-white px-4 py-2 flex items-center rounded-md">
            <FiUpload className="mr-2" /> Upload
          </Link>
          <Link href="/download" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Download free for 30 days
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FiUser className="text-gray-600" />
              <span>Sign</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-200">
                  Settings
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-200">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 flex flex-col p-4 space-y-3">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`${
                pathname === item.href ? "text-green-600 font-semibold" : "text-black"
              } hover:text-gray-600`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/upload" className="bg-green-600 text-white px-4 py-2 flex items-center rounded-md">
            <FiUpload className="mr-2" /> Upload
          </Link>
          <Link href="/download" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Download free for 30 days
          </Link>

          {/* Mobile User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded-md w-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FiUser className="text-gray-600" />
              <span>Sign</span>
            </button>
            {isDropdownOpen && (
              <div className="mt-2 bg-white shadow-md rounded-md w-full">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-200">
                  Settings
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-200">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
