"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signInWithEmail(email, password);
      if (signInError) {
        setError(signInError);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signInWithGoogle();
      if (signInError) {
        setError("Failed to sign in with Google. Please try again.");
      }
      // Redirect will be handled by auth state change
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Google sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-primary mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            <span className="uppercase text-xs font-bold tracking-wider">
              Back to Home
            </span>
          </Link>

          <div className="inline-flex items-center mb-6">
            <div className="badge-primary">
              <Lock className="w-4 h-4" />
              <span>Secure Login</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-4">
            Sign In
          </h1>
          <p className="section-description">
            Access your account to manage projects
          </p>
        </div>

        {/* Sign In Card */}
        <div className="card-dark p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3">
                Email Address <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark pl-12"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3">
                Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pl-12"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Sign In with Email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-dark-lighter text-gray-400 uppercase tracking-wider font-bold">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-dark-lighter border-2 border-white/10 text-white font-bold uppercase tracking-wider rounded-lg hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:text-primary/80 font-bold uppercase text-xs tracking-wider transition-colors"
            >
              Sign Up
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors uppercase tracking-wider"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors uppercase tracking-wider"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              href="/cookie-policy"
              className="hover:text-primary transition-colors uppercase tracking-wider"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
