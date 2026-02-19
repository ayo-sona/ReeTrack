"use client";

import { useState } from "react";
import { OrganizationSidebar } from "../../components/organization/OrganizationSideBar";
import { OrganizationHeader } from "../../components/organization/OrganizationHeader";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-default-50 dark:bg-background">
      {/* Sidebar */}
      <OrganizationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onToggleMobile={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <OrganizationHeader
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobile={setIsMobileOpen}
          onSetCollapse={setIsSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
