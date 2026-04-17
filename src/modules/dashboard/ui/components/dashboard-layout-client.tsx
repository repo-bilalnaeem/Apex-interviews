"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

export const DashboardLayoutClient = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};
