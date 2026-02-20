"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrganizationSidebar } from "@/components/organization/OrganizationSideBar";
import { OrganizationMobileHeader } from "@/components/organization/OrganizationMobileHeader";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9FAFB]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Sidebar + toggle wrapper */}
      <div className="hidden lg:flex items-center" style={{ padding: "12px 0 12px 12px", position: "relative" }}>
        <OrganizationSidebar
          pathname={pathname}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((c) => !c)}
        />

        {/* Toggle button — completely outside the panel, no clipping possible */}
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          style={{
            position: "relative",
            marginLeft: "-1px", // kiss the panel edge
            width: "24px",
            height: "48px",
            borderRadius: "0 8px 8px 0",
            border: `1px solid #E5E7EB`,
            borderLeft: "none",
            background: "#FFFFFF",
            color: "#9CA3AF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
            transition: "all 200ms",
            flexShrink: 0,
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0D9488";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "#0D9488";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "#9CA3AF";
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <OrganizationMobileHeader pathname={pathname} />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}