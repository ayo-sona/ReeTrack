'use client';

import { useState } from 'react';
import { OrganizationSidebar } from "../../components/organization/OrganizationSideBar";
import { OrganizationHeader } from "../../components/organization/OrganizationHeader";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      {/* Sidebar */}
      <OrganizationSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <OrganizationHeader 
          onToggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}