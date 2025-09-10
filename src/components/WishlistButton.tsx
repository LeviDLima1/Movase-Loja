'use client';

import React, { useState } from 'react';
import { Heart, HeartOff, Loader2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface WishlistButtonProps {
  livro: {
    id: number;
    titulo: string;
    autor: string;
    price: number;
    img1: string;
    categoria: string;
    isbn?: string;
    editora?: string;
    anoPublicacao?: number;
    promocao?: boolean;
    novidade?: boolean;
    destaque?: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export default function WishlistButton({ 
  livro, 
  size = 'md', 
  variant = 'icon',
  className = '' 
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const isInWishlistItem = isInWishlist(livro.id);

  const handleToggleWishlist = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (isInWishlistItem) {
        await removeFromWishlist(livro.id);
        addSuccessNotification('Sucesso!', 'Item removido da lista de desejos!');
      } else {
        await addToWishlist(livro);
        addSuccessNotification('Sucesso!', 'Item adicionado à lista de desejos!');
      }
    } catch (error) {
      console.error('Erro ao alterar wishlist:', error);
      addErrorNotification('Erro!', 'Erro ao alterar lista de desejos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      addErrorNotification('Atenção!', 'Faça login para usar a lista de desejos!');
      return;
    }
    handleToggleWishlist();
  };

  // Tamanhos
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Variantes
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || loading}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          transition-all duration-200
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isInWishlistItem 
            ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }
          ${className}
        `}
        title={isInWishlistItem ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
      >
        {isLoading || loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isInWishlistItem ? (
          <Heart className="w-4 h-4 fill-current" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || loading}
        className={`
          flex items-center gap-2
          ${textSizeClasses[size]}
          font-medium
          transition-colors duration-200
          hover:underline
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isInWishlistItem 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-600 hover:text-red-500'
          }
          ${className}
        `}
      >
        {isLoading || loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isInWishlistItem ? (
          <Heart className="w-4 h-4 fill-current" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        {isInWishlistItem ? 'Remover dos desejos' : 'Adicionar aos desejos'}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || loading}
        className={`
          w-full
          flex items-center justify-center gap-2
          px-4 py-2
          ${textSizeClasses[size]}
          font-medium
          rounded-lg
          border
          transition-all duration-200
          hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isInWishlistItem 
            ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300' 
            : 'text-gray-600 border-gray-200 bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200'
          }
          ${className}
        `}
      >
        {isLoading || loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isInWishlistItem ? (
          <Heart className="w-4 h-4 fill-current" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        {isInWishlistItem ? 'Remover dos desejos' : 'Adicionar aos desejos'}
      </button>
    );
  }

  return null;
}
