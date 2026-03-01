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
    'from-red-500/20 to-red-600/10 border-red-500/30',
    'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    'from-green-500/20 to-green-600/10 border-green-500/30',
    'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
    'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    'from-teal-500/20 to-teal-600/10 border-teal-500/30',
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Genres</h1>
          <p className="text-gray-400">Browse manga by genre or category.</p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <Link
              key={genre.slug}
              href={`/search?q=${genre.name}`}
              className={`block p-6 rounded-xl bg-gradient-to-br ${genreColors[index % genreColors.length]} border hover:scale-105 transition-transform duration-200`}
            >
              <h3 className="text-white font-semibold text-lg">{genre.name}</h3>
              <p className="text-gray-400 text-sm mt-1">Browse manga</p>
            </Link>
          ))}
        </div>

        {/* Browse by Type */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/manga?type=manga"
              className="block p-8 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/10 border border-red-500/30 hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-white font-bold text-2xl">Manga</h3>
              <p className="text-gray-400 mt-2">Japanese comics</p>
            </Link>
            <Link
              href="/manga?type=manhwa"
              className="block p-8 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/30 hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-white font-bold text-2xl">Manhwa</h3>
              <p className="text-gray-400 mt-2">Korean comics</p>
            </Link>
            <Link
              href="/manga?type=manhua"
              className="block p-8 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/10 border border-green-500/30 hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-white font-bold text-2xl">Manhua</h3>
              <p className="text-gray-400 mt-2">Chinese comics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
