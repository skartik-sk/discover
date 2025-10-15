'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Zap,
  Rocket,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 12.5
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5
    return strength
  }

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/\d/.test(password)) return 'Password must contain at least one number'
    return ''
  }

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== password) return 'Passwords do not match'
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
    const strength = calculatePasswordStrength(value)
    setPasswordStrength(strength)
    if (touched.password) {
      setFormErrors(prev => ({ ...prev, password: validatePassword(value) }))
    }
    if (touched.confirmPassword && confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, value) }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    if (touched.confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, password) }))
    }
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (field === 'email') {
      setFormErrors(prev => ({ ...prev, email: validateEmail(email) }))
    } else if (field === 'password') {
      setFormErrors(prev => ({ ...prev, password: validatePassword(password) }))
    } else if (field === 'confirmPassword') {
      setFormErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, password) }))
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500'
    if (strength < 60) return 'bg-yellow-500'
    if (strength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    }

    setFormErrors(errors)
    setTouched({ email: true, password: true, confirmPassword: true })

    // Check if there are any errors
    if (errors.email || errors.password || errors.confirmPassword) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Sign up with Supabase
      const { error } = await signUpWithEmail(email, password, {
        display_name: email.split('@')[0],
        username: email.split('@')[0]
      })

      if (error) {
        setError(error || 'Failed to create account. Please try again.')
      } else {
        setIsSuccess(true)
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full showcase-project-card shadow-elevation-2">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Account Created!</h3>
            <p className="text-muted-foreground mb-4">
              Welcome to the Web3 Project Showcase. Redirecting to your dashboard...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="animate-float inline-flex items-center mb-6">
              <Badge className="showcase-badge animate-pulse-slow">
                <Rocket className="w-3 h-3 mr-2" />
                Join Web3 Showcase
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient-primary mb-4">
              Create Your Account
            </h1>
            <p className="text-lg text-gray-600">
              Join thousands of Web3 enthusiasts and showcase your innovative projects
            </p>
          </div>

          {/* Signup Form */}
          <Card className="showcase-project-card shadow-elevation-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sign Up
              </CardTitle>
              <CardDescription>
                Create your account to start submitting and discovering Web3 projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur('email')}
                      className={`showcase-input pl-10 ${
                        formErrors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.email && touched.email && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => handleBlur('password')}
                      className={`showcase-input pr-10 ${
                        formErrors.password ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {formErrors.password && touched.password && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {formErrors.password}
                    </p>
                  )}

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 30 ? 'text-red-500' :
                          passwordStrength < 60 ? 'text-yellow-500' :
                          passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`showcase-input pr-10 ${
                        formErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {formErrors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full showcase-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 showcase-btn-outline"
                  onClick={() => signInWithGoogle()}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                <span>Fast Setup</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Rocket className="h-4 w-4 text-primary" />
                <span>Web3 Ready</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}