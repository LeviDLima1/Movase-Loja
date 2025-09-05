'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import Link from 'next/link';

interface WishlistIconProps {
  className?: string;
  showCount?: boolean;
}

export default function WishlistIcon({ 
  className = '', 
  showCount = true 
}: WishlistIconProps) {
  const { itemCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className={`
        relative
        flex items-center justify-center
        w-10 h-10
        rounded-full
        text-gray-600
        hover:text-red-500
        hover:bg-red-50
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${className}
      `}
      title="Lista de Desejos"
    >
      <Heart className="w-5 h-5" />
      
      {showCount && itemCount > 0 && (
        <span className="
          absolute
          -top-1
          -right-1
          flex
          items-center
          justify-center
          w-5
          h-5
          text-xs
          font-bold
          text-white
          bg-red-500
          rounded-full
          border-2
          border-white
        ">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
