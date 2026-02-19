"use client";

import { Calendar, Filter, X } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";

interface MemberFiltersType {
  search: string;
  dateFrom: string;
  dateTo: string;
  plan: string;
  status: "all" | "active" | "inactive";
}

interface MemberFiltersProps {
  filters: MemberFiltersType;
  onFiltersChange: (filters: MemberFiltersType) => void;
  filteredCount: number;
  totalCount: number;
  isLoading?: boolean;
}

export function MemberFilters({
  filters,
  onFiltersChange,
  filteredCount,
  totalCount,
  isLoading = false,
}: MemberFiltersProps) {
  const updateFilter = (key: keyof MemberFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", dateFrom: "", dateTo: "", plan: "all", status: "all" });
  };

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.plan !== "all" ||
    filters.status !== "all";

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all appearance-none";

  const labelClass = "block text-sm font-semibold text-[#1F2937] mb-1.5";

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Search */}
      <SearchBar
        value={filters.search}
        onChange={(value) => updateFilter("search", value)}
        placeholder="Search members by name or email..."
        isLoading={isLoading}
      />

      {/* Filters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date From */}
        <div>
          <label className={labelClass}>Joined From</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className={labelClass}>Joined To</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Plan */}
        <div>
          <label className={labelClass}>Subscription Plan</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={filters.plan}
              onChange={(e) => updateFilter("plan", e.target.value)}
              className={`${inputClass} pl-10 cursor-pointer`}
            >
              <option value="all">All Plans</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Member Status</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value as MemberFiltersType["status"])}
              className={`${inputClass} pl-10 cursor-pointer`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="font-semibold text-[#1F2937]">Active:</span>
            <span className="text-[#9CA3AF]">Currently active subscription</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="font-semibold text-[#1F2937]">Inactive:</span>
            <span className="text-[#9CA3AF]">Last login over 6 months ago</span>
          </div>
        </div>
      </div>

      {/* Results count & clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <p className="text-sm text-[#9CA3AF]">
            Showing{" "}
            <span className="font-bold text-[#1F2937]">{filteredCount}</span>{" "}
            of <span className="font-bold text-[#1F2937]">{totalCount}</span> members
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-[#9CA3AF] hover:text-[#1F2937]"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}