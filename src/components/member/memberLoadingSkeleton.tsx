'use client';

const C = {
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  border:   "#E5E7EB",
  skeleton: "#E5E7EB",
};

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'stats' | 'text';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  const widthPattern = [75, 90, 65, 80, 70, 85];

  if (type === 'card') {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
            <div style={{
              height: "128px",
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: C.skeleton,
                  borderRadius: "12px",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ height: "16px", background: C.skeleton, borderRadius: "4px", width: "33%" }} />
                  <div style={{ height: "12px", background: C.skeleton, borderRadius: "4px", width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
            <div style={{
              height: "80px",
              background: C.white,
              borderRadius: "8px",
              border: `1px solid ${C.border}`,
              padding: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: C.skeleton,
                  borderRadius: "8px",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ height: "12px", background: C.skeleton, borderRadius: "4px", width: "66%" }} />
                  <div style={{ height: "8px", background: C.skeleton, borderRadius: "4px", width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
            <div style={{
              height: "112px",
              background: C.white,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: C.skeleton,
                  borderRadius: "8px",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ height: "12px", background: C.skeleton, borderRadius: "4px", width: "50%" }} />
                  <div style={{ height: "16px", background: C.skeleton, borderRadius: "4px", width: "33%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "16px",
              background: C.skeleton,
              borderRadius: "4px",
              width: `${widthPattern[i % widthPattern.length]}%`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}