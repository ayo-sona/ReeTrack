"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";

interface PlanFiltersType {
  status: "all" | "active" | "inactive";
  duration: "all" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  priceMin: string;
  priceMax: string;
}

interface PlanFiltersProps {
  filters: PlanFiltersType;
  onFiltersChange: (filters: PlanFiltersType) => void;
  filteredCount: number;
  totalCount: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isSearchLoading?: boolean;
}

export function PlanFilters({ filters, onFiltersChange, filteredCount, totalCount, searchValue = "", onSearchChange, isSearchLoading = false }: PlanFiltersProps) {
  const updateFilter = (key: keyof PlanFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ status: "all", duration: "all", priceMin: "", priceMax: "" });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.duration !== "all" ||
    filters.priceMin !== "" ||
    filters.priceMax !== "";

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all appearance-none";

  const labelClass = "block text-sm font-semibold text-[#1F2937] mb-1.5";

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {onSearchChange && (
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search plans by name..."
          isLoading={isSearchLoading}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className={`${inputClass} pl-10 cursor-pointer`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className={labelClass}>Billing Cycle</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <select
              value={filters.duration}
              onChange={(e) => updateFilter("duration", e.target.value)}
              className={`${inputClass} pl-10 cursor-pointer`}
            >
              <option value="all">All Cycles</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Price Min */}
        <div>
          <label className={labelClass}>Min Price (₦)</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => updateFilter("priceMin", e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* Price Max */}
        <div>
          <label className={labelClass}>Max Price (₦)</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => updateFilter("priceMax", e.target.value)}
            placeholder="No limit"
            className={inputClass}
          />
        </div>
      </div>

      {/* Results & clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <p className="text-sm text-[#9CA3AF]">
            Showing <span className="font-bold text-[#1F2937]">{filteredCount}</span> of{" "}
            <span className="font-bold text-[#1F2937]">{totalCount}</span> plans
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