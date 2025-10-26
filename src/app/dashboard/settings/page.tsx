"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Link as LinkIcon,
  Shield,
  Bell,
  Moon,
  Sun,
  Twitter,
  Github,
  Linkedin,
  Globe,
  Mail,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
}

export default function SettingsPage() {
  const { user, session, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Settings state
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    bio: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        display_name: data.display_name || "",
        username: data.username || "",
        bio: data.bio || "",
        website: data.website || "",
        twitter: data.twitter || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: formData.display_name,
          username: formData.username,
          bio: formData.bio,
          website: formData.website,
          twitter: formData.twitter,
          github: formData.github,
          linkedin: formData.linkedin,
        })
        .eq("id", user?.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mesh bg-orbs pb-20">
      <div className="container-custom page-header-spaced content-safe">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6"
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-foreground mb-4">
            Settings
          </h1>
          <p className="text-muted text-base md:text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="card-dark sticky top-24">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-all">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 dark:hover:bg-white/5 hover:text-foreground font-medium transition-all">
                    <Palette className="h-5 w-5" />
                    <span>Appearance</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 dark:hover:bg-white/5 hover:text-foreground font-medium transition-all">
                    <LinkIcon className="h-5 w-5" />
                    <span>Connections</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 dark:hover:bg-white/5 hover:text-foreground font-medium transition-all">
                    <Shield className="h-5 w-5" />
                    <span>Privacy</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 dark:hover:bg-white/5 hover:text-foreground font-medium transition-all">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase text-foreground">
                  <User className="h-6 w-6 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-muted">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-foreground font-bold uppercase text-sm mb-2 block">
                      Display Name
                    </Label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          display_name: e.target.value,
                        }))
                      }
                      className="input-dark"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-bold uppercase text-sm mb-2 block">
                      Username
                    </Label>
                    <Input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="input-dark"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-foreground font-bold uppercase text-sm mb-2 block">
                    Bio
                  </Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="input-dark resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Connections */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase text-foreground">
                  <LinkIcon className="h-6 w-6 text-primary" />
                  Social Connections
                </CardTitle>
                <CardDescription className="text-muted">
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-foreground font-bold uppercase text-sm mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="input-dark"
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>

                <div>
                  <Label className="text-foreground font-bold uppercase text-sm mb-2 flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    className="input-dark"
                    placeholder="https://twitter.com/username"
                    type="url"
                  />
                </div>

                <div>
                  <Label className="text-foreground font-bold uppercase text-sm mb-2 flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    value={formData.github}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        github: e.target.value,
                      }))
                    }
                    className="input-dark"
                    placeholder="https://github.com/username"
                    type="url"
                  />
                </div>

                <div>
                  <Label className="text-foreground font-bold uppercase text-sm mb-2 flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        linkedin: e.target.value,
                      }))
                    }
                    className="input-dark"
                    placeholder="https://linkedin.com/in/username"
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase text-foreground">
                  <Palette className="h-6 w-6 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-muted">
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 border border-border">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="text-foreground font-bold text-sm">
                        Dark Mode
                      </p>
                      <p className="text-muted text-xs">
                        Currently using {theme} theme
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 border border-border">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      Auto-save
                    </p>
                    <p className="text-muted text-xs">
                      Automatically save your changes
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase text-foreground">
                  <Bell className="h-6 w-6 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-muted">
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 border border-border">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      Email Notifications
                    </p>
                    <p className="text-muted text-xs">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 border border-border">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      Project Updates
                    </p>
                    <p className="text-muted text-xs">
                      Get notified about your project activity
                    </p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 border border-border">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      Weekly Digest
                    </p>
                    <p className="text-muted text-xs">
                      Receive weekly summary of activities
                    </p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="btn-outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                className="btn-primary"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
