'use client';

import Image from 'next/image';

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Smart Insurance Filtering",
      description: "Find doctors who accept your insurance plan instantly. No more calling offices or wondering about coverage - PataDoc shows you exactly which providers work with your plan.",
      image: "/images/feature-insurance-filter.webp",
      imageAlt: "Screenshot of PataDoc mobile app displaying the insurance filtering feature. The interface shows a dropdown menu with various Kenyan insurance providers including NHIF, AAR, Jubilee, and CIC, allowing users to filter doctors by their accepted insurance plans.",
      imageFirst: true
    },
    {
      id: 2,
      title: "KMPDC Verified Doctors",
      description: "Every doctor on PataDoc is verified by the Kenya Medical Practitioners and Dentists Council. See their credentials, specializations, and practice history with confidence.",
      image: "/images/feature-kmpdc-badge.webp",
      imageAlt: "Doctor profile page showing the official KMPDC (Kenya Medical Practitioners and Dentists Council) verification badge prominently displayed next to the doctor's credentials, including their license number, specialization, and years of practice.",
      imageFirst: false
    }
  ];

  return (
    <section 
      className="py-16 sm:py-20 lg:py-24 bg-off-white"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-patadoc-teal mb-4"
          >
            Built for Kenya&apos;s Healthcare
          </h2>
          <p className="text-lg sm:text-xl text-charcoal max-w-3xl mx-auto">
            PataDoc understands the unique challenges of finding quality healthcare in Kenya. 
            Our features are designed specifically for the Kenyan healthcare landscape.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-16 sm:space-y-20 lg:space-y-24">
          {features.map((feature) => (
            <article 
              key={feature.id}
              className={`flex flex-col ${
                feature.imageFirst 
                  ? 'lg:flex-row' 
                  : 'lg:flex-row-reverse'
              } items-center gap-8 lg:gap-12 xl:gap-16`}
              aria-labelledby={`feature-${feature.id}-title`}
            >
              {/* Image Container */}
              <div className="flex-1 w-full" role="img" aria-labelledby={`feature-${feature.id}-title`}>
                <div className="relative aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority={feature.id === 1}
                    loading={feature.id === 1 ? 'eager' : 'lazy'}
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    role="img"
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-1 text-center lg:text-left">
                <h3 
                  id={`feature-${feature.id}-title`}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal mb-4 sm:mb-6"
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-base sm:text-lg lg:text-xl text-charcoal leading-relaxed max-w-2xl mx-auto lg:mx-0"
                  aria-describedby={`feature-${feature.id}-title`}
                >
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}