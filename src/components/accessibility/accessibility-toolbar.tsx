'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  EyeOff,
  Type,
  Palette,
  Accessibility,
  Keyboard,
  Monitor,
  Smartphone,
  Info
} from 'lucide-react'
import { runAccessibilityAudit } from '@/lib/accessibility'

export function AccessibilityToolbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [auditResults, setAuditResults] = useState<any>(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  useEffect(() => {
    // Check user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches

    setReducedMotion(prefersReducedMotion)
    setHighContrast(prefersHighContrast)

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches)

    motionQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  useEffect(() => {
    // Apply accessibility preferences
    const root = document.documentElement

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (largeText) {
      root.classList.add('large-text')
      root.style.fontSize = '18px'
    } else {
      root.classList.remove('large-text')
      root.style.fontSize = '16px'
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
  }, [highContrast, largeText, reducedMotion])

  const runAudit = () => {
    const results = runAccessibilityAudit()
    setAuditResults(results)
  }

  const keyboardShortcuts = [
    { key: 'Alt + A', description: 'Toggle accessibility toolbar' },
    { key: 'Alt + H', description: 'Toggle high contrast' },
    { key: 'Alt + L', description: 'Toggle large text' },
    { key: 'Alt + M', description: 'Toggle reduced motion' },
    { key: 'Alt + K', description: 'Show keyboard shortcuts' },
    { key: 'Tab', description: 'Navigate forward' },
    { key: 'Shift + Tab', description: 'Navigate backward' },
    { key: 'Enter/Space', description: 'Activate element' },
    { key: 'Escape', description: 'Close dialogs/modals' }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'a':
          case 'A':
            e.preventDefault()
            setIsVisible(!isVisible)
            break
          case 'h':
          case 'H':
            e.preventDefault()
            setHighContrast(!highContrast)
            break
          case 'l':
          case 'L':
            e.preventDefault()
            setLargeText(!largeText)
            break
          case 'm':
          case 'M':
            e.preventDefault()
            setReducedMotion(!reducedMotion)
            break
          case 'k':
          case 'K':
            e.preventDefault()
            setShowKeyboardHelp(!showKeyboardHelp)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, highContrast, largeText, reducedMotion, showKeyboardHelp])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Poor'
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className={`fixed bottom-4 right-4 z-50 ${isVisible ? 'bg-primary text-white' : ''}`}
        aria-label="Toggle accessibility toolbar (Alt+A)"
      >
        <Accessibility className="h-4 w-4" />
      </Button>

      {/* Main Toolbar */}
      {isVisible && (
        <Card className="fixed bottom-16 right-4 z-50 w-80 max-h-96 overflow-y-auto shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibility Tools
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Alt + A to toggle
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Visual Adjustments */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Visual Adjustments</h4>

              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Button
                  variant={highContrast ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHighContrast(!highContrast)}
                  aria-label="Toggle high contrast mode"
                >
                  {highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Large Text</span>
                <Button
                  variant={largeText ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLargeText(!largeText)}
                  aria-label="Toggle large text"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Reduced Motion</span>
                <Button
                  variant={reducedMotion ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  aria-label="Toggle reduced motion"
                >
                  {reducedMotion ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Audit Results */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Accessibility Audit</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runAudit}
                  aria-label="Run accessibility audit"
                >
                  Run Audit
                </Button>
              </div>

              {auditResults && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score:</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(auditResults.score)}`}>
                        {auditResults.score}/100
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getScoreBadge(auditResults.score)}
                      </Badge>
                    </div>
                  </div>

                  {auditResults.issues.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Issues Found:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {auditResults.issues.slice(0, 3).map((issue: string, index: number) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-500">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                        {auditResults.issues.length > 3 && (
                          <li className="text-muted-foreground">
                            +{auditResults.issues.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                  aria-label="Show keyboard shortcuts"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </div>

              {showKeyboardHelp && (
                <div className="space-y-1">
                  {keyboardShortcuts.slice(0, 5).map((shortcut, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="font-mono bg-muted px-1 rounded">
                        {shortcut.key}
                      </span>
                      <span className="text-muted-foreground">
                        {shortcut.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Device Info</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Screen Reader: {navigator.userAgent.includes('JAWS') || navigator.userAgent.includes('NVDA') ? 'Detected' : 'Not detected'}</div>
                <div>Touch Device: {('ontouchstart' in window) ? 'Yes' : 'No'}</div>
                <div>Reduced Motion: {reducedMotion ? 'Preferred' : 'Not preferred'}</div>
                <div>High Contrast: {highContrast ? 'Preferred' : 'Not preferred'}</div>
              </div>
            </div>

            {/* Help */}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  alert('For more accessibility help, contact our support team at support@web3projecthunt.com')
                }}
              >
                <Info className="h-3 w-3 mr-1" />
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {shortcut.key}
                    </span>
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowKeyboardHelp(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}