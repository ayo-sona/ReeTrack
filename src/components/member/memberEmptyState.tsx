'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const C = {
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
  coral:    "#F06543",
};

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: C.white,
        borderRadius: "16px",
        border: `1px solid ${C.border}`,
        padding: "64px 48px",
        textAlign: "center",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
      `}</style>

      <div style={{
        width: "72px",
        height: "72px",
        borderRadius: "18px",
        background: C.snow,
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        color: C.coolGrey,
      }}>
        <Icon size={32} />
      </div>

      <h3 style={{
        fontWeight: 700,
        fontSize: "20px",
        color: C.ink,
        marginBottom: "8px",
        letterSpacing: "-0.2px",
      }}>
        {title}
      </h3>

      <p style={{
        fontWeight: 400,
        fontSize: "15px",
        color: C.coolGrey,
        lineHeight: 1.6,
        maxWidth: "400px",
        margin: "0 auto",
        marginBottom: action ? "28px" : 0,
      }}>
        {description}
      </p>

      {action && (
        action.variant === 'default' ? (
          // Coral CTA with glow
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "12px",
              background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
              filter: "blur(14px)",
              opacity: 0.7,
              zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Button
                variant="default"
                size="lg"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            </div>
          </div>
        ) : (
          // Other variants without glow
          <Button
            variant={action.variant || 'secondary'}
            size="lg"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      )}
    </motion.div>
  );
}