'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Search & Discover",
      description: "Browse verified doctors by specialty, location, and insurance coverage. Read authentic patient reviews to make informed decisions.",
      icon: (
        <svg 
          className="w-12 h-12 text-patadoc-teal" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      )
    },
    {
      id: 2,
      title: "Book Instantly",
      description: "Select your preferred appointment time and book instantly. No phone calls, no waiting on hold - just simple, direct booking.",
      icon: (
        <svg 
          className="w-12 h-12 text-patadoc-teal" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      )
    },
    {
      id: 3,
      title: "Get Care",
      description: "Attend your appointment with confidence. Rate your experience and help other patients find the right care for their needs.",
      icon: (
        <svg 
          className="w-12 h-12 text-patadoc-teal" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )
    }
  ];

  return (
    <section 
      className="py-16 sm:py-20 lg:py-24 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-patadoc-teal mb-4"
          >
            Care in Three Simple Steps
          </h2>
          <p className="text-lg sm:text-xl text-charcoal max-w-3xl mx-auto">
            Getting the healthcare you need shouldn&apos;t be complicated. Here&apos;s how PataDoc makes it simple.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" role="list">
          {steps.map((step) => (
            <article 
              key={step.id}
              className="text-center group"
              role="listitem"
              aria-labelledby={`step-${step.id}-title`}
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div 
                  className="flex items-center justify-center w-20 h-20 bg-off-white rounded-full group-hover:bg-patadoc-teal group-hover:text-white transition-colors duration-300"
                  role="img"
                  aria-label={`Step ${step.id} icon: ${step.title}`}
                >
                  {step.icon}
                </div>
              </div>

              {/* Step Number */}
              <div className="mb-4">
                <span 
                  className="inline-flex items-center justify-center w-8 h-8 bg-patadoc-teal text-white text-sm font-semibold rounded-full"
                  aria-label={`Step ${step.id}`}
                >
                  {step.id}
                </span>
              </div>

              {/* Step Title */}
              <h3 
                id={`step-${step.id}-title`}
                className="text-xl sm:text-2xl font-semibold text-charcoal mb-4"
              >
                {step.title}
              </h3>

              {/* Step Description */}
              <p 
                className="text-base sm:text-lg text-charcoal leading-relaxed"
                aria-describedby={`step-${step.id}-title`}
              >
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}