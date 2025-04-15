import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--primary)]">Write, Build, & Solve Problems with Real Life Projects</h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          Discover, download, and upload project write-ups & source codes.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mt-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Search for projects..."
          className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Featured Projects Section */}
      <section className="mt-12 w-full max-w-4xl">
        {/* <h2 className="text-2xl font-semibold mb-4 text-[var(--primary)]">Featured Projects</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Project Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Projects</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover real life projects, tutorials and solutions to many projects.
            </p>
            <Link
              href="/projects/elearning-platform"
              className="text-[var(--primary)] font-semibold mt-2 inline-block"
            >
              View →
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Documents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find pproject writeups, research papers, assignments, solved questions, etc.
            </p>
            <Link
              href="/projects/elearning-platform"
              className="text-[var(--primary)] font-semibold mt-2 inline-block"
            >
              View →
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold">E-Learning Platform</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A complete LMS with student dashboard, quizzes, and video lectures.
            </p>
            <Link
              href="/projects/elearning-platform"
              className="text-[var(--primary)] font-semibold mt-2 inline-block"
            >
              View →
            </Link>
          </div>

          {/* More projects can be added dynamically */}
        </div>
      </section>

      {/* Upload Project CTA */}
      {/* <div className="mt-12">
        <Link href="/upload" className="btn-primary">
          Upload Your Project
        </Link>
      </div> */}
    </div>
  );
}
