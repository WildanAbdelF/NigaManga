import { getRecommendedManga, getPopularManga, getLatestManga } from '@/lib/api';
import HeroSection from '@/components/HeroSection';
import TrendingSection from '@/components/TrendingSection';
import MangaCard from '@/components/MangaCard';
import SectionTitle from '@/components/SectionTitle';
import { Manga } from '@/types/manga';

export default async function Home() {
  let recommendedList: Manga[] = [];
  let popularList: Manga[] = [];
  let latestList: Manga[] = [];
  
  try {
    const [recommendedRes, popularRes, latestRes] = await Promise.all([
      getRecommendedManga('manga'),
      getPopularManga('manga'),
      getLatestManga('mirror'),
    ]);
    recommendedList = recommendedRes.mangaList;
    popularList = popularRes.mangaList;
    latestList = latestRes.mangaList;
  } catch (error) {
    console.error('Failed to fetch manga:', error);
  }

  if (recommendedList.length === 0 && popularList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-gray-400">Failed to load manga. Please try again later.</p>
      </div>
    );
  }

  // Use popular list for hero if recommended is empty
  const heroList = recommendedList.length > 0 ? recommendedList : popularList;

  return (
    <div className="min-h-screen pt-14">
      {/* Hero Section */}
      <HeroSection mangaList={heroList} />

      {/* Trending Section */}
      {popularList.length > 0 && (
        <TrendingSection title="Trending Now" mangaList={popularList} />
      )}

      {/* Latest Updates Section */}
      {latestList.length > 0 && (
        <TrendingSection title="Latest Updates" mangaList={latestList} />
      )}

      {/* Recommended Manga Grid */}
      {recommendedList.length > 0 && (
        <section className="py-4 md:py-6">
          <div className="w-full px-6 sm:px-10 lg:px-16">
            <SectionTitle title="Recommended Manga" viewAllHref="/manga" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {recommendedList.slice(0, 12).map((manga) => (
                <MangaCard key={manga.manga_id} manga={manga} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-4 border-t border-[#2a2a3e] mt-4">
        <div className="w-full px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2026 NigaManga. All rights reserved. Data from Sansekai API.
          </p>
        </div>
      </footer>
    </div>
  );
}
