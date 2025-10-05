'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import WaitlistModal from './WaitlistModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const navigationLinks = [
    { label: 'How It Works', sectionId: 'how-it-works' },
    { label: 'Features', sectionId: 'features' },
    { label: 'Contact', sectionId: 'footer' }
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-transparent lg:bg-off-white'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <a 
                href="#"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 rounded-md"
                aria-label="PataDoc - Go to homepage"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Image
                  src="/images/logo.svg"
                  alt="PataDoc - Find and book doctors in Kenya"
                  width={120}
                  height={32}
                  className="h-8 w-auto sm:h-10"
                  priority
                  quality={100}
                  role="img"
                />
              </a>
            </div>

            {/* Center: Navigation Links (Desktop only) */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation">
              {navigationLinks.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  className="text-charcoal hover:text-patadoc-teal transition-colors duration-200 font-inter font-regular text-base focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-label={`Navigate to ${link.label} section`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: CTA Button + Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* CTA Button (Desktop) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex items-center px-6 py-2 bg-patadoc-teal text-white font-inter font-semibold text-base rounded-md hover:bg-patadoc-teal/90 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 transition-colors duration-200"
                aria-label="Join the waitlist"
              >
                Join the Waitlist
              </button>

              {/* Mobile CTA Button (smaller) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="sm:hidden inline-flex items-center px-4 py-2 bg-patadoc-teal text-white font-inter font-semibold text-sm rounded-md hover:bg-patadoc-teal/90 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 transition-colors duration-200"
                aria-label="Join the waitlist"
              >
                Join Waitlist
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-charcoal hover:text-patadoc-teal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 transition-colors duration-200 mobile-menu-container"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 mobile-menu-container">
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl mobile-menu-container">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="text-lg font-semibold text-charcoal">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-charcoal hover:text-patadoc-teal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-patadoc-teal"
                    aria-label="Close menu"
                  >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Links */}
                <nav className="flex-1 px-4 py-6 space-y-4" role="navigation">
                  {navigationLinks.map((link) => (
                    <button
                      key={link.sectionId}
                      onClick={() => scrollToSection(link.sectionId)}
                      className="block w-full text-left px-4 py-3 text-base font-inter text-charcoal hover:text-patadoc-teal hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-patadoc-teal"
                      aria-label={`Navigate to ${link.label} section`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}