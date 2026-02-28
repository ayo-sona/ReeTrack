"use client";

import { useState, useMemo } from "react";
import {
  QrCode,
  Scan,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Award,
  Hash,
  Filter,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import QRCodeScanner from "@/components/organization/QRCodeScanner";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useMembers } from "@/hooks/useMembers";
import clsx from "clsx";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CheckInSkeleton() {
  return (
    <div
      className="p-6 space-y-6 max-w-7xl mx-auto"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="h-5 w-36 bg-gray-100 rounded-lg animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#F9FAFB] border border-gray-100 rounded-lg p-3 space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-full bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrganizationCheckInPage() {
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"scan" | "stats">("scan");
  const [scanMode, setScanMode] = useState<"qr" | "manual" | "">("");
  const [manualCode, setManualCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearchQuery, setRecentSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">(
    "month",
  );
  const { data: members, isLoading } = useMembers(page, PAGE_SIZE);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentMember, setCurrentMember] = useState("");

  const totalMembers = members?.length ?? 0;
  const todayCheckIns =
    members?.filter((m) => {
      const checkInDate = new Date(m?.checked_in_at);
      return checkInDate.toDateString() === new Date().toDateString();
    }).length ?? 0;

  const recentCheckIns = useMemo(
    () =>
      members
        ?.slice()
        .sort(
          (a, b) =>
            new Date(b?.checked_in_at).getTime() -
            new Date(a?.checked_in_at).getTime(),
        ),
    [members],
  );

  const filteredRecentCheckIns = useMemo(() => {
    if (!recentSearchQuery.trim()) return recentCheckIns;
    const q = recentSearchQuery.toLowerCase();
    return recentCheckIns?.filter(
      (m) =>
        m.user?.first_name?.toLowerCase().includes(q) ||
        m.user?.last_name?.toLowerCase().includes(q) ||
        `${m.user?.first_name} ${m.user?.last_name}`.toLowerCase().includes(q),
    );
  }, [recentCheckIns, recentSearchQuery]);

  const filteredStats = members?.filter(
    (m) =>
      m.user?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user?.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTimeAgo = (dateString: string) => {
    const diffInMinutes = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 60000,
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return;
    try {
      setIsChecking(true);
      const response = await apiClient.post(`members/organization/check-in/`, {
        memberId: currentMember,
        checkInCode: manualCode,
      });
      if (response.data.statusCode === 201) {
        toast.success("Member checked in successfully");
      }
    } catch (error) {
      console.error("Failed to check-in:", error);
      toast.error("Failed to check in member");
    } finally {
      setIsChecking(false);
      setManualCode("");
      setScanMode("");
    }
  };

  const handleCheckInSuccess = () => {
    toast.success("Member checked in successfully");
  };

  if (isLoading) return <CheckInSkeleton />;

  if (members?.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 px-6"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-[#0D9488]" />
        </div>
        <p className="text-base font-bold text-[#1F2937] mb-1">
          No members found
        </p>
        <p className="text-sm text-[#9CA3AF]">
          Add members to start tracking check-ins
        </p>
      </div>
    );
  }

  const tabBtnClass = (active: boolean) =>
    clsx(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
      active
        ? "bg-white text-[#1F2937] shadow-sm"
        : "text-[#9CA3AF] hover:text-[#1F2937]",
    );

  return (
    <div
      className="p-6 space-y-6 max-w-7xl mx-auto"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">Member Check-In</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Scan QR codes or enter codes manually to check in members
          </p>
        </div>

        <div className="inline-flex items-center bg-[#F9FAFB] border border-gray-100 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("scan")}
            className={tabBtnClass(activeTab === "scan")}
          >
            <Scan className="w-4 h-4" />
            Check-In
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={tabBtnClass(activeTab === "stats")}
          >
            <TrendingUp className="w-4 h-4" />
            Statistics
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
              Today&apos;s Check-Ins
            </p>
            <div className="w-8 h-8 bg-[#0D9488]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#0D9488]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1F2937]">
            {todayCheckIns}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
              Total Members
            </p>
            <div className="w-8 h-8 bg-[#0D9488]/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-[#0D9488]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1F2937]">
            {totalMembers}
          </p>
        </div>
      </div>

      {activeTab === "scan" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-bold text-[#1F2937]">
                Select Check-In Method
              </h2>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setScanMode("qr");
                  setIsScannerOpen(true);
                }}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </Button>

              <QRCodeScanner
                isOpen={isScannerOpen}
                onOpenChange={setIsScannerOpen}
                onCheckInSuccess={handleCheckInSuccess}
              />

              {scanMode === "manual" && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                      Enter Check-In Code
                    </label>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyUp={(e) =>
                        e.key === "Enter" && handleManualCheckIn()
                      }
                      placeholder="ABC123XYZ"
                      maxLength={9}
                      className="w-full text-center rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all tracking-widest font-bold"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={!manualCode.trim() || isChecking}
                    onClick={handleManualCheckIn}
                  >
                    {isChecking ? "Checking in..." : "Check In Member"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Recent check-ins */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {/* Panel header */}
            <h2 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D9488]" />
              Recent Check-Ins
            </h2>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                size={14}
              />
              <input
                type="text"
                value={recentSearchQuery}
                onChange={(e) => setRecentSearchQuery(e.target.value)}
                placeholder="Search members…"
                className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] pl-8 pr-8 py-2 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all"
              />
              {recentSearchQuery && (
                <button
                  onClick={() => setRecentSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Results */}
            {filteredRecentCheckIns && filteredRecentCheckIns.length > 0 ? (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {filteredRecentCheckIns.map((checkIn) => {
                  const initials =
                    `${checkIn.user.first_name} ${checkIn.user.last_name}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                  return (
                    <div
                      key={checkIn.id}
                      className="bg-[#F9FAFB] border border-gray-100 rounded-lg p-3 space-y-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1F2937] truncate">
                            {checkIn.user.first_name} {checkIn.user.last_name}
                          </p>
                          <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(checkIn.checked_in_at)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setScanMode("manual");
                          setCurrentMember(checkIn.id);
                        }}
                      >
                        <Hash className="w-3.5 h-3.5 mr-1.5" />
                        Enter Code
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-3">
                  {recentSearchQuery ? (
                    <Search className="w-5 h-5 text-[#0D9488]" />
                  ) : (
                    <Users className="w-6 h-6 text-[#0D9488]" />
                  )}
                </div>
                <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                  {recentSearchQuery ? "No results found" : "No check-ins yet"}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  {recentSearchQuery
                    ? `No members match "${recentSearchQuery}"`
                    : "Check-ins will appear here"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Statistics tab */
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search members..."
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter className="w-4 h-4 text-[#9CA3AF]" />
                {(["today", "week", "month"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={clsx(
                      "px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize",
                      timeFilter === period
                        ? "bg-[#0D9488] text-white shadow-sm"
                        : "bg-[#F9FAFB] border border-gray-100 text-[#9CA3AF] hover:text-[#1F2937]",
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Check-Ins
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Last Check-In
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStats?.map((stat, index) => {
                    const initials =
                      `${stat.user.first_name} ${stat.user.last_name}`
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();
                    return (
                      <tr
                        key={stat.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <p className="text-sm font-semibold text-[#1F2937]">
                              {stat.user.first_name} {stat.user.last_name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-xl font-extrabold text-[#1F2937]">
                              {stat.check_in_count}
                            </span>
                            {index === 0 && (
                              <Award className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#9CA3AF]">
                            {formatTimeAgo(stat.checked_in_at)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filteredStats?.map((stat, index) => {
                const initials =
                  `${stat.user.first_name} ${stat.user.last_name}`
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                return (
                  <div
                    key={stat.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">
                          {stat.user.first_name} {stat.user.last_name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          {formatTimeAgo(stat.checked_in_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-extrabold text-[#1F2937]">
                        {stat.check_in_count}
                      </span>
                      {index === 0 && (
                        <Award className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStats?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-[#0D9488]" />
                </div>
                <p className="text-sm font-bold text-[#1F2937] mb-1">
                  No members found
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Try adjusting your search
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
