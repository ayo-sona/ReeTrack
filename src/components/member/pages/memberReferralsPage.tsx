"use client";

import {
  Users,
  Gift,
  Share2,
  AlertCircle,
} from "lucide-react";

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-600 mt-1">
            Invite friends and earn rewards
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Referral Program Coming Soon!
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;re working on an exciting referral program that will allow you to invite friends
            and earn rewards. Stay tuned for updates!
          </p>
          <div className="flex gap-4 justify-center">
            <div className="p-4 bg-white rounded-lg">
              <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Invite Friends</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <Share2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Share Your Link</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <Gift className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Earn Rewards</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Want to be notified when this launches?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact support to join our waitlist for the referral program.
                You&apos;ll be among the first to know when we launch this feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}