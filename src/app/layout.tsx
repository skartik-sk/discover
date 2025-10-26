import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { RainbowProvider } from "@/components/providers/rainbow-provider";
import { SkipLink } from "@/components/accessibility/skip-link";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { DarkHeader } from "@/components/layout/header-dark";
import { DarkFooter } from "@/components/layout/footer-dark";
import { CursorEffects } from "@/components/CursorEffects";
import { AnimatedBackground } from "@/components/AnimatedBackground";

// Cabinet Grotesk alternative - Space Grotesk is similar and available on Google Fonts
// Configured with weights matching Figma specs: 500, 700 (800/900 will fall back to 700)
const cabinetGrotesk = Space_Grotesk({
  variable: "--font-cabinet-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Discover - Web3 Innovation Platform | Showcase Your Projects",
  description:
    "The leading platform for Web3 builders to showcase innovative decentralized applications. Discover DeFi protocols, NFT projects, DAOs, and blockchain solutions.",
  keywords: [
    "web3",
    "blockchain",
    "defi",
    "nft",
    "dao",
    "crypto",
    "decentralized apps",
    "smart contracts",
    "ethereum",
    "web3 projects",
    "blockchain innovation",
    "cryptocurrency",
    "web3 showcase",
  ],
  authors: [{ name: "Discover Platform" }],
  creator: "Discover Team",
  publisher: "Discover Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://discover-web3.com",
    title: "Discover - Web3 Innovation Platform",
    description:
      "Showcase and discover cutting-edge Web3 projects. Connect with builders, investors, and users in the decentralized ecosystem.",
    siteName: "Discover",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Discover - Web3 Innovation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover - Web3 Innovation Platform",
    description:
      "Showcase and discover cutting-edge Web3 projects. Connect with builders, investors, and users.",
    creator: "@discoverWeb3",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://discover-web3.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cabinetGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SkipLink />
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <RainbowProvider>
                <CursorEffects />
                <AnimatedBackground />
                <DarkHeader />
                <main
                  id="main-content"
                  className="flex-1 relative z-10"
                  role="main"
                >
                  {children}
                </main>
                <DarkFooter />
                <AccessibilityToolbar />
              </RainbowProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
