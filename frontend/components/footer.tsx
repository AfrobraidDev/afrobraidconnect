// components/footer.tsx
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t py-12 px-4 sm:px-6 lg:px-60 bg-gray-50">
      <div className="container grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 mb-8">
        {/* Product Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Product</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/features">Features</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/status">Status</FooterLink>
            <FooterLink href="/support">Support</FooterLink>
          </nav>
        </div>

        {/* About Afro-Connect */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">About Afro-Connect</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/sitemap">Sitemap</FooterLink>
          </nav>
        </div>

        {/* Business & Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">For Business</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/business">For Partners</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
          </nav>

          <h3 className="font-semibold text-gray-900 mt-4">Legal</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/terms-of-use">Terms of Use</FooterLink>
          </nav>
        </div>

        {/* Social & Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Connect With Us</h3>
          <div className="flex space-x-4">
            <SocialIcon href="https://facebook.com/afroconnect" icon={<FaFacebook />} />
            <SocialIcon href="https://twitter.com/afroconnect" icon={<FaTwitter />} />
            <SocialIcon href="https://linkedin.com/company/afroconnect" icon={<FaLinkedin />} />
            <SocialIcon href="https://instagram.com/afroconnect" icon={<FaInstagram />} />
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 text-sm rounded-r-md transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container border-t pt-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-gray-900 font-bold hover:text-purple-600 transition">
            Afro-Connect
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Afro-Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Reusable components
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-600 hover:text-purple-600 hover:underline transition-colors"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-purple-600 text-lg transition-colors"
    >
      {icon}
    </a>
  );
}