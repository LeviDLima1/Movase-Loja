"use client"

import { useCart } from '../context/CartContext';
import { ShoppingCart, Package } from 'lucide-react';

export default function CartIcon() {
  const { itemCount, openCart } = useCart();

  return (
    <button 
      onClick={openCart}
      className="group relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-all duration-200 cursor-pointer rounded-lg hover:bg-red-50"
      aria-label="Abrir carrinho"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        
        {/* Badge com quantidade */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      
      <span className="hidden sm:inline">Carrinho</span>
      
      {/* Indicador de itens */}
      {itemCount > 0 && (
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
          <Package className="h-3 w-3" />
          <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
        </div>
      )}
    </button>
  );
}
