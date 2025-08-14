"use client"

import { CheckCircle, Package, Truck, Mail, Download, Share2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderDetails: {
    customerName: string;
    total: number;
    items: Array<{
      titulo: string;
      quantity: number;
    }>;
  };
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  orderId, 
  orderDetails 
}: SuccessModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="text-center">
        {/* Ícone de Sucesso */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pedido Realizado com Sucesso!
        </h2>
        <p className="text-gray-600 mb-6">
          Seu pedido foi processado e está sendo preparado para envio.
        </p>

        {/* Número do Pedido */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Número do Pedido</p>
          <p className="text-lg font-bold text-gray-900">{orderId}</p>
        </div>

        {/* Detalhes do Pedido */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
          
          <div className="space-y-3 mb-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.titulo} (x{item.quantity})</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-red-600">
                {formatPrice(orderDetails.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Passos</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900">Confirmação por Email</h4>
                <p className="text-xs text-gray-600">
                  Você receberá um email de confirmação em breve
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900">Preparação</h4>
                <p className="text-xs text-gray-600">
                  Seu pedido será preparado e embalado com cuidado
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900">Envio</h4>
                <p className="text-xs text-gray-600">
                  Você receberá o código de rastreamento por email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Continuar Comprando
          </Link>
          
          <button
            onClick={() => {
              // Lógica para baixar comprovante
              console.log('Download comprovante');
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Baixar Comprovante
          </button>
        </div>

        {/* Compartilhar */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Compartilhar com amigos</p>
          <div className="flex justify-center gap-3">
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
