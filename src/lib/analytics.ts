// Simple analytics utility for tracking user interactions
interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

interface ProjectAnalytics {
  project_id: string
  event_type: 'view' | 'click' | 'share' | 'like' | 'review'
  metadata?: Record<string, any>
}

class Analytics {
  private static instance: Analytics
  private events: AnalyticsEvent[] = []

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: page,
      value: 1
    })

    console.log('📊 Page View:', { page, title })

    // Store in localStorage for demo purposes
    this.storeEvent({
      event_type: 'view',
      project_id: page,
      metadata: { title, timestamp: new Date().toISOString() }
    })
  }

  // Track project interactions
  trackProjectInteraction(projectId: string, eventType: ProjectAnalytics['event_type'], metadata?: Record<string, any>) {
    this.track({
      action: eventType,
      category: 'project',
      label: projectId,
      value: 1
    })

    console.log('📊 Project Interaction:', { projectId, eventType, metadata })

    // Store in localStorage for demo purposes
    this.storeEvent({
      project_id: projectId,
      event_type: eventType,
      metadata: { ...metadata, timestamp: new Date().toISOString() }
    })
  }

  // Track user interactions
  track(action: string, category: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value
    }

    this.events.push(event)

    // Log to console for demo (in production, this would send to analytics service)
    console.log('📊 Analytics Event:', event)

    // Store in localStorage for persistence
    try {
      const storedEvents = localStorage.getItem('analytics_events')
      const events = storedEvents ? JSON.parse(storedEvents) : []
      events.push({ ...event, timestamp: new Date().toISOString() })
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))) // Keep last 100 events
    } catch (error) {
      console.warn('Failed to store analytics event:', error)
    }
  }

  // Store project-specific events
  private storeEvent(event: ProjectAnalytics) {
    try {
      const storedEvents = localStorage.getItem('project_analytics')
      const events = storedEvents ? JSON.parse(storedEvents) : []
      events.push(event)
      localStorage.setItem('project_analytics', JSON.stringify(events.slice(-50))) // Keep last 50 events
    } catch (error) {
      console.warn('Failed to store project event:', error)
    }
  }

  // Get analytics data for dashboard
  getAnalyticsData() {
    try {
      const events = localStorage.getItem('analytics_events')
      return events ? JSON.parse(events) : []
    } catch (error) {
      console.warn('Failed to retrieve analytics data:', error)
      return []
    }
  }

  // Get project-specific analytics
  getProjectAnalytics(projectId?: string) {
    try {
      const events = localStorage.getItem('project_analytics')
      const allEvents = events ? JSON.parse(events) : []
      return projectId ? allEvents.filter((e: ProjectAnalytics) => e.project_id === projectId) : allEvents
    } catch (error) {
      console.warn('Failed to retrieve project analytics:', error)
      return []
    }
  }

  // Clear analytics data
  clearAnalyticsData() {
    try {
      localStorage.removeItem('analytics_events')
      localStorage.removeItem('project_analytics')
      this.events = []
      console.log('📊 Analytics data cleared')
    } catch (error) {
      console.warn('Failed to clear analytics data:', error)
    }
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const events = this.getAnalyticsData()
    const summary = {
      totalEvents: events.length,
      pageViews: events.filter(e => e.action === 'page_view').length,
      projectInteractions: events.filter(e => e.category === 'project').length,
      topPages: this.getTopPages(events),
      recentActivity: events.slice(-10).reverse()
    }

    return summary
  }

  private getTopPages(events: any[]) {
    const pageViews = events.filter(e => e.action === 'page_view')
    const pageCounts: Record<string, number> = {}

    pageViews.forEach(event => {
      const page = event.label || 'unknown'
      pageCounts[page] = (pageCounts[page] || 0) + 1
    })

    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, views: count }))
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance()

// Export convenience functions
export const trackPageView = (page: string, title?: string) => analytics.trackPageView(page, title)
export const trackProjectInteraction = (projectId: string, eventType: ProjectAnalytics['event_type'], metadata?: Record<string, any>) =>
  analytics.trackProjectInteraction(projectId, eventType, metadata)
export const trackEvent = (action: string, category: string, label?: string, value?: number) =>
  analytics.track(action, category, label, value)

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView,
    trackProjectInteraction,
    trackEvent,
    getAnalyticsData: analytics.getAnalyticsData.bind(analytics),
    getProjectAnalytics: analytics.getProjectAnalytics.bind(analytics),
    getAnalyticsSummary: analytics.getAnalyticsSummary.bind(analytics),
    clearAnalyticsData: analytics.clearAnalyticsData.bind(analytics)
  }
}