'use client';

import Link from 'next/link';

// Common manga genres
const genres = [
  { slug: 'action', name: 'Action' },
  { slug: 'adventure', name: 'Adventure' },
  { slug: 'comedy', name: 'Comedy' },
  { slug: 'drama', name: 'Drama' },
  { slug: 'fantasy', name: 'Fantasy' },
  { slug: 'horror', name: 'Horror' },
  { slug: 'mystery', name: 'Mystery' },
  { slug: 'romance', name: 'Romance' },
  { slug: 'sci-fi', name: 'Sci-Fi' },
  { slug: 'slice-of-life', name: 'Slice of Life' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'supernatural', name: 'Supernatural' },
  { slug: 'thriller', name: 'Thriller' },
  { slug: 'historical', name: 'Historical' },
  { slug: 'martial-arts', name: 'Martial Arts' },
  { slug: 'school-life', name: 'School Life' },
  { slug: 'shounen', name: 'Shounen' },
  { slug: 'shoujo', name: 'Shoujo' },
  { slug: 'seinen', name: 'Seinen' },
  { slug: 'josei', name: 'Josei' },
];

export default function GenrePage() {
  // Genre colors for visual appeal
  const genreColors = [
    'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50',
    'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50',
    'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400/50',
    'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-400/50',
    'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50',
    'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-400/50',
    'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-400/50',
    'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-400/50',
    'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/50',
    'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-400/50',
  ];

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Genres</h1>
          </div>
          <p className="text-gray-400 text-sm ml-5">Browse manga by genre or category.</p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {genres.map((genre, index) => (
            <Link
              key={genre.slug}
              href={`/search?q=${genre.name}`}
              className={`block p-4 sm:p-5 rounded-xl bg-gradient-to-br ${genreColors[index % genreColors.length]} border hover:scale-[1.03] transition-all duration-200 group shadow-lg`}
            >
              <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-[#f0c929] transition-colors">{genre.name}</h3>
              <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Browse manga</p>
            </Link>
          ))}
        </div>

        {/* Browse by Type */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Browse by Type</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <Link
              href="/manga?type=manga"
              className="block p-5 sm:p-6 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/10 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 group shadow-lg hover:scale-[1.02]"
            >
              <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-red-300 transition-colors">Manga</h3>
              <p className="text-gray-400 mt-1.5 text-xs sm:text-sm">Japanese comics</p>
            </Link>
            <Link
              href="/manga?type=manhwa"
              className="block p-5 sm:p-6 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 group shadow-lg hover:scale-[1.02]"
            >
              <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-blue-300 transition-colors">Manhwa</h3>
              <p className="text-gray-400 mt-1.5 text-xs sm:text-sm">Korean comics</p>
            </Link>
            <Link
              href="/manga?type=manhua"
              className="block p-5 sm:p-6 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/10 border border-green-500/30 hover:border-green-400/50 transition-all duration-200 group shadow-lg hover:scale-[1.02]"
            >
              <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-green-300 transition-colors">Manhua</h3>
              <p className="text-gray-400 mt-1.5 text-xs sm:text-sm">Chinese comics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
