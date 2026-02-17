"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@heroui/react";
import MemberQRCodeModal from "../memberQRCodeModal";
import { addHours } from "date-fns";
import { useMemberStore } from "@/store/memberStore";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

// Check-in code interface
interface CheckInCode {
  id: string;
  checkInCode: string;
  createdAt: string;
  expiresAt: string;
}

export default function CheckInPage() {
  const [checkInCode, setCheckInCode] = useState<CheckInCode | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { getMember } = useMemberStore();
  const params = useParams();

  const orgId = params.id;
  const memberData = getMember(orgId as string);
  console.log(memberData);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update timer countdown
  useEffect(() => {
    if (!checkInCode) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(checkInCode.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
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

  const handleGenerateCode = async () => {
    const generateCode = async (): Promise<CheckInCode> => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiry to 1 hour from now
      const now = new Date();
      const expiry = addHours(now, 1);

      try {
        setGeneratingCode(true);
        const response = await apiClient.post(`members/check-in/`, {
          memberId: memberData.id,
          checkInCode: randomCode,
          expiresAt: expiry.toISOString(),
        });
        console.log(response);
        if (response.data.statusCode === 201) {
          toast("Check-in code generated successfully", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Failed to generate check-in code:", error);
      } finally {
        setGeneratingCode(false);
      }

      return {
        id: `checkin-${Date.now()}`,
        checkInCode: randomCode,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      };
    };

    const codeData = await generateCode();
    setCheckInCode(codeData);
    // console.log(codeData);
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading member data...</h2>
          <p className="text-gray-600 mt-2">
            Please wait while we load your information.
          </p>
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
          <p className="text-gray-600 mt-1">
            Generate your daily check-in code
          </p>
        </div>

        {
          /* Display Code */
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {checkInCode && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    Valid for {timeLeft}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {checkInCode?.checkInCode}
                  </h2>
                </div>
              )}

              {/* Alphanumeric Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Show this code to staff
                </p>
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <span className="text-4xl font-mono font-bold text-emerald-900 tracking-wider">
                    {checkInCode?.checkInCode || ""}
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
                  <span>Show this code to staff at the entrance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Staff will verify your code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>You&apos;re all set! Enjoy your day</span>
                </li>
              </ol>
            </div>

            {/* Info Card */}
            {checkInCode && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Generated</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(checkInCode?.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Valid Until</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(checkInCode?.expiresAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate New Code Button */}
            <Button
              onPress={() => {
                setCheckInCode(null);
                handleGenerateCode();
              }}
              disabled={generatingCode}
              isLoading={generatingCode}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Generate New Code
            </Button>
            <Button
              onPress={() => {
                setCheckInCode(null);
                setIsOpen(true);
              }}
              className="w-full"
            >
              Show My QR Code
            </Button>
            {isOpen && (
              <MemberQRCodeModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                memberId={memberData?.id}
              />
            )}
          </div>
        }

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
              Once the backend is up, your check-in history will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
