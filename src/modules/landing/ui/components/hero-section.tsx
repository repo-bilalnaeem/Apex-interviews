"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star, Users, Zap, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const HeroSection = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-12 pb-20 sm:pt-24 sm:pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent)]" />
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="flex flex-col space-y-8">
              {/* Badge Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm sm:text-base flex items-center">
                  <Zap className="w-3 h-3 mr-2" />
                  AI-Powered Interview Platform
                </Badge>

                <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full bg-primary/20 border-2 border-background"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">Trusted by 500+ companies</span>
                </div>
              </div>

              {/* Heading + Subtext */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight tracking-tight text-balance">
                  Transform Your
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {" "}Interview Process
                  </span>
                  <br />
                  with AI Agents
                </h1>
                <h2 className="text-base sm:text-lg max-w-md sm:max-w-xl lg:max-w-2xl leading-relaxed text-gray-800 dark:text-gray-200">
                  Automate candidate screening, conduct intelligent interviews,
                  and make data-driven hiring decisions with our advanced AI
                  interview agents. Save time, reduce bias, and find the perfect
                  candidates faster.
                </h2>
              </div>

              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  "24/7 Automated Screening",
                  "Bias-Free Evaluations",
                  "Real-time Analytics",
                  "Seamless Integration",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                {!isPending && session?.user ? (
                  <>
                    <Button size="lg" asChild className="text-base px-8 py-6 h-auto w-full sm:w-auto">
                      <Link href="/overview">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="text-base px-8 py-6 h-auto w-full sm:w-auto">
                      <Link href="/agents">
                        Create Agent
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild className="text-base px-8 py-6 h-auto w-full sm:w-auto">
                      <Link href="/sign-up">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="text-base px-8 py-6 h-auto w-full sm:w-auto">
                      <Link href="#demo">
                        <Play className="mr-2 h-5 w-5" />
                        Watch Demo
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    4.9/5 rating
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    10,000+ interviews conducted
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative lg:pl-8">
              <div className="relative">
                <div className="relative bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-primary/20">
                  <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
                    <div className="bg-primary/5 p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-400" />
                          <div className="h-3 w-3 rounded-full bg-yellow-400" />
                          <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          AI Interview Dashboard
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Active Interviews</h3>
                        <Badge>12 ongoing</Badge>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Sarah Johnson", role: "Frontend Developer", status: "In Progress" },
                          { name: "Mike Chen", role: "Data Scientist", status: "Completed" },
                          { name: "Emily Davis", role: "Product Manager", status: "Scheduled" },
                        ].map((candidate, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-sm">{candidate.name}</div>
                              <div className="text-xs text-gray-800 dark:text-gray-200">{candidate.role}</div>
                            </div>
                            <Badge variant={candidate.status === "Completed" ? "default" : "secondary"}>
                              {candidate.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
