interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-[#1a1a2e] text-white text-sm rounded-lg border border-[#2a2a3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 flex items-center justify-center bg-[#1a1a2e] text-white text-sm rounded-lg border border-[#2a2a3e] hover:bg-[#2a2a3e] transition-all"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500 text-sm px-0.5">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all text-sm ${
            page === currentPage
              ? 'bg-[#f0c929] text-[#0f0f1a] font-bold shadow-lg'
              : 'bg-[#1a1a2e] text-white border border-[#2a2a3e] hover:bg-[#2a2a3e]'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500 text-sm px-0.5">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 flex items-center justify-center bg-[#1a1a2e] text-white text-sm rounded-lg border border-[#2a2a3e] hover:bg-[#2a2a3e] transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-[#1a1a2e] text-white text-sm rounded-lg border border-[#2a2a3e] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f0c929] hover:text-[#0f0f1a] hover:border-[#f0c929] transition-all flex items-center gap-1.5"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
