"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Star, Zap } from "lucide-react";
import Link from "next/link";

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with AI interviews",
      price: "49",
      period: "month",
      yearlyPrice: "39",
      badge: null,
      features: [
        { name: "Up to 50 interviews/month", included: true },
        { name: "Basic AI interview agents", included: true },
        { name: "Video recording & transcription", included: true },
        { name: "Standard analytics dashboard", included: true },
        { name: "Email support", included: true },
        { name: "Integration with 3 ATS systems", included: true },
        { name: "Custom branding", included: false },
        { name: "Advanced AI insights", included: false },
        { name: "Priority support", included: false },
        { name: "Custom interview workflows", included: false },
      ],
      cta: "Start Free Trial",
      href: "/sign-up?plan=starter",
    },
    {
      name: "Professional",
      description: "For growing companies that need advanced features",
      price: "149",
      period: "month",
      yearlyPrice: "119",
      badge: "Most Popular",
      features: [
        { name: "Up to 200 interviews/month", included: true },
        { name: "Advanced AI interview agents", included: true },
        { name: "Video recording & transcription", included: true },
        { name: "Advanced analytics & insights", included: true },
        { name: "Priority email & chat support", included: true },
        { name: "Integration with 10+ ATS systems", included: true },
        { name: "Custom branding", included: true },
        { name: "Advanced AI insights", included: true },
        { name: "Team collaboration tools", included: true },
        { name: "Custom interview workflows", included: false },
      ],
      cta: "Start Free Trial",
      href: "/sign-up?plan=professional",
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex requirements",
      price: "Custom",
      period: "contact us",
      yearlyPrice: null,
      badge: "Best Value",
      features: [
        { name: "Unlimited interviews", included: true },
        { name: "Enterprise AI interview agents", included: true },
        { name: "Video recording & transcription", included: true },
        { name: "Custom analytics & reporting", included: true },
        { name: "Dedicated customer success manager", included: true },
        { name: "Custom integrations", included: true },
        { name: "White-label solution", included: true },
        { name: "Advanced AI insights", included: true },
        { name: "Advanced team collaboration", included: true },
        { name: "Custom interview workflows", included: true },
      ],
      cta: "Contact Sales",
      href: "/contact-sales",
    },
  ];

  const [isYearly, setIsYearly] = React.useState(true);

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Star className="w-3 h-3 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Choose the Perfect
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Plan for You
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-gray-800 dark:text-gray-200">
              Start with a free trial on any plan. No credit card required.
              Upgrade or downgrade anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span
                className={`text-sm font-medium ${
                  !isYearly ? "text-gray-800 dark:text-gray-200" : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                aria-label={isYearly ? "Switch to monthly billing" : "Switch to yearly billing"}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className="sr-only">
                  {isYearly ? "Switch to monthly billing" : "Switch to yearly billing"}
                </span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  isYearly ? "text-gray-800 dark:text-gray-200" : "text-muted-foreground"
                }`}
              >
                Yearly
              </span>
              <Badge variant="secondary" className="text-xs">
                Save 20%
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative group hover:shadow-lg transition-all duration-300 ${
                  plan.badge === "Most Popular"
                    ? "border-primary shadow-lg scale-105"
                    : "border-0 bg-background/80 backdrop-blur-sm"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge
                      className={`px-4 py-1 ${
                        plan.badge === "Most Popular"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-r from-primary to-blue-600 text-white"
                      }`}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2 text-gray-800 dark:text-gray-200">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-6">
                    {plan.price === "Custom" ? (
                      <div className="text-4xl font-bold">Custom</div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">
                          ${isYearly ? plan.yearlyPrice : plan.price}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          /{isYearly ? "month" : plan.period}
                        </span>
                      </div>
                    )}
                    {isYearly && plan.yearlyPrice && (
                      <p className="text-sm text-muted-foreground mt-1">
                        billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-gray-800 dark:text-gray-200"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`w-full ${
                      plan.badge === "Most Popular"
                        ? "bg-primary hover:bg-primary/90"
                        : ""
                    }`}
                    variant={
                      plan.badge === "Most Popular" ? "default" : "outline"
                    }
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All plans include:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800 dark:text-gray-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 uptime SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Frequently Asked Questions
            </h3>
            <p className="mb-8 text-gray-800 dark:text-gray-200">
              Have questions? We&apos;re here to help. Contact our sales team
              for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/faq">View FAQ</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
