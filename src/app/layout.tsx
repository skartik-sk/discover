import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { RainbowProvider } from "@/components/providers/rainbow-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/accessibility/skip-link";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Discover - Web3 Projects & Innovations Platform",
  description: "Discover and explore innovative Web3 projects. Submit your decentralized applications and connect with the blockchain community.",
  keywords: ["web3 platform", "blockchain projects", "defi", "nft", "crypto", "decentralized applications", "blockchain innovation"],
  authors: [{ name: "Discover Team" }],
  openGraph: {
    title: "Discover - Web3 Projects Platform",
    description: "Discover and explore innovative Web3 projects. Submit your decentralized applications and connect with the blockchain community.",
    type: "website",
    url: "https://discover.com",
    siteName: "Discover",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover - Web3 Projects Platform",
    description: "Discover and explore innovative Web3 projects. Submit your decentralized applications and connect with the blockchain community.",
    creator: "@discover",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://discover.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <SkipLink />
        <ErrorBoundary>
          <AuthSessionProvider>
            <RainbowProvider>
              <Header />
              <main id="main-content" className="flex-1" role="main">
                {children}
              </main>
              <Footer />
              <AccessibilityToolbar />
            </RainbowProvider>
          </AuthSessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
