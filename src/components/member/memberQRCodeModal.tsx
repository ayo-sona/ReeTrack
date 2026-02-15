import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { Download, X } from "lucide-react";
import StyledQRCode from "./StyledQRCode";

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
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    if (memberId) {
      // You can customize what data to encode in the QR code
      const data = JSON.stringify({
        type: "member_checkin",
        memberId: memberId,
        timestamp: new Date().toISOString(),
      });
      setQrData(data);
    }
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
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => onOpenChange(false)}
          >
            <X size={20} />
          </Button>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center py-6">
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
