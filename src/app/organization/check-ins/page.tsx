'use client';

import { useState, useEffect, useRef } from 'react';
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
  Filter
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  membershipNumber: string;
  photoUrl?: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  checkedInAt: string;
  photoUrl?: string;
}

interface MemberStats {
  memberId: string;
  memberName: string;
  planName: string;
  totalCheckIns: number;
  lastCheckIn: string;
  photoUrl?: string;
}

// Mock data - replace with actual API calls
const MOCK_RECENT_CHECKINS: CheckInRecord[] = [
  {
    id: '1',
    memberId: 'm1',
    memberName: 'Chidi Okonkwo',
    planName: 'Premium Membership',
    checkedInAt: new Date().toISOString(),
    photoUrl: undefined
  },
  {
    id: '2',
    memberId: 'm2',
    memberName: 'Amara Nwosu',
    planName: 'Basic Membership',
    checkedInAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    photoUrl: undefined
  },
];

const MOCK_MEMBER_STATS: MemberStats[] = [
  {
    memberId: 'm1',
    memberName: 'Chidi Okonkwo',
    planName: 'Premium Membership',
    totalCheckIns: 24,
    lastCheckIn: new Date().toISOString(),
  },
  {
    memberId: 'm2',
    memberName: 'Amara Nwosu',
    planName: 'Basic Membership',
    totalCheckIns: 18,
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    memberId: 'm3',
    memberName: 'Funke Ajayi',
    planName: 'VIP Membership',
    totalCheckIns: 30,
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export default function OrganizationCheckInPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'stats'>('scan');
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [manualCode, setManualCode] = useState('');
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>(MOCK_RECENT_CHECKINS);
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    member?: Member;
    message: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('month');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stats
  const todayCheckIns = recentCheckIns.filter(c => {
    const checkInDate = new Date(c.checkedInAt);
    const today = new Date();
    return checkInDate.toDateString() === today.toDateString();
  }).length;

  const totalMembers = MOCK_MEMBER_STATS.length;
  const activeToday = new Set(recentCheckIns
    .filter(c => {
      const checkInDate = new Date(c.checkedInAt);
      const today = new Date();
      return checkInDate.toDateString() === today.toDateString();
    })
    .map(c => c.memberId)
  ).size;

  // Start QR Scanner
  const startScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      alert('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  // Stop QR Scanner
  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Handle Manual Code Submit
  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return;

    // Simulate API call
    setTimeout(() => {
      // Mock successful check-in
      const mockMember: Member = {
        id: 'm' + Date.now(),
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+234 801 234 5678',
        planName: 'Premium Membership',
        membershipNumber: manualCode,
        status: 'active'
      };

      const newCheckIn: CheckInRecord = {
        id: 'c' + Date.now(),
        memberId: mockMember.id,
        memberName: mockMember.name,
        planName: mockMember.planName,
        checkedInAt: new Date().toISOString(),
      };

      setRecentCheckIns([newCheckIn, ...recentCheckIns]);
      setCheckInResult({
        success: true,
        member: mockMember,
        message: 'Check-in successful!'
      });
      setManualCode('');

      // Clear result after 5 seconds
      setTimeout(() => setCheckInResult(null), 5000);
    }, 500);
  };

  // Filter member stats
  const filteredStats = MOCK_MEMBER_STATS.filter(stat => 
    stat.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Member Check-In</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Scan QR codes or enter codes manually to check in members
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Scan className="w-4 h-4 inline mr-2" />
            Check-In
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Today&apos;s Check-Ins</p>
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayCheckIns}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">Active Today</p>
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeToday}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Total Members</p>
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalMembers}</p>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Mode Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Select Check-In Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    setScanMode('qr');
                    if (scanMode === 'manual') stopScanner();
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    scanMode === 'qr'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <QrCode className={`w-8 h-8 mx-auto mb-3 ${
                    scanMode === 'qr' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Scan QR Code</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Use camera to scan</p>
                </button>

                <button
                  onClick={() => {
                    setScanMode('manual');
                    stopScanner();
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    scanMode === 'manual'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Hash className={`w-8 h-8 mx-auto mb-3 ${
                    scanMode === 'manual' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Enter Code</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Type code manually</p>
                </button>
              </div>

              {/* QR Scanner */}
              {scanMode === 'qr' && (
                <div className="space-y-4">
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                    {isScanning ? (
                      <>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          playsInline
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Scanning overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-64 h-64 border-4 border-blue-500 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <p className="text-white font-medium text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                            Position QR code within the frame
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Camera className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-sm">Camera not started</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={isScanning ? stopScanner : startScanner}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isScanning
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isScanning ? 'Stop Camera' : 'Start Camera'}
                  </button>
                </div>
              )}

              {/* Manual Code Entry */}
              {scanMode === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter Check-In Code
                    </label>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualCheckIn()}
                      placeholder="e.g., ABC123XYZ"
                      className="w-full px-4 py-3 text-center text-2xl font-mono font-bold tracking-wider border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      maxLength={9}
                    />
                  </div>

                  <button
                    onClick={handleManualCheckIn}
                    disabled={!manualCode.trim()}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Check In Member
                  </button>
                </div>
              )}
            </div>

            {/* Check-In Result */}
            {checkInResult && (
              <div className={`rounded-xl p-6 border-2 ${
                checkInResult.success
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    checkInResult.success ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {checkInResult.success ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <XCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${
                      checkInResult.success ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      {checkInResult.message}
                    </h3>
                    
                    {checkInResult.member && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {checkInResult.member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {checkInResult.member.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {checkInResult.member.planName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                            <p className="font-semibold text-green-600 dark:text-green-400 capitalize">
                              {checkInResult.member.status.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Check-Ins */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Check-Ins
            </h2>

            {recentCheckIns.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {recentCheckIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {checkIn.memberName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {checkIn.memberName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {checkIn.planName}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(checkIn.checkedInAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No check-ins yet today</p>
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
                {(['today', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      timeFilter === period
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Plan
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
                    <tr key={stat.memberId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {stat.memberName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {stat.memberName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                          {stat.planName}
                        </span>
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
                <p className="text-gray-500 dark:text-gray-400">No members found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}