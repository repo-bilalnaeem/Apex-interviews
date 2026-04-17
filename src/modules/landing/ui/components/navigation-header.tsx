"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BotIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const NavigationHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false); // close sidebar first
    router.push(href); // then navigate
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto pl-4 pr-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BotIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              AI Interview Agents
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isPending && session?.user ? (
              <Button variant="outline" asChild>
                <Link href="/overview">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-72 px-4">
              <div className="flex flex-col space-y-6 pt-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <BotIcon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    AI Interview Agents
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className="text-left text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col space-y-3">
                  {!isPending && session?.user ? (
                    <Button className="w-full" onClick={() => handleNavClick("/overview")}>
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" onClick={() => handleNavClick("/sign-in")}>
                        Sign In
                      </Button>
                      <Button className="w-full" onClick={() => handleNavClick("/sign-up")}>
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
