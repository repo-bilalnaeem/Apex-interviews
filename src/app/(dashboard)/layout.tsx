import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { TourProvider } from "@/contexts/tour-context";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <TourProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col min-h-screen w-full bg-[#0A0A0A]">
          <DashboardNavbar />
          {children}
        </main>
      </SidebarProvider>
    </TourProvider>
  );
};

export default Layout;
