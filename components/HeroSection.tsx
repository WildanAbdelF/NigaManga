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
    }, 5000);
    return () => clearInterval(timer);
  }, [spotlightManga.length]);

  const currentManga = spotlightManga[currentIndex];
  if (!currentManga) return null;

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + spotlightManga.length) % spotlightManga.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % spotlightManga.length);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentManga.cover_image_url}
          alt={currentManga.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-[#0f0f1a]/50" />
        {/* Color overlay for visual effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-red-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl">
          {/* Spotlight Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0c929] rounded-full mb-4">
            <svg className="w-4 h-4 text-[#0f0f1a]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-[#0f0f1a]">SPOTLIGHT #{currentIndex + 1}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 leading-tight">
            {currentManga.title}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 mb-4">{currentManga.alternative_title || currentManga.title}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#1a1a2e] text-white text-sm rounded">{getFormatType(currentManga)}</span>
            <span className="text-gray-400 text-sm">{formatViewCount(currentManga.view_count)} views</span>
            <span className="px-3 py-1 bg-[#f0c929] text-[#0f0f1a] text-sm font-semibold rounded">
              CH. {currentManga.latest_chapter_number}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-6 line-clamp-3 max-w-md">
            {currentManga.description || 'Dive into an amazing manga adventure. Click to read more and discover the story!'}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/manga/${currentManga.manga_id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#f0c929] text-[#0f0f1a] font-semibold rounded-lg hover:bg-[#d4b12a] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Read Now
            </Link>
            <Link
              href={`/manga/${currentManga.manga_id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {spotlightManga.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-[#f0c929]' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 text-white/70 text-sm">
        <span className="text-white font-bold">#{currentIndex + 1}</span> of {spotlightManga.length}
      </div>
    </section>
  );
}
