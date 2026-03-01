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
      {/* Hero Banner */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={manga.cover_image_url}
          alt={manga.title}
          fill
          className="object-cover object-center blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Manga Cover */}
          <div className="flex-shrink-0">
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={manga.cover_image_url}
                alt={manga.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Manga Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{manga.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                manga.status === 1 ? 'bg-[#2ed573] text-white' : 'bg-[#ff4757] text-white'
              }`}>
                {statusText}
              </span>
              <span className="px-3 py-1 bg-[#1a1a2e] text-white text-sm rounded">
                {formatViewCount(manga.view_count)} views
              </span>
              {manga.user_rate && (
                <span className="px-3 py-1 bg-[#f0c929] text-[#0f0f1a] text-sm font-semibold rounded">
                  ★ {manga.user_rate}/10
                </span>
              )}
            </div>

            {/* Author & Updated */}
            <div className="space-y-2 mb-6 text-gray-300">
              <p><span className="text-gray-500">Author:</span> {author}</p>
              <p><span className="text-gray-500">Updated:</span> {formatDate(manga.updated_at)}</p>
              <p><span className="text-gray-500">Chapters:</span> {chapters.length}</p>
              <p><span className="text-gray-500">Released:</span> {manga.release_year}</p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre) => (
                <Link
                  key={genre.slug}
                  href={`/genre?genre=${genre.slug}`}
                  className="px-3 py-1 bg-[#1a1a2e] text-gray-300 text-sm rounded-full hover:bg-[#2a2a3e] hover:text-[#f0c929] transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Description */}
            {manga.description && (
              <p className="text-gray-400 text-sm mb-6 line-clamp-4">{manga.description}</p>
            )}

            {/* CTA Buttons */}
            {chapters.length > 0 && (
              <div className="flex gap-3">
                {firstChapter && (
                  <Link
                    href={`/manga/${id}/${firstChapter.chapter_id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#f0c929] text-[#0f0f1a] font-semibold rounded-lg hover:bg-[#d4b12a] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Read First Chapter
                  </Link>
                )}
                {latestChapter && (
                  <Link
                    href={`/manga/${id}/${latestChapter.chapter_id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Latest Chapter ({latestChapter.chapter_number})
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-[#f0c929] rounded-full" />
            Chapters
          </h2>
          
          <div className="bg-[#1a1a2e] rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.chapter_id}
                  href={`/manga/${id}/${chapter.chapter_id}`}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3e] hover:bg-[#2a2a3e] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm w-8">#{chapters.length - index}</span>
                    <span className="text-white group-hover:text-[#f0c929] transition-colors line-clamp-1">
                      Chapter {chapter.chapter_number}{chapter.chapter_title ? `: ${chapter.chapter_title}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatViewCount(chapter.view_count)}</span>
                    <span>{formatDate(chapter.release_date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[#2a2a3e] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 NigaManga. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
