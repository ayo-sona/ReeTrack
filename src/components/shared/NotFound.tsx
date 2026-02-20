"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFoundPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [proximityLevel, setProximityLevel] = useState(0);
  const [isHoveringHome, setIsHoveringHome] = useState(false);
  const [isHoveringBack, setIsHoveringBack] = useState(false);
  const faceRef = useRef<HTMLDivElement>(null);
  const homeButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const isHoveringAny = isHoveringHome || isHoveringBack;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      let minDistance = Infinity;
      [homeButtonRef, backButtonRef].forEach((ref) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const d = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
          if (d < minDistance) minDistance = d;
        }
      });

      if (minDistance < 80) setProximityLevel(2);
      else if (minDistance < 280) setProximityLevel(1);
      else setProximityLevel(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [eyeCenters, setEyeCenters] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const updateEyeCenters = () => {
      if (faceRef.current) {
        const rect = faceRef.current.getBoundingClientRect();
        const faceCX = rect.left + rect.width / 2;
        const faceTop = rect.top;
        const faceH = rect.height;
        setEyeCenters({
          lx: faceCX - rect.width * 0.16,
          ly: faceTop + faceH * 0.38,
          rx: faceCX + rect.width * 0.16,
          ry: faceTop + faceH * 0.38,
        });
      }
    };
    updateEyeCenters();
    window.addEventListener("resize", updateEyeCenters);
    return () => window.removeEventListener("resize", updateEyeCenters);
  }, []);

  const calculateEyePosition = (eyeCenterX: number, eyeCenterY: number) => {
    const dx = mousePosition.x - eyeCenterX;
    const dy = mousePosition.y - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const rawDist = Math.sqrt(dx * dx + dy * dy);
    const distance = Math.min(rawDist / 18, 14);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const leftEyePos = calculateEyePosition(eyeCenters.lx, eyeCenters.ly);
  const rightEyePos = calculateEyePosition(eyeCenters.rx, eyeCenters.ry);

  const mouthOpen = proximityLevel === 2 ? 1 : proximityLevel === 1 ? 0.45 : 0;
  const upperLipY = 30;
  const lowerLipY = upperLipY + mouthOpen * 56;
  const mouthWidth = 110 + mouthOpen * 20;
  const startX = (200 - mouthWidth) / 2;
  const endX = startX + mouthWidth;
  const eyeColor = proximityLevel === 2 ? "#F06543" : "#0D9488";

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#F9FAFB] flex flex-col items-center justify-center gap-6"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#F06543]/6 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* ── FACE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          ref={faceRef}
          className="relative w-[38vmin] h-[38vmin] min-w-[180px] min-h-[180px] max-w-[280px] max-h-[280px]"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: proximityLevel > 0
                ? "0 0 60px 12px rgba(13,148,136,0.13)"
                : "0 0 24px 4px rgba(13,148,136,0.05)",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Face circle */}
          <div className="absolute inset-0 rounded-full bg-white border-[3px] border-[#1F2937] shadow-[5px_5px_0px_#1F2937]" />

          {/* Eyes */}
          <div className="absolute top-[28%] left-0 right-0 flex justify-center gap-[16%]">
            {[leftEyePos, rightEyePos].map((pos, i) => (
              <div key={i} className="relative">
                <motion.div
                  className="w-[9vmin] h-[11vmin] min-w-[42px] min-h-[52px] max-w-[68px] max-h-[82px] bg-white rounded-full border-[2.5px] flex items-center justify-center overflow-hidden"
                  animate={{ borderColor: eyeColor }}
                  style={{ borderStyle: "solid" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-[44%] h-[44%] rounded-full relative"
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      backgroundColor: eyeColor,
                      scale: proximityLevel === 2 ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  >
                    <div className="absolute top-[15%] left-[18%] w-[38%] h-[38%] bg-white rounded-full opacity-65" />
                    <div className="absolute bottom-[18%] right-[15%] w-[20%] h-[20%] bg-white rounded-full opacity-35" />
                  </motion.div>
                </motion.div>

                {/* Blink */}
                <motion.div
                  className="absolute top-0 left-0 right-0 bg-white rounded-t-full z-10"
                  animate={{
                    height: isHoveringAny ? ["0%", "100%", "0%"] : "0%",
                  }}
                  transition={{
                    duration: 0.2,
                    times: [0, 0.5, 1],
                    repeat: isHoveringAny ? Infinity : 0,
                    repeatDelay: 3,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Mouth */}
          <div className="absolute top-[63%] left-0 right-0 flex justify-center">
            <svg width="55%" height="auto" viewBox="0 0 200 100" overflow="visible">
              {/* Teeth */}
              <AnimatePresence>
                {mouthOpen > 0.25 && (
                  <motion.rect
                    x={startX + 5}
                    y={upperLipY + 3}
                    width={mouthWidth - 10}
                    height={(lowerLipY - upperLipY) * 0.42}
                    rx="5"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: Math.min((mouthOpen - 0.25) / 0.35, 1) }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              {/* Mouth shape */}
              <motion.path
                animate={{
                  d: mouthOpen === 0
                    ? `M ${startX + 12} ${upperLipY} Q 100 ${upperLipY + 10} ${endX - 12} ${upperLipY}`
                    : `M ${startX} ${upperLipY} Q 100 ${upperLipY - 16} ${endX} ${upperLipY} Q 100 ${lowerLipY + 8} ${startX} ${upperLipY} Z`,
                }}
                stroke="#1F2937"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={mouthOpen > 0 ? "#1F2937" : "none"}
                transition={{ type: "spring", stiffness: 100, damping: 16 }}
              />

              {/* Blush */}
              <AnimatePresence>
                {proximityLevel === 2 && (
                  <>
                    <motion.ellipse cx="22" cy="52" rx="18" ry="10" fill="#F06543"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }} style={{ transformOrigin: "22px 52px" }} />
                    <motion.ellipse cx="178" cy="52" rx="18" ry="10" fill="#F06543"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }} style={{ transformOrigin: "178px 52px" }} />
                  </>
                )}
              </AnimatePresence>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── TEXT + BUTTONS ── */}
      <motion.div
        className="flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <h1 className="text-7xl sm:text-8xl font-extrabold text-[#0D9488] tracking-tight leading-none mb-2">
          404
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-1">
          Page not found
        </p>
        <p className="text-sm sm:text-base text-[#9CA3AF] mb-7">
          Looks like you wandered off the path
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Take Me Home */}
          <motion.button
            ref={homeButtonRef}
            onClick={() => router.push("/")}
            onMouseEnter={() => setIsHoveringHome(true)}
            onMouseLeave={() => setIsHoveringHome(false)}
            className="relative px-8 py-3 bg-[#F06543] text-white font-bold rounded-full border-2 border-[#1F2937] shadow-[4px_4px_0px_#1F2937] overflow-hidden min-w-[160px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97, y: 0 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Take Me Home
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: isHoveringHome ? "100%" : "-100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          {/* Go Back */}
          <motion.button
            ref={backButtonRef}
            onClick={() => router.back()}
            onMouseEnter={() => setIsHoveringBack(true)}
            onMouseLeave={() => setIsHoveringBack(false)}
            className="relative px-8 py-3 bg-white font-bold rounded-full border-2 border-[#1F2937] shadow-[4px_4px_0px_#1F2937] overflow-hidden min-w-[160px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97, y: 0 }}
          >
            {/* Teal fill on hover */}
            <motion.div
              className="absolute inset-0 bg-[#0D9488] rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHoveringBack ? 1.6 : 0, opacity: isHoveringBack ? 1 : 0 }}
              transition={{ duration: 0.28 }}
              style={{ transformOrigin: "center" }}
            />
            <span
              className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base font-bold transition-colors duration-150"
              style={{ color: isHoveringBack ? "#ffffff" : "#1F2937" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}