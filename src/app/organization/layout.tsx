"use client";

import { usePathname } from "next/navigation";
import { OrganizationSidebar } from "@/components/organization/OrganizationSideBar";
import { OrganizationMobileHeader } from "@/components/organization/OrganizationMobileHeader";

const C = {
  snow: "#F9FAFB",
};

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh", background: C.snow }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Mobile Header Component */}
      <OrganizationMobileHeader pathname={pathname} />

      <div style={{ display: "flex" }}>
        {/* Desktop Sidebar Component */}
        <OrganizationSidebar pathname={pathname} />

        {/* Main Content - No desktop header */}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}