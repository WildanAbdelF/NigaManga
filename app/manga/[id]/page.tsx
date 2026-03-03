import { getMangaDetail, getChapterList } from '@/lib/api';
import { MangaDetail, Chapter } from '@/types/manga';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// Format view count to readable string
function formatViewCount(count?: number): string {
  if (!count) return 'N/A';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// Format date to readable string
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default async function MangaDetailPage({ params }: Props) {
  const { id } = await params;
  let manga: MangaDetail | null = null;
  let chapters: Chapter[] = [];

  try {
    const [mangaRes, chapterRes] = await Promise.all([
      getMangaDetail(id),
      getChapterList(id)
    ]);
    manga = mangaRes;
    chapters = chapterRes.chapters;
  } catch (error) {
    console.error('Failed to fetch manga:', error);
    notFound();
  }

  if (!manga) {
    notFound();
  }

  const statusText = manga.status === 1 ? 'Ongoing' : 'Completed';
  const author = manga.taxonomy?.Author?.[0]?.name || 'Unknown';
  const genres = manga.taxonomy?.Genre || [];
  const firstChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;
  const latestChapter = chapters.length > 0 ? chapters[0] : null;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner with blurred background */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
        <Image
          src={manga.cover_image_url}
          alt={manga.title}
          fill
          className="object-cover object-center blur-md scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/80 to-[#0f0f1a]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="w-full px-6 sm:px-10 lg:px-16 -mt-24 sm:-mt-28 lg:-mt-32 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-gray-400 hover:text-[#f0c929] transition-colors">Home</Link>
          <span className="text-gray-600">/</span>
          <Link href="/manga" className="text-gray-400 hover:text-[#f0c929] transition-colors">Manga</Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#f0c929] font-medium truncate max-w-[200px]">{manga.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cover Image - with status badge */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative w-40 sm:w-48 lg:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-2 ring-[#1a1a2e]">
              <Image
                src={manga.cover_image_url}
                alt={manga.title}
                fill
                className="object-cover"
                priority
              />
              {/* Status Badge on Cover */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-lg ${
                  manga.status === 1 ? 'bg-[#22c55e] text-white' : 'bg-[#3b82f6] text-white'
                }`}>
                  {statusText}
                </span>
              </div>
            </div>
          </div>

          {/* Manga Info */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">{manga.title}</h1>
            
            {/* Alternative Title */}
            {manga.alternative_title && (
              <p className="text-gray-400 text-base mb-4">{manga.alternative_title}</p>
            )}

            {/* Stats Grid - Reference Style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 max-w-2xl mx-auto lg:mx-0">
              {/* Score */}
              <div className="bg-[#1a1a2e] rounded-lg p-3 border border-[#2a2a3e] text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-[#f0c929]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-400 text-xs font-medium">Score</span>
                </div>
                <span className="text-xl font-bold text-white">{manga.user_rate || 'N/A'}</span>
              </div>
              
              {/* Views */}
              <div className="bg-[#1a1a2e] rounded-lg p-3 border border-[#2a2a3e] text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-[#f0c929]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 text-xs font-medium">Views</span>
                </div>
                <span className="text-xl font-bold text-white">{formatViewCount(manga.view_count)}</span>
              </div>
              
              {/* Chapters */}
              <div className="bg-[#22c55e]/10 rounded-lg p-3 border border-[#22c55e]/30 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span className="text-[#22c55e] text-xs font-medium">Chapters</span>
                </div>
                <span className="text-xl font-bold text-[#22c55e]">{chapters.length}</span>
              </div>
              
              {/* Year */}
              <div className="bg-[#3b82f6]/10 rounded-lg p-3 border border-[#3b82f6]/30 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-[#3b82f6]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#3b82f6] text-xs font-medium">Year</span>
                </div>
                <span className="text-xl font-bold text-[#3b82f6]">{manga.release_year || 'N/A'}</span>
              </div>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-300">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">Author:</span> {author}
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">Updated:</span> {formatDate(manga.updated_at)}
              </span>
            </div>

            {/* Synopsis Section */}
            {manga.description && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-[#f0c929] rounded-full" />
                  <h2 className="text-lg font-bold text-white">Synopsis</h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">{manga.description}</p>
              </div>
            )}

            {/* Genres & Themes */}
            {genres.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-[#f0c929] rounded-full" />
                  <h2 className="text-lg font-bold text-white">Genres & Themes</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/genre?genre=${genre.slug}`}
                      className="px-3 py-1.5 bg-[#1a1a2e] text-gray-300 text-xs rounded-lg border border-[#2a2a3e] hover:border-[#f0c929] hover:text-[#f0c929] transition-all"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons - Reference style */}
            {chapters.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {firstChapter && (
                  <Link
                    href={`/manga/${id}/${firstChapter.chapter_id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f0c929] text-[#0f0f1a] text-sm font-bold rounded-lg hover:bg-[#ffd93d] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start Reading
                  </Link>
                )}
                {latestChapter && latestChapter !== firstChapter && (
                  <Link
                    href={`/manga/${id}/${latestChapter.chapter_id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 hover:border-white/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Latest Ch. {latestChapter.chapter_number}
                  </Link>
                )}
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef4444]/20 border-2 border-[#ef4444]/30 text-[#ef4444] text-sm font-semibold rounded-lg hover:bg-[#ef4444]/30 hover:border-[#ef4444]/50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Add to Favorites
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h2 className="text-xl font-bold text-white">Chapters ({chapters.length})</h2>
          </div>
          
          <div className="bg-[#1a1a2e] rounded-xl overflow-hidden border border-[#2a2a3e]">
            <div className="max-h-[500px] overflow-y-auto">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.chapter_id}
                  href={`/manga/${id}/${chapter.chapter_id}`}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3e] hover:bg-[#2a2a3e] transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-[#f0c929] text-xs font-bold w-8 flex-shrink-0">#{chapters.length - index}</span>
                    <span className="text-white text-sm group-hover:text-[#f0c929] transition-colors truncate font-medium">
                      Chapter {chapter.chapter_number}{chapter.chapter_title ? ` - ${chapter.chapter_title}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0 ml-3">
                    <span className="hidden sm:flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {formatViewCount(chapter.view_count)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(chapter.release_date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-[#2a2a3e] mt-8">
        <div className="w-full px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-gray-500 text-xs">
            © 2026 NigaManga. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
