'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C = {
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const sizeMap = {
    sm: '448px',
    md: '672px',
    lg: '896px',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
            * { box-sizing: border-box; }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(31, 41, 55, 0.45)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 50,
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: C.white,
                borderRadius: '16px',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
                width: '100%',
                maxWidth: sizeMap[size],
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <h3 style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: C.ink,
                  letterSpacing: '-0.2px',
                }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: C.coolGrey,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 200ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.border}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
              }}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  padding: '24px',
                  borderTop: `1px solid ${C.border}`,
                }}>
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}