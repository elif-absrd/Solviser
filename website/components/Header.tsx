'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);

  // Effect to handle header background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/our-team', label: 'Our Team' },
    { 
      href: '/products', 
      label: 'Products', 
      subLinks: [
        { href: '/products/ai-risk-engine', label: 'AI Risk Engine' },
        { href: '/products/buyer-blocklist', label: 'Buyer Blocklist' },
        { href: '/products/ecommerce', label: 'Ecommerce' },
        { href: '/products/industry-network', label: 'Industry Network' },
        { href: '/products/smart-contract', label: 'Smart Contract' },
        { href: '/products/solviser-erp', label: 'Solviser ERP' },
      ] 
    },
    { href: '/services', label: 'Services' },
    { 
      href: '/tools', 
      label: 'Tools', 
      subLinks: [
        { href: '/tools/measurement-calculator', label: 'Measurement Calculator' },
        { href: '/tools/sales-price-calculator', label: 'Sales Price Calculator' },
        { href: '/tools/wood-calculator', label: 'Wood Calculator' },
      ] 
    },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  const hasLightBg = isScrolled || isMenuOpen;

  const headerClasses = `fixed top-0 z-50 w-full transition-all duration-300 ease-in-out ${
    hasLightBg
      ? 'bg-white dark:bg-black/80 shadow-md backdrop-blur-sm'
      : 'bg-transparent'
  }`;

  const navTextClasses = `transition-colors duration-300 ${
    hasLightBg ? 'text-gray-800 dark:text-white' : 'text-white'
  }`;
  
  const handleMobileSubMenuToggle = (href: string) => {
    setOpenMobileSubMenu(openMobileSubMenu === href ? null : href);
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo with improved visibility logic */}
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <div className="relative w-[160px] h-[35px]">
            {/* White logo: Visible in dark mode OR when background is transparent */}
            <Image
              src="/whitelogo.png"
              alt="Solviser Logo"
              fill
              priority
              className={`transition-opacity duration-300 ${hasLightBg ? 'opacity-0' : 'opacity-100'} dark:opacity-100`}
            />
            {/* Black logo: Visible only in light mode when background is light */}
            <Image
              src="/blacklogo.png"
              alt="Solviser Logo"
              fill
              priority
              className={`transition-opacity duration-300 ${hasLightBg ? 'opacity-100' : 'opacity-0'} dark:opacity-0`}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center space-x-6 ${navTextClasses}`}>
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className="flex items-center space-x-1 hover:text-[#FF4D00] transition-colors"
              >
                <span>{link.label}</span>
                {link.subLinks && <ChevronDown size={16} />}
              </Link>
              {link.subLinks && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/signin" className={`hover:text-[#FF4D00] font-medium px-4 py-2 ${navTextClasses}`}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-[#FF4D00] hover:bg-opacity-90 text-white font-semibold px-5 py-2 rounded-md transition-shadow shadow-sm hover:shadow-lg"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={navTextClasses}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with smooth transition */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'transform-none' : '-translate-y-[120%]'
        }`}
        style={{ maxHeight: 'calc(100vh - 70px)' }}
      >
        <nav className="flex flex-col items-center py-8">
          {navLinks.map((link) => (
            <div key={link.href} className="w-full text-center">
              {link.subLinks ? (
                <>
                  <button
                    onClick={() => handleMobileSubMenuToggle(link.href)}
                    className="text-lg w-full text-gray-800 dark:text-white hover:bg-[#FF4D00]/10 py-3 transition-colors flex justify-center items-center gap-2"
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={16} className={`transition-transform ${openMobileSubMenu === link.href ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-gray-900 ${openMobileSubMenu === link.href ? 'max-h-96' : 'max-h-0'}`}>
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.href}
                        href={subLink.href}
                        className="block text-base text-gray-600 dark:text-gray-300 hover:bg-[#FF4D00]/10 py-3 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="text-lg w-full block text-gray-800 dark:text-white hover:bg-[#FF4D00]/10 py-3 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 w-[90%] my-4"></div>
          <div className="flex flex-col items-center space-y-4 w-full px-8">
            <Link
              href="/signin"
              className="w-full text-center text-lg text-gray-800 dark:text-white font-medium py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full text-center bg-[#FF4D00] hover:bg-opacity-90 text-white font-semibold px-5 py-3 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
