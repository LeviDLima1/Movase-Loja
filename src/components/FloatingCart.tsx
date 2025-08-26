"use client"

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Package } from 'lucide-react';

export default function FloatingCart() {
  const { itemCount, total, openCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  useEffect(() => {
    if (itemCount > 0) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [itemCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[50]">
      {/* Carrinho Flutuante */}
      <div className="relative">
        <button
          onClick={openCart}
          className={`group relative bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 transform hover:scale-110 touch-manipulation ${
            isAnimating ? 'animate-bounce' : ''
          }`}
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className="h-6 w-6" />
          
          {/* Badge com quantidade */}
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Carrinho</h3>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="font-bold text-red-600">{formatPrice(total)}</span>
          </div>
          
          {/* Seta */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      </div>

      {/* Notificação de item adicionado */}
      {isAnimating && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          +1
        </div>
      )}
    </div>
  );
}
