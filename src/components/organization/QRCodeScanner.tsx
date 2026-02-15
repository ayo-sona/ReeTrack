import { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
} from "@heroui/react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

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
  const [success, setSuccess] = useState<{
    member: any;
    message: string;
  } | null>(null);
  const [scannerState, setScannerState] = useState("initial"); // 'initial', 'requesting', 'scanning', 'denied'
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const scannerElementId = "qr-reader";
  //   console.log(scannerState);

  // Handle QR code scan
  const handleScanSuccess = async (decodedText: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Parse the QR code data (assuming it contains member ID)
      const memberId = decodedText; // or parse from JSON if needed

      // Call check-in API
      const response = await apiClient.post("/members/check-in", { memberId });

      // Handle success
      setSuccess({
        member: response.data.member,
        message: "Check-in successful!",
      });

      // Notify parent component
      onCheckInSuccess(response.data.member);

      // Reset after delay
      setTimeout(() => {
        setSuccess(null);
        // Restart scanner
        if (html5QrcodeRef.current) {
          html5QrcodeRef.current.resume();
        }
      }, 2000);
    } catch (error: any) {
      console.error("Check-in failed:", error);
      setError(error.response?.data?.message || "Failed to process check-in");
    } finally {
      setIsProcessing(false);
    }
  };

  // Scanner setup and cleanup
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
      if (!container) {
        throw new Error("Scanner container not found");
      }

      // Create new scanner instance
      const html5QrCode = new Html5Qrcode(scannerElementId);
      html5QrcodeRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          //   handleScanSuccess(decodedText);
          console.log(decodedText);
        },
        (errorMessage) => {
          // Ignore "not found" errors
          if (!errorMessage.includes("No QR code found")) {
            console.warn("QR Code error:", errorMessage);
          }
        },
      );
    } catch (err: any) {
      console.error("Error starting scanner:", err);

      if (err.message.includes("Permission denied")) {
        setScannerState("denied");
        setError(
          "Camera access was denied. Please allow camera access and try again, or check your browser settings.",
        );
      } else if (err.message.includes("Camera not found")) {
        setError(
          "Selected camera not found. Please try a different camera or refresh the page.",
        );
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
      html5QrcodeRef.current
        .stop()
        .then(() => {
          html5QrcodeRef.current?.clear();
          html5QrcodeRef.current = null;
        })
        .catch(console.error);
    }
    setScannerState("initial");
  };

  // Reset scanner state
  const resetScanner = () => {
    setSuccess(null);
    setError(null);
    stopScanner();
  };

  // Check for available cameras without requesting permission
  const checkCameras = async () => {
    try {
      setIsLoading(true);
      const devices = await Html5Qrcode.getCameras();
      setAvailableCameras(devices as any);
      if (devices.length > 0) {
        // Prefer back camera if available
        const backCamera = devices.find(
          (device: any) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment"),
        );
        setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
      }
    } catch (err) {
      console.error("Error getting cameras:", err);
      setError("Unable to detect cameras on this device.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch camera (for devices with multiple cameras)
  const switchCamera = async () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex(
        (cam: CameraDevice) => cam.id === selectedCamera,
      );
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      setSelectedCamera(availableCameras[nextIndex].id);

      // If currently scanning, restart with new camera
      if (scannerState === "scanning") {
        await stopScanner();
        // Wait a bit before starting with new camera
        setTimeout(() => {
          startScanner();
        }, 1000);
      }
    }
  };

  // Initialize cameras when modal opens
  useEffect(() => {
    if (isOpen) {
      checkCameras();
    } else {
      resetScanner();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current) {
        stopScanner();
      }
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center mt-4">
              <span>Scan Member QR Code</span>
              <Button
                size="sm"
                variant="flat"
                isIconOnly
                onPress={switchCamera}
                title="Switch Camera"
              >
                <RotateCcw size={16} />
              </Button>
            </ModalHeader>
            <ModalBody>
              <div className="relative w-full h-full bg-gray-100 dark:bg-black rounded-lg overflow-hidden">
                {/* Scanner View */}
                {scannerState === "scanning" && (
                  <div className="relative">
                    <div
                      id={scannerElementId}
                      className={`w-full h-full min-h-[300px] flex items-center justify-center ${
                        scannerState === "scanning" ? "block" : "hidden"
                      }`}
                    />
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-lg pointer-events-none animate-pulse" />
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold">
                      Check-in Successful!
                    </h3>
                    <p className="text-gray-600 mt-2">{success.member?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {success.message}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold">Error</h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <Button
                      className="mt-4"
                      color="primary"
                      onPress={startScanner}
                      startContent={<RotateCcw size={16} />}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {scannerState === "initial" && (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
                    <Camera size={48} className="text-gray-400" />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        Ready to Scan
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Click "Start Scanning" to access your camera and scan
                        the QR code
                      </p>
                      {availableCameras.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {availableCameras.length} camera(s) detected
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {scannerState === "requesting" && (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        Starting Camera...
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Please allow camera access when prompted
                      </p>
                    </div>
                  </div>
                )}

                {scannerState === "denied" && (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
                    <X size={48} className="text-red-400" />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2 text-red-600">
                        Camera Access Denied
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        To scan QR code, please:
                      </p>
                      <ol className="text-xs text-left space-y-1">
                        <li>
                          1. Click the camera icon in your browser's address bar
                        </li>
                        <li>2. Select "Always allow" for camera access</li>
                        <li>3. Refresh the page and try again</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Camera Selection */}
                {availableCameras.length > 1 && scannerState !== "scanning" && (
                  <div className="w-full space-y-2">
                    <label className="text-sm font-medium">
                      Select Camera:
                    </label>
                    <select
                      value={selectedCamera || ""}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-black border-gray-300 dark:border-gray-600"
                    >
                      {availableCameras.map((camera: CameraDevice) => (
                        <option
                          key={camera.id}
                          value={camera.id}
                          className="capitalize"
                        >
                          {camera.label || `Camera ${camera.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-between">
              <Button
                variant="light"
                onPress={() => {
                  if (success) {
                    resetScanner();
                  } else if (scannerState === "scanning") {
                    stopScanner();
                  } else {
                    onClose();
                  }
                }}
              >
                {success
                  ? "Scan Again"
                  : scannerState === "scanning"
                    ? "Stop Scanning"
                    : "Cancel"}
              </Button>

              <div className="flex space-x-2">
                {!success && (
                  <Button
                    color="success"
                    isLoading={isLoading}
                    disabled={isLoading || availableCameras.length === 0}
                    onPress={startScanner}
                    startContent={<Camera size={16} />}
                  >
                    Start Scanning
                  </Button>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
