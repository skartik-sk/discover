import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Shield, AlertTriangle } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Agreement to Terms
              </CardTitle>
              <CardDescription>
                By accessing and using the Discover platform, you accept and agree to be bound by the terms and provision of this agreement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Accounts and Responsibilities
              </CardTitle>
              <CardDescription>
                Users are responsible for maintaining the confidentiality of their account credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use this platform</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You must not share your password or account access</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Project Submissions
              </CardTitle>
              <CardDescription>
                Users may submit Web3 projects for showcase on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Projects must be legitimate Web3/blockchain projects</li>
                <li>You must have the right to submit and showcase the project</li>
                <li>Projects must not contain malicious code or content</li>
                <li>We reserve the right to remove inappropriate projects</li>
                <li>You retain ownership of your submitted projects</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Prohibited Activities
              </CardTitle>
              <CardDescription>
                The following activities are strictly prohibited on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submitting fraudulent or scam projects</li>
                <li>Attempting to exploit platform vulnerabilities</li>
                <li>Spamming or abusive behavior towards other users</li>
                <li>Violating applicable laws and regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Distributing malware or harmful content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
              <CardDescription>
                You retain ownership of your intellectual property.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                By submitting projects to Discover, you grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your projects on our platform. You retain all ownership rights to your projects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
              <CardDescription>
                Our platform is provided "as is" without warranties of any kind.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We do not guarantee that the platform will be uninterrupted, secure, or error-free. We are not responsible for the accuracy, quality, or legitimacy of user-submitted projects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
              <CardDescription>
                Our liability is limited to the maximum extent permitted by law.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Discover shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
              <CardDescription>
                We reserve the right to modify these terms at any time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We will notify users of significant changes via email or platform notifications. Continued use of the platform after such changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Questions about these Terms of Service should be directed to:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Email: legal@discover.com<br />
                We will respond to your inquiry within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}