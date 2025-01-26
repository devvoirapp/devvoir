'use client';

import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, alt = '', fallback = '', className = '' }: AvatarProps) {
  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?';
  
  return (
    <div className={`relative rounded-full overflow-hidden bg-purple-50 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.removeAttribute('style');
          }}
          width={96}
          height={96}
          quality={100}
          priority
        />
      ) : null}
      <div
        className="absolute inset-0 flex items-center justify-center bg-purple-100 text-purple-600 font-semibold text-lg"
        style={{ display: src ? 'none' : 'flex' }}
      >
        {initials}
      </div>
    </div>
  );
}
