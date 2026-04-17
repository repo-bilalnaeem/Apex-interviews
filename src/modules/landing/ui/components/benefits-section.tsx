"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "75% Faster Hiring",
      description:
        "Reduce time-to-hire from weeks to days with automated screening and instant candidate evaluation.",
      metric: "Average 21 → 5 days",
      color: "text-green-600",
    },
    {
      icon: DollarSign,
      title: "60% Cost Reduction",
      description:
        "Cut hiring costs significantly by automating manual processes and reducing recruiter workload.",
      metric: "Save $15K per hire",
      color: "text-blue-600",
    },
    {
      icon: Target,
      title: "90% Better Match Quality",
      description:
        "Improve candidate-role fit with AI-driven assessments and objective evaluation criteria.",
      metric: "Higher retention rates",
      color: "text-purple-600",
    },
    {
      icon: Users,
      title: "5x More Candidates",
      description:
        "Interview more candidates without increasing workload, expanding your talent pool dramatically.",
      metric: "Scale infinitely",
      color: "text-orange-600",
    },
  ];

  const outcomes = [
    "Eliminate scheduling conflicts",
    "Reduce unconscious bias",
    "Standardize interview process",
    "Improve candidate experience",
    "Generate detailed insights",
    "Scale globally without limits",
  ];

  return (
    <section id="benefits" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              Proven Results
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Transform Your Hiring
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Outcomes
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-800 dark:text-gray-200">
              See measurable improvements in your hiring process from day one.
              Our customers report significant gains in efficiency, quality, and
              cost savings.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:scale-110 transition-transform`}
                  >
                    <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                      {benefit.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {benefit.metric}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Benefits */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Outcomes List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  What You&apos;ll Achieve
                </h3>
                <p className="text-lg mb-6 text-gray-800 dark:text-gray-200">
                  Our AI interview platform delivers measurable improvements
                  across every aspect of your hiring process.
                </p>
              </div>

              <div className="grid gap-4">
                {outcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{outcome}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors">
                  See case studies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Column - Visual Representation */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary/5 to-blue-600/5 rounded-2xl p-8 backdrop-blur-sm border border-primary/10">
                {/* Process Comparison */}
                <div className="space-y-8">
                  <h4 className="text-xl font-semibold text-center mb-6">
                    Traditional vs AI-Powered
                  </h4>

                  {/* Traditional Process */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          Traditional Hiring
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-200">
                          21 days average
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {[
                        "Manual screening",
                        "Schedule coordination",
                        "Subjective evaluation",
                        "Delayed feedback",
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="text-xs bg-red-50 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Process */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          AI-Powered Hiring
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-200">
                          5 days average
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {[
                        "Automated screening",
                        "24/7 availability",
                        "Objective evaluation",
                        "Instant feedback",
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="text-xs bg-green-50 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating metric */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full px-4 py-2 shadow-lg">
                  <div className="text-xs font-semibold">75% Faster</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
