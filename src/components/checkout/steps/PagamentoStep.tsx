import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG, METODOS_PAGAMENTO, CAMPOS_CARTAO } from '../constants';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 sm:p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${config.color}-100 rounded-full flex items-center justify-center mr-2 sm:mr-3`}>
            <span className="text-sm sm:text-base">{config.icon}</span>
          </div>
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {METODOS_PAGAMENTO.map(metodo => (
            <label key={metodo.id} className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value={metodo.id}
                checked={paymentMethod === metodo.id}
                onChange={(e) => onPaymentMethodChange(e.target.value as any)}
                className="mr-3 sm:mr-4 w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{metodo.title}</div>
                <div className="text-sm text-gray-600">{metodo.description}</div>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                {metodo.colors.map((color, index) => (
                  <div key={index} className={`w-6 h-4 sm:w-8 sm:h-5 ${color} rounded`}></div>
                ))}
              </div>
            </label>
          ))}
        </div>

        {/* Dados do Cartão */}
        {paymentMethod === 'credit_card' && (
          <div className="mt-6 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Dados do Cartão
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {CAMPOS_CARTAO.map(campo => (
                <InputField
                  key={campo.id}
                  label={campo.label}
                  value={cardData[campo.id as keyof typeof cardData]}
                  onChange={(value) => onCardChange(campo.id, value)}
                  placeholder={campo.placeholder}
                  maxLength={campo.maxLength}
                  required
                  colSpan={campo.colSpan || ''}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagamentoStep;
