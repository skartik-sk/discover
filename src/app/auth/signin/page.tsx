"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Wallet, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/web3";
import { useAuth } from "@/contexts/auth-context";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { walletState, connectWallet } = useWallet();
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError("Failed to sign in with Google. Please try again.");
      }
      // Redirect will be handled by auth state change in context
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error || "Failed to sign in with email. Please try again.");
      }
      // Redirect will be handled by auth state change in context
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async (walletId: string) => {
    const success = await connectWallet(walletId);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen showcase-theme">
      <section className="showcase-hero section-padding-xs lg:section-padding flex items-center">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue showcasing Web3 innovations
              </p>
            </div>

            <Card className="showcase-project-card shadow-elevation-3 my-5">
              <CardHeader>
                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Access your account to manage projects and connect with the
                  community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email/Password Sign In */}
                <form onSubmit={handleEmailSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="showcase-input w-full"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="showcase-input w-full"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold showcase-btn disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Sign in with Email
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 text-base font-semibold showcase-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign in with Google
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Connect with Web3 wallet
                  </p>
                  <Button
                    variant="outline"
                    className="showcase-btn-outline border-2 w-full h-11 justify-start"
                    onClick={() => handleWalletConnect("metamask")}
                    disabled={walletState.isConnecting}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {walletState.isConnecting
                      ? "Connecting..."
                      : "Connect Wallet"}
                  </Button>

                  {walletState.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-700">
                        {walletState.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-4 text-xs text-gray-500">
                <Link href="/privacy" className="hover:text-gray-700">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-700">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
