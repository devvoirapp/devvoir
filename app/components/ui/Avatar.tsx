'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ 
  src, 
  alt = '', 
  fallback = '', 
  size = 'md',
  className = ''
}: AvatarProps) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getFallbackInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || error) {
    return (
      <div 
        className={`${sizes[size]} bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-medium ${className}`}
      >
        {getFallbackInitials(fallback)}
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
