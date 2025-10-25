"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type Theme = "dark" | "light" | "system";

export default function SettingsPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [communityNews, setCommunityNews] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // In a real app, this would save to localStorage and update the document
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-dark py-12 px-4">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#FFDF00] transition-colors mb-6 text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFDF00]/20 to-amber-500/20 flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-[#FFDF00]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase">
                Settings
              </h1>
              <p className="text-white/60 text-sm md:text-base mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Theme Settings */}
          <section className="card-dark p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-[#FFDF00]" />
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase">
                Appearance
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-white mb-4">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {/* Dark Theme */}
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-[#FFDF00] bg-[#FFDF00]/10"
                        : "border-white/10 bg-dark-lighter hover:border-white/20"
                    }`}
                  >
                    <Moon className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-sm font-bold text-white uppercase">
                      Dark
                    </div>
                    {theme === "dark" && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-[#FFDF00]" />
                      </div>
                    )}
                  </button>

                  {/* Light Theme */}
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      theme === "light"
                        ? "border-[#FFDF00] bg-[#FFDF00]/10"
                        : "border-white/10 bg-dark-lighter hover:border-white/20"
                    }`}
                  >
                    <Sun className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-sm font-bold text-white uppercase">
                      Light
                    </div>
                    {theme === "light" && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-[#FFDF00]" />
                      </div>
                    )}
                  </button>

                  {/* System Theme */}
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      theme === "system"
                        ? "border-[#FFDF00] bg-[#FFDF00]/10"
                        : "border-white/10 bg-dark-lighter hover:border-white/20"
                    }`}
                  >
                    <Monitor className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-sm font-bold text-white uppercase">
                      System
                    </div>
                    {theme === "system" && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-[#FFDF00]" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-white/60 text-sm">
                Currently using: <strong className="text-[#FFDF00]">Dark Theme</strong>
              </p>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="card-dark p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#FFDF00]" />
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase">
                Notifications
              </h2>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-white">
                    Email Notifications
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Receive email updates about your account
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    emailNotifications ? "bg-[#FFDF00]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-dark rounded-full transition-transform ${
                      emailNotifications ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Project Updates */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-white">
                    Project Updates
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Get notified when your projects are reviewed
                  </div>
                </div>
                <button
                  onClick={() => setProjectUpdates(!projectUpdates)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    projectUpdates ? "bg-[#FFDF00]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-dark rounded-full transition-transform ${
                      projectUpdates ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Community News */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-white">
                    Community News
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Stay updated with Web3 community highlights
                  </div>
                </div>
                <button
                  onClick={() => setCommunityNews(!communityNews)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    communityNews ? "bg-[#FFDF00]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-dark rounded-full transition-transform ${
                      communityNews ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="card-dark p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#FFDF00]" />
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase">
                Account
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-white/60 mb-2">
                  Email
                </label>
                <div className="text-base text-white">{user?.email || "Not available"}</div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-white/60 mb-2">
                  Member Since
                </label>
                <div className="text-base text-white">January 2025</div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border-2 border-red-500/50 text-red-400 font-bold uppercase text-sm tracking-wider rounded-lg hover:bg-red-500/20 transition-all"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="card-dark p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#FFDF00]" />
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase">
                Privacy & Security
              </h2>
            </div>

            <div className="space-y-4">
              <Link
                href="/privacy"
                className="flex items-center justify-between p-4 rounded-lg bg-dark-lighter hover:bg-white/5 transition-colors group"
              >
                <span className="text-base text-white group-hover:text-[#FFDF00] transition-colors">
                  Privacy Policy
                </span>
                <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-[#FFDF00] rotate-180 transition-colors" />
              </Link>

              <Link
                href="/terms"
                className="flex items-center justify-between p-4 rounded-lg bg-dark-lighter hover:bg-white/5 transition-colors group"
              >
                <span className="text-base text-white group-hover:text-[#FFDF00] transition-colors">
                  Terms of Service
                </span>
                <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-[#FFDF00] rotate-180 transition-colors" />
              </Link>

              <Link
                href="/cookie-policy"
                className="flex items-center justify-between p-4 rounded-lg bg-dark-lighter hover:bg-white/5 transition-colors group"
              >
                <span className="text-base text-white group-hover:text-[#FFDF00] transition-colors">
                  Cookie Policy
                </span>
                <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-[#FFDF00] rotate-180 transition-colors" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
