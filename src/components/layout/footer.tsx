import Link from 'next/link'
import { Rocket, Github, Twitter, MessageCircle, Mail, Shield, Zap, Globe, Code, Cpu, Database } from 'lucide-react'

export function Footer() {
  return (
    <footer className="showcase-footer bg-gradient-to-br from-gray-50 to-white border-t-2 border-gray-100">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="flex items-center space-x-3 group">
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"> */}
            <img
              src="/logo.png" alt="Discover Logo"
              className="h-10 object-contain"
            />
          {/* </div> */}
        </Link>
            <p className="text-base text-gray-600 leading-relaxed max-w-md">
              Discover, test, and discover innovative Web3 projects and protocols from talented blockchain developers worldwide. Build your Web3 portfolio and grow your ecosystem.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group">
                <Twitter className="h-5 w-5 group-hover:scale-110" />
              </Link>
              <Link href="https://discord.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                <MessageCircle className="h-5 w-5 group-hover:scale-110" />
              </Link>
              <Link href="https://github.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-300 group">
                <Github className="h-5 w-5 group-hover:scale-110" />
              </Link>
              <Link href="mailto:contact@discover.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 group">
                <Mail className="h-5 w-5 group-hover:scale-110" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/categories/defi" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  DeFi Protocols
                </Link>
              </li>
              <li>
                <Link href="/categories/nft" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  NFT Projects
                </Link>
              </li>
              <li>
                <Link href="/categories/gaming" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Web3 Gaming
                </Link>
              </li>
              <li>
                <Link href="/categories/dao" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  DAO Platforms
                </Link>
              </li>
            </ul>
          </div>

          {/* Builders */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display mb-6">For Builders</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/submit" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Developer Guidelines
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Get Testing Feedback
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Project Analytics
                </Link>
              </li>
              <li>
                <Link href="/grants" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Grant Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display mb-6">Community</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Web3 Insights
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Weekly Digest
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Builder Discord
                </Link>
              </li>
              <li>
                <Link href="/ambassadors" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Brand Ambassadors
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Web3 Events
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2024 Discover. All rights reserved. Built with ❤️ for the Web3 community.
            </p>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Web3 Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Blockchain</span>
              </div>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookie-policy" className="text-gray-600 hover:text-primary transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}