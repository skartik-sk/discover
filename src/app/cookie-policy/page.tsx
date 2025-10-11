import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cookie, Settings, Shield, Eye } from 'lucide-react'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                What Are Cookies?
              </CardTitle>
              <CardDescription>
                Cookies are small text files that are stored on your device when you visit websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Cookies help us improve your experience by remembering your preferences, analyzing site traffic, and personalizing content.
                They do not typically contain any information that personally identifies you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Types of Cookies We Use
              </CardTitle>
              <CardDescription>
                We use different types of cookies for various purposes on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies are necessary for the website to function and cannot be switched off in our systems.
                  </p>
                  <ul className="text-sm list-disc pl-6">
                    <li>Authentication and session management</li>
                    <li>Security and fraud prevention</li>
                    <li>Platform functionality</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                  <ul className="text-sm list-disc pl-6">
                    <li>Page views and user behavior tracking</li>
                    <li>Performance monitoring</li>
                    <li>Platform usage statistics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Functional Cookies</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies enable enhanced functionality and personalization.
                  </p>
                  <ul className="text-sm list-disc pl-6">
                    <li>Remembering your preferences</li>
                    <li>Customized content delivery</li>
                    <li>Saved search filters and settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Third-Party Cookies
              </CardTitle>
              <CardDescription>
                Some cookies are placed by third-party services that appear on our pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Fonts:</strong> For web font delivery and performance</li>
                <li><strong>Supabase:</strong> For database operations and user authentication</li>
                <li><strong>WalletConnect:</strong> For Web3 wallet integration</li>
                <li><strong>Vercel Analytics:</strong> For platform performance monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Managing Your Cookies
              </CardTitle>
              <CardDescription>
                You have control over how cookies are used on your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Browser Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="text-sm list-disc pl-6 mt-2">
                    <li>Block all cookies or only third-party cookies</li>
                    <li>Delete existing cookies from your device</li>
                    <li>Receive notifications when new cookies are set</li>
                    <li>Set exceptions for trusted websites</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Platform Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    We provide cookie consent management tools that allow you to:
                  </p>
                  <ul className="text-sm list-disc pl-6 mt-2">
                    <li>Accept or reject non-essential cookies</li>
                    <li>Customize your cookie preferences</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Duration</CardTitle>
              <CardDescription>
                Different cookies have different lifespans on your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 1 year)</li>
                <li><strong>Authentication Cookies:</strong> Typically expire after 7-30 days for security</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
              <CardDescription>
                We may update this cookie policy from time to time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about our use of cookies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about our cookie policy, please contact us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Email: privacy@discover.com<br />
                We will respond to your inquiry within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}