import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG } from '../constants';

interface DadosPessoaisStepProps {
  customerData: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  onCustomerChange: (field: string, value: string) => void;
}

const DadosPessoaisStep: React.FC<DadosPessoaisStepProps> = ({ 
  customerData, 
  onCustomerChange 
}) => {
  const config = STEP_CONFIG['dados-pessoais'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-base">{config.icon}</span>
          </div>
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2">{config.description}</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Nome Completo *"
            value={customerData.name}
            onChange={(value) => onCustomerChange('name', value)}
            placeholder="Digite seu nome completo"
            required
          />
          <InputField
            label="E-mail *"
            value={customerData.email}
            onChange={(value) => onCustomerChange('email', value)}
            placeholder="seu@email.com"
            type="email"
            required
          />
          <InputField
            label="CPF *"
            value={customerData.cpf}
            onChange={(value) => onCustomerChange('cpf', value)}
            placeholder="000.000.000-00"
            required
          />
          <InputField
            label="Telefone *"
            value={customerData.phone}
            onChange={(value) => onCustomerChange('phone', value)}
            placeholder="(11) 99999-9999"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DadosPessoaisStep;
