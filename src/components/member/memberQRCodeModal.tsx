import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import StyledQRCode from "./StyledQRCode";
import apiClient from "@/lib/apiClient";
import { addHours } from "date-fns";
import { toast } from "sonner";

const C = {
  teal:     "#0D9488",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

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

  useEffect(() => {
    if (!memberId || !isOpen) return;

    const generateCode = async () => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date();
      const expiry = addHours(now, 1);

      try {
        setGeneratingCode(true);
        const response = await apiClient.post(`members/check-in/`, {
          memberId: memberId,
          checkInCode: randomCode,
          expiresAt: expiry.toISOString(),
        });
        
        if (response.data.statusCode === 201) {
          toast.success("Check-in code generated successfully");
          const data = JSON.stringify({
            memberId: memberId,
            checkInCode: randomCode,
            createdAt: now.toISOString(),
            expiresAt: expiry.toISOString(),
          });
          setQrData(data);
        }
      } catch (error) {
        console.error("Failed to generate check-in code:", error);
        toast.error("Failed to generate check-in code");
      } finally {
        setGeneratingCode(false);
      }
    };

    generateCode();
  }, [memberId, isOpen]);

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
      downloadLink.download = `member-qr-${new Date().getTime()}.png`;
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
    <Modal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="Member QR Code"
      size="sm"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 0",
        fontFamily: "Nunito, sans-serif",
      }}>
        {generatingCode ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: "48px",
              height: "48px",
              border: `3px solid ${C.border}`,
              borderTopColor: C.teal,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{
              fontWeight: 600,
              fontSize: "14px",
              color: C.coolGrey,
            }}>
              Generating QR code...
            </p>
          </div>
        ) : qrData ? (
          <>
            {/* QR Code */}
            <div
              id="member-qr-code"
              style={{
                padding: "20px",
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <StyledQRCode
                value={qrData}
                size={200}
                level="H"
              />
            </div>

            {/* Member ID */}
            <div style={{
              textAlign: "center",
              marginBottom: "24px",
              padding: "12px 20px",
              background: "rgba(13,148,136,0.08)",
              borderRadius: "8px",
              border: `1px solid rgba(13,148,136,0.2)`,
            }}>
              <p style={{
                fontSize: "12px",
                color: C.coolGrey,
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Member ID
              </p>
              <p style={{
                fontWeight: 700,
                fontSize: "14px",
                color: C.teal,
                fontFamily: "monospace",
              }}>
                {memberId}
              </p>
            </div>

            {/* Download button */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownload}
              className="w-full max-w-xs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download QR Code
            </Button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{
              fontWeight: 600,
              fontSize: "14px",
              color: C.coolGrey,
            }}>
              No QR code available
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}