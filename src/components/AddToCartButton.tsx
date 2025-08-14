"use client"

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItem } from '../types/cart';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';

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
    showToast(`${livro.titulo} adicionado ao carrinho!`, 'success', 3000, 'Item Adicionado');
    
    // Reset após um breve delay
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`}
    >
      {/* Estado normal */}
      <span className={`flex items-center gap-2 transition-all duration-300 ${isAdding ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
        Adicionar ao Carrinho
      </span>
      
      {/* Estado de loading */}
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adicionando...
        </span>
      )}
      
      {/* Estado de sucesso (breve) */}
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 animate-pulse">
          <Check className="h-4 w-4" />
          Adicionado!
        </span>
      )}
    </button>
  );
}
