'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorId: Math.random().toString(36).substr(2, 9)
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Store error in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('react_errors') || '[]')
      errors.push({
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
          errorBoundary: errorInfo.errorBoundary?.name || 'Unknown'
        },
        userAgent: navigator.userAgent,
        url: window.location.href
      })
      localStorage.setItem('react_errors', JSON.stringify(errors.slice(-10))) // Keep last 10 errors
    } catch (storageError) {
      console.warn('Failed to store error in localStorage:', storageError)
    }

    // Custom error handling could be added here if needed

    // Update state with error info
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: Math.random().toString(36).substr(2, 9)
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state
    const subject = `Bug Report - Error ${errorId}`
    const body = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Error:
${error?.name}: ${error?.message}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

User Agent: ${navigator.userAgent}
`

    window.location.href = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                    <summary className="cursor-pointer font-semibold text-sm text-gray-700 mb-2">
                      Error Details (Development Mode)
                    </summary>
                    <div className="text-xs text-gray-600 space-y-2">
                      <div>
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                      <div>
                        <strong>Error:</strong> {this.state.error.name}: {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>

                <Button
                  onClick={this.handleReportBug}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Bug className="w-4 h-4" />
                  Report Bug
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                Error ID: {this.state.errorId}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary