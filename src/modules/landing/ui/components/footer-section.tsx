"use client";

import React from "react";
import Link from "next/link";
import { BotIcon, Twitter, Linkedin, Github, Mail } from "lucide-react";

export const FooterSection = () => {
  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "API Documentation", href: "/docs" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Webinars", href: "/webinars" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Best Practices", href: "/best-practices" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
      { label: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/aiinterviewagents",
      label: "Twitter",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/aiinterviewagents",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/aiinterviewagents",
      label: "GitHub",
    },
    {
      icon: Mail,
      href: "mailto:contact@aiinterviewagents.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <BotIcon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">AI Interview Agents</span>
                </div>
                <p className="mb-6 max-w-sm text-gray-800 dark:text-gray-200">
                  Revolutionizing the hiring process with AI-powered interview
                  agents. Make better hiring decisions faster, fairer, and more
                  efficiently.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <div
                      key={index}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-background opacity-50 cursor-not-allowed"
                      title="Coming Soon"
                    >
                      <social.icon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{`${social.label} (Coming Soon)`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors pointer-events-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors pointer-events-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors pointer-events-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors pointer-events-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="py-8 border-t">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 gap-4">
              {/* Text Section */}
              <div className="text-center md:text-left px-2">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm max-w-md text-gray-800 dark:text-gray-200">
                  Get the latest updates on AI hiring trends and product features.
                </p>
              </div>

              {/* Form Section */}
              <div className="flex flex-col sm:flex-row w-full max-w-md px-2 gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>


          {/* Bottom Bar */}
          <div className="py-6 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-800 dark:text-gray-200">
                <span>© 2024 AI Interview Agents. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-800 dark:text-gray-200">
                <span>SOC 2 Compliant</span>
                <span>GDPR Ready</span>
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
