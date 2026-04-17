"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  useEffect(() => {
    if (isIOS && !isStandalone) {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isIOS, isStandalone]);

  const handleClose = () => {
    setShowPrompt(false);
    // Store preference to not show again for a while
    localStorage.setItem("pwa-install-prompt-dismissed", Date.now().toString());
  };

  // Don't show if not iOS, already installed, or user dismissed recently
  if (!isIOS || isStandalone || !showPrompt) {
    return null;
  }

  // Check if user dismissed recently (within 7 days)
  const lastDismissed = localStorage.getItem("pwa-install-prompt-dismissed");
  if (lastDismissed) {
    const daysSinceDismissal =
      (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissal < 7) {
      return null;
    }
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm bg-background border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install App
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Add AI Interview Agents to your home screen for a better experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span>1. Tap the share button</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>2. Select &quot;Add to Home Screen&quot;</span>
          </div>
        </div>
        <Button onClick={handleClose} className="w-full mt-4" variant="outline">
          Got it
        </Button>
      </CardContent>
    </Card>
  );
}
