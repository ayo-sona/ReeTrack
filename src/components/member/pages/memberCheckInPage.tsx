'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QrCode, Clock, CheckCircle, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useAllSubscriptions } from '@/hooks/memberHook/useMember';

// Mock check-in code interface (placeholder until backend implements)
interface MockCheckInCode {
  id: string;
  code: string;
  subscriptionId: string;
  planName: string;
  createdAt: string;
  expiresAt: string;
}

export default function CheckInPage() {
  const { data: subscriptions, isLoading } = useAllSubscriptions();
  
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [checkInCode, setCheckInCode] = useState<MockCheckInCode | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Filter active subscriptions
  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];

  // Generate mock check-in code
  const handleGenerateCode = () => {
    if (!selectedSubscription) return;

    const selectedSub = activeSubscriptions.find(s => s.id === selectedSubscription);
    if (!selectedSub) return;

    // Helper function to generate code (satisfies ESLint purity rules)
    const generateMockCode = (): MockCheckInCode => {
      // Generate random 6-digit code
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiry to 24 hours from now
      const now = new Date();
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      return {
        id: `checkin-${Date.now()}`,
        code: randomCode,
        subscriptionId: selectedSubscription,
        planName: selectedSub.plan.name,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      };
    };

    const mockCode = generateMockCode();
    setCheckInCode(mockCode);
  };

  // Update timer countdown
  useEffect(() => {
    if (!checkInCode) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(checkInCode.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [checkInCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Check In</h1>
          <p className="text-gray-600 mt-1">Generate your daily check-in code</p>
        </div>

        {/* Beta Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Prototype Feature</h3>
              <p className="text-sm text-blue-800">
                This is a demo check-in system. Once the backend API is ready, codes will be validated and check-ins will be recorded.
              </p>
            </div>
          </div>
        </div>

        {activeSubscriptions.length === 0 ? (
          /* No Active Subscriptions */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Subscriptions</h3>
            <p className="text-gray-600 mb-6">
              You need an active subscription to check in
            </p>
            <Link href="/member/subscriptions">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                View Subscriptions
              </button>
            </Link>
          </div>
        ) : !checkInCode ? (
          /* Select Subscription */
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Subscription</h2>
            
            <div className="space-y-3 mb-6">
              {activeSubscriptions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubscription(sub.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSubscription === sub.id
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {sub.plan.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{sub.plan.name}</h3>
                      <p className="text-sm text-gray-600">
                        Expires {new Date(sub.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedSubscription === sub.id && (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateCode}
              disabled={!selectedSubscription}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Generate Check-In Code
            </button>
          </div>
        ) : (
          /* Display Code */
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <Clock className="w-4 h-4" />
                  Valid for {timeLeft}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{checkInCode.planName}</h2>
              </div>

              {/* Mock QR Code Placeholder */}
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-emerald-600">
                <div className="text-center">
                  <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">QR Code will appear here</p>
                  <p className="text-xs text-gray-400">when backend is ready</p>
                </div>
              </div>

              {/* Alphanumeric Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Show this code to staff</p>
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <span className="text-4xl font-mono font-bold text-emerald-900 tracking-wider">
                    {checkInCode.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions Card */}
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                How to Check In
              </h3>
              <ol className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Show this code to staff at the gym entrance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Staff will verify your code manually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>You&apos;re all set! Enjoy your workout</span>
                </li>
              </ol>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Generated</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(checkInCode.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Valid Until</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(checkInCode.expiresAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Generate New Code Button */}
            <button
              onClick={() => {
                setCheckInCode(null);
                setSelectedSubscription('');
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Generate New Code
            </button>
          </div>
        )}

        {/* Coming Soon - Recent Check-ins */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            Recent Check-ins
          </h3>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-1">Check-in history coming soon</p>
            <p className="text-sm text-gray-500">
              Once the backend is ready, your check-in history will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}