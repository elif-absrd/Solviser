import Link from 'next/link';
import Image from 'next/image';
import { LinkedinIcon, FacebookIcon, InstagramIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <Image src="/whitelogo.png" alt="Solviser Logo" width={120} height={32} />
            <p className="mt-4 text-sm">
              Empowering MSMEs with AI-driven risk assessment tools.
            </p>
          </div>

          {/* Column 2: Quick Link */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="hover:text-brand-orange">About Us</Link></li>
              <li><Link href="/services" className="hover:text-brand-orange">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-orange">Pricing</Link></li>
              <li><Link href="/contact-us" className="hover:text-brand-orange">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-brand-orange">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-brand-orange">Terms and Conditions</Link></li>
              <li><Link href="/refund-and-cancellations" className="hover:text-brand-orange">Refund and Cancellations</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/company/105701635/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-brand-orange"><LinkedinIcon /></Link>
              <Link href="https://www.facebook.com/profile.php?id=61567543661718" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand-orange"><FacebookIcon /></Link>
              <Link href="https://www.instagram.com/solviser_pvtltd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-orange"><InstagramIcon /></Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Solviser. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}