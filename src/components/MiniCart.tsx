"use client"

import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cart';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, ArrowRight, Package } from 'lucide-react';

export default function MiniCart() {
  const { items, total, itemCount, openCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sempre mostrar o carrinho, mesmo vazio

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <div 
        className="group relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-all duration-200 cursor-pointer rounded-lg hover:bg-red-50"
        onClick={() => setIsVisible(!isVisible)}
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">Carrinho</span>
        {itemCount > 0 && (
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
            <Package className="h-3 w-3" />
            <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
          </div>
        )}
      </div>

      {/* Mini Cart Dropdown */}
      {isVisible && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Carrinho</h3>
              <span className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
            </div>
          </div>

          {/* Items */}
          <div className="max-h-64 overflow-y-auto">
            {itemCount === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Seu carrinho está vazio</p>
                <p className="text-gray-400 text-xs mt-1">Adicione produtos para começar</p>
              </div>
            ) : (
              <>
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <Image
                      src={item.img1}
                      alt={item.titulo}
                      width={40}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.titulo}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.autor}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-red-600">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qtd: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      +{items.length - 3} mais {items.length - 3 === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            {itemCount > 0 ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-red-600">{formatPrice(total)}</span>
                </div>
                
                <button
                  onClick={() => {
                    setIsVisible(false);
                    openCart();
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Ver Carrinho
                </button>
              </>
            ) : (
              <Link
                href="/livros"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Ver Produtos
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
