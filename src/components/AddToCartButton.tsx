"use client"

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItem } from '../types/cart';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  livro: Omit<CartItem, 'quantity'>;
  className?: string;
  disabled?: boolean;
  status?: string;
}

export default function AddToCartButton({ livro, className = '', disabled = false, status }: AddToCartButtonProps) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Verifica se o livro está disponível
  const isAvailable = status === 'disponivel' && !disabled;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isAdding) return; // Previne cliques múltiplos
    
    if (!isAvailable) {
      // Mostra mensagem de erro para livros indisponíveis
      showToast(`${livro.titulo} não está disponível no momento`, 'error', 3000, 'Item Indisponível');
      return;
    }
    
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
      disabled={isAdding || !isAvailable}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform shadow-lg touch-manipulation ${
        isAvailable 
          ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 hover:scale-105 active:scale-95 hover:shadow-xl' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={isAvailable ? 'Adicionar ao carrinho' : 'Item indisponível'}
    >
      {/* Estado normal */}
      <span className={`flex items-center gap-2 transition-all duration-300 ${isAdding ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <ShoppingCart className={`h-4 w-4 ${isAvailable ? 'group-hover:scale-110 transition-transform duration-200' : ''}`} />
        {isAvailable ? 'Adicionar ao Carrinho' : 'Indisponível'}
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
