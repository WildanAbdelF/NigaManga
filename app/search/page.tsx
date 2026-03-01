'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MangaCard from '@/components/MangaCard';
import { Manga } from '@/types/manga';

const API_BASE = 'https://api.sansekai.my.id/api/komik';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!query) return;
    
    async function search() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search?type=manga&query=${encodeURIComponent(query)}&page=${currentPage}`);
        const data = await res.json();
        if (data.retcode === 0) {
          setResults(data.data || []);
          setTotalPages(data.meta?.total_page || 0);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [query, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Search Manga</h1>
          </div>
          <p className="text-gray-400 text-sm ml-5">Find your favorite manga by title.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search manga by title..."
                className="w-full px-6 py-4 pl-14 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#f0c929] focus:ring-2 focus:ring-[#f0c929]/20 transition-all"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#f0c929] text-[#0f0f1a] text-base font-bold rounded-lg hover:bg-[#ffd93d] transition-all shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm">
              {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f0c929]"></div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {results.map((manga) => (
              <MangaCard key={manga.manga_id} manga={manga} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a2e] flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-300 text-base font-medium">No manga found for &quot;{query}&quot;</p>
            <p className="text-gray-500 text-base mt-2">Try a different search term</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-3 bg-[#1a1a2e] text-white text-base rounded-xl border border-[#2a2a3e] disabled:opacity-50 hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            <span className="text-white text-base px-5 py-3 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-3 bg-[#1a1a2e] text-white text-base rounded-xl border border-[#2a2a3e] disabled:opacity-50 hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all flex items-center gap-2"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0c929]"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
