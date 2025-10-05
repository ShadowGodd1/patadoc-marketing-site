import WaitlistForm from './WaitlistForm';
import FormErrorBoundary from './FormErrorBoundary';

export default function FinalCTASection() {
  return (
    <section 
      className="bg-patadoc-teal py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="final-cta-heading"
      role="region"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Main headline */}
        <h2 
          id="final-cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Be the first to know.
        </h2>
        
        {/* Urgency messaging */}
        <p 
          className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          aria-describedby="final-cta-heading"
        >
          The PataDoc app is launching soon. Join our waitlist for early access and exclusive updates.
        </p>
        
        {/* Waitlist form */}
        <div 
          className="flex justify-center"
          role="region"
          aria-label="Join waitlist for early access"
        >
          <FormErrorBoundary formName="footer_cta">
            <WaitlistForm location="footer_cta" />
          </FormErrorBoundary>
        </div>
      </div>
    </section>
  );
}