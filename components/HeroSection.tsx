'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Manga } from '@/types/manga';

interface HeroSectionProps {
  mangaList: Manga[];
}

// Format view count to readable string
function formatViewCount(count?: number): string {
  if (!count) return 'N/A';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// Get format type from taxonomy
function getFormatType(manga: Manga): string {
  const format = manga.taxonomy?.Format?.[0]?.name;
  return format || 'MANGA';
}

export default function HeroSection({ mangaList }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const spotlightManga = mangaList.slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightManga.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [spotlightManga.length]);

  const currentManga = spotlightManga[currentIndex];
  if (!currentManga) return null;

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + spotlightManga.length) % spotlightManga.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % spotlightManga.length);

  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentManga.cover_image_url}
          alt={currentManga.title}
          fill
          className="object-cover object-center scale-105 transition-transform duration-700"
          priority
        />
        {/* Overlay gradients - Reference style */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/85 to-[#0f0f1a]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-[#0f0f1a]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-16 flex items-center">
        <div className="max-w-2xl">
          {/* Spotlight Badge */}
          <div className="inline-flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0c929] rounded-md shadow-lg">
              <svg className="w-3.5 h-3.5 text-[#0f0f1a]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] font-bold text-[#0f0f1a] uppercase tracking-wide">Spotlight</span>
            </div>
            <span className="text-[#f0c929] text-base font-bold">#{currentIndex + 1}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight line-clamp-2 drop-shadow-xl">
            {currentManga.title}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-1">{currentManga.alternative_title || currentManga.title}</p>

          {/* Meta Info - Reference Style with colored badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="px-2 py-1 bg-[#1a1a2e] text-white text-[10px] font-semibold rounded-md border border-[#2a2a3e]">
              {getFormatType(currentManga)}
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <span className="flex items-center gap-1 text-gray-300 text-[10px]">
              <svg className="w-3 h-3 text-[#f0c929]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {formatViewCount(currentManga.view_count)} views
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <span className="px-2 py-1 bg-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold rounded-md border border-[#22c55e]/30">
              CH: {currentManga.latest_chapter_number}+
            </span>
            <span className="px-2 py-1 bg-[#3b82f6]/20 text-[#3b82f6] text-[10px] font-bold rounded-md border border-[#3b82f6]/30">
              {currentManga.status || 'Ongoing'}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2 max-w-xl leading-relaxed">
            {currentManga.description || 'Dive into an amazing manga adventure. Click to read more and discover the story!'}
          </p>

          {/* CTA Buttons - Larger and matching reference */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/manga/${currentManga.manga_id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0c929] text-[#0f0f1a] text-sm font-bold rounded-sm hover:bg-[#ffd93d] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Read Now
            </Link>
            <Link
              href={`/manga/${currentManga.manga_id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-white/30 text-white text-sm font-semibold rounded-sm hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Larger and more prominent
      <button
        onClick={goToPrev}
        className="absolute left-4 sm:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-white/20 hover:border-[#f0c929] hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-white/20 hover:border-[#f0c929] hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button> */}

      {/* Dots Indicator - Larger and spaced */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {spotlightManga.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-[#f0c929]' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-6 sm:right-10 lg:right-12 z-20 text-white/70 text-xs">
        <span className="text-[#f0c929] font-bold text-lg">#{currentIndex + 1}</span> <span className="text-gray-400">/ {spotlightManga.length}</span>
      </div>
    </section>
  );
}
