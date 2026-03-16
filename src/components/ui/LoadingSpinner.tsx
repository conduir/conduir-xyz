import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner - A reusable loading spinner component
 *
 * @param size - The size of the spinner (sm: 16px, md: 20px, lg: 24px)
 * @param className - Additional CSS classes to apply
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-2',
  };

  return (
    <div
      className={`${sizes[size]} border-white/30 border-t-white rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * ButtonLoadingSpinner - A loading spinner specifically for use inside buttons
 * Automatically sizes to fit the button text size
 */
export function ButtonLoadingSpinner() {
  return <LoadingSpinner size="sm" className="text-white" />;
}

/**
 * PageLoadingSpinner - A larger loading spinner for full-page loading states
 */
export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default LoadingSpinner;
