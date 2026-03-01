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
  return format || 'MANGA';
}

export default function MangaCard({ manga, showDescription = false }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.manga_id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#1a1a2e]">
        {/* Manga Image */}
        <Image
          src={manga.cover_image_url}
          alt={manga.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badge - Type */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-[#f0c929] text-[#0f0f1a] text-xs font-semibold rounded">
            {getFormatType(manga)}
          </span>
        </div>

        {/* Chapter Badge */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
          <span className="px-2 py-0.5 bg-[#f0c929] text-[#0f0f1a] text-xs font-semibold rounded w-fit">
            Ch. {manga.latest_chapter_number}
          </span>
          {manga.view_count && (
            <span className="px-2 py-0.5 bg-[#ff4757] text-white text-xs font-semibold rounded w-fit">
              {formatViewCount(manga.view_count)} views
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-[#f0c929] transition-colors">
        {manga.title}
      </h3>

      {/* Description */}
      {showDescription && manga.description && (
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {manga.description}
        </p>
      )}
    </Link>
  );
}
