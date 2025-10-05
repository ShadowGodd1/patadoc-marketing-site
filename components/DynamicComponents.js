import dynamic from 'next/dynamic';

// Dynamic imports for below-the-fold components to improve initial page load
export const DynamicHowItWorksSection = dynamic(
  () => import('./HowItWorksSection'),
  {
    loading: () => (
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-12 sm:mb-16">
              <div className="h-12 bg-gray-200 rounded-md w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-md w-32 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const DynamicFeaturesSection = dynamic(
  () => import('./FeaturesSection'),
  {
    loading: () => (
      <div className="py-16 sm:py-20 lg:py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="h-12 bg-gray-200 rounded-md w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
            </div>
            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
                  <div className="flex-1 w-full">
                    <div className="aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="h-10 bg-gray-200 rounded-md w-3/4 mx-auto lg:mx-0 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6 mx-auto lg:mx-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const DynamicFinalCTASection = dynamic(
  () => import('./FinalCTASection'),
  {
    loading: () => (
      <div className="py-16 sm:py-20 lg:py-24 bg-patadoc-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded-md w-80 mx-auto mb-6"></div>
            <div className="h-6 bg-white/20 rounded-md w-2/3 mx-auto mb-8"></div>
            <div className="max-w-md mx-auto">
              <div className="h-12 bg-white/20 rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const DynamicFooter = dynamic(
  () => import('./Footer'),
  {
    loading: () => (
      <div className="bg-patadoc-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center md:items-start">
                <div className="h-8 w-32 bg-white/20 rounded-md mb-4"></div>
                <div className="h-4 bg-white/20 rounded-md w-48"></div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="h-6 bg-white/20 rounded-md w-16 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded-md w-24"></div>
                  <div className="h-4 bg-white/20 rounded-md w-28"></div>
                  <div className="h-4 bg-white/20 rounded-md w-20"></div>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="h-6 bg-white/20 rounded-md w-20 mb-4"></div>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 bg-white/20 rounded-md"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);