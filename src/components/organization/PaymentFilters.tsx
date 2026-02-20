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
  "w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors";

const labelClass = "block text-xs font-medium text-gray-500 mb-1";

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
    setSelectedSource("paystack");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchTerm ||
    dateFrom ||
    dateTo ||
    selectedSource !== "paystack" ||
    selectedStatus !== "all";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${inputClass} pl-9`}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Gateway</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="paystack">Paystack</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredCount}</span> results
          </p>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}