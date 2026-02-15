import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`bg-white p-4 rounded-xl shadow-lg ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        className="w-full h-auto"
        fgColor="#000000"
        bgColor="#ffffff"
      />
    </div>
  );
}
