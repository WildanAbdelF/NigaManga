'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/manga', label: 'Manga List' },
    { href: '/manga?type=topview', label: 'Popular' },
    { href: '/manga?state=Ongoing', label: 'Ongoing' },
    { href: '/genre', label: 'Genre' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-[#2a2a3e]/50 shadow-xl">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-lg sm:text-xl font-bold text-[#f0c929] group-hover:text-[#ffd93d] transition-colors">Niga</span>
            <span className="text-lg sm:text-xl font-bold text-white">Manga</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-[#f0c929] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#f0c929] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Search & Avatar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 px-4 py-2 pl-9 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f0c929] focus:ring-2 focus:ring-[#f0c929]/20 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* User Avatar */}
          <button className="w-9 h-9 rounded-full bg-[#f0c929] text-[#0f0f1a] font-bold text-sm flex items-center justify-center hover:bg-[#ffd93d] transition-colors shadow-lg">
            U
          </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#2a2a3e]">
            <form onSubmit={handleSearch} className="mb-3 px-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-9 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f0c929] focus:ring-2 focus:ring-[#f0c929]/20 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-[#f0c929] hover:bg-[#1a1a2e] rounded-lg transition-all flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0c929]/50" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
