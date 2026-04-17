"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechFlow Inc.",
      image: "SC",
      rating: 5,
      quote:
        "AI Interview Agents transformed our hiring process completely. We've reduced our time-to-hire by 70% while maintaining high-quality candidates. The bias-free evaluation is a game-changer.",
      metrics: {
        before: "3 weeks",
        after: "5 days",
        improvement: "70% faster",
      },
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Talent",
      company: "DataCorp Solutions",
      image: "MR",
      rating: 5,
      quote:
        "The 24/7 availability means we can interview global candidates without timezone constraints. Our candidate satisfaction scores increased by 40% since implementation.",
      metrics: { before: "40%", after: "84%", improvement: "44pt increase" },
    },
    {
      name: "Emily Watson",
      role: "Recruiting Director",
      company: "Innovation Labs",
      image: "EW",
      rating: 5,
      quote:
        "The analytics and insights provided by the AI platform helped us identify the best predictors of success in our organization. Our new hire retention improved dramatically.",
      metrics: { before: "68%", after: "92%", improvement: "24pt increase" },
    },
    {
      name: "James Park",
      role: "CTO",
      company: "StartupX",
      image: "JP",
      rating: 5,
      quote:
        "As a fast-growing startup, we needed a scalable solution. AI Interview Agents allowed us to interview 10x more candidates without expanding our HR team.",
      metrics: {
        before: "50/month",
        after: "500/month",
        improvement: "10x scale",
      },
    },
    {
      name: "Lisa Thompson",
      role: "Global HR Lead",
      company: "Enterprise Corp",
      image: "LT",
      rating: 5,
      quote:
        "The standardization across our global offices has been incredible. Every candidate gets the same high-quality interview experience regardless of location or time zone.",
      metrics: {
        before: "Inconsistent",
        after: "Standardized",
        improvement: "100% consistent",
      },
    },
    {
      name: "David Kim",
      role: "Product Manager",
      company: "FinTech Pro",
      image: "DK",
      rating: 5,
      quote:
        "The cost savings have been substantial. We've reduced our cost-per-hire by 60% while actually improving the quality of our hires. ROI was achieved within 2 months.",
      metrics: { before: "$25K", after: "$10K", improvement: "60% savings" },
    },
  ];

  const stats = [
    {
      label: "Customer Satisfaction",
      value: "98%",
      subtext: "Would recommend",
    },
    { label: "Time Saved", value: "75%", subtext: "Faster hiring" },
    { label: "Cost Reduction", value: "60%", subtext: "Lower cost-per-hire" },
    { label: "Quality Improvement", value: "90%", subtext: "Better matches" },
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              Customer Success
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Trusted by Leading
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Companies
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-800 dark:text-gray-200">
              See what industry leaders are saying about their experience with
              our AI interview platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20" />

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Metrics */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      Impact
                    </div>
                    <div className="text-sm font-semibold text-green-800 dark:text-green-300">
                      {testimonial.metrics.improvement}
                    </div>
                    <div className="text-xs text-gray-800 dark:text-gray-200">
                      {testimonial.metrics.before} → {testimonial.metrics.after}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-3 pt-2 border-t">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.image}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-800 dark:text-gray-200">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 backdrop-blur-sm border border-primary/20">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Join 500+ Companies Already Transforming Their Hiring
              </h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-800 dark:text-gray-200">
                Start your free trial today and see results within the first
                week. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Start Free Trial
                </button>
                <button className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
