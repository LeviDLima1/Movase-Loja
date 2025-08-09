import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-red-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}

// Skeleton loader for content
export function Skeleton({ className = '', lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-2 last:mb-0"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 20 + 15}%` }} />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-3 border-b border-gray-200">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-gray-200 rounded" 
              style={{ width: `${Math.random() * 30 + 20}%` }} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}
