import React from 'react';
import InputField from '../InputField';
import { STEP_CONFIG, ESTADOS_BRASIL } from '../constants';
import { UserAddress } from '../../../types/cart';
import { MapPin, Search, Home, Building, Map, Navigation } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{config.title}</h3>
            <p className="text-blue-100 mt-1 text-base sm:text-lg">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* CEP com busca automática */}
          <div className="lg:col-span-2">
            <div className="relative">
              <label className="block text-base font-semibold text-gray-700 mb-3">
                CEP
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address.cep}
                  onChange={(e) => onAddressChange('cep', e.target.value)}
                  className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 pl-12 bg-white shadow-sm"
                  placeholder="00000-000"
                  maxLength={8}
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                {(isBuscandoEndereco || isCalculatingFrete) && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <Search className="w-4 h-4 mr-1" />
                Digite o CEP para preenchimento automático
              </p>
            </div>
          </div>

          {/* Logradouro */}
          <div className="lg:col-span-2">
            <InputField
              label="Logradouro"
              value={address.logradouro}
              onChange={(value) => onAddressChange('logradouro', value)}
              placeholder="Rua, Avenida, etc."
              required
              icon={<MapPin className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Número e Complemento */}
          <div className="space-y-2">
            <InputField
              label="Número"
              value={address.numero}
              onChange={(value) => onAddressChange('numero', value)}
              placeholder="123"
              required
              icon={<Home className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <InputField
              label="Complemento"
              value={address.complemento || ''}
              onChange={(value) => onAddressChange('complemento', value)}
              placeholder="Apto, Casa, etc."
              icon={<Building className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Bairro */}
          <div className="space-y-2">
            <InputField
              label="Bairro"
              value={address.bairro}
              onChange={(value) => onAddressChange('bairro', value)}
              placeholder="Centro, Jardim, etc."
              required
              icon={<Map className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Cidade */}
          <div className="space-y-2">
            <InputField
              label="Cidade"
              value={address.cidade}
              onChange={(value) => onAddressChange('cidade', value)}
              placeholder="São Paulo"
              required
              icon={<Navigation className="w-5 h-5" />}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Estado */}
          <div className="lg:col-span-2">
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Estado
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={address.uf}
                onChange={(e) => onAddressChange('uf', e.target.value)}
                className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 bg-white shadow-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Selecione o estado</option>
                {ESTADOS_BRASIL.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de entrega */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 mb-1">Entrega Garantida</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Após preencher o CEP, calcularemos automaticamente as opções de frete disponíveis 
                para sua região. Entregamos em todo o Brasil!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnderecoStep;
