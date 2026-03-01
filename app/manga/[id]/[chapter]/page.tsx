'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChapterDetail } from '@/types/manga';

const API_BASE = 'https://api.sansekai.my.id/api/komik';

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const mangaId = params.id as string;
  const chapterId = params.chapter as string;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/getimage?type=manga&chapter_id=${chapterId}`);
        const data = await res.json();
        if (data.retcode === 0) {
          setChapter(data.data);
        } else {
          console.error('API Error:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch chapter:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [chapterId]);

  const navigateChapter = (chId: string) => {
    router.push(`/manga/${mangaId}/${chId}`);
  };

  // Toggle controls on click
  const handleImageClick = () => {
    setShowControls(!showControls);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0c929]"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-gray-400">Chapter not found.</p>
      </div>
    );
  }

  const images = chapter.chapter?.data || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-[#2a2a3e]/50 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="w-full px-6 sm:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={`/manga/${mangaId}`}
              className="p-2.5 hover:bg-[#1a1a2e] rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white font-semibold line-clamp-1 text-base">
                Chapter {chapter.chapter_number}{chapter.chapter_title ? `: ${chapter.chapter_title}` : ''}
              </h1>
              <p className="text-gray-400 text-sm line-clamp-1">{images.length} pages</p>
            </div>
          </div>

          {/* Reading Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-[#1a1a2e] p-1 rounded-xl">
            <button
              onClick={() => setReadingMode('vertical')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                readingMode === 'vertical' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'text-white hover:bg-[#2a2a3e]'
              }`}
            >
              Vertical
            </button>
            <button
              onClick={() => setReadingMode('horizontal')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                readingMode === 'horizontal' ? 'bg-[#f0c929] text-[#0f0f1a]' : 'text-white hover:bg-[#2a2a3e]'
              }`}
            >
              Horizontal
            </button>
          </div>
        </div>
      </div>

      {/* Images Container */}
      <div 
        className={`pt-20 ${readingMode === 'vertical' ? 'pb-24' : 'min-h-screen flex items-center justify-center'}`}
        onClick={handleImageClick}
      >
        {readingMode === 'vertical' ? (
          // Vertical Reading Mode
          <div className="max-w-4xl mx-auto">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={imgUrl}
                  alt={`Page ${index + 1}`}
                  width={1000}
                  height={1400}
                  className="w-full h-auto"
                  priority={index < 3}
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : (
          // Horizontal Reading Mode (Single page view)
          <HorizontalReader images={images} />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-[#2a2a3e]/50 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full px-6 sm:px-10 py-3 flex items-center justify-between">
          <button
            onClick={() => chapter.prev_chapter_id && navigateChapter(chapter.prev_chapter_id)}
            disabled={!chapter.prev_chapter_id}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] text-white text-base rounded-xl border border-[#2a2a3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Ch. {chapter.prev_chapter_number || 'N/A'}</span>
          </button>

          <span className="text-gray-400 text-base px-4 py-2.5 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e]">
            {images.length} pages
          </span>

          <button
            onClick={() => chapter.next_chapter_id && navigateChapter(chapter.next_chapter_id)}
            disabled={!chapter.next_chapter_id}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] text-white text-base rounded-xl border border-[#2a2a3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all"
          >
            <span className="hidden sm:inline">Ch. {chapter.next_chapter_number || 'N/A'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Horizontal Reader Component
function HorizontalReader({ images }: { images: string[] }) {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(images.length - 1, prev + 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-7rem)] flex items-center justify-center">
      {/* Current Page */}
      <div className="relative max-h-full max-w-full">
        <Image
          src={images[currentPage]}
          alt={`Page ${currentPage + 1}`}
          width={1000}
          height={1400}
          className="max-h-[calc(100vh-7rem)] w-auto object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Page Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        disabled={currentPage === 0}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        disabled={currentPage === images.length - 1}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full disabled:opacity-30 hover:bg-[#f0c929] hover:text-[#0f0f1a] text-white transition-all border border-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
        {currentPage + 1} / {images.length}
      </div>
    </div>
  );
}
