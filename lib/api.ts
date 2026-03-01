import { Manga, MangaDetail, Chapter, ChapterDetail, ApiResponse, ApiMeta } from '@/types/manga';

const API_BASE = 'https://api.sansekai.my.id/api/komik';

// Comic types: manga, manhwa, manhua
export type ComicType = 'manga' | 'manhwa' | 'manhua';
// Source types for latest: project, mirror
export type SourceType = 'project' | 'mirror';

export interface MangaListResult {
  mangaList: Manga[];
  meta: ApiMeta;
}

export async function getRecommendedManga(type: ComicType = 'manga'): Promise<MangaListResult> {
  try {
    const res = await fetch(`${API_BASE}/recommended?type=${type}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch recommended: ${res.status}`);
    const data: ApiResponse<Manga[]> = await res.json();
    return { mangaList: data.data, meta: data.meta };
  } catch (error) {
    console.error('API Error:', error);
    return { mangaList: [], meta: { request_id: '', timestamp: 0, process_time: '0ms' } };
  }
}

export async function getLatestManga(type: SourceType = 'mirror', page: number = 1): Promise<MangaListResult> {
  try {
    const res = await fetch(`${API_BASE}/latest?type=${type}&page=${page}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch latest: ${res.status}`);
    const data: ApiResponse<Manga[]> = await res.json();
    return { mangaList: data.data, meta: data.meta };
  } catch (error) {
    console.error('API Error:', error);
    return { mangaList: [], meta: { request_id: '', timestamp: 0, process_time: '0ms' } };
  }
}

export async function getPopularManga(type: ComicType = 'manga', page: number = 1): Promise<MangaListResult> {
  try {
    const res = await fetch(`${API_BASE}/popular?type=${type}&page=${page}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch popular: ${res.status}`);
    const data: ApiResponse<Manga[]> = await res.json();
    return { mangaList: data.data, meta: data.meta };
  } catch (error) {
    console.error('API Error:', error);
    return { mangaList: [], meta: { request_id: '', timestamp: 0, process_time: '0ms' } };
  }
}

export async function searchManga(query: string, type: ComicType = 'manga', page: number = 1): Promise<MangaListResult> {
  try {
    const res = await fetch(`${API_BASE}/search?type=${type}&query=${encodeURIComponent(query)}&page=${page}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to search manga: ${res.status}`);
    const data: ApiResponse<Manga[]> = await res.json();
    return { mangaList: data.data, meta: data.meta };
  } catch (error) {
    console.error('API Error:', error);
    return { mangaList: [], meta: { request_id: '', timestamp: 0, process_time: '0ms' } };
  }
}

export async function getMangaDetail(mangaId: string, type: ComicType = 'manga'): Promise<MangaDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/detail?type=${type}&manga_id=${mangaId}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch manga detail: ${res.status}`);
    const data: ApiResponse<MangaDetail> = await res.json();
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function getChapterList(mangaId: string, type: ComicType = 'manga', page: number = 1): Promise<{ chapters: Chapter[]; meta: ApiMeta }> {
  try {
    const res = await fetch(`${API_BASE}/chapterlist?type=${type}&manga_id=${mangaId}&page=${page}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch chapter list: ${res.status}`);
    const data: ApiResponse<Chapter[]> = await res.json();
    return { chapters: data.data, meta: data.meta };
  } catch (error) {
    console.error('API Error:', error);
    return { chapters: [], meta: { request_id: '', timestamp: 0, process_time: '0ms' } };
  }
}

export async function getChapterImages(chapterId: string, type: ComicType = 'manga'): Promise<ChapterDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/getimage?type=${type}&chapter_id=${chapterId}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch chapter images: ${res.status}`);
    const data: ApiResponse<ChapterDetail> = await res.json();
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
