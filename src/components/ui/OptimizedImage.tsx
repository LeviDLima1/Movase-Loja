'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  fallbackSrc = '/api/placeholder/300/400'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      console.log(`❌ Erro ao carregar imagem: ${imgSrc}, usando fallback`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Se não há src, usar fallback diretamente
  if (!src || src === '') {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        className={className}
        priority={priority}
        sizes={sizes}
        fill={fill}
        width={!fill ? (width || 300) : undefined}
        height={!fill ? (height || 400) : undefined}
      />
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    priority,
    sizes,
    onError: handleError,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 300}
      height={height || 400}
    />
  );
}
