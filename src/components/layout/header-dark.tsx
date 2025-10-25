"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { FigmaButton } from "@/components/figma-ui/FigmaButton";

export function DarkHeader() {
  const { user, session, loading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".mobile-menu-container")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/categories", label: "Categories" },
    { href: "/submit", label: "Submit" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#151515]/95 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Discover Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  isActive(link.href)
                    ? "bg-[#FFDF00] text-[#151515]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {loading ? (
                <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
              ) : session ? (
                <>
                  <Link href="/dashboard">
                    <FigmaButton variant="ghost" size="sm">
                      Dashboard
                    </FigmaButton>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative h-10 w-10 rounded-lg hover:ring-2 ring-[#FFDF00] transition-all duration-300">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage
                            src={user?.user_metadata?.avatar_url || ""}
                            alt={user?.user_metadata?.full_name || ""}
                          />
                          <AvatarFallback className="bg-[#FFDF00] text-[#151515] font-black rounded-lg">
                            {user?.user_metadata?.full_name?.charAt(0) ||
                              user?.email?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-[#1B1B1B] border border-white/10"
                      align="end"
                    >
                      <DropdownMenuLabel className="p-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-bold text-white">
                            {user?.user_metadata?.full_name || user?.email}
                          </p>
                          <p className="text-xs text-[#818181] truncate">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-white/10 m-1 rounded-lg"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center w-full px-3 py-2"
                        >
                          <User className="mr-3 h-4 w-4 text-[#FFDF00]" />
                          <span className="font-semibold text-white">
                            Dashboard
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-white/10 m-1 rounded-lg"
                      >
                        <Link
                          href="/settings"
                          className="flex items-center w-full px-3 py-2"
                        >
                          <Settings className="mr-3 h-4 w-4 text-[#FFDF00]" />
                          <span className="font-semibold text-white">
                            Settings
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer hover:bg-red-500/10 text-red-500 m-1 rounded-lg px-3 py-2"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-semibold">Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/signin">
                    <FigmaButton variant="secondary" size="sm">
                      Sign In
                    </FigmaButton>
                  </Link>
                  <Link href="/auth/signup">
                    <FigmaButton variant="primary" size="sm">
                      Sign Up
                    </FigmaButton>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isMobileMenuOpen
                  ? "bg-[#FFDF00] text-[#151515]"
                  : "bg-white/10 text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mobile-menu-container bg-[#1B1B1B] border-t border-white/10">
          <nav className="container-custom py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                  isActive(link.href)
                    ? "bg-[#FFDF00] text-[#151515]"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-[#FFDF00]" />
                    <span className="font-semibold">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-6 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FigmaButton
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Sign In
                    </FigmaButton>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FigmaButton variant="primary" size="md" className="w-full">
                      Sign Up
                    </FigmaButton>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
