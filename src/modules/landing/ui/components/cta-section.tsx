"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CheckCircle, Zap, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const CtaSection = () => {
  const { data: session, isPending } = authClient.useSession();

  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Setup in under 5 minutes",
    "Cancel anytime",
  ];

  const stats = [
    { value: "500+", label: "Companies trust us" },
    { value: "10K+", label: "Interviews conducted" },
    { value: "98%", label: "Customer satisfaction" },
    { value: "75%", label: "Time saved" },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1),transparent)]" />
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Main CTA */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-3 h-3 mr-2" />
              Ready to Transform Your Hiring?
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Start Hiring Smarter
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Today
              </span>
            </h2>

            <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-gray-800 dark:text-gray-200">
              Join hundreds of forward-thinking companies that have
              revolutionized their hiring process with AI interview agents.
              Experience the future of recruitment.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!isPending && session?.user ? (
                // Authenticated user buttons
                <>
                  <Button
                    size="lg"
                    asChild
                    className="text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Link href="/overview">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="text-base px-8 py-6 h-auto"
                  >
                    <Link href="/agents">
                      Create Agent
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                // Non-authenticated user buttons
                <>
                  <Button
                    size="lg"
                    asChild
                    className="text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Link href="/sign-up">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="text-base px-8 py-6 h-auto"
                  >
                    <Link href="#demo">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-800 dark:text-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>4.9/5 on G2</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>Rated #1 AI Interview Platform</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-primary/10">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Push */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 backdrop-blur-sm border border-primary/20 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Don&apos;t Let Great Candidates Slip Away
              </h3>
              <p className="text-lg mb-6 text-gray-800 dark:text-gray-200">
                While you&apos;re scheduling interviews and waiting for
                feedback, your competitors are already making offers. Start your
                AI-powered hiring journey now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isPending && session?.user ? (
                  // Authenticated user buttons
                  <>
                    <Button size="lg" asChild className="text-base px-8 py-4">
                      <Link href="/agents">
                        Create Your First Agent
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="text-base px-8 py-4"
                    >
                      <Link href="/meetings">View Meetings</Link>
                    </Button>
                  </>
                ) : (
                  // Non-authenticated user buttons
                  <>
                    <Button size="lg" asChild className="text-base px-8 py-4">
                      <Link href="/sign-up">
                        Get Started - It&apos;s Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="text-base px-8 py-4"
                    >
                      <Link href="/contact">Talk to Sales</Link>
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs mt-4 text-gray-800 dark:text-gray-200">
                {!isPending && session?.user
                  ? "Start creating agents and scheduling interviews"
                  : "No commitment required • Setup takes less than 5 minutes"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
