// components/footer.tsx
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";
import { LanguageSelector } from "./language-selector";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#170D07] py-12 px-4 sm:px-6 lg:px-12 text-white">
      {/* Top section */}
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-12">
        {/* Logo */}
        <div className="flex items-start w-full">
          <Link href="/">
            <Image
              src="/images/afro-logo1.png"
              alt="Afro-Connect Logo"
              width={150}
              height={50}
              className="object-contain w-auto max-w-[120px] md:max-w-[150px]"
            />
          </Link>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold">Legal</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/terms-of-use">Terms of Use</FooterLink>
          </nav>
        </div>

        {/* For Business */}
        <div className="space-y-4">
          <h3 className="font-semibold">For Business</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/business">For Partners</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
          </nav>
        </div>

        {/* Company */}
        <div className="space-y-4">
          <h3 className="font-semibold">Company</h3>
          <nav className="flex flex-col space-y-2">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/sitemap">Sitemap</FooterLink>
            <FooterLink href="/how-it-works">How it Works</FooterLink>
          </nav>
        </div>

        {/* Socials */}
        <div className="space-y-4">
          <h3 className="font-semibold">Connect With Us</h3>
          {/* Social links: horizontal on mobile, vertical on tablet/desktop */}
          <div className="flex flex-row flex-wrap gap-4 md:flex-col md:gap-2">
            <SocialLink href="https://facebook.com/afroconnect" name="Facebook" />
            <SocialLink href="https://twitter.com/afroconnect" name="Twitter" />
            <SocialLink href="https://linkedin.com/company/afroconnect" name="LinkedIn" />
            <SocialLink href="https://instagram.com/afroconnect" name="Instagram" />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center flex-wrap">
        {/* Left - Language Selector */}
        <div className="mb-4 sm:mb-0">
          <LanguageSelector />
        </div>

        {/* Right - Copyright */}
        <div className="text-sm opacity-60">
          © {new Date().getFullYear()} Afro-Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Footer link component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-white hover:text-gray-500 hover:underline transition-colors"
    >
      {children}
    </Link>
  );
}

// Social link with up-arrow icon before the name
function SocialLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-1 text-white hover:text-gray-500 transition-colors text-sm md:text-base"
    >
      <FaArrowUp className="transform rotate-12 text-sm md:text-base" />
      <span>{name}</span>
    </a>
  );
}
