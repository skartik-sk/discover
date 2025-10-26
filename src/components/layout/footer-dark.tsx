"use client";

import Link from "next/link";
import { Mail, Twitter, Github, Linkedin, ArrowUp } from "lucide-react";
import { FigmaButton } from "@/components/figma-ui/FigmaButton";
import { FigmaInput } from "@/components/figma-ui/FigmaInput";
import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";

export function DarkFooter() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    product: [
      { href: "/projects", label: "Browse Projects" },
      { href: "/categories", label: "Categories" },
      { href: "/submit", label: "Submit Project" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
    resources: [
      { href: "/docs", label: "Documentation" },
      { href: "/support", label: "Support" },
      { href: "/api", label: "API" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  };

  const socialLinks = [
    {
      href: "https://twitter.com",
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: "https://github.com",
      icon: Github,
      label: "GitHub",
    },
    {
      href: "https://linkedin.com",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "mailto:hello@discover.com",
      icon: Mail,
      label: "Email",
    },
  ];

  return (
    <footer
      className="relative border-t transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-custom">
        {/* Newsletter Section */}
        <div
          className="py-8 md:py-12 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Subscribe To Our{" "}
              <span className="text-[#FFDF00]">Newsletter</span>
            </h3>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Get the latest Web3 projects and updates delivered to your inbox
            </p>
            <form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <FigmaInput
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <FigmaButton type="submit" variant="primary" size="md">
                Subscribe
              </FigmaButton>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-8">
            {/* Brand Column */}
            <div className="col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-[#FFDF00] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="text-[#000000] text-xl font-black">D</span>
                </div>
                <span
                  className="text-2xl font-black uppercase tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Discover
                </span>
              </Link>
              <p
                className="max-w-xs leading-relaxed text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                The leading platform for Web3 builders to showcase innovative
                decentralized applications and connect with early adopters.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center hover:text-[#FFDF00] transition-all duration-300"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[#FFDF00] transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[#FFDF00] transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[#FFDF00] transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[#FFDF00] transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="py-6 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              © {new Date().getFullYear()} Discover. All rights reserved. Built
              with ❤️ for Web3.
            </p>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:text-[#FFDF00] transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="text-sm font-semibold uppercase tracking-wide">
                Back to Top
              </span>
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
