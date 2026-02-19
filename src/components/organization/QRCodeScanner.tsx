"use client";

import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, RotateCcw, CheckCircle, XCircle, X } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";

interface QRCodeScannerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCheckInSuccess: (member: any) => void;
}

interface CameraDevice {
  id: string;
  label: string;
}

export default function QRCodeScanner({
  isOpen,
  onOpenChange,
  onCheckInSuccess,
}: QRCodeScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ member: any; message: string } | null>(null);
  const [scannerState, setScannerState] = useState("initial");
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const scannerElementId = "qr-reader";

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const data = JSON.parse(decodedText);
      const response = await apiClient.post(`/members/organization/check-in`, {
        memberId: data.memberId,
        checkInCode: data.checkInCode,
      });
      if (response.data.statusCode === 201) {
        setScannerState("initial");
        setSuccess({ member: response.data.data.fullName, message: "Check-in successful!" });
        onCheckInSuccess(response.data.data.fullName);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to process check-in");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const startScanner = async () => {
    if (!selectedCamera) {
      setError("No camera selected. Please check your device settings.");
      return;
    }
    setScannerState("requesting");
    setError(null);
    try {
      setIsLoading(true);
      setScannerState("scanning");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const container = document.getElementById(scannerElementId);
      if (!container) throw new Error("Scanner container not found");
      const html5QrCode = new Html5Qrcode(scannerElementId);
      html5QrcodeRef.current = html5QrCode;
      await html5QrCode.start(
        selectedCamera,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => handleScanSuccess(decodedText),
        (errorMessage) => {
          if (!errorMessage.includes("No QR code found")) console.warn("QR Code error:", errorMessage);
        }
      );
    } catch (err: any) {
      if (err.message.includes("Permission denied")) {
        setScannerState("denied");
        setError("Camera access was denied. Please allow camera access and try again.");
      } else if (err.message.includes("Camera not found")) {
        setError("Selected camera not found. Please try a different camera.");
      } else {
        setError(`Failed to start camera: ${err.message}`);
      }
      setScannerState("initial");
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    if (html5QrcodeRef.current) {
      html5QrcodeRef.current.stop().then(() => {
        html5QrcodeRef.current?.clear();
        html5QrcodeRef.current = null;
      }).catch(console.error);
    }
    setScannerState("initial");
  };

  const resetScanner = () => {
    setSuccess(null);
    setError(null);
    stopScanner();
  };

  const checkCameras = async () => {
    try {
      setIsLoading(true);
      const devices = await Html5Qrcode.getCameras();
      setAvailableCameras(devices as any);
      if (devices.length > 0) {
        const backCamera = devices.find((d: any) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear") ||
          d.label.toLowerCase().includes("environment")
        );
        setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
      }
    } catch {
      setError("Unable to detect cameras on this device.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = async () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((cam) => cam.id === selectedCamera);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      setSelectedCamera(availableCameras[nextIndex].id);
      if (scannerState === "scanning") {
        await stopScanner();
        setTimeout(() => startScanner(), 1000);
      }
    }
  };

  useEffect(() => {
    if (isOpen) checkCameras();
    else resetScanner();
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current) stopScanner();
      setError(null);
      setSuccess(null);
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-xl border border-gray-100 shadow-lg",
        header: "border-b border-gray-100 px-6 py-5",
        body: "px-6 py-5",
        footer: "border-t border-gray-100 px-6 py-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex items-center justify-between w-full" style={{ fontFamily: "Nunito, sans-serif" }}>
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Scan Member QR Code</h2>
                  <p className="text-sm font-normal text-[#9CA3AF] mt-0.5">
                    Point the camera at a member's QR code
                  </p>
                </div>
                {availableCameras.length > 1 && (
                  <button
                    onClick={switchCamera}
                    title="Switch Camera"
                    className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors text-[#9CA3AF] hover:text-[#1F2937]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </ModalHeader>

            <ModalBody>
              <div
                className="w-full rounded-xl bg-[#F9FAFB] border border-gray-100 overflow-hidden min-h-[300px] flex flex-col items-center justify-center"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {/* Scanning view */}
                {scannerState === "scanning" && (
                  <div className="relative w-full">
                    <div id={scannerElementId} className="w-full min-h-[300px]" />
                    <div className="absolute inset-0 border-4 border-[#0D9488] rounded-xl pointer-events-none animate-pulse" />
                  </div>
                )}

                {/* Loading */}
                {isLoading && scannerState !== "scanning" && (
                  <div className="flex flex-col items-center gap-3 p-8">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0D9488] rounded-full animate-spin" />
                    <p className="text-sm text-[#9CA3AF]">Starting camera...</p>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-base font-bold text-[#1F2937] mb-1">Check-in Successful</h3>
                    <p className="text-sm font-semibold text-[#0D9488]">{success.member}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{success.message}</p>
                  </div>
                )}

                {/* Error */}
                {error && !success && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-[#1F2937] mb-1">Something went wrong</h3>
                    <p className="text-sm text-[#9CA3AF] mb-4 max-w-xs">{error}</p>
                    <Button type="button" variant="secondary" size="sm" onClick={startScanner}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Initial state */}
                {scannerState === "initial" && !success && !error && !isLoading && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-[#0D9488]" />
                    </div>
                    <h3 className="text-base font-bold text-[#1F2937] mb-1">Ready to Scan</h3>
                    <p className="text-sm text-[#9CA3AF] mb-1">
                      Click "Start Scanning" to access your camera
                    </p>
                    {availableCameras.length > 0 && (
                      <p className="text-xs text-[#9CA3AF]">
                        {availableCameras.length} camera{availableCameras.length > 1 ? "s" : ""} detected
                      </p>
                    )}
                  </div>
                )}

                {/* Denied state */}
                {scannerState === "denied" && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-red-600 mb-2">Camera Access Denied</h3>
                    <p className="text-sm text-[#9CA3AF] mb-3">To scan QR codes, please:</p>
                    <ol className="text-xs text-[#9CA3AF] text-left space-y-1">
                      <li>1. Click the camera icon in your browser's address bar</li>
                      <li>2. Select "Always allow" for camera access</li>
                      <li>3. Refresh the page and try again</li>
                    </ol>
                  </div>
                )}

                {/* Camera selector */}
                {availableCameras.length > 1 && scannerState !== "scanning" && (
                  <div className="w-full px-6 pb-4 space-y-1.5">
                    <label className="block text-sm font-semibold text-[#1F2937]">Select Camera</label>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                    >
                      {availableCameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                          {camera.label || `Camera ${camera.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (success) resetScanner();
                  else if (scannerState === "scanning") stopScanner();
                  else onClose();
                }}
              >
                {success ? "Scan Again" : scannerState === "scanning" ? "Stop" : "Cancel"}
              </Button>

              {!success && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isLoading || availableCameras.length === 0}
                  onClick={startScanner}
                >
                  {isLoading ? "Starting..." : "Start Scanning"}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}