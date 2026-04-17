"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardCommand from "./dashboard-command";

const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b border-[#1E1E1E] bg-[#0A0A0A]">
        <Button
          className="size-9 bg-[#141414] border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#CAFF02]/30"
          variant="ghost"
          onClick={toggleSidebar}
        >
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Button
          className="h-9 w-[240px] justify-start font-normal bg-[#141414] border border-[#2A2A2A] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#CAFF02]/30 search-bar"
          variant="ghost"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="size-4 shrink-0" />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#2A2A2A] bg-[#1E1E1E] px-1.5 font-mono text-[10px] font-medium text-[#6B6B6B]">
            <span className="text-sm">⌘</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};

export default DashboardNavbar;
