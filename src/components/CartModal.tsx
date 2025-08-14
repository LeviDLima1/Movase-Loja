"use client"

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItem } from '../types/cart';
import Image from 'next/image';
import Link from 'next/link';
import Modal from './ui/Modal';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Package, 
  Truck, 
  Shield, 
  CreditCard,
  Heart,
  Star
} from 'lucide-react';

export default function CartModal() {
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

  // Função wrapper para remoção com feedback
  const handleRemoveItem = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      removeFromCart(id);
      showToast(`${item.titulo} removido do carrinho`, 'info', 2000, 'Item Removido');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeCart}
      title="Carrinho de Compras"
      size="lg"
      showCloseButton={true}
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <div className="space-y-6">
        {/* Header com contador */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-red-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Seu Carrinho</h3>
            <p className="text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>

        {/* Lista de itens */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Seu carrinho está vazio
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione alguns livros para começar suas compras
            </p>
            <button
              onClick={closeCart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.titulo}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.autor}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.5</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Preço */}
                      <div className="text-right">
                                                 <p className="font-semibold text-gray-900">
                           {formatPrice(item.price * item.quantity)}
                         </p>
                         <p className="text-sm text-gray-500">
                           {formatPrice(item.price)} cada
                         </p>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                                                 <button
                           onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                           className="p-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                         >
                           <Minus className="h-3 w-3" />
                         </button>
                         <span className="w-8 text-center text-sm font-medium">
                           {item.quantity}
                         </span>
                         <button
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                           className="p-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                         >
                           <Plus className="h-3 w-3" />
                         </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Entrega Rápida</h4>
                  <p className="text-xs text-gray-500">Em até 3 dias úteis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Compra Segura</h4>
                  <p className="text-xs text-gray-500">Pagamento 100% seguro</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Embalagem Especial</h4>
                  <p className="text-xs text-gray-500">Proteção garantida</p>
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemCount} itens):</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete:</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3">
              <button
                onClick={closeCart}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continuar Comprando
              </button>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <CreditCard className="h-4 w-4" />
                Finalizar Compra
              </Link>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
