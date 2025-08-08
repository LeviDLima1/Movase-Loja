"use client";

import CheckoutForm from '../../components/checkout/CheckoutForm';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CorreiosResponse } from '../../correios';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [selectedFrete, setSelectedFrete] = useState<CorreiosResponse | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
          <p className="text-gray-600 mb-6">Adicione alguns livros ao seu carrinho para continuar</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a lista de livros
          </Link>
        </div>
      </div>
    );
  }

  const totalComFrete = total + (selectedFrete ? parseFloat(selectedFrete.Valor.replace(',', '.')) : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center text-red-700 hover:text-red-800 font-semibold transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para livros
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Finalizar Compra</h1>
            <div className="w-20"></div> {/* Spacer para centralizar o título */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <CheckoutForm 
              onSuccess={(orderId) => {
                console.log('Pedido realizado com ID:', orderId);
              }}
              onFreteChange={setSelectedFrete}
            />
          </div>

          {/* Sidebar com Resumo */}
          <div className="lg:col-span-1 mt-8 lg:mt-17">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              {/* Header do Resumo */}
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h2>
                <p className="text-sm text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
              </div>

              {/* Lista de Itens */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded-lg overflow-hidden">
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
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qtd: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="p-6 border-t bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-medium text-gray-900">
                      {selectedFrete ? `R$ ${selectedFrete.Valor}` : 'Calculando...'}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-red-700">R$ {totalComFrete.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Segurança */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Compra Segura</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Seus dados estão protegidos com criptografia SSL de 256 bits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
