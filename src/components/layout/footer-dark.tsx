"use client";

import Link from "next/link";
import { Mail, Twitter, Github, Linkedin, ArrowUp } from "lucide-react";
import { FigmaButton } from "@/components/figma-ui/FigmaButton";
import { FigmaInput } from "@/components/figma-ui/FigmaInput";
import { useState } from "react";

export function DarkFooter() {
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
    <footer className="relative bg-[#1B1B1B] border-t border-white/10">
      <div className="container-custom">
        {/* Newsletter Section */}
        <div className="py-16 md:py-20 border-b border-white/10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight">
              Subscribe To Our{" "}
              <span className="text-[#FFDF00]">Newsletter</span>
            </h3>
            <p className="text-lg text-[#818181] max-w-2xl mx-auto">
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
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-[#FFDF00] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="text-[#151515] text-xl font-black">D</span>
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tight">
                  Discover
                </span>
              </Link>
              <p className="text-[#818181] max-w-xs leading-relaxed text-sm">
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
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#818181] hover:text-[#FFDF00] hover:bg-white/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#818181] hover:text-[#FFDF00] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#818181] hover:text-[#FFDF00] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#818181] hover:text-[#FFDF00] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#818181] hover:text-[#FFDF00] transition-colors duration-300"
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
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#818181]">
              © {new Date().getFullYear()} Discover. All rights reserved. Built
              with ❤️ for Web3.
            </p>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#818181] hover:text-[#FFDF00] transition-all duration-300"
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
