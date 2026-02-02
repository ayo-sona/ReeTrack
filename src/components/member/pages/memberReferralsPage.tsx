"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Gift,
  Users,
  TrendingUp,
} from "lucide-react";
import { useReferral, useReferredMembers } from "@/hooks/memberHook/useMember";

export default function ReferralsPage() {
  const { data: referral, isLoading } = useReferral();
  const { data: referredMembers } = useReferredMembers();

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = referral?.shareUrl || "";
    const text = `Join me on ReeTrack and get ₦2,500 off your first subscription! Use my code: ${referral?.code}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=Join me on ReeTrack&body=${encodeURIComponent(text + "\n\n" + url)}`,
        );
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Refer & Earn</h1>
          <p className="text-gray-600 mt-1">Share the love and earn rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Referred Friends</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {referral?.referredMembers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₦{referral?.totalEarnings.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">₦5,000</p>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
            <p className="text-emerald-100">
              Share this code with friends and family
            </p>
          </div>

          {/* Code Display */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl font-mono font-bold tracking-wider">
                {referral?.code}
              </span>
              <button
                onClick={() => handleCopy(referral?.code || "")}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-emerald-100 text-sm">
              <Share2 className="w-4 h-4" />
              <span>{referral?.shareUrl}</span>
              <button
                onClick={() => handleCopy(referral?.shareUrl || "")}
                className="ml-auto p-1 hover:bg-white/10 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleShare("whatsapp")}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare("facebook")}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-sm font-medium">Facebook</span>
            </button>

            <button
              onClick={() => handleShare("twitter")}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <Twitter className="w-6 h-6" />
              <span className="text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm font-medium">QR Code</span>
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                1. Share Your Code
              </h4>
              <p className="text-sm text-gray-600">
                Send your referral code to friends via WhatsApp, email, or
                social media
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                2. They Sign Up
              </h4>
              <p className="text-sm text-gray-600">
                Your friend creates an account and subscribes to a plan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                3. Earn Rewards
              </h4>
              <p className="text-sm text-gray-600">
                Get ₦2,500 credited to your wallet for each successful referral
              </p>
            </div>
          </div>
        </div>

        {/* Referred Members */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Referred Members
            </h3>
            <span className="text-sm text-gray-600">
              {referredMembers?.length || 0} total
            </span>
          </div>

          {referredMembers && referredMembers.length > 0 ? (
            <div className="space-y-4">
              {referredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">
                      +₦{member.reward.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">
                No referrals yet
              </h4>
              <p className="text-gray-600 mb-6">
                Start sharing your code to earn rewards
              </p>
              <button
                onClick={() => handleCopy(referral?.shareUrl || "")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Copy Referral Link
              </button>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Scan QR Code
              </h3>
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                {referral?.qrCode ? (
                  <img
                    src={referral.qrCode}
                    alt="QR Code"
                    className="w-full h-full"
                  />
                ) : (
                  <QrCode className="w-32 h-32 text-gray-400" />
                )}
              </div>
              <p className="text-center text-gray-600 mb-6">
                Share this QR code for easy sign-ups
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
