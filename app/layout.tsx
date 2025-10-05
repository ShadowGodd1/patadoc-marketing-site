import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import WebVitals from "../components/WebVitals";
import PerformanceOptimizer from "../components/PerformanceOptimizer";
import GlobalErrorBoundary from "../components/GlobalErrorBoundary";
import OfflineIndicator from "../components/OfflineIndicator";
import AccessibilityProvider from "../components/AccessibilityProvider";
import AccessibilityTest from "../components/AccessibilityTest";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PataDoc - Find & Book Doctors in Kenya | App Coming Soon",
  description: "The simplest way to find verified doctors in Kenya. Join the waitlist for the PataDoc app and be the first to get access.",
  keywords: "doctors Kenya, book appointments, verified doctors, healthcare Kenya, medical appointments",
  authors: [{ name: "PataDoc" }],
  creator: "PataDoc",
  publisher: "PataDoc",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://patadoc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PataDoc - Find & Book Doctors in Kenya | App Coming Soon",
    description: "The simplest way to find verified doctors in Kenya. Join the waitlist for the PataDoc app and be the first to get access.",
    url: '/',
    siteName: 'PataDoc',
    images: [
      {
        url: '/images/social-share-image.png',
        width: 1200,
        height: 630,
        alt: 'PataDoc - Find & Book Doctors in Kenya',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PataDoc - Find & Book Doctors in Kenya | App Coming Soon",
    description: "The simplest way to find verified doctors in Kenya. Join the waitlist for the PataDoc app and be the first to get access.",
    images: ['/images/social-share-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Resource hints for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/images/hero-app-mockup.webp" type="image/webp" />
        <link rel="preload" as="image" href="/images/logo.svg" type="image/svg+xml" />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W9CHQQN4');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-inter antialiased bg-white text-gray-900`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W9CHQQN4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <AccessibilityProvider>
          <GlobalErrorBoundary>
            {/* Offline status indicator */}
            <OfflineIndicator />
            
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
            
            {/* Performance optimizations */}
            <PerformanceOptimizer />
            <WebVitals />
            
            {/* Accessibility testing (development only) */}
            <AccessibilityTest />
          </GlobalErrorBoundary>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
