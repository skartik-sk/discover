// Accessibility utilities for Web3 Project Hunt platform

export const accessibilityConfig = {
  // ARIA labels for common elements
  ariaLabels: {
    navigation: 'Main navigation',
    search: 'Search projects',
    walletConnect: 'Connect wallet',
    signIn: 'Sign in to your account',
    signUp: 'Create a new account',
    userMenu: 'User account menu',
    themeToggle: 'Toggle color theme',
    languageSelect: 'Select language',
    categoryFilter: 'Filter by category',
    sortBy: 'Sort projects by',
    viewMode: 'Toggle view mode',
    projectCard: (title: string) => `Project: ${title}`,
    reviewRating: (rating: number) => `Rating: ${rating} out of 5 stars`,
    nftReward: 'NFT reward for early testers',
    externalLink: (text: string) => `External link: ${text}`,
    close: 'Close dialog',
    open: 'Open dialog',
    skipToContent: 'Skip to main content',
    loading: 'Loading content',
    error: 'Error occurred',
    success: 'Action completed successfully'
  },

  // Keyboard navigation patterns
  keyboardNavigation: {
    focusableElements: [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ],
    trapFocus: true,
    restoreFocus: true
  },

  // Screen reader announcements
  announcements: {
    projectLoaded: 'Project details loaded',
    filterApplied: 'Filter applied',
    searchComplete: (count: number) => `${count} projects found`,
    reviewSubmitted: 'Review submitted successfully',
    nftMinted: 'NFT minted successfully',
    walletConnected: 'Wallet connected successfully',
    walletDisconnected: 'Wallet disconnected'
  },

  // Color contrast ratios (WCAG AA compliant)
  colorContrast: {
    minimum: 4.5, // 7:1 for AAA
    largeText: 3.0, // 4.5:1 for AAA
    interactive: 3.0 // 4.5:1 for AAA
  }
}

// Utility functions for accessibility
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    accessibilityConfig.keyboardNavigation.focusableElements.join(', ')
  ) as NodeListOf<HTMLElement>

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  firstElement.focus()

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

export const validateColorContrast = (foreground: string, background: string): number => {
  // This is a simplified contrast calculation
  // In a real app, you'd use a proper contrast calculation library
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0

    const [r, g, b] = rgb.map(Number)
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export const checkAccessibility = (element: HTMLElement): {
  passed: boolean
  issues: string[]
} => {
  const issues: string[] = []

  // Check for alt text on images
  const images = element.querySelectorAll('img')
  images.forEach((img, index) => {
    if (!img.alt) {
      issues.push(`Image ${index + 1} missing alt text`)
    }
  })

  // Check for proper heading structure
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))

  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      issues.push('Heading levels skip numbers (e.g., h1 to h3)')
      break
    }
  }

  // Check for form labels
  const inputs = element.querySelectorAll('input, select, textarea')
  inputs.forEach((input, index) => {
    const hasLabel = element.querySelector(`label[for="${input.id}"]`) ||
                     input.getAttribute('aria-label') ||
                     input.getAttribute('aria-labelledby')

    if (!hasLabel) {
      issues.push(`Form input ${index + 1} missing label`)
    }
  })

  // Check for ARIA attributes
  const buttons = element.querySelectorAll('button')
  buttons.forEach((button, index) => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      issues.push(`Button ${index + 1} missing accessible name`)
    }
  })

  return {
    passed: issues.length === 0,
    issues
  }
}

// Enhanced focus management
export const manageFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    accessibilityConfig.keyboardNavigation.focusableElements.join(', ')
  ) as NodeListOf<HTMLElement>

  const addFocusStyles = () => {
    const style = document.createElement('style')
    style.id = 'focus-styles'
    style.textContent = `
      *:focus {
        outline: 2px solid #f97316 !important;
        outline-offset: 2px !important;
      }
      *:focus:not(:focus-visible) {
        outline: 2px solid transparent !important;
      }
      *:focus-visible {
        outline: 2px solid #f97316 !important;
        outline-offset: 2px !important;
      }
    `
    document.head.appendChild(style)
  }

  addFocusStyles()

  return {
    focusableElements,
    firstFocusable: focusableElements[0],
    lastFocusable: focusableElements[focusableElements.length - 1]
  }
}

// Skip link functionality
export const createSkipLink = (): HTMLElement => {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50'
  skipLink.setAttribute('aria-label', accessibilityConfig.ariaLabels.skipToContent)

  return skipLink
}

// Reduced motion support
export const checkReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast mode support
export const checkHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Screen reader detection
export const checkScreenReader = (): boolean => {
  // This is a heuristic approach
  return navigator.userAgent.includes('JAWS') ||
         navigator.userAgent.includes('NVDA') ||
         navigator.userAgent.includes('VoiceOver') ||
         window.speechSynthesis !== undefined
}

// Touch device detection
export const checkTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Accessibility testing utilities
export const runAccessibilityAudit = (): {
  score: number
  issues: string[]
  recommendations: string[]
} => {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check basic HTML structure
  if (!document.querySelector('main')) {
    issues.push('Missing main landmark')
    recommendations.push('Add <main> element for primary content')
  }

  if (!document.querySelector('h1')) {
    issues.push('Missing h1 heading')
    recommendations.push('Add a descriptive h1 heading')
  }

  // Check for skip link
  if (!document.querySelector('a[href^="#main"]')) {
    issues.push('Missing skip link')
    recommendations.push('Add skip link for keyboard navigation')
  }

  // Check for language attribute
  const html = document.documentElement
  if (!html.getAttribute('lang')) {
    issues.push('Missing language attribute')
    recommendations.push('Add lang attribute to html element')
  }

  // Check for page title
  if (!document.title || document.title.length === 0) {
    issues.push('Missing page title')
    recommendations.push('Add descriptive page title')
  }

  // Check for color contrast (simplified)
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
  let contrastIssues = 0

  textElements.forEach(element => {
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const backgroundColor = styles.backgroundColor

    if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = validateColorContrast(color, backgroundColor)
      if (contrast < accessibilityConfig.colorContrast.minimum) {
        contrastIssues++
      }
    }
  })

  if (contrastIssues > 0) {
    issues.push(`${contrastIssues} elements with poor color contrast`)
    recommendations.push('Improve color contrast for better readability')
  }

  const score = Math.max(0, 100 - (issues.length * 10))

  return {
    score,
    issues,
    recommendations
  }
}