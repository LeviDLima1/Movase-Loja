"use client"

import { useCart } from '../context/CartContext';
import { BsCart2 } from "react-icons/bs";

export default function CartIcon() {
  const { itemCount, openCart } = useCart();

  return (
    <button 
      onClick={openCart}
      className="flex items-center gap-1 p-3 text-red-700 hover:text-red-600 font-bold transition-colors duration-200 cursor-pointer relative"
      aria-label="Abrir carrinho"
    >
      <BsCart2/>
      <span>Carrinho</span>

      {/* Badge com quantidade */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
