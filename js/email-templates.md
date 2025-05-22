# EmailJS Templates

This document contains sample templates for EmailJS integration in the Fitrition application.

## Contact Form Template

When creating your template in the EmailJS dashboard, you can use something like this:

```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
<p><strong>Subject:</strong> {{subject}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><small>This email was sent from the Fitrition website contact form.</small></p>
```

## Newsletter Subscription Template

For newsletter subscriptions, you can use this template:

```html
<h2>New Newsletter Subscriber</h2>

<p>A new user has subscribed to the Fitrition newsletter.</p>
<p><strong>Email Address:</strong> {{subscriber_email}}</p>

<hr>
<p><small>This email was sent from the Fitrition website newsletter subscription form.</small></p>
```

## Auto-Reply Template (Optional)

You can also set up an auto-reply template to send to users who submit the contact form:

```html
<h2>Thank you for contacting Fitrition!</h2>

<p>Dear {{from_name}},</p>

<p>Thank you for reaching out to us. We have received your message regarding "{{subject}}" and will respond as soon as possible, typically within 24-48 hours.</p>

<p>For your records, here is a copy of your message:</p>
<blockquote>
{{message}}
</blockquote>

<p>If you have any urgent concerns, please contact us directly at +60 123456789.</p>

<p>Best regards,<br>
The Fitrition Team</p>
```

## Setup Instructions

1. Go to [EmailJS Templates Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Click "Create New Template"
3. Name your template (e.g., "Contact Form", "Newsletter Subscription")
4. Paste the corresponding HTML code
5. Save your template
6. Note the Template ID for use in the JavaScript code 