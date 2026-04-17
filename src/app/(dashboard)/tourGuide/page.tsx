"use client";

import Joyride, { CallBackProps, Step } from "react-joyride";
import { useEffect, useState } from "react";
import { useTour } from "@/contexts/tour-context";

// Constants for better maintainability
const TOUR_STORAGE_KEY = "hasSeenTour" as const;
const TOUR_Z_INDEX = 11000 as const;

// Joyride styling configuration
const JOYRIDE_STYLES = {
    options: {
        arrowColor: "#ffffff",
        backgroundColor: "#ffffff",
        primaryColor: "#1865a4",
        textColor: "#000000",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        spotlightShadow: "none",
        zIndex: TOUR_Z_INDEX,
    },
    overlay: {
        pointerEvents: "none" as const,
    },
    spotlight: {
        pointerEvents: "auto" as const,
        zIndex: TOUR_Z_INDEX + 1,
    },
    tooltip: {
        pointerEvents: "auto" as const,
        fontSize: "16px",
        lineHeight: "1.5",
        fontWeight: 500,
        color: "#1f2937",
        padding: "16px",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
        maxWidth: "300px",
        wordWrap: "break-word" as const,
        whiteSpace: "normal" as const,
    },
    buttonNext: {
        backgroundColor: "#1865a4",
        color: "#ffffff",
    },
    buttonBack: {
        color: "#374151",
    },
} as const;

// Function to create tour steps with progress
const createTourSteps = (currentStep: number, totalSteps: number): Step[] => [
    {
        target: ".create-meeting-btn",
        content: (
            <div>
                <div className="mb-3">
                    Welcome! Let&apos;s start with the Quick Actions toolkit. Click here to create a new AI interview meeting.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        disableBeacon: true,
        placement: "top",
    },
    {
        target: ".search-bar",
        content: (
            <div>
                <div className="mb-3">
                    Use this search bar to quickly find agents, meetings, or resumes across your dashboard.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        disableBeacon: true,
        placement: "bottom",
    },
    {
        target: "body",
        content: (
            <div>
                <div className="mb-3">
                    This is your dashboard overview where you&apos;ll see key metrics and recent activity when you log in.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        disableBeacon: true,
        placement: "center",
        offset: 0,
    },
    {
        target: ".left-sidebar-nav",
        content: (
            <div>
                <div className="mb-3">
                    Navigate between key sections using the sidebar. Let&apos;s explore the main features:
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right",
        disableBeacon: true,
    },
    {
        target: '.left-sidebar-nav a[href="/overview"]',
        content: (
            <div>
                <div className="mb-3">
                    Overview - Your main dashboard with key metrics and recent activity.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right-start",
        disableBeacon: true,
        offset: 10,
    },
    {
        target: '.left-sidebar-nav a[href="/meetings"]',
        content: (
            <div>
                <div className="mb-3">
                    Meetings - View and manage all your AI interview sessions.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right-start",
        disableBeacon: true,
        offset: 10,
    },
    {
        target: '.left-sidebar-nav a[href="/agents"]',
        content: (
            <div>
                <div className="mb-3">
                    Agents - Create and manage your AI interview agents with custom instructions.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right-start",
        disableBeacon: true,
        offset: 10,
    },
    {
        target: '.left-sidebar-nav a[href="/my-resumes"]',
        content: (
            <div>
                <div className="mb-3">
                    Resume Assistant - Upload and get AI feedback on your resumes.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right-start",
        disableBeacon: true,
        offset: 10,
    },
    {
        target: '.left-sidebar-nav a[href="/chatbot"]',
        content: (
            <div>
                <div className="mb-3">
                    Chatbot - Start conversations with AI for interview practice and guidance.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        placement: "right-start",
        disableBeacon: true,
        offset: 10,
    },
    {
        target: ".settings-btn",
        content: (
            <div>
                <div className="mb-3">
                    User Menu - Access your profile settings, billing information, and account options from this dropdown menu.
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{totalSteps - currentStep - 1} remaining</span>
                </div>
            </div>
        ),
        disableBeacon: true,
        placement: "top-end",
        offset: 10,
    },

];

export default function TourGuide() {
    const [run, setRun] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { setRestartTour } = useTour();

    const handleRestartTour = () => {
        setRun(true);
        setShowPrompt(false);
        setCurrentStep(0);
    };

    useEffect(() => {
        // Ensure we're on the client side
        setIsClient(true);

        // Register the restart function with the context
        setRestartTour(() => handleRestartTour);

        try {
            const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
            if (!hasSeenTour) {
                setShowPrompt(true);
            }
        } catch (error) {
            console.warn("Failed to access localStorage:", error);
            // Fallback: show tour prompt if localStorage is unavailable
            setShowPrompt(true);
        }
    }, [setRestartTour]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, index, action } = data;
        const finishedStatuses = ["finished", "skipped"];

        // Update current step
        if (action === "next" || action === "prev") {
            setCurrentStep(index);
        }

        if (finishedStatuses.includes(status) || data.action === "close") {
            setRun(false);
            setCurrentStep(0);
            localStorage.setItem(TOUR_STORAGE_KEY, "true");
        }
    };

    const startTour = () => {
        setRun(true);
        setShowPrompt(false);
        setCurrentStep(0);
    };

    const skipTour = () => {
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        setShowPrompt(false);
        setCurrentStep(0);
    };

    // Don't render anything until we're on the client side
    if (!isClient) {
        return null;
    }

    return (
        <>
            <Joyride
                steps={createTourSteps(currentStep, 15)}
                run={run}
                continuous
                scrollToFirstStep={false}
                disableScrolling={true}
                scrollOffset={0}
                showProgress={false}
                showSkipButton
                disableOverlayClose
                spotlightClicks
                floaterProps={{
                    styles: {
                        floater: {
                            filter: 'none',
                        }
                    }
                }}
                styles={JOYRIDE_STYLES}
                locale={{
                    last: "End", // 👈 This changes the last button text
                }}
                callback={handleJoyrideCallback}
            />
            {showPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Want a quick tour?</h2>
                        <p className="mb-6 text-gray-600">We can guide you through the key features of this page in just a few steps.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={skipTour}
                                className="text-gray-500 hover:text-gray-700 px-4 py-2"
                            >
                                Skip
                            </button>
                            <button
                                onClick={startTour}
                                className="bg-[#1865a4] hover:bg-[#145488] text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Start Tour
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}