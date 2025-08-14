import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG } from '../constants';
import { User, Mail, CreditCard, Phone } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 sm:p-6 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{config.title}</h3>
            <p className="text-red-100 mt-1 text-base sm:text-lg">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Nome Completo */}
          <div className="space-y-2">
            <InputField
              label="Nome Completo"
              value={customerData.name}
              onChange={(value) => onCustomerChange('name', value)}
              placeholder="Digite seu nome completo"
              required
              icon={<User className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <InputField
              label="E-mail"
              value={customerData.email}
              onChange={(value) => onCustomerChange('email', value)}
              placeholder="seu@email.com"
              type="email"
              required
              icon={<Mail className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <InputField
              label="CPF"
              value={customerData.cpf}
              onChange={(value) => onCustomerChange('cpf', value)}
              placeholder="000.000.000-00"
              required
              icon={<CreditCard className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <InputField
              label="Telefone"
              value={customerData.phone}
              onChange={(value) => onCustomerChange('phone', value)}
              placeholder="(11) 99999-9999"
              required
              icon={<Phone className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>
        </div>

        {/* Informações de segurança */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Dados Protegidos</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Seus dados pessoais são protegidos com criptografia SSL de 256 bits. 
                Utilizamos apenas as informações necessárias para processar seu pedido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoaisStep;
