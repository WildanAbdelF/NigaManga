'use client';

import { useRef } from 'react';
import MangaCard from './MangaCard';
import { Manga } from '@/types/manga';

interface TrendingSectionProps {
  title: string;
  mangaList: Manga[];
}

export default function TrendingSection({ title, mangaList }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-4 md:py-6">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 flex items-center justify-center bg-[#1a1a2e] rounded-full hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-[#2a2a3e] hover:border-[#f0c929]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 flex items-center justify-center bg-[#1a1a2e] rounded-full hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-[#2a2a3e] hover:border-[#f0c929]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-3 scroll-smooth"
        >
          {mangaList.map((manga) => (
            <div key={manga.manga_id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
              <MangaCard manga={manga} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
