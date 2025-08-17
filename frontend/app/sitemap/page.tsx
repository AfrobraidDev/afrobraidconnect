// app/sitemap/page.tsx
import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Afro-Connect Sitemap</h1>
          <p className="text-lg text-gray-600">
            Explore all pages and features of our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <Section title="Main Pages">
            <SitemapLink href="/">Home</SitemapLink>
            <SitemapLink href="/about">About Us</SitemapLink>
            <SitemapLink href="/blog">Blog</SitemapLink>
            <SitemapLink href="/contact">Contact Us</SitemapLink>
            <SitemapLink href="/sitemap">Sitemap</SitemapLink>
          </Section>

          {/* Services */}
          <Section title="Services">
            <SitemapLink href="/services">All Services</SitemapLink>
            <SitemapLink href="/services/hair">Hair Services</SitemapLink>
            <SitemapLink href="/services/nails">Nail Services</SitemapLink>
            <SitemapLink href="/services/skin">Skin Treatments</SitemapLink>
            <SitemapLink href="/services/massage">Massage Therapy</SitemapLink>
            <SitemapLink href="/services/makeup">Makeup Services</SitemapLink>
          </Section>

          {/* Business */}
          <Section title="For Businesses">
            <SitemapLink href="/business">Business Home</SitemapLink>
            <SitemapLink href="/business/register">Register Your Business</SitemapLink>
            <SitemapLink href="/business/pricing">Pricing Plans</SitemapLink>
            <SitemapLink href="/business/resources">Resources</SitemapLink>
            <SitemapLink href="/business/testimonials">Success Stories</SitemapLink>
          </Section>

          {/* User Account */}
          <Section title="User Account">
            <SitemapLink href="/auth/login">Login</SitemapLink>
            <SitemapLink href="/auth/register">Register</SitemapLink>
            <SitemapLink href="/account/dashboard">Dashboard</SitemapLink>
            <SitemapLink href="/account/bookings">My Bookings</SitemapLink>
            <SitemapLink href="/account/settings">Settings</SitemapLink>
          </Section>

          {/* Legal */}
          <Section title="Legal">
            <SitemapLink href="/privacy-policy">Privacy Policy</SitemapLink>
            <SitemapLink href="/terms-of-service">Terms of Service</SitemapLink>
            <SitemapLink href="/cookie-policy">Cookie Policy</SitemapLink>
            <SitemapLink href="/accessibility">Accessibility</SitemapLink>
          </Section>

          {/* Support */}
          <Section title="Support">
            <SitemapLink href="/help">Help Center</SitemapLink>
            <SitemapLink href="/faq">FAQs</SitemapLink>
            <SitemapLink href="/contact-support">Contact Support</SitemapLink>
            <SitemapLink href="/community">Community</SitemapLink>
          </Section>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Discover Afro-Connect</h2>
          <p className="text-gray-600 mb-4">
            Our sitemap helps you navigate all the features and services we offer. 
            Can't find what you're looking for?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}

// Reusable section component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

// Reusable sitemap link component
function SitemapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-600 hover:text-purple-600 hover:underline transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}