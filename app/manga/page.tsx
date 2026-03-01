'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MangaCard from '@/components/MangaCard';
import Pagination from '@/components/Pagination';
import { Manga, ApiMeta } from '@/types/manga';

const API_BASE = 'https://api.sansekai.my.id/api/komik';

type ComicType = 'manga' | 'manhwa' | 'manhua';

function MangaListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [metaData, setMetaData] = useState<ApiMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentType = (searchParams.get('type') as ComicType) || 'manga';
  const currentSort = searchParams.get('sort') || 'popular';

  useEffect(() => {
    async function fetchManga() {
      setLoading(true);
      try {
        const endpoint = currentSort === 'latest' ? 'latest' : 'popular';
        const typeParam = endpoint === 'latest' ? 'mirror' : currentType;
        
        const res = await fetch(`${API_BASE}/${endpoint}?type=${typeParam}&page=${currentPage}`);
        const data = await res.json();
        
        if (data.retcode === 0) {
          setMangaList(data.data || []);
          setMetaData(data.meta);
        } else {
          setMangaList([]);
        }
      } catch (error) {
        console.error('Failed to fetch manga:', error);
        setMangaList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchManga();
  }, [currentPage, currentType, currentSort]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1');
    router.push(`/manga?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/manga?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Manga</h1>
          <p className="text-gray-400">Browse the entire collection of manga, manhwa, and manhua.</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Type Filter */}
            <select
              value={currentType}
              onChange={(e) => updateFilters('type', e.target.value)}
              className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-[#f0c929]"
            >
              <option value="manga">Manga</option>
              <option value="manhwa">Manhwa</option>
              <option value="manhua">Manhua</option>
            </select>

            {/* Sort Filter */}
            <select
              value={currentSort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-[#f0c929]"
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest Updates</option>
            </select>

            {/* View Mode Toggle */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'bg-[#1a1a2e] text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'bg-[#1a1a2e] text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0c929]"></div>
          </div>
        )}

        {/* Manga Grid/List */}
        {!loading && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'
                : 'flex flex-col gap-4'
            }>
              {mangaList.map((manga) => (
                <MangaCard key={manga.manga_id} manga={manga} showDescription={viewMode === 'list'} />
              ))}
            </div>

            {/* Pagination */}
            {metaData && metaData.total_page && metaData.total_page > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={metaData.total_page}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MangaListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0c929]"></div>
      </div>
    }>
      <MangaListContent />
    </Suspense>
  );
}
