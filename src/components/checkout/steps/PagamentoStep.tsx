import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG, METODOS_PAGAMENTO, CAMPOS_CARTAO } from '../constants';
import Image from 'next/image';
import { CreditCard, QrCode, FileText, Shield, Lock } from 'lucide-react';

interface PagamentoStepProps {
  paymentMethod: 'credit_card' | 'boleto' | 'pix';
  onPaymentMethodChange: (method: 'credit_card' | 'boleto' | 'pix') => void;
  cardData: {
    number: string;
    expMonth: string;
    expYear: string;
    securityCode: string;
    holderName: string;
    holderBirthDate: string;
    holderCPF: string;
  };
  onCardChange: (field: string, value: string) => void;
}

const PagamentoStep: React.FC<PagamentoStepProps> = ({ 
  paymentMethod, 
  onPaymentMethodChange, 
  cardData, 
  onCardChange 
}) => {
  const config = STEP_CONFIG['pagamento'];

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'pix':
        return <QrCode className="w-5 h-5" />;
      case 'boleto':
        return <FileText className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{config.title}</h3>
            <p className="text-purple-100 mt-1 text-base sm:text-lg">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Métodos de Pagamento */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {METODOS_PAGAMENTO.map(metodo => (
            <label 
              key={metodo.id} 
              className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                paymentMethod === metodo.id
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value={metodo.id}
                  checked={paymentMethod === metodo.id}
                  onChange={(e) => onPaymentMethodChange(e.target.value as any)}
                  className="mr-4 w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    {getMethodIcon(metodo.id)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">{metodo.title}</div>
                    <div className="text-sm text-gray-600">{metodo.description}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {metodo.bandeiras.map((bandeira, index) => (
                      <div key={index} className="w-8 h-5 rounded flex items-center justify-center bg-white p-1 shadow-sm">
                        <Image src={bandeira} alt={metodo.title} width={24} height={16} className="object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Dados do Cartão */}
        {paymentMethod === 'credit_card' && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Dados do Cartão</h4>
                <p className="text-sm text-gray-600">Preencha as informações do seu cartão</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CAMPOS_CARTAO.map(campo => (
                <div key={campo.id} className={campo.colSpan === 'lg:col-span-2' ? 'lg:col-span-2' : ''}>
                  <InputField
                    label={campo.label}
                    value={cardData[campo.id as keyof typeof cardData]}
                    onChange={(value) => onCardChange(campo.id, value)}
                    placeholder={campo.placeholder}
                    maxLength={campo.maxLength}
                    required
                    className="bg-white shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              ))}
            </div>

            {/* Informações de segurança */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-green-900">Pagamento Seguro</h5>
                  <p className="text-sm text-green-700">
                    Seus dados são protegidos com criptografia SSL de 256 bits
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações de segurança geral */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Ambiente Seguro</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Todos os pagamentos são processados em ambiente seguro. 
                Suas informações estão protegidas e não serão compartilhadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentoStep;
