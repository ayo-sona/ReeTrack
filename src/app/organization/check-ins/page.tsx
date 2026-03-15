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
  UserSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import QRCodeScanner from "@/components/organization/QRCodeScanner";
import MemberSelectModal from "@/components/organization/MemberSelectModal";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useMembers } from "@/hooks/useMembers";
import clsx from "clsx";

function getLatestCheckIn(
  checked_in_at: string[] | string | null | undefined,
): string | null {
  if (!checked_in_at) return null;
  if (typeof checked_in_at === "string") return checked_in_at;
  if (checked_in_at.length === 0) return null;
  return [...checked_in_at].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )[0];
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const diffInMinutes = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 60000,
  );
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}

function CheckInSkeleton() {
  return (
    <div
      className="p-6 space-y-6 max-w-7xl mx-auto"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3"
          >
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <div className="h-5 w-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrganizationCheckInPage() {
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<"scan" | "stats">("scan");
  const [scanMode, setScanMode] = useState<"qr" | "manual" | "">("");
  const [manualCode, setManualCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearchQuery, setRecentSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">(
    "month",
  );
  const { data: members, isLoading } = useMembers(page, 100);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentMember, setCurrentMember] = useState("");
  const [currentMemberName, setCurrentMemberName] = useState("");

  const totalMembers = members?.meta?.total ?? members?.data?.length ?? 0;

  const todayCheckIns = useMemo(() => {
    const today = new Date().toDateString();
    return (
      members?.data?.filter((m) => {
        const timestamps = Array.isArray(m?.checked_in_at)
          ? m.checked_in_at
          : m?.checked_in_at
            ? [m.checked_in_at]
            : [];
        return timestamps.some((t) => new Date(t).toDateString() === today);
      }).length ?? 0
    );
  }, [members]);

  const recentCheckIns = useMemo(
    () =>
      members?.data
        ?.slice()
        .filter((m) => getLatestCheckIn(m?.checked_in_at) !== null)
        .sort((a, b) => {
          const latestA = getLatestCheckIn(a?.checked_in_at);
          const latestB = getLatestCheckIn(b?.checked_in_at);
          return (
            new Date(latestB ?? 0).getTime() - new Date(latestA ?? 0).getTime()
          );
        }),
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

  const filteredStats = useMemo(() => {
    return members?.data?.filter(
      (m) =>
        m.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return;
    try {
      setIsChecking(true);
      await apiClient.post(`members/organization/check-in/`, {
        memberId: currentMember,
        checkInCode: manualCode,
      });
      toast.success("Member checked in successfully");
    } catch (error) {
      console.error("Failed to check-in:", error);
      toast.error("Failed to check in member");
    } finally {
      setIsChecking(false);
      setManualCode("");
      setScanMode("");
      setCurrentMember("");
      setCurrentMemberName("");
    }
  };

  const handleMemberSelect = (memberId: string, memberName: string) => {
    setCurrentMember(memberId);
    setCurrentMemberName(memberName);
    setScanMode("manual");
  };

  const cancelManual = () => {
    setScanMode("");
    setCurrentMember("");
    setCurrentMemberName("");
    setManualCode("");
  };

  if (isLoading) return <CheckInSkeleton />;

  if (!members?.data || members.data.length === 0) {
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
      <MemberSelectModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSelect={handleMemberSelect}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">Member Check-In</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Scan QR codes or enter code to check in members
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-In Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-[#1F2937]">
              Check-In a Member
            </h2>

            {/* QR Scan */}
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
              onCheckInSuccess={() =>
                toast.success("Member checked in successfully")
              }
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs font-semibold text-[#9CA3AF]">
                  or enter code
                </span>
              </div>
            </div>

            {/* Select Member Button */}
            {scanMode !== "manual" && (
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-gray-200 py-5 text-sm font-bold text-[#9CA3AF] hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#0D9488]/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#0D9488]/10 flex items-center justify-center transition-colors">
                  <UserSearch className="w-4 h-4" />
                </div>
                Select a member to check in
              </button>
            )}

            {/* Manual Code Input */}
            {scanMode === "manual" && (
              <div className="space-y-4">
                {currentMemberName && (
                  <div className="flex items-center justify-between bg-[#0D9488]/5 border border-[#0D9488]/15 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0D9488]/20 flex items-center justify-center text-[#0D9488] text-xs font-bold">
                        {currentMemberName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-[#0D9488]">
                        {currentMemberName}
                      </p>
                    </div>
                    <button
                      onClick={cancelManual}
                      className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5">
                    Check-In Code
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleManualCheckIn()}
                    placeholder="Enter 6-digit code"
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
                <button
                  onClick={cancelManual}
                  className="w-full text-xs font-semibold text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Recent Check-Ins Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D9488]" />
              Recent Check-Ins
            </h2>
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

            {filteredRecentCheckIns && filteredRecentCheckIns.length > 0 ? (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {filteredRecentCheckIns.map((checkIn) => {
                  const fullName = `${checkIn.user.first_name} ${checkIn.user.last_name}`;
                  const initials = fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                  const latest = getLatestCheckIn(checkIn.checked_in_at);
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
                            {fullName}
                          </p>
                          <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(latest)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleMemberSelect(checkIn.id, fullName)}
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
                    const latest = getLatestCheckIn(stat.checked_in_at);
                    const checkInCount = Array.isArray(stat.checked_in_at)
                      ? stat.checked_in_at.length
                      : (stat.check_in_count ?? 0);
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
                              {checkInCount}
                            </span>
                            {index === 0 && (
                              <Award className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#9CA3AF]">
                            {formatTimeAgo(latest)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-50">
              {filteredStats?.map((stat, index) => {
                const initials =
                  `${stat.user.first_name} ${stat.user.last_name}`
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                const latest = getLatestCheckIn(stat.checked_in_at);
                const checkInCount = Array.isArray(stat.checked_in_at)
                  ? stat.checked_in_at.length
                  : (stat.check_in_count ?? 0);
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
                          {formatTimeAgo(latest)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-extrabold text-[#1F2937]">
                        {checkInCount}
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
