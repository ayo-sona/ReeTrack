'use client';

import Link from 'next/link';
import { Info, AlertCircle, CheckCircle, XCircle, Check } from 'lucide-react';
import { SyntheticNotification } from '@/types/memberTypes/member';
import { useState } from 'react';

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

interface NotificationItemProps {
  notification: SyntheticNotification;
  isRead: boolean;
  onMarkAsRead?: (id: string, e: React.MouseEvent) => void;
}

export default function NotificationItem({ 
  notification, 
  isRead,
  onMarkAsRead 
}: NotificationItemProps) {
  const [markAsReadHovered, setMarkAsReadHovered] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} style={{ color: C.teal }} />;
      case 'warning': return <AlertCircle size={20} style={{ color: "#D97706" }} />;
      case 'error': return <XCircle size={20} style={{ color: C.coral }} />;
      default: return <Info size={20} style={{ color: C.teal }} />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return { bg: C.white, border: C.border };
    
    switch (type) {
      case 'success': return { bg: "rgba(13,148,136,0.08)", border: "rgba(13,148,136,0.2)" };
      case 'warning': return { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" };
      case 'error': return { bg: "rgba(240,101,67,0.08)", border: "rgba(240,101,67,0.2)" };
      default: return { bg: "rgba(13,148,136,0.08)", border: "rgba(13,148,136,0.2)" };
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      subscription: { bg: "rgba(168,85,247,0.1)", color: "#9333EA", label: "Subscription" },
      payment: { bg: "rgba(13,148,136,0.1)", color: C.teal, label: "Payment" },
      achievement: { bg: "rgba(251,191,36,0.1)", color: "#D97706", label: "Achievement" },
      system: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "System" },
    };

    const badge = badges[category as keyof typeof badges];
    if (!badge) return null;

    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '6px',
        background: badge.bg,
        color: badge.color,
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 600,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        {badge.label}
      </span>
    );
  };

  const style = getNotificationBg(notification.type, isRead);
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${hovered && !isRead ? C.teal : style.border}`,
        background: style.bg,
        transition: 'all 200ms',
        boxShadow: hovered && !isRead ? '0 4px 12px rgba(13,148,136,0.08)' : 'none',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {/* Icon */}
        <div style={{ flexShrink: 0, opacity: isRead ? 0.5 : 1, transition: 'opacity 200ms' }}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontWeight: 600,
                fontSize: '14px',
                color: isRead ? C.coolGrey : C.ink,
                marginBottom: '6px',
                transition: 'color 200ms',
              }}>
                {notification.title}
              </h3>
              {getCategoryBadge(notification.category)}
            </div>
            {!isRead && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: C.teal,
                flexShrink: 0,
                marginTop: '4px',
              }} />
            )}
          </div>
          
          {/* Message */}
          <p style={{
            fontSize: '13px',
            color: isRead ? C.coolGrey : C.ink,
            lineHeight: 1.6,
            marginBottom: '12px',
            transition: 'color 200ms',
          }}>
            {notification.message}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{
              fontSize: '12px',
              color: C.coolGrey,
            }}>
              {new Date(notification.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            
            {!isRead && onMarkAsRead && (
              <button
                onClick={(e) => onMarkAsRead(notification.id, e)}
                onMouseEnter={() => setMarkAsReadHovered(true)}
                onMouseLeave={() => setMarkAsReadHovered(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: markAsReadHovered ? 'rgba(13,148,136,0.08)' : 'transparent',
                  color: C.teal,
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background 200ms',
                }}
              >
                <Check size={12} />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return content;
}