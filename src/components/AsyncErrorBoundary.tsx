'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, WifiOff, Database, Clock } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  maxRetries?: number
  retryDelay?: number
}

interface State {
  hasError: boolean
  error?: Error
  errorType: 'network' | 'timeout' | 'database' | 'unknown' | 'parsing'
  retryCount: number
  isRetrying: boolean
}

class AsyncErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorType: 'unknown',
      retryCount: 0,
      isRetrying: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    let errorType: State['errorType'] = 'unknown'

    // Categorize error types based on error message
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      errorType = 'network'
    } else if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
      errorType = 'timeout'
    } else if (error.message.includes('database') || error.message.includes('SQL') || error.message.includes('connection')) {
      errorType = 'database'
    } else if (error.message.includes('JSON') || error.message.includes('parse')) {
      errorType = 'parsing'
    }

    return {
      hasError: true,
      error,
      errorType
    }
  }

  componentDidCatch(error: Error) {
    console.error('Async Error Boundary caught an error:', error)

    // Store async errors separately
    try {
      const errors = JSON.parse(localStorage.getItem('async_errors') || '[]')
      errors.push({
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorType: this.state.errorType,
        retryCount: this.state.retryCount,
        url: window.location.href
      })
      localStorage.setItem('async_errors', JSON.stringify(errors.slice(-20))) // Keep last 20 errors
    } catch (storageError) {
      console.warn('Failed to store async error in localStorage:', storageError)
    }

    // Custom error handling could be added here if needed
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState({
        isRetrying: true,
        retryCount: retryCount + 1
      })

      // Automatic retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)

      this.retryTimeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: undefined,
          errorType: 'unknown',
          isRetrying: false
        })
      }, delay)
    }
  }

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorType: 'unknown',
      retryCount: 0,
      isRetrying: false
    })
  }

  getErrorIcon = () => {
    switch (this.state.errorType) {
      case 'network':
        return <WifiOff className="w-8 h-8 text-red-600" />
      case 'timeout':
        return <Clock className="w-8 h-8 text-yellow-600" />
      case 'database':
        return <Database className="w-8 h-8 text-red-600" />
      default:
        return <AlertTriangle className="w-8 h-8 text-red-600" />
    }
  }

  getErrorTitle = () => {
    switch (this.state.errorType) {
      case 'network':
        return 'Connection Error'
      case 'timeout':
        return 'Request Timeout'
      case 'database':
        return 'Database Error'
      case 'parsing':
        return 'Data Error'
      default:
        return 'Something went wrong'
    }
  }

  getErrorMessage = () => {
    switch (this.state.errorType) {
      case 'network':
        return 'Unable to connect to our servers. Please check your internet connection and try again.'
      case 'timeout':
        return 'The request took too long to complete. Please try again.'
      case 'database':
        return 'We\'re having trouble accessing our database. Please try again in a moment.'
      case 'parsing':
        return 'We received some invalid data. Please refresh the page and try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  render() {
    const { children, fallback, maxRetries = 3 } = this.props
    const { hasError, error, errorType, retryCount, isRetrying } = this.state

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                {this.getErrorIcon()}
              </div>
              <CardTitle className="text-xl text-gray-900">
                {this.getErrorTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600 text-sm">
                {this.getErrorMessage()}
              </p>

              {process.env.NODE_ENV === 'development' && error && (
                <details className="text-left bg-gray-50 p-3 rounded text-xs">
                  <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <div className="text-gray-600">
                    <div className="mb-1">
                      <strong>Type:</strong> {errorType}
                    </div>
                    <div className="mb-1">
                      <strong>Message:</strong> {error.message}
                    </div>
                    <div>
                      <strong>Retries:</strong> {retryCount}/{maxRetries}
                    </div>
                  </div>
                </details>
              )}

              <div className="flex flex-col gap-2">
                {retryCount < maxRetries && !isRetrying && (
                  <Button
                    onClick={this.handleManualRetry}
                    className="w-full flex items-center gap-2"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again ({maxRetries - retryCount} attempts left)
                  </Button>
                )}

                {isRetrying && (
                  <div className="text-center text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Retrying... (Attempt {retryCount}/{maxRetries})
                    </div>
                  </div>
                )}

                {retryCount >= maxRetries && (
                  <Button
                    onClick={this.handleManualRetry}
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset and Try Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}

export default AsyncErrorBoundary