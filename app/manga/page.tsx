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
    <div className="min-h-screen pt-16 pb-8">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-6 mt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Browse Manga</h1>
          </div>
          <p className="text-gray-400 text-sm ml-5">Browse the entire collection of manga, manhwa, and manhua.</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          {/* Filter Row */}
          <div className="flex flex-wrap gap-3 items-end bg-[#1a1a2e]/50 p-4 rounded-xl border border-[#2a2a3e]">
            {/* Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Type</label>
              <select
                value={currentType}
                onChange={(e) => updateFilters('type', e.target.value)}
                className="px-3 py-2 bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-[#f0c929] transition-all cursor-pointer"
              >
                <option value="manga">Manga</option>
                <option value="manhwa">Manhwa</option>
                <option value="manhua">Manhua</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Sort By</label>
              <select
                value={currentSort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="px-3 py-2 bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-[#f0c929] transition-all cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="latest">Latest Updates</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="ml-auto flex gap-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'bg-[#0f0f1a] text-white border border-[#2a2a3e] hover:border-[#f0c929]'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'bg-[#0f0f1a] text-white border border-[#2a2a3e] hover:border-[#f0c929]'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f0c929]"></div>
          </div>
        )}

        {/* Manga Grid/List */}
        {!loading && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'
                : 'flex flex-col gap-3'
            }>
              {mangaList.map((manga) => (
                <MangaCard key={manga.manga_id} manga={manga} showDescription={viewMode === 'list'} />
              ))}
            </div>

            {/* Pagination */}
            {metaData && metaData.total_page && metaData.total_page > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={metaData.total_page}
                  onPageChange={handlePageChange}
                />
              </div>
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f0c929]"></div>
      </div>
    }>
      <MangaListContent />
    </Suspense>
  );
}
