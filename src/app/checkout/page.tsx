"use client";

import CheckoutForm from '../../components/checkout/CheckoutForm';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CorreiosResponse } from '../../correios';
import Header from '../../components/header/page';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Shield, 
  Truck, 
  CreditCard, 
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [selectedFrete, setSelectedFrete] = useState<CorreiosResponse | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md mx-4">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Carrinho vazio</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Adicione alguns livros ao seu carrinho para continuar com a compra
            </p>
            <Link 
              href="/livros" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Explorar Livros
            </Link>
          </div>
        </div>
      </>
    );
  }

  const totalComFrete = total + (selectedFrete ? parseFloat(selectedFrete.Valor.replace(',', '.')) : 0);

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                href="/livros" 
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Finalizar Compra</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-10 xl:flex lg:gap-4 xl:gap-6 2xl:gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Informações do Pedido</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Complete os dados para finalizar sua compra</p>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                  <CheckoutForm 
                    onSuccess={(orderId) => {
                      console.log('Pedido realizado com ID:', orderId);
                    }}
                    onFreteChange={setSelectedFrete}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar com Resumo */}
            <div className="lg:col-span-3 mt-8 lg:mt-6 space-y-6 xl:space-y-8">
              {/* Resumo do Pedido */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3 xl:gap-4">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Resumo do Pedido</h2>
                      <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de Itens */}
                <div className="p-4 sm:p-6 space-y-4 xl:space-y-5 max-h-80 xl:max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                        {item.img1 && (
                          <Image
                            src={item.img1}
                            alt={item.titulo}
                            width={64}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {item.titulo}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          por {item.autor}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            Qtd: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="space-y-3 xl:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Subtotal</span>
                      <span className="font-semibold text-base sm:text-lg">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Frete</span>
                      <span className="font-semibold text-base sm:text-lg text-gray-900">
                        {selectedFrete ? formatPrice(parseFloat(selectedFrete.Valor.replace(',', '.'))) : 'Calculando...'}
                      </span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-3 xl:pt-4 flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-lg sm:text-xl">Total</span>
                      <span className="text-red-600 font-bold text-xl sm:text-2xl">{formatPrice(totalComFrete)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações de Segurança */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Compra 100% Segura</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Criptografia SSL de 256 bits</p>
                      <p>• Dados protegidos</p>
                      <p>• Certificado de segurança</p>
                      <p>• Ambiente seguro</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suporte */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Precisa de Ajuda?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">suporte@movase.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Seg-Sex: 9h às 18h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
