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
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Manga</h1>
          <p className="text-gray-400">Find your favorite manga by title.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search manga by title..."
              className="flex-1 px-4 py-3 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f0c929]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#f0c929] text-[#0f0f1a] font-semibold rounded-lg hover:bg-[#d4b12a] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query && (
          <div className="mb-4">
            <p className="text-gray-400">
              {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0c929]"></div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((manga) => (
              <MangaCard key={manga.manga_id} manga={manga} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No manga found for &quot;{query}&quot;</p>
            <p className="text-gray-500 mt-2">Try a different search term</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg disabled:opacity-50"
            >
              Next
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
