"use client";

import { useState, useMemo } from "react";
import {
  QrCode,
  Scan,
  Users,
  Calendar,
  Clock,
  Hash,
  Search,
  X,
  UserSearch,
  Trophy,
  Crown,
  Medal,
  Award,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import QRCodeScanner from "@/components/organization/QRCodeScanner";
import MemberSelectModal from "@/components/organization/MemberSelectModal";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useMembers } from "@/hooks/useMembers";
import { motion } from "framer-motion";
import clsx from "clsx";

const MONTHLY_THRESHOLD = 15;

function getLatestCheckIn(checked_in_at: string[] | string | null | undefined): string | null {
  if (!checked_in_at) return null;
  if (typeof checked_in_at === "string") return checked_in_at;
  if (checked_in_at.length === 0) return null;
  return [...checked_in_at].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const diffInMinutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}

function getCheckInCount(checked_in_at: string[] | string | null | undefined, period: "all" | "month" | "today" | "week"): number {
  if (!checked_in_at) return 0;
  const timestamps = Array.isArray(checked_in_at) ? checked_in_at : [checked_in_at];
  if (period === "all") return timestamps.length;
  const now = new Date();
  return timestamps.filter((t) => {
    const d = new Date(t);
    if (period === "today") return d.toDateString() === now.toDateString();
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    return false;
  }).length;
}

function RankBadge({ rank, qualifies }: { rank: number; qualifies: boolean }) {
  if (!qualifies || rank > 3) return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F9FAFB", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontWeight: 700, fontSize: 12, color: "#9CA3AF" }}>#{rank}</span>
    </div>
  );
  if (rank === 1) return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(245,158,11,0.4)", flexShrink: 0 }}>
      <Crown size={14} color="white" />
    </div>
  );
  if (rank === 2) return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #94A3B8, #64748B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(148,163,184,0.35)", flexShrink: 0 }}>
      <Medal size={14} color="white" />
    </div>
  );
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #CD7F32, #A0522D)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(205,127,50,0.35)", flexShrink: 0 }}>
      <Award size={14} color="white" />
    </div>
  );
}

function PodiumCard({ member, rank }: { member: any; rank: 1 | 2 | 3 }) {
  // Always use month count for podium
  const count = getCheckInCount(member.checked_in_at, "month");
  const name = `${member.user.first_name} ${member.user.last_name}`;
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
  const heights = { 1: 120, 2: 95, 3: 75 };
  const rankColors = {
    1: { bg: "linear-gradient(135deg, #F59E0B, #D97706)", shadow: "0 6px 24px rgba(245,158,11,0.35)" },
    2: { bg: "linear-gradient(135deg, #94A3B8, #64748B)", shadow: "0 6px 20px rgba(148,163,184,0.3)" },
    3: { bg: "linear-gradient(135deg, #CD7F32, #A0522D)", shadow: "0 6px 16px rgba(205,127,50,0.3)" },
  };
  const cfg = rankColors[rank];
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}
    >
      <div style={{ position: "relative", marginBottom: 2 }}>
        <div style={{ width: rank === 1 ? 60 : 48, height: rank === 1 ? 60 : 48, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: rank === 1 ? 20 : 16, color: "white", boxShadow: cfg.shadow }}>
          {initials}
        </div>
        <div style={{ position: "absolute", bottom: -3, right: -3, fontSize: 14 }}>{medals[rank]}</div>
      </div>
      <p style={{ fontWeight: 700, fontSize: 12, color: "#1F2937", textAlign: "center", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name.split(" ")[0]}
      </p>
      <div style={{ width: "100%", height: heights[rank], borderRadius: "10px 10px 0 0", background: cfg.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, boxShadow: cfg.shadow }}>
        <p style={{ fontWeight: 900, fontSize: rank === 1 ? 24 : 18, color: "white", lineHeight: 1 }}>{count}</p>
        <p style={{ fontWeight: 600, fontSize: 9, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>this month</p>
      </div>
    </motion.div>
  );
}

function CheckInSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="h-5 w-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Get current month name
const currentMonthName = new Date().toLocaleString("default", { month: "long" });

export default function OrganizationCheckInPage() {
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<"scan" | "stats">("scan");
  const [scanMode, setScanMode] = useState<"qr" | "manual" | "">("");
  const [manualCode, setManualCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearchQuery, setRecentSearchQuery] = useState("");
  const { data: members, isLoading } = useMembers(page, 100);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentMember, setCurrentMember] = useState("");
  const [currentMemberName, setCurrentMemberName] = useState("");

  const totalMembers = members?.meta?.total ?? members?.data?.length ?? 0;

  const todayCheckIns = useMemo(() => {
    const today = new Date().toDateString();
    return members?.data?.filter((m) => {
      const timestamps = Array.isArray(m?.checked_in_at) ? m.checked_in_at : m?.checked_in_at ? [m.checked_in_at] : [];
      return timestamps.some((t) => new Date(t).toDateString() === today);
    }).length ?? 0;
  }, [members]);

  const recentCheckIns = useMemo(() =>
    members?.data?.slice()
      .filter((m) => getLatestCheckIn(m?.checked_in_at) !== null)
      .sort((a, b) => new Date(getLatestCheckIn(b?.checked_in_at) ?? 0).getTime() - new Date(getLatestCheckIn(a?.checked_in_at) ?? 0).getTime()),
    [members]
  );

  const filteredRecentCheckIns = useMemo(() => {
    if (!recentSearchQuery.trim()) return recentCheckIns;
    const q = recentSearchQuery.toLowerCase();
    return recentCheckIns?.filter((m) =>
      m.user?.first_name?.toLowerCase().includes(q) ||
      m.user?.last_name?.toLowerCase().includes(q) ||
      `${m.user?.first_name} ${m.user?.last_name}`.toLowerCase().includes(q)
    );
  }, [recentCheckIns, recentSearchQuery]);

  // ── Leaderboard: always ranked by current month ──────────────────────────
  const ranked = useMemo(() => {
    if (!members?.data) return [];
    return [...members.data]
      .map((m) => ({
        ...m,
        score: getCheckInCount(m.checked_in_at, "month"), // always month
        qualifies: getCheckInCount(m.checked_in_at, "month") >= MONTHLY_THRESHOLD,
      }))
      .sort((a, b) => b.score - a.score);
  }, [members]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return ranked;
    const q = searchQuery.toLowerCase();
    return ranked.filter((m) =>
      m.user?.first_name?.toLowerCase().includes(q) ||
      m.user?.last_name?.toLowerCase().includes(q)
    );
  }, [ranked, searchQuery]);

  const qualifyingRanked = ranked.filter((m) => m.qualifies);
  const top3 = qualifyingRanked.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : [];
  const qualifyingCount = qualifyingRanked.length;
  const totalMonthCheckIns = ranked.reduce((s, m) => s + m.score, 0);
  // ──────────────────────────────────────────────────────────────────────────

  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return;
    try {
      setIsChecking(true);
      await apiClient.post(`members/organization/check-in/`, { memberId: currentMember, checkInCode: manualCode });
      toast.success("Member checked in successfully");
    } catch (error) {
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
      <div className="flex flex-col items-center justify-center py-24 px-6" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-[#0D9488]" />
        </div>
        <p className="text-base font-bold text-[#1F2937] mb-1">No members found</p>
        <p className="text-sm text-[#9CA3AF]">Add members to start tracking check-ins</p>
      </div>
    );
  }

  const tabBtnClass = (active: boolean) => clsx(
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
    active ? "bg-white text-[#1F2937] shadow-sm" : "text-[#9CA3AF] hover:text-[#1F2937]"
  );

  const gold = "#F59E0B", silver = "#94A3B8", bronze = "#CD7F32";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <style>{`@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}`}</style>

      <MemberSelectModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} onSelect={handleMemberSelect} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">Member Check-In</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Scan QR codes or enter code to check in members</p>
        </div>
        <div className="inline-flex items-center bg-[#F9FAFB] border border-gray-100 rounded-lg p-1 self-start sm:self-auto">
          <button onClick={() => setActiveTab("scan")} className={tabBtnClass(activeTab === "scan")}>
            <Scan className="w-4 h-4" /> Check-In
          </button>
          <button onClick={() => setActiveTab("stats")} className={tabBtnClass(activeTab === "stats")}>
            <Trophy className="w-4 h-4" /> Leaderboard
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">Today's Check-Ins</p>
            <div className="w-8 h-8 bg-[#0D9488]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#0D9488]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1F2937]">{todayCheckIns}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">Total Members</p>
            <div className="w-8 h-8 bg-[#0D9488]/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-[#0D9488]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1F2937]">{totalMembers}</p>
        </div>
      </div>

      {activeTab === "scan" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-In Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-[#1F2937]">Check-In a Member</h2>
            <Button type="button" variant="secondary" className="w-full" onClick={() => { setScanMode("qr"); setIsScannerOpen(true); }}>
              <QrCode className="w-4 h-4 mr-2" /> Scan QR Code
            </Button>
            <QRCodeScanner isOpen={isScannerOpen} onOpenChange={setIsScannerOpen} onCheckInSuccess={() => toast.success("Member checked in successfully")} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs font-semibold text-[#9CA3AF]">or enter code</span></div>
            </div>
            {scanMode !== "manual" && (
              <button onClick={() => setIsMemberModalOpen(true)} className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-gray-200 py-5 text-sm font-bold text-[#9CA3AF] hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#0D9488]/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#0D9488]/10 flex items-center justify-center transition-colors">
                  <UserSearch className="w-4 h-4" />
                </div>
                Select a member to check in
              </button>
            )}
            {scanMode === "manual" && (
              <div className="space-y-4">
                {currentMemberName && (
                  <div className="flex items-center justify-between bg-[#0D9488]/5 border border-[#0D9488]/15 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0D9488]/20 flex items-center justify-center text-[#0D9488] text-xs font-bold">
                        {currentMemberName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-[#0D9488]">{currentMemberName}</p>
                    </div>
                    <button onClick={cancelManual} className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors"><X size={14} /></button>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5">Check-In Code</label>
                  <input
                    type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleManualCheckIn()}
                    placeholder="Enter 6-digit code" maxLength={9}
                    className="w-full text-center rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all tracking-widest font-bold"
                  />
                </div>
                <Button type="button" variant="secondary" className="w-full" disabled={!manualCode.trim() || isChecking} onClick={handleManualCheckIn}>
                  {isChecking ? "Checking in..." : "Check In Member"}
                </Button>
                <button onClick={cancelManual} className="w-full text-xs font-semibold text-[#9CA3AF] hover:text-[#1F2937] transition-colors">Cancel</button>
              </div>
            )}
          </div>

          {/* Recent Check-Ins Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D9488]" /> Recent Check-Ins
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" size={14} />
              <input type="text" value={recentSearchQuery} onChange={(e) => setRecentSearchQuery(e.target.value)} placeholder="Search members…"
                className="w-full rounded-lg border border-gray-200 bg-[#F9FAFB] pl-8 pr-8 py-2 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all" />
              {recentSearchQuery && (
                <button onClick={() => setRecentSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"><X size={13} /></button>
              )}
            </div>
            {filteredRecentCheckIns && filteredRecentCheckIns.length > 0 ? (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {filteredRecentCheckIns.map((checkIn) => {
                  const fullName = `${checkIn.user.first_name} ${checkIn.user.last_name}`;
                  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase();
                  const latest = getLatestCheckIn(checkIn.checked_in_at);
                  return (
                    <div key={checkIn.id} className="bg-[#F9FAFB] border border-gray-100 rounded-lg p-3 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0">{initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1F2937] truncate">{fullName}</p>
                          <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{formatTimeAgo(latest)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => handleMemberSelect(checkIn.id, fullName)}>
                        <Hash className="w-3.5 h-3.5 mr-1.5" /> Enter Code
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-3">
                  {recentSearchQuery ? <Search className="w-5 h-5 text-[#0D9488]" /> : <Users className="w-6 h-6 text-[#0D9488]" />}
                </div>
                <p className="text-sm font-bold text-[#1F2937] mb-0.5">{recentSearchQuery ? "No results found" : "No check-ins yet"}</p>
                <p className="text-xs text-[#9CA3AF]">{recentSearchQuery ? `No members match "${recentSearchQuery}"` : "Check-ins will appear here"}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ── LEADERBOARD TAB ─────────────────────────────────────────────────
        <div className="space-y-5">

          {/* Search + month label */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search members..." />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0D9488]/8 border border-[#0D9488]/15 flex-shrink-0">
                <Flame size={13} className="text-[#0D9488]" />
                <span className="text-xs font-bold text-[#0D9488]">{currentMonthName} rankings</span>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: `${currentMonthName} Check-Ins`, value: totalMonthCheckIns, accent: true },
              { label: "Active Members", value: ranked.filter(m => m.score > 0).length, accent: false },
              { label: "Locked In", value: qualifyingCount, accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ background: accent ? "#0D9488" : "white", borderRadius: 12, border: `1px solid ${accent ? "transparent" : "#E5E7EB"}`, padding: "14px 16px", boxShadow: accent ? "0 4px 16px rgba(13,148,136,0.2)" : "none" }}>
                <p style={{ fontWeight: 400, fontSize: 11, color: accent ? "rgba(255,255,255,0.7)" : "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</p>
                <p style={{ fontWeight: 800, fontSize: 20, color: accent ? "white" : "#1F2937", letterSpacing: "-0.3px" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Podium */}
          {podiumOrder.length === 3 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F59E0B, #0D9488, #F06543)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }} />
              <div style={{ padding: "20px 20px 0" }}>
                <p style={{ fontWeight: 700, fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", marginBottom: 20 }}>🏆 {currentMonthName} Top Performers</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, maxWidth: 340, margin: "0 auto" }}>
                  {podiumOrder.map((m) => {
                    const rank = qualifyingRanked.indexOf(m) + 1;
                    return <PodiumCard key={m.id} member={m} rank={rank as 1 | 2 | 3} />;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Full rankings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>Full Rankings — {currentMonthName}</h2>
              <span style={{ fontWeight: 600, fontSize: 12, color: "#9CA3AF" }}>{filtered.length} members</span>
            </div>

            {filtered.length > 0 ? (
              <div>
                {filtered.map((member, i) => {
                  const rank = ranked.indexOf(member) + 1;
                  const name = `${member.user.first_name} ${member.user.last_name}`;
                  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
                  const isTop3 = rank <= 3 && member.qualifies;
                  const rankColor = rank === 1 ? gold : rank === 2 ? silver : rank === 3 ? bronze : "#0D9488";
                  const barWidth = ranked[0]?.score > 0 ? (member.score / ranked[0].score) * 100 : 0;
                  const prevMember = filtered[i - 1];
                  const showDivider = i > 0 && prevMember?.qualifies && !member.qualifies;

                  return (
                    <div key={member.id}>
                      {showDivider && (
                        <div style={{ padding: "8px 20px", background: "rgba(240,101,67,0.04)", borderTop: "1px dashed rgba(240,101,67,0.3)", borderBottom: "1px dashed rgba(240,101,67,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 1, background: "rgba(240,101,67,0.2)" }} />
                          <span style={{ fontWeight: 700, fontSize: 10, color: "#F06543", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>
                            Below {MONTHLY_THRESHOLD} check-ins — not qualifying
                          </span>
                          <div style={{ flex: 1, height: 1, background: "rgba(240,101,67,0.2)" }} />
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.025, duration: 0.3 }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", background: !member.qualifies ? "transparent" : isTop3 ? `${rankColor}08` : "transparent", borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", opacity: member.qualifies ? 1 : 0.45, transition: "background 200ms, opacity 200ms" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(13,148,136,0.04)"; e.currentTarget.style.opacity = "1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = !member.qualifies ? "transparent" : isTop3 ? `${rankColor}08` : "transparent"; e.currentTarget.style.opacity = member.qualifies ? "1" : "0.45"; }}
                      >
                        <RankBadge rank={rank} qualifies={member.qualifies} />

                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: !member.qualifies ? "#F9FAFB" : isTop3 ? `linear-gradient(135deg, ${rankColor}, ${rankColor}BB)` : "rgba(13,148,136,0.1)", border: !member.qualifies ? "1px solid #E5E7EB" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: !member.qualifies ? "#9CA3AF" : isTop3 ? "white" : "#0D9488", flexShrink: 0, boxShadow: isTop3 && member.qualifies ? `0 3px 10px ${rankColor}40` : "none" }}>
                          {initials}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <p style={{ fontWeight: 700, fontSize: 13, color: member.qualifies ? "#1F2937" : "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                              {member.qualifies ? (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 999, background: "rgba(13,148,136,0.08)", color: "#0D9488", fontWeight: 600, fontSize: 10 }}>
                                  <Flame size={9} /> locked in
                                </span>
                              ) : (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 999, background: "rgba(240,101,67,0.08)", color: "#F06543", fontWeight: 600, fontSize: 10 }}>
                                  {member.score}/{MONTHLY_THRESHOLD}
                                </span>
                              )}
                              <span style={{ fontWeight: 800, fontSize: 16, color: !member.qualifies ? "#9CA3AF" : isTop3 ? rankColor : "#1F2937", letterSpacing: "-0.3px" }}>{member.score}</span>
                            </div>
                          </div>
                          <div style={{ height: 3, borderRadius: 999, background: "#F9FAFB", overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.7, delay: i * 0.03 }}
                              style={{ height: "100%", borderRadius: 999, background: !member.qualifies ? "#E5E7EB" : isTop3 ? `linear-gradient(90deg, ${rankColor}, ${rankColor}99)` : "linear-gradient(90deg, #0D9488, #0D948888)" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-7 h-7 text-[#0D9488]" />
                </div>
                <p className="text-sm font-bold text-[#1F2937] mb-1">No members found</p>
                <p className="text-xs text-[#9CA3AF]">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}