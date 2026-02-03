'use client';

import { useState } from 'react';
import { QrCode, Clock, CheckCircle, Building2, Calendar } from 'lucide-react';
import { useSubscriptions, useGenerateCheckInCode } from '@/hooks/memberHook/useMember';
import { CheckIn } from '@/types/memberTypes/member';

export default function CheckInPage() {
  const { data: subscriptions } = useSubscriptions();
  const generateCode = useGenerateCheckInCode();
  
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [checkInCode, setCheckInCode] = useState<CheckIn | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];

  const handleGenerateCode = async () => {
    if (!selectedSubscription) return;

    try {
      const code = await generateCode.mutateAsync(selectedSubscription);
      setCheckInCode(code);
      
      // Start countdown timer
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiry = new Date(code.expiresAt).getTime();
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
    } catch (error) {
      console.error('Failed to generate check-in code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Check In</h1>
          <p className="text-gray-600 mt-1">Generate your daily check-in code</p>
        </div>

        {activeSubscriptions.length === 0 ? (
          /* No Active Subscriptions */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Subscriptions</h3>
            <p className="text-gray-600 mb-6">
              You need an active subscription to check in
            </p>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Browse Plans
            </button>
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
                      {sub.organizationName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{sub.organizationName}</h3>
                      <p className="text-sm text-gray-600">{sub.planName}</p>
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
              disabled={!selectedSubscription || generateCode.isPending}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              {generateCode.isPending ? 'Generating...' : 'Generate Check-In Code'}
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
                  Expires in {timeLeft}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{checkInCode.organizationName}</h2>
              </div>

              {/* QR Code */}
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-emerald-600">
                {checkInCode.qrCode ? (
                  <img src={checkInCode.qrCode} alt="QR Code" className="w-full h-full" />
                ) : (
                  <QrCode className="w-32 h-32 text-gray-400" />
                )}
              </div>

              {/* Alphanumeric Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Or show this code</p>
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 rounded-xl">
                  <span className="text-4xl font-mono font-bold text-gray-900 tracking-wider">
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
                  <span>Show this QR code or code to staff at the entrance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Staff will scan or enter your code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>You&apos;re all set! Enjoy your session</span>
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

        {/* Recent Check-ins (Optional) */}
        {checkInCode && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Recent Check-ins
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{checkInCode.organizationName}</p>
                    <p className="text-sm text-gray-600">2 days ago • 10:30 AM</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}