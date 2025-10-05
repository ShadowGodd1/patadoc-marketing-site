import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AnalyticsProvider from '../components/AnalyticsProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  DynamicHowItWorksSection, 
  DynamicFeaturesSection, 
  DynamicFinalCTASection, 
  DynamicFooter 
} from '../components/DynamicComponents';

export default function Home() {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen">
        {/* Header - Sticky navigation */}
        <ErrorBoundary componentName="header">
          <Header />
        </ErrorBoundary>
        
        {/* Main content */}
        <main role="main">
          {/* Hero Section - Primary value proposition and CTA */}
          <ErrorBoundary componentName="hero_section">
            <HeroSection />
          </ErrorBoundary>
          
          {/* How It Works Section - Educational content */}
          <ErrorBoundary componentName="how_it_works_section">
            <DynamicHowItWorksSection />
          </ErrorBoundary>
          
          {/* Features Section - Key differentiators */}
          <ErrorBoundary componentName="features_section">
            <DynamicFeaturesSection />
          </ErrorBoundary>
          
          {/* Final CTA Section - Secondary conversion opportunity */}
          <ErrorBoundary componentName="final_cta_section">
            <DynamicFinalCTASection />
          </ErrorBoundary>
        </main>
        
        {/* Footer - Legal links and social media */}
        <ErrorBoundary componentName="footer">
          <DynamicFooter />
        </ErrorBoundary>
      </div>
    </AnalyticsProvider>
  );
}
