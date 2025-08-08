"use client"

import { useEffect, useRef } from 'react';
import { BsCart2 } from "react-icons/bs";
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItem } from '../types/cart';
import Image from 'next/image';
import Link from 'next/link';

export default function CartModal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    total, 
    itemCount 
  } = useCart();
  const { showToast } = useToast();

  // Suporte para fechar com ESC e gerenciamento de foco
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
      
      // Foca no modal quando abre
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  // Função wrapper para remoção com feedback
  const handleRemoveItem = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      removeFromCart(id);
      showToast(`${item.titulo} removido do carrinho`, 'info', 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div 
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] sm:max-h-[80vh] flex flex-col outline-none animate-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <h2 id="cart-title" className="text-lg sm:text-xl font-bold text-gray-900">Carrinho de Compras</h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <BsCart2 className="m-auto text-7xl text-zinc-400 font-bold mb-10"/>
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <button
                  onClick={closeCart}
                  className="px-4 py-2 cursor-pointer bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                                 {items.map((item) => (
                   <CartItemComponent 
                     key={item.id} 
                     item={item} 
                     onRemove={handleRemoveItem}
                     onUpdateQuantity={updateQuantity}
                   />
                 ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total ({itemCount} {itemCount === 1 ? 'item' : 'itens'}):</span>
                <span className="text-red-700">R$ {total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-800 transition-colors text-center block"
                >
                  Finalizar Compra
                </Link>
                
                <button
                  onClick={closeCart}
                  className="w-full border cursor-pointer border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Componente para cada item do carrinho
function CartItemComponent({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: CartItem; 
  onRemove: (id: number) => void; 
  onUpdateQuantity: (id: number, quantity: number) => void; 
}) {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200 animate-in fade-in-0 slide-in-from-right-2">
      {/* Imagem */}
      <div className="flex-shrink-0">
        <Image
          src={item.img1}
          alt={item.titulo}
          width={60}
          height={80}
          className="rounded-md object-cover"
        />
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {item.titulo}
        </h3>
        <p className="text-sm text-gray-500">
          {item.autor}
        </p>
        <p className="text-sm font-semibold text-red-700">
          R$ {item.price.toFixed(2)}
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 cursor-pointer bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="text-sm font-semibold w-8 text-center">
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 bg-gray-200 cursor-pointer rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
