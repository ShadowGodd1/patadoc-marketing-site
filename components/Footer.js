import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-patadoc-teal" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/images/logo-white.svg"
              alt="PataDoc"
              width={120}
              height={32}
              className="h-8 w-auto sm:h-10 mb-4"
              loading="lazy"
              quality={100}
            />
            <p className="text-white/80 text-sm text-center md:text-left max-w-xs">
              Your trusted connection to healthcare in Kenya.
            </p>
          </div>

          {/* Legal Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <a 
                href="#privacy" 
                className="text-white/80 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md px-1 py-1"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="text-white/80 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md px-1 py-1"
                aria-label="Terms of Service"
              >
                Terms of Service
              </a>
              <a 
                href="#contact" 
                className="text-white/80 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md px-1 py-1"
                aria-label="Contact Us"
              >
                Contact Us
              </a>
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-sm mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Twitter/X */}
              <a 
                href="https://twitter.com/patadoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md p-2"
                aria-label="Follow PataDoc on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a 
                href="https://facebook.com/patadoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md p-2"
                aria-label="Follow PataDoc on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/patadoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md p-2"
                aria-label="Follow PataDoc on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/patadoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-patadoc-teal rounded-md p-2"
                aria-label="Follow PataDoc on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.388a5.918 5.918 0 0 0-2.14 1.393A5.918 5.918 0 0 0 1.503 4.92c-.184.484-.306 1.058-.34 2.005C1.128 7.989 1.115 8.396 1.115 12.017c0 3.621.013 4.028.048 4.976.034.947.156 1.521.34 2.005a5.918 5.918 0 0 0 1.393 2.14 5.918 5.918 0 0 0 2.14 1.393c.484.184 1.058.306 2.005.34.948.035 1.355.048 4.976.048 3.621 0 4.028-.013 4.976-.048.947-.034 1.521-.156 2.005-.34a5.918 5.918 0 0 0 2.14-1.393 5.918 5.918 0 0 0 1.393-2.14c.184-.484.306-1.058.34-2.005.035-.948.048-1.355.048-4.976 0-3.621-.013-4.028-.048-4.976-.034-.947-.156-1.521-.34-2.005a5.918 5.918 0 0 0-1.393-2.14A5.918 5.918 0 0 0 19.078.388c-.484-.184-1.058-.306-2.005-.34C16.025.013 15.618 0 12.017 0zm0 2.162c3.557 0 3.98.013 5.386.048.3.014.462.064.57.107.144.056.246.122.354.23.108.108.174.21.23.354.043.108.093.27.107.57.035 1.406.048 1.829.048 5.386 0 3.557-.013 3.98-.048 5.386-.014.3-.064.462-.107.57-.056.144-.122.246-.23.354-.108.108-.21.174-.354.23-.108.043-.27.093-.57.107-1.406.035-1.829.048-5.386.048-3.557 0-3.98-.013-5.386-.048-.3-.014-.462-.064-.57-.107-.144-.056-.246-.122-.354-.23-.108-.108-.174-.21-.23-.354-.043-.108-.093-.27-.107-.57-.035-1.406-.048-1.829-.048-5.386 0-3.557.013-3.98.048-5.386.014-.3.064-.462.107-.57.056-.144.122-.246.23-.354.108-.108.21-.174.354-.23.108-.043.27-.093.57-.107 1.406-.035 1.829-.048 5.386-.048z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M12.017 15.33a3.313 3.313 0 1 1 0-6.626 3.313 3.313 0 0 1 0 6.626zm0-8.464a5.151 5.151 0 1 0 0 10.302 5.151 5.151 0 0 0 0-10.302zm6.532-1.325a1.204 1.204 0 1 1-2.408 0 1.204 1.204 0 0 1 2.408 0z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm text-center md:text-left">
              © {currentYear} PataDoc. All rights reserved.
            </p>
            <p className="text-white/80 text-sm text-center md:text-right mt-2 md:mt-0">
              Made with ❤️ in Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}