"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import {
  BotIcon,
  VideoIcon,
  HomeIcon,
  User,
  FileEdit,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import DasboardUserButton from "./dashboard-user-button";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navItems: NavigationItem[] = [
  { icon: HomeIcon, label: "Overview", href: "/overview" },
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
  { icon: User, label: "Resume Assistant", href: "/my-resumes" },
  { icon: FileEdit, label: "Cover Letter", href: "/cover-letter" },
  { icon: Target, label: "Tailor Your CV", href: "/tailor-cv" },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) toggleSidebar();
  };

  const navItemClass = (href: string) =>
    cn(
      "h-10 rounded-xl border border-transparent text-[#6B6B6B] transition-all duration-150",
      "hover:bg-[#1A1A1A] hover:text-[#F5F5F5]",
      pathname === href &&
        "bg-[#1A1A1A] border-l-[3px] border-l-[#CAFF02] border-t-transparent border-r-transparent border-b-transparent text-[#F5F5F5]"
    );

  return (
    <Sidebar className="border-r border-[#1E1E1E] bg-[#0F0F0F]">
      {/* Wordmark */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/overview" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-[#F5F5F5] tracking-tight">APEX</span>
          <span className="text-[8px] font-medium text-[#CAFF02] uppercase tracking-[0.2em] mt-1">interviews</span>
        </Link>
      </SidebarHeader>

      <div className="px-4">
        <Separator className="bg-[#1E1E1E]" />
      </div>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="left-sidebar-nav gap-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={navItemClass(item.href)}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} onClick={handleLinkClick}>
                      <item.icon className="size-5 shrink-0" />
                      <span className="text-sm font-medium tracking-tight">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="px-4">
        <Separator className="bg-[#1E1E1E]" />
      </div>

      <SidebarFooter className="px-2 py-3">
        <DasboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
