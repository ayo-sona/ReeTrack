import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from "@heroui/react";
import { Download, X } from "lucide-react";
import StyledQRCode from "./StyledQRCode";
import apiClient from "@/lib/apiClient";
import { addHours } from "date-fns";
import { toast } from "sonner";

interface MemberQRCodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  memberId?: string;
}

export default function MemberQRCodeModal({
  isOpen,
  onOpenChange,
  memberId,
}: MemberQRCodeModalProps) {
  const [qrData, setQrData] = useState<string>("");
  const [generatingCode, setGeneratingCode] = useState(false);
  // const effectRan = useRef(false);

  useEffect(() => {
    // if (effectRan.current === true || !memberId) return;
    if (!memberId) return;

    const generateCode = async () => {
      // effectRan.current = true
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiry to 1 hour from now
      const now = new Date();
      const expiry = addHours(now, 1);

      try {
        setGeneratingCode(true);
        const response = await apiClient.post(`members/check-in/`, {
          memberId: memberId,
          checkInCode: randomCode,
          expiresAt: expiry.toISOString(),
        });
        console.log(response);
        if (response.data.statusCode === 201) {
          toast("Check-in code generated successfully", {
            duration: 5000,
          });
          const data = JSON.stringify({
            id: `checkin-${Date.now()}`,
            checkInCode: randomCode,
            createdAt: now.toISOString(),
            expiresAt: expiry.toISOString(),
          });
          setQrData(data);
        }
      } catch (error) {
        console.error("Failed to generate check-in code:", error);
      } finally {
        setGeneratingCode(false);
      }
    };
    generateCode();

    //   return () => {
    //   effectRan.current = false;
    // };
  }, [memberId]);

  const handleDownload = () => {
    if (!qrData) return;

    const svg = document.getElementById("member-qr-code")?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `member-${new Date()}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Member QR Code</h3>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center py-6">
          {generatingCode ? (
            <Spinner color="success" size="lg" />
          ) : (
            <>
              <div id="member-qr-code" className="mb-6">
                <StyledQRCode
                  value={qrData}
                  size={200}
                  level="H"
                  className="p-4 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Member ID: {memberId}</p>
              </div>
            </>
          )}

          <Button
            color="primary"
            variant="solid"
            onPress={handleDownload}
            startContent={<Download size={18} />}
            className="w-full max-w-xs"
          >
            Download QR Code
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
