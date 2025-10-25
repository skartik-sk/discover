'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function HeaderFigma() {
  const [activeNav, setActiveNav] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#151515] border-b border-white/10">
      <div className="max-w-[1240px] mx-auto px-4 md:px-[100px] h-[56px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-[120px] md:w-[150px] h-[37px] flex items-center">
            <span className="text-white font-bold text-lg md:text-xl">WPCone</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link 
            href="/" 
            className={`text-[20px] font-bold capitalize leading-[1.7] transition-colors ${
              activeNav === 'home' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('home')}
          >
            home
          </Link>
          <Link 
            href="/projects" 
            className={`text-[20px] font-medium capitalize leading-[1.7] transition-colors ${
              activeNav === 'plugins' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('plugins')}
          >
            plugins
          </Link>
          <Link 
            href="/categories" 
            className={`text-[20px] font-medium capitalize leading-[1.7] transition-colors ${
              activeNav === 'themes' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('themes')}
          >
            themes
          </Link>
          <Link 
            href="/projects" 
            className={`text-[20px] font-medium capitalize leading-[1.7] transition-colors ${
              activeNav === 'templates' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('templates')}
          >
            templates
          </Link>
          <Link 
            href="/projects" 
            className={`text-[20px] font-medium capitalize leading-[1.7] transition-colors ${
              activeNav === 'blog' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('blog')}
          >
            blog
          </Link>
          <Link 
            href="/submit" 
            className={`text-[20px] font-medium capitalize leading-[1.7] transition-colors ${
              activeNav === 'support' ? 'text-[#FFDF00]' : 'text-white hover:text-[#FFDF00]'
            }`}
            onClick={() => setActiveNav('support')}
          >
            support
          </Link>
        </nav>

        {/* Desktop Contact Button */}
        <Link 
          href="/submit" 
          className="hidden lg:block px-8 py-4 bg-[#FFDF00] text-[#151515] font-extrabold text-base uppercase rounded-lg hover:bg-[#FFDF00]/90 transition-all"
        >
          contact us
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#FFDF00] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[56px] left-0 right-0 bg-[#151515] border-b border-white/10 shadow-xl">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <Link 
              href="/" 
              className={`px-4 py-3 text-lg font-bold capitalize rounded-lg transition-colors ${
                activeNav === 'home' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('home'); setMobileMenuOpen(false); }}
            >
              home
            </Link>
            <Link 
              href="/projects" 
              className={`px-4 py-3 text-lg font-medium capitalize rounded-lg transition-colors ${
                activeNav === 'plugins' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('plugins'); setMobileMenuOpen(false); }}
            >
              plugins
            </Link>
            <Link 
              href="/categories" 
              className={`px-4 py-3 text-lg font-medium capitalize rounded-lg transition-colors ${
                activeNav === 'themes' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('themes'); setMobileMenuOpen(false); }}
            >
              themes
            </Link>
            <Link 
              href="/projects" 
              className={`px-4 py-3 text-lg font-medium capitalize rounded-lg transition-colors ${
                activeNav === 'templates' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('templates'); setMobileMenuOpen(false); }}
            >
              templates
            </Link>
            <Link 
              href="/projects" 
              className={`px-4 py-3 text-lg font-medium capitalize rounded-lg transition-colors ${
                activeNav === 'blog' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('blog'); setMobileMenuOpen(false); }}
            >
              blog
            </Link>
            <Link 
              href="/submit" 
              className={`px-4 py-3 text-lg font-medium capitalize rounded-lg transition-colors ${
                activeNav === 'support' ? 'bg-[#FFDF00] text-[#151515]' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => { setActiveNav('support'); setMobileMenuOpen(false); }}
            >
              support
            </Link>
            <Link 
              href="/submit" 
              className="px-4 py-3 bg-[#FFDF00] text-[#151515] font-extrabold text-center uppercase rounded-lg hover:bg-[#FFDF00]/90 transition-all mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
