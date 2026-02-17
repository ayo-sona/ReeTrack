"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Hash,
  Camera,
  Clock,
  Award,
  Filter,
} from "lucide-react";
import { Button, Input } from "@heroui/react";
import QRCodeScanner from "@/components/organization/QRCodeScanner";
import apiClient from "@/lib/apiClient";
import { LoadingSkeleton } from "@/components/ui";
import { toast } from "sonner";
import { useMembers } from "@/hooks/useMembers";

interface ActualMembers {
  check_in_code: string;
  check_in_count: number;
  checked_in_at: string;
  created_at: string;
  id: string;
  metadata: string;
  organization_user_id: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    photo_url: string;
    status: string;
  };
  user_id: string;
}

interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkedInAt: string;
  photoUrl?: string;
}

interface MemberStats {
  memberId: string;
  memberName: string;
  totalCheckIns: number;
  lastCheckIn: string;
  photoUrl?: string;
}

// Mock data - replace with actual API calls
const MOCK_RECENT_CHECKINS: CheckInRecord[] = [
  {
    id: "1",
    memberId: "m1",
    memberName: "Chidi Okonkwo",
    checkedInAt: new Date().toISOString(),
    photoUrl: undefined,
  },
  {
    id: "2",
    memberId: "m2",
    memberName: "Amara Nwosu",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    photoUrl: undefined,
  },
];

const MOCK_MEMBER_STATS: MemberStats[] = [
  {
    memberId: "m1",
    memberName: "Chidi Okonkwo",
    totalCheckIns: 24,
    lastCheckIn: new Date().toISOString(),
  },
  {
    memberId: "m2",
    memberName: "Amara Nwosu",
    totalCheckIns: 18,
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    memberId: "m3",
    memberName: "Funke Ajayi",
    totalCheckIns: 30,
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export default function OrganizationCheckInPage() {
  const [activeTab, setActiveTab] = useState<"scan" | "stats">("scan");
  const [scanMode, setScanMode] = useState<"qr" | "manual" | "">("");
  const [manualCode, setManualCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">(
    "month",
  );
  const { data: members, isLoading, error } = useMembers(searchQuery);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentMember, setCurrentMember] = useState("");
  // const [members, setMembers] = useState<ActualMembers[] | []>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);

  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const response = await apiClient.get("members/");
  //       console.log(response);
  //       if (response.data.statusCode === 200) {
  //         setMembers(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch members:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchMembers();
  // }, []);

  // Stats
  const totalMembers = members?.length;
  const todayCheckIns = members?.filter((m) => {
    const checkInDate = new Date(m?.checked_in_at);
    const today = new Date();
    return checkInDate.toDateString() === today.toDateString();
  }).length;
  const recentCheckIns = members?.sort((a, b) => {
    const checkInDateA = new Date(a?.checked_in_at);
    const checkInDateB = new Date(b?.checked_in_at);
    return checkInDateB.getTime() - checkInDateA.getTime();
  });

  // Filter member stats
  const filteredStats = MOCK_MEMBER_STATS.filter((stat) =>
    stat.memberName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Handle Manual Code Submit
  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return;

    try {
      setIsChecking(true);
      const response = await apiClient.post(`members/organization/check-in/`, {
        memberId: currentMember,
        checkInCode: manualCode,
      });
      console.log(response);
      if (response.data.statusCode === 201) {
        toast("Checked in member successfully", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to check-in code:", error);
      toast("Failed to check-in member");
    } finally {
      setIsChecking(false);
      setManualCode("");
      setScanMode("");
    }
  };

  // Handle successful check-in
  const handleCheckInSuccess = async (member: any) => {
    // Add to recent check-ins
    const newCheckIn: CheckInRecord = {
      id: `checkin-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      checkedInAt: new Date().toISOString(),
    };

    // Refresh member stats
    // await fetchMemberStats();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (members?.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 space-y-6 max-w-7xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400">No members found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Member Check-In
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Scan QR codes or enter codes manually to check in members
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("scan")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "scan"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Scan className="w-4 h-4 inline mr-2" />
            Check-In
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "stats"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Today&apos;s Check-Ins
            </p>
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {todayCheckIns}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Total Members
            </p>
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {totalMembers}
          </p>
        </div>
      </div>

      {activeTab === "scan" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Mode Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Select Check-In Method
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <Button
                  onPress={() => {
                    setScanMode("qr");
                    setIsScannerOpen(true);
                  }}
                  startContent={<QrCode size={20} />}
                >
                  Scan QR Code
                </Button>

                <QRCodeScanner
                  isOpen={isScannerOpen}
                  onOpenChange={setIsScannerOpen}
                  onCheckInSuccess={handleCheckInSuccess}
                />
              </div>

              {/* Manual Code Entry */}
              {scanMode === "manual" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter Check-In Code
                    </label>
                    <Input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyUp={(e) =>
                        e.key === "Enter" && handleManualCheckIn()
                      }
                      placeholder="ABC123XYZ"
                      maxLength={9}
                      classNames={{
                        input:
                          "text-center outline-none focus-visible:outline-none",
                      }}
                    />
                  </div>

                  <Button
                    onPress={handleManualCheckIn}
                    isDisabled={!manualCode.trim() || isChecking}
                    isLoading={isChecking}
                    color="success"
                    variant="solid"
                    className="w-full"
                  >
                    Check In Member
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Check-Ins */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Check-Ins
            </h2>

            {recentCheckIns?.length! > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {recentCheckIns?.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {`${checkIn.user.first_name} ${checkIn.user.last_name}`
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {`${checkIn.user.first_name} ${checkIn.user.last_name}`}
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(checkIn.checked_in_at)}
                      </p>
                      <Button
                        onPress={() => {
                          setScanMode("manual");
                          setCurrentMember(checkIn.id);
                        }}
                        startContent={<Hash size={20} />}
                      >
                        Enter Code
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No check-ins yet
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Statistics Tab */
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-500 my-auto" />
                {(["today", "week", "month"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      timeFilter === period
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Member Stats Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Check-Ins
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Last Check-In
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStats.map((stat, index) => (
                    <tr
                      key={stat.memberId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {stat.memberName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {stat.memberName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {stat.totalCheckIns}
                          </span>
                          {index === 0 && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {formatTimeAgo(stat.lastCheckIn)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStats.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No members found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
