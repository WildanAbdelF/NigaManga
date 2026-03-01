import Link from 'next/link';

interface SectionTitleProps {
  title: string;
  viewAllHref?: string;
}

export default function SectionTitle({ title, viewAllHref }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#f0c929] rounded-full" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-[#f0c929] hover:underline"
        >
          View All →
        </Link>
      )}
    </div>
  );
}
