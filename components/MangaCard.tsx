import Image from 'next/image';
import Link from 'next/link';
import { Manga } from '@/types/manga';

interface MangaCardProps {
  manga: Manga;
  showDescription?: boolean;
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
  return format || 'Manga';
}

export default function MangaCard({ manga, showDescription = false }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.manga_id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a2e] shadow-lg hover:shadow-xl transition-shadow">
        {/* Manga Image */}
        <Image
          src={manga.cover_image_url}
          alt={manga.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        {/* Overlay gradient - stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Badge - Type (top left) */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-[#f0c929] text-[#0f0f1a] text-[10px] font-bold rounded shadow-md">
            {getFormatType(manga)}
          </span>
        </div>

        {/* Badges - Bottom right (Reference style: SUB/DUB style) */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1.5 items-end">
          <span className="px-2 py-1 bg-[#22c55e] text-white text-[10px] font-bold rounded shadow-md">
            CH {manga.latest_chapter_number}
          </span>
          {manga.status !== undefined && (
            <span className={`px-2 py-1 text-white text-[10px] font-bold rounded shadow-md ${
              manga.status === 0 ? 'bg-[#3b82f6]' : 'bg-[#ef4444]'
            }`}>
              {manga.status === 0 ? 'END' : 'ONG'}
            </span>
          )}
        </div>
      </div>

      {/* Title - outside the image */}
      <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white line-clamp-2 group-hover:text-[#f0c929] transition-colors leading-snug">
        {manga.title}
      </h3>

      {/* Views count */}
      <p className="mt-0.5 text-[10px] text-gray-500">
        {formatViewCount(manga.view_count)} views
      </p>

      {/* Description */}
      {showDescription && manga.description && (
        <p className="mt-1 text-[10px] sm:text-xs text-gray-400 line-clamp-2">
          {manga.description}
        </p>
      )}
    </Link>
  );
}
