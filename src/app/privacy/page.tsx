import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Cookie, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Information We Collect
              </CardTitle>
              <CardDescription>
                We collect information you provide directly to us and information we collect automatically when you use our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, username, profile details)</li>
                <li>Project submissions and related metadata</li>
                <li>Usage analytics and platform interaction data</li>
                <li>Technical information (IP address, browser type, device information)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
              <CardDescription>
                We use the information we collect to provide, maintain, and improve our services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>To operate and maintain the Web3 project showcase platform</li>
                <li>To allow users to submit and showcase their projects</li>
                <li>To communicate with users about platform updates</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To ensure platform security and prevent fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookies and Tracking
              </CardTitle>
              <CardDescription>
                We use cookies and similar tracking technologies to enhance your experience on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand user behavior</li>
                <li>Authentication cookies for secure access</li>
                <li>Third-party cookies for integrated services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Rights and Choices
              </CardTitle>
              <CardDescription>
                You have certain rights regarding your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your account and associated data</li>
                <li>Control over cookie preferences</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy, please contact us.
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