// Sansekai API Types

export interface Taxonomy {
  taxonomy_id?: number;
  slug: string;
  name: string;
}

export interface MangaTaxonomy {
  Artist?: Taxonomy[];
  Author?: Taxonomy[];
  Format?: Taxonomy[];
  Genre?: Taxonomy[];
  Type?: Taxonomy[];
}

export interface Manga {
  manga_id: string;
  title: string;
  description: string;
  alternative_title: string;
  cover_image_url: string;
  cover_portrait_url?: string;
  release_year: string;
  status: number; // 1 = ongoing, 0 = completed
  country_id: string;
  bookmark_count: number;
  view_count?: number;
  user_rate?: number;
  rank: number;
  is_recommended: boolean;
  latest_chapter_id: string;
  latest_chapter_number: number;
  latest_chapter_time: string;
  taxonomy: MangaTaxonomy;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface MangaDetail extends Manga {
  id: number;
}

export interface Chapter {
  chapter_id: string;
  manga_id: string;
  chapter_title: string;
  chapter_number: number;
  thumbnail_image_url: string;
  view_count: number;
  release_date: string;
}

export interface ChapterDetail {
  chapter_id: string;
  manga_id: string;
  chapter_number: number;
  chapter_title: string;
  base_url: string;
  base_url_low: string;
  chapter: {
    data: string[];
  };
  thumbnail_image_url: string;
  view_count: number;
  prev_chapter_id: string | null;
  prev_chapter_number: number | null;
  next_chapter_id: string | null;
  next_chapter_number: number | null;
  release_date: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMeta {
  request_id: string;
  timestamp: number;
  process_time: string;
  page?: number;
  page_size?: number;
  total_page?: number;
  total_record?: number;
}

export interface ApiResponse<T> {
  retcode: number;
  message: string;
  meta: ApiMeta;
  data: T;
}

export interface MangaListResponse {
  mangaList: Manga[];
  meta: ApiMeta;
}

export interface ChapterListResponse {
  chapters: Chapter[];
  meta: ApiMeta;
}
