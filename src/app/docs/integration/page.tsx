import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Globe, Blocks, Code2, Rocket } from 'lucide-react'

export default function IntegrationDocsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documentation
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deployment & Integration</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to deploy SimpleCRM and integrate it with your website
        </p>
      </div>

      {/* Deployment Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Deployment Options</h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Recommended: Separate Deployment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deploy CRM on its own subdomain for clean separation
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Deploy:</p>
              <div className="bg-muted p-4 rounded-md space-y-2">
                <code className="text-sm block">git clone https://github.com/aimonk2025/crm.git</code>
                <code className="text-sm block">cd crm</code>
                <code className="text-sm block">npm install</code>
                <code className="text-sm block">vercel --prod</code>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Platform Options:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li><strong>Vercel</strong> - Best for Next.js (free tier: 100GB/month)</li>
                <li><strong>Railway</strong> - $5/month credit included</li>
                <li><strong>Render</strong> - Free tier available</li>
                <li><strong>DigitalOcean</strong> - $5/month App Platform</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Configuration:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Point subdomain: <code className="text-xs bg-muted px-1 py-0.5 rounded">crm.yourbusiness.com</code> to deployment</li>
                <li>Set environment variables in platform dashboard</li>
                <li>CRM accessible at: <code className="text-xs bg-muted px-1 py-0.5 rounded">https://crm.yourbusiness.com</code></li>
                <li>Main website stays separate: <code className="text-xs bg-muted px-1 py-0.5 rounded">https://www.yourbusiness.com</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Integration Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Website Integration Examples</h2>

        <p className="text-sm text-muted-foreground">
          Integrate SimpleCRM with your existing website by sending form data to the leads API endpoint.
        </p>

        {/* Next.js */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Next.js Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For Next.js applications, use Server Actions or API routes
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Using Server Actions (Recommended):</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`'use server'

export async function submitContactForm(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  }

  const response = await fetch('https://crm.yourbusiness.com/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit form')
  }

  return { success: true }
}`}</code></pre>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Component Usage:</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`'use client'

import { submitContactForm } from './actions'
import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState('')

  async function handleSubmit(formData: FormData) {
    try {
      await submitContactForm(formData)
      setStatus('Thank you! We will contact you soon.')
    } catch (error) {
      setStatus('Something went wrong. Please try again.')
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="phone" type="tel" placeholder="Phone" required />
      <input name="email" type="email" placeholder="Email" />
      <textarea name="message" placeholder="Message" />
      <button type="submit">Submit</button>
      {status && <p>{status}</p>}
    </form>
  )
}`}</code></pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* React */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              React Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For React applications (CRA, Vite, etc.)
            </p>

            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-xs"><code>{`import { useState } from 'react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://crm.yourbusiness.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('Thank you! We will contact you soon.')
        setFormData({ name: '', phone: '', email: '', message: '' })
      } else {
        const error = await response.json()
        setStatus(error.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Submit'}
      </button>
      {status && <p>{status}</p>}
    </form>
  )
}`}</code></pre>
            </div>
          </CardContent>
        </Card>

        {/* WordPress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              WordPress Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For WordPress sites using Contact Form 7
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Add to functions.php:</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`<?php
// Send Contact Form 7 submissions to SimpleCRM
add_action('wpcf7_before_send_mail', 'send_to_simplecrm');

function send_to_simplecrm($contact_form) {
    $submission = WPCF7_Submission::get_instance();

    if ($submission) {
        $data = $submission->get_posted_data();

        $payload = array(
            'name' => isset($data['your-name']) ? $data['your-name'] : '',
            'phone' => isset($data['your-phone']) ? $data['your-phone'] : '',
            'email' => isset($data['your-email']) ? $data['your-email'] : '',
            'message' => isset($data['your-message']) ? $data['your-message'] : ''
        );

        wp_remote_post('https://crm.yourbusiness.com/api/leads', array(
            'body' => json_encode($payload),
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'timeout' => 15
        ));
    }
}
?>`}</code></pre>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Using WordPress REST API:</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`<?php
// Custom endpoint approach
add_action('rest_api_init', function () {
    register_rest_route('mysite/v1', '/contact', array(
        'methods' => 'POST',
        'callback' => 'handle_contact_form',
    ));
});

function handle_contact_form($request) {
    $params = $request->get_json_params();

    $response = wp_remote_post('https://crm.yourbusiness.com/api/leads', array(
        'body' => json_encode($params),
        'headers' => array('Content-Type' => 'application/json'),
    ));

    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Failed to submit', array('status' => 500));
    }

    return rest_ensure_response(array('success' => true));
}
?>`}</code></pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webflow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Webflow Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For Webflow sites using custom code
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Add to Page Settings → Custom Code (Before &lt;/body&gt;):</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`<script>
// Get your Webflow form
const form = document.querySelector('[data-name="Contact Form"]');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(form);
  const data = {
    name: formData.get('Name'),
    phone: formData.get('Phone'),
    email: formData.get('Email'),
    message: formData.get('Message')
  };

  // Send to SimpleCRM
  try {
    const response = await fetch('https://crm.yourbusiness.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // Show success message
      document.querySelector('.w-form-done').style.display = 'block';
      form.reset();
    } else {
      // Show error message
      document.querySelector('.w-form-fail').style.display = 'block';
    }
  } catch (error) {
    console.error('Form submission error:', error);
    document.querySelector('.w-form-fail').style.display = 'block';
  }
});
</script>`}</code></pre>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Alternative: Using Webflow Logic + Zapier/Make:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Use Webflow's native form submission</li>
                <li>Connect to Zapier/Make automation</li>
                <li>Trigger webhook to SimpleCRM API endpoint</li>
                <li>No custom code needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">POST /api/leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Endpoint:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded block">https://your-crm-domain.com/api/leads</code>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Request Body:</p>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs"><code>{`{
  "name": "John Doe",        // Required
  "phone": "+919999999999",  // Required
  "email": "john@example.com", // Optional
  "message": "I need help..." // Optional
}`}</code></pre>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Responses:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">200 Success</p>
                  <code className="text-xs">{`{ "success": true }`}</code>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">409 Conflict</p>
                  <code className="text-xs">{`{ "error": "This phone number is already registered" }`}</code>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">400 Bad Request</p>
                  <code className="text-xs">{`{ "error": "Invalid form data" }`}</code>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">CORS:</p>
              <p className="text-sm text-muted-foreground">
                The API endpoint accepts cross-origin requests, so you can call it from any domain.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Security Best Practices</h2>

        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Add CAPTCHA</strong> - Implement reCAPTCHA or hCaptcha on your website forms to prevent spam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Rate Limiting</strong> - Consider adding rate limits to the /api/leads endpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Input Validation</strong> - Always validate phone numbers and email addresses on the client side</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span><strong>HTTPS Only</strong> - Ensure your CRM deployment uses HTTPS (automatic on Vercel/Railway)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Environment Variables</strong> - Never expose SUPABASE_SERVICE_ROLE_KEY on the client</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Testing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Testing Integration</h2>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Test your integration using curl or Postman:
            </p>

            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-xs"><code>{`curl -X POST https://crm.yourbusiness.com/api/leads \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "phone": "+919999999999",
    "email": "test@example.com",
    "message": "Testing integration"
  }'`}</code></pre>
            </div>

            <p className="text-sm text-muted-foreground">
              Expected response:
            </p>
            <div className="bg-muted p-4 rounded-md">
              <code className="text-xs">{`{ "success": true }`}</code>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="pt-6">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documentation
        </Link>
      </div>
    </div>
  )
}
