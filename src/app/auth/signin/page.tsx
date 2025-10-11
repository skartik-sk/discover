'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowRight,
  Wallet,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Rocket,
  Github,
  Twitter,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/lib/web3'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })
  const router = useRouter()

  const { walletState, availableWallets, connectWallet } = useWallet()

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    return ''
  }

  // Real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched.email) {
      setFormErrors(prev => ({ ...prev, email: validateEmail(value) }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (touched.password) {
      setFormErrors(prev => ({ ...prev, password: validatePassword(value) }))
    }
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))

    if (field === 'email') {
      setFormErrors(prev => ({ ...prev, email: validateEmail(email) }))
    } else if (field === 'password') {
      setFormErrors(prev => ({ ...prev, password: validatePassword(password) }))
    }
  }

  const isFormValid = () => {
    return !formErrors.email && !formErrors.password && email && password
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Touch all fields to show validation errors
    setTouched({ email: true, password: true })

    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setFormErrors({
      email: emailError,
      password: passwordError
    })

    if (emailError || passwordError) {
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Simulate authentication error for demo
      if (email === 'demo@example.com' && password === 'wrongpassword') {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  }

  const handleWalletConnect = async (walletId: string) => {
    const success = await connectWallet(walletId)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Failed to connect wallet. Please try again.')
    }
  }

  return (
    <div className="min-h-screen showcase-theme">
      <section className="showcase-hero section-padding-xs lg:section-padding flex items-center">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
        <div className="text-center">
         
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue showcasing Web3 innovations</p>
        </div>

        <Card className="showcase-project-card shadow-elevation-3 my-5">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your account to manage projects and connect with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`showcase-input h-12 ${
                    formErrors.email && touched.email
                      ? 'border-red-500 focus:border-red-500'
                      : touched.email && !formErrors.email
                      ? 'border-green-500 focus:border-green-500'
                      : ''
                  }`}
                  aria-invalid={formErrors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={formErrors.email && touched.email ? 'email-error' : undefined}
                />
                {formErrors.email && touched.email && (
                  <p id="email-error" className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    required
                    className={`showcase-input h-12 pr-10 ${
                      formErrors.password && touched.password
                        ? 'border-red-500 focus:border-red-500'
                        : touched.password && !formErrors.password
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                    aria-invalid={formErrors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={formErrors.password && touched.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && touched.password && (
                  <p id="password-error" className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold showcase-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="showcase-btn-outline border-2 h-11">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="showcase-btn-outline border-2 h-11">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">Connect with Web3 wallet</p>
              <Button
                variant="outline"
                className="showcase-btn-outline border-2 w-full h-11 justify-start"
                onClick={() => handleWalletConnect('metamask')}
                disabled={walletState.isConnecting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>

              {walletState.error && (
                <Alert className="border-red-200 bg-red-50">
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
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
          </div>
        </div>
          </div>
        </div>
      </section>
    </div>
  )
}