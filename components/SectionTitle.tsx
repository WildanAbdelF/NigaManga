import Link from 'next/link';

interface SectionTitleProps {
  title: string;
  viewAllHref?: string;
}

export default function SectionTitle({ title, viewAllHref }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 bg-[#f0c929] rounded-full" />
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs sm:text-sm font-semibold text-[#f0c929] hover:text-[#ffd93d] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#f0c929]/10"
        >
          View All 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
