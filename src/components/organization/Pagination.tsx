// components/organization/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Page info */}
      <p className="text-sm text-[#1F2937]/60">
        Page <span className="font-bold text-[#1F2937]">{currentPage}</span> of{" "}
        <span className="font-bold text-[#1F2937]">{totalPages}</span>
      </p>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={clsx(
            "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
            currentPage === 1 || isLoading
              ? "text-[#1F2937]/30 cursor-not-allowed"
              : "text-[#1F2937] hover:bg-[#F9FAFB]"
          )}
          style={{ borderRadius: "8px" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-9 h-9 text-[#1F2937]/60"
              >
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              disabled={isLoading}
              className={clsx(
                "flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold transition-all",
                isActive
                  ? "bg-[#0D9488] text-white shadow-sm"
                  : "text-[#1F2937] hover:bg-[#F9FAFB]",
                isLoading && "cursor-not-allowed opacity-50"
              )}
              style={{ borderRadius: "8px" }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={clsx(
            "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
            currentPage === totalPages || isLoading
              ? "text-[#1F2937]/30 cursor-not-allowed"
              : "text-[#1F2937] hover:bg-[#F9FAFB]"
          )}
          style={{ borderRadius: "8px" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}