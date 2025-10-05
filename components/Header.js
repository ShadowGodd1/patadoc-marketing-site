'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="#main-content"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 rounded-md"
              aria-label="PataDoc - Go to main content"
              onClick={(e) => {
                e.preventDefault();
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                  mainContent.focus();
                  mainContent.scrollIntoView({ behavior: 'smooth' });
                }
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
        </div>
      </div>
    </header>
  );
}