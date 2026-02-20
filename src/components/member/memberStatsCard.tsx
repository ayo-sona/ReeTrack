'use client';

import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'teal' | 'coral' | 'amber' | 'purple' | 'blue';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'teal', 
  subtitle, 
  trend 
}: StatsCardProps) {
  const [hovered, setHovered] = useState(false);

  const colorConfig = {
    teal: { 
      bg: 'rgba(13,148,136,0.1)', 
      color: C.teal 
    },
    coral: { 
      bg: 'rgba(240,101,67,0.1)', 
      color: C.coral 
    },
    amber: { 
      bg: 'rgba(251,191,36,0.12)', 
      color: '#D97706' 
    },
    purple: { 
      bg: 'rgba(168,85,247,0.1)', 
      color: '#9333EA' 
    },
    blue: { 
      bg: 'rgba(59,130,246,0.1)', 
      color: '#3B82F6' 
    },
  };

  const cfg = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: "12px",
        padding: "24px",
        border: `1px solid ${hovered ? C.teal : C.border}`,
        boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 300ms",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        {/* Icon */}
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          background: cfg.bg,
          color: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "transform 300ms",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}>
          <Icon size={22} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <p style={{
            fontWeight: 400,
            fontSize: "13px",
            color: C.coolGrey,
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            {title}
          </p>

          {/* Value & Trend */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            flexWrap: "wrap",
          }}>
            <p style={{
              fontWeight: 800,
              fontSize: "26px",
              color: C.ink,
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              {value}
            </p>
            {trend && (
              <span style={{
                fontWeight: 600,
                fontSize: "12px",
                color: trend.isPositive ? C.teal : C.coral,
                display: "inline-flex",
                alignItems: "center",
                gap: "2px",
              }}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p style={{
              fontWeight: 400,
              fontSize: "12px",
              color: C.coolGrey,
              marginTop: "4px",
              lineHeight: 1.4,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}