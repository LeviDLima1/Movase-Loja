"use client"

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItem } from '../types/cart';

interface AddToCartButtonProps {
  livro: Omit<CartItem, 'quantity'>;
  className?: string;
}

export default function AddToCartButton({ livro, className = '' }: AddToCartButtonProps) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isAdding) return; // Previne cliques múltiplos
    
    setIsAdding(true);
    addToCart(livro);
    openCart();
    
    // Feedback visual
    showToast(`${livro.titulo} adicionado ao carrinho!`, 'success');
    
    // Reset após um breve delay
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`px-6 py-2 border-2 cursor-pointer border-red-700 text-red-700 font-semibold rounded-lg bg-white shadow-[inset_0_0_0_0_#dc2626] hover:shadow-[inset_0_0_0_40px_#fff1f1] transition-all duration-500 ease-in-out transform hover:scale-95 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden ${className}`}
    >
      <span className={`transition-opacity duration-200 ${isAdding ? 'opacity-0' : 'opacity-100'}`}>
        ADICIONAR AO CARRINHO
      </span>
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center opacity-100 animate-pulse">
          ADICIONANDO...
        </span>
      )}
    </button>
  );
}
