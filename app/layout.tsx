import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Discover - Curated Web3 Showcase",
  description: "The daily destination for the best new Web3 products. Curated, reviewed, and ranked by the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans text-body-text bg-main-bg`}
      >
        <div className="min-h-screen p-2 sm:p-3 md:p-4">
          <div className="w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2rem)] bg-main-bg border border-frame-border rounded-soft flex flex-col overflow-hidden">
            <Navbar />
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary-green">
              Skip to main content
            </a>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
