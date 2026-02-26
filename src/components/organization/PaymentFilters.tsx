"use client";

import { Search, X } from "lucide-react";

interface PaymentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  filteredCount: number;
}

const inputClass =
  "px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-colors";

export function PaymentFilters({
  searchTerm,
  setSearchTerm,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedSource,
  setSelectedSource,
  selectedStatus,
  setSelectedStatus,
  filteredCount,
}: PaymentFiltersProps) {
  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchTerm ||
    dateFrom ||
    dateTo ||
    selectedSource !== "paystack" ||
    selectedStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${inputClass} pl-8 w-52`}
        />
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200 hidden sm:block" />

      {/* Date range */}
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={`${inputClass} w-34`}
          title="From"
        />
        <span className="text-[11px] text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={`${inputClass} w-34`}
          title="To"
        />
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200 hidden sm:block" />

      {/* Status */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className={`${inputClass} cursor-pointer`}
      >
        <option value="all">All status</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      {/* Active filter feedback */}
      {hasActiveFilters && (
        <>
          <span className="text-[11px] text-gray-400">
            <span className="font-semibold text-gray-600">{filteredCount}</span> results
          </span>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </>
      )}
    </div>
  );
}