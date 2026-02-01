import { OrganizationSidebar } from "../../components/organization/OrganizationSideBar";
import { OrganizationHeader } from "../../components/organization/OrganizationHeader";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <OrganizationSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <OrganizationHeader />
        <main className="flex-1 hide-scrollbar overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
