"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BotIcon,
  VideoIcon,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Users,
  Target,
  MessageSquare,
  Settings,
  Database,
  Brain,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: BotIcon,
      title: "AI Interview Agents",
      description:
        "Intelligent agents that conduct natural, conversational interviews tailored to specific roles and requirements.",
      benefits: [
        "Natural conversation flow",
        "Role-specific questions",
        "Real-time adaptation",
      ],
    },
    {
      icon: VideoIcon,
      title: "Video Interview Platform",
      description:
        "High-quality video interviews with recording, transcription, and analysis capabilities.",
      benefits: [
        "HD video quality",
        "Automatic transcription",
        "Facial expression analysis",
      ],
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive interview analytics with scoring, insights, and detailed candidate assessments.",
      benefits: [
        "Performance scoring",
        "Bias detection",
        "Predictive insights",
      ],
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Schedule and conduct interviews anytime, anywhere, without human intervention.",
      benefits: [
        "Global timezone support",
        "Instant scheduling",
        "No waiting periods",
      ],
    },
    {
      icon: Shield,
      title: "Bias-Free Evaluation",
      description:
        "Eliminate unconscious bias with objective, data-driven candidate assessments.",
      benefits: [
        "Standardized evaluation",
        "Objective scoring",
        "Fair assessments",
      ],
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description:
        "Get started in minutes with pre-built templates and easy customization options.",
      benefits: [
        "Ready-to-use templates",
        "Simple configuration",
        "Fast deployment",
      ],
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share interview results, collaborate on decisions, and maintain hiring consistency.",
      benefits: ["Shared dashboards", "Team feedback", "Decision tracking"],
    },
    {
      icon: Target,
      title: "Smart Matching",
      description:
        "AI-powered candidate matching based on skills, experience, and cultural fit.",
      benefits: ["Skill assessment", "Culture matching", "Success prediction"],
    },
    {
      icon: MessageSquare,
      title: "Multi-Language Support",
      description:
        "Conduct interviews in multiple languages with real-time translation capabilities.",
      benefits: [
        "50+ languages",
        "Real-time translation",
        "Cultural adaptation",
      ],
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description:
        "Design custom interview workflows that match your hiring process and requirements.",
      benefits: ["Flexible workflows", "Custom stages", "Automated routing"],
    },
    {
      icon: Database,
      title: "Candidate Database",
      description:
        "Maintain a searchable database of all candidates with their interview history and assessments.",
      benefits: [
        "Searchable profiles",
        "Interview history",
        "Performance tracking",
      ],
    },
    {
      icon: Brain,
      title: "Learning AI",
      description:
        "AI that continuously learns and improves from each interview to provide better assessments.",
      benefits: [
        "Continuous learning",
        "Improved accuracy",
        "Adaptive questions",
      ],
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Modern Hiring
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-800 dark:text-gray-200">
              Everything you need to revolutionize your interview process, from
              initial screening to final selection.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-200">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg mb-6 text-gray-800 dark:text-gray-200">
              Ready to experience these features yourself?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
              <button className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
