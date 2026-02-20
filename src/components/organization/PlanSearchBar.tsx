"use client";

import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search plans by name...",
  isLoading = false,
}: SearchBarProps) {
  return (
    <div className="relative" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
      />
      {isLoading && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 text-[#0D9488] animate-spin" />
        </div>
      )}
    </div>
  );
}