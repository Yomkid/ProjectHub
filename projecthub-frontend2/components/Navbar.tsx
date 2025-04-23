"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiUpload, FiEdit2, FiSearch } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolling ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          Project<span className="text-green-600">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Browse Projects" },
            { href: "/write", label: "Write Project" },
            { href: "/upload", label: "Upload File" },
            { href: "/membership", label: "Membership" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-green-600 font-semibold"
                  : "text-gray-800"
              } hover:text-green-500`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {/* Submit Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FiUpload className="mr-2" />
              Submit Project
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
                <Link
                  href="/upload"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Upload File
                </Link>
                <Link
                  href="/write"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Write Project
                </Link>
              </div>
            )}
          </div>

          {/* Subscribe */}
          <Link
            href="/membership"
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Subscribe
          </Link>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md"
            >
              <FiUser className="text-gray-600" />
              <span>Mayomi</span>
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-44">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col p-4 space-y-3">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Browse Projects" },
            { href: "/write", label: "Write Project" },
            { href: "/upload", label: "Upload File" },
            { href: "/membership", label: "Membership" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`${
                pathname === item.href ? "text-green-600 font-semibold" : "text-gray-800"
              } hover:text-green-500`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/membership" className="bg-red-600 text-white px-4 py-2 rounded-md text-center">
            Subscribe
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md w-full"
            >
              <FiUser className="text-gray-600" />
              <span>Mayomi</span>
            </button>
            {isUserDropdownOpen && (
              <div className="mt-2 bg-white shadow-md rounded-md w-full">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
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
