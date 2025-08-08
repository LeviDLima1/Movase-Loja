import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG, ESTADOS_BRASIL } from '../constants';
import { UserAddress } from '../../../types/cart';

interface EnderecoStepProps {
  address: UserAddress;
  onAddressChange: (field: keyof UserAddress, value: string) => void;
  isBuscandoEndereco: boolean;
  isCalculatingFrete: boolean;
}

const EnderecoStep: React.FC<EnderecoStepProps> = ({ 
  address, 
  onAddressChange, 
  isBuscandoEndereco, 
  isCalculatingFrete 
}) => {
  const config = STEP_CONFIG['endereco'];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP *
            </label>
            <div className="relative">
              <input
                type="text"
                value={address.cep}
                onChange={(e) => onAddressChange('cep', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors pr-10 sm:pr-12"
                placeholder="00000-000"
                maxLength={8}
                required
              />
              {isBuscandoEndereco && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
              {isCalculatingFrete && !isBuscandoEndereco && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-yellow-600"></div>
                </div>
              )}
            </div>
          </div>
          <InputField
            label="Logradouro *"
            value={address.logradouro}
            onChange={(value) => onAddressChange('logradouro', value)}
            placeholder="Rua, Avenida, etc."
            required
            colSpan="sm:col-span-2"
          />
          <InputField
            label="Número *"
            value={address.numero}
            onChange={(value) => onAddressChange('numero', value)}
            placeholder="123"
            required
          />
          <InputField
            label="Complemento"
            value={address.complemento || ''}
            onChange={(value) => onAddressChange('complemento', value)}
            placeholder="Apto, Casa, etc."
          />
          <InputField
            label="Bairro *"
            value={address.bairro}
            onChange={(value) => onAddressChange('bairro', value)}
            placeholder="Centro, Jardim, etc."
            required
          />
          <InputField
            label="Cidade *"
            value={address.cidade}
            onChange={(value) => onAddressChange('cidade', value)}
            placeholder="São Paulo"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              value={address.uf}
              onChange={(e) => onAddressChange('uf', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Selecione...</option>
              {ESTADOS_BRASIL.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnderecoStep;
