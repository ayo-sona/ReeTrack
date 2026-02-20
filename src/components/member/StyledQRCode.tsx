import { QRCodeSVG } from "qrcode.react";

const C = {
  white: "#FFFFFF",
  border: "#E5E7EB",
};

interface StyledQRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
}

export default function StyledQRCode({
  value,
  size = 256,
  level = "H",
  className = "",
}: StyledQRCodeProps) {
  return (
    <div
      className={className}
      style={{
        background: C.white,
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        style={{ width: "100%", height: "auto" }}
        fgColor="#000000"
        bgColor="#ffffff"
      />
    </div>
  );
}