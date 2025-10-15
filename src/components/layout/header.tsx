'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  PlusCircle,
  User,
  Settings,
  LogOut,
  Rocket,
  Trophy,
  Star,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
export function Header() {
  const { user, session, loading, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`showcase-nav transition-all duration-300 ${isScrolled ? 'shadow-elevation-3 bg-background/98' : 'shadow-elevation-1 bg-background/95'}`}>
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Enhanced Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"> */}
            <img
              src="/logo.png" alt="Discover Logo"
              className="h-10 object-contain"
            />
          {/* </div> */}
        </Link>

        {/* Enhanced Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="showcase-nav-link px-4 py-2">
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white border-2 border-gray-200 shadow-elevation-3 rounded-xl">
                <div className="grid gap-3 p-6 w-[400px] bg-white">
                  <NavigationMenuLink asChild>
                    <Link href="/projects" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <Search className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-primary">All Projects</div>
                        <div className="text-sm text-gray-600">Browse all creative work</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/categories/design" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-primary">Design</div>
                        <div className="text-sm text-gray-600">UI/UX & Graphic Design</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/categories/development" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-primary">Development</div>
                        <div className="text-sm text-gray-600">Web & Mobile Apps</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              {/* <Link href="/submit"  passHref> */}
                <NavigationMenuLink href='/submit' className="showcase-btn px-5 py-2 text-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit Your Work
                </NavigationMenuLink>
              {/* </Link> */}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Enhanced Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Wallet Connect */}
          <div className="hidden lg:block">
            <WalletConnectButton />
          </div>

          {/* User menu */}
          {loading ? (
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.user_metadata?.full_name || ''} />
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl border-2 border-gray-200 shadow-elevation-3 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 bg-white">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
                      Creator
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem asChild className="rounded-xl p-3 m-1 hover:bg-primary/10 cursor-pointer bg-white">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3 m-1 hover:bg-primary/10 cursor-pointer bg-white">
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 m-1 hover:bg-red-50 text-red-600 cursor-pointer bg-white">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" asChild className="showcase-nav-link px-4 py-2">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="showcase-btn px-5 py-2 text-sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Enhanced Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className={`md:hidden h-10 w-10 rounded-xl transition-colors duration-200 ${
              isMobileMenuOpen ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background/98 backdrop-blur-xl md:hidden mobile-menu">
          <nav className="container-custom py-6 space-y-2" role="navigation" aria-label="Mobile navigation">
            <div className="space-y-1">
              <Link
                href="/projects"
                className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </div>
                <span className="font-medium">All Projects</span>
              </Link>

              <Link
                href="/categories/design"
                className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="font-medium">Design</span>
              </Link>

              <Link
                href="/categories/development"
                className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <Star className="h-5 w-5" />
                </div>
                <span className="font-medium">Development</span>
              </Link>

              <Link
                href="/submit"
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent/70 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <span className="font-medium">Submit Your Work</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="px-4 pb-4">
                <WalletConnectButton />
              </div>

              {session ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-xl border-2 hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full showcase-btn rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}