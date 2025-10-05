import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image component with WebP fallback and error handling
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  className = '',
  sizes,
  fill = false,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate blur data URL if not provided
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Fallback for broken images
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    priority,
    quality,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    sizes,
    loading: priority ? 'eager' : loading,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onError: handleError,
    onLoad: handleLoad,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width} height={height} alt={alt} />;
}

/**
 * Optimized Image with aspect ratio container to prevent layout shift
 */
export function OptimizedImageWithContainer({
  src,
  alt,
  width,
  height,
  containerClassName = '',
  ...imageProps
}) {
  return (
    <div 
      className={`relative ${containerClassName}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill
        {...imageProps}
      />
    </div>
  );
}