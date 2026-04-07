"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface StyledQRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
}

export default function StyledQRCode({
  value,
  size = 256,
  className = "",
}: StyledQRCodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrRef.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: value,
      dotsOptions: {
        color: "#0D9488",
        type: "rounded",
      },
      cornersSquareOptions: {
        color: "#0D9488",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#F06543",
        type: "dot",
      },
      backgroundOptions: {
        color: "#FFFFFF",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
      },
    });

    if (ref.current) {
      ref.current.innerHTML = "";
      qrRef.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    qrRef.current?.update({ data: value });
  }, [value]);

  useEffect(() => {
    qrRef.current?.update({ width: size, height: size });
  }, [size]);

  return <div ref={ref} className={className} />;
}