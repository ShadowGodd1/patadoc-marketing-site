import Image from 'next/image';
import WaitlistForm from './WaitlistForm';
import FormErrorBoundary from './FormErrorBoundary';

export default function HeroSection() {
  return (
    <section 
      className="bg-off-white pt-8 pb-16 lg:pt-12 lg:pb-24"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-patadoc-teal mb-6 leading-tight"
            >
              Health, in your hands.
            </h1>
            
            {/* Value Proposition */}
            <p 
              className="text-lg sm:text-xl text-charcoal mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              aria-describedby="hero-heading"
            >
              PataDoc is the simplest way to find verified doctors in Kenya, read patient reviews, and book appointments instantly. Your trusted connection to care is launching soon.
            </p>
            
            {/* Waitlist Form */}
            <div 
              className="flex justify-center lg:justify-start"
              role="region"
              aria-label="Join waitlist"
            >
              <FormErrorBoundary formName="hero">
                <WaitlistForm location="hero" />
              </FormErrorBoundary>
            </div>
          </div>
          
          {/* Image Column */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/hero-app-mockup.webp"
                alt="PataDoc mobile app interface displaying a list of verified doctors with their photos, specialties, ratings, and available appointment times. The interface shows features like insurance filtering and instant booking capabilities."
                width={500}
                height={600}
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                className="w-full h-auto rounded-2xl shadow-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                role="img"
                aria-describedby="hero-heading"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}