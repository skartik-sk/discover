'use client'

import { useEffect } from 'react'
import { createSkipLink } from '@/lib/accessibility'

export function SkipLink() {
  useEffect(() => {
    // Create and append skip link
    const skipLink = createSkipLink()
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Add keyboard navigation styles
    const style = document.createElement('style')
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .focus:not-sr-only {
        position: static;
        width: auto;
        height: auto;
        padding: 0.5rem;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }

      /* Enhanced focus styles */
      *:focus-visible {
        outline: 2px solid #f97316 !important;
        outline-offset: 2px !important;
      }

      /* Skip link styles */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #f97316;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* High contrast support */
      @media (prefers-contrast: high) {
        .text-gradient {
          background: none !important;
          -webkit-text-fill-color: currentColor !important;
          color: currentColor !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return null
}