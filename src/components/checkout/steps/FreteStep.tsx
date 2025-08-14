"use client"

import { useState } from 'react';
import { CorreiosResponse } from '../../../correios';
import { Truck, Clock, Package, Zap, DollarSign, Settings } from 'lucide-react';

interface FreteStepProps {
  opcoes: CorreiosResponse[];
  selecionado: CorreiosResponse | null;
  onSelecionar: (opcao: CorreiosResponse) => void;
  isLoading?: boolean;
}

export default function FreteStep({ 
  opcoes, 
  selecionado, 
  onSelecionar, 
  isLoading = false 
}: FreteStepProps) {
  const [formaEntrega, setFormaEntrega] = useState<'mais_rapida' | 'mais_barata' | 'personalizada'>('mais_rapida');

  // Ordenar opções por prazo (mais rápida primeiro)
  const opcoesOrdenadas = [...opcoes].sort((a, b) => 
    parseInt(a.PrazoEntrega) - parseInt(b.PrazoEntrega)
  );

  // Ordenar por valor (mais barata primeiro)
  const opcoesPorValor = [...opcoes].sort((a, b) => 
    parseFloat(a.Valor.replace(',', '.')) - parseFloat(b.Valor.replace(',', '.'))
  );

  const getOpcoesExibidas = () => {
    switch (formaEntrega) {
      case 'mais_rapida':
        return opcoesOrdenadas.slice(0, 2); // 2 opções mais rápidas
      case 'mais_barata':
        return opcoesPorValor.slice(0, 2); // 2 opções mais baratas
      case 'personalizada':
        return opcoes; // Todas as opções
      default:
        return opcoesOrdenadas.slice(0, 2);
    }
  };

  const getTituloForma = () => {
    switch (formaEntrega) {
      case 'mais_rapida':
        return 'Entrega Mais Rápida';
      case 'mais_barata':
        return 'Entrega Mais Econômica';
      case 'personalizada':
        return 'Todas as Opções';
      default:
        return 'Opções de Entrega';
    }
  };

  const getDescricaoForma = () => {
    switch (formaEntrega) {
      case 'mais_rapida':
        return 'Receba seu pedido o mais rápido possível';
      case 'mais_barata':
        return 'Economize no frete com entrega em mais tempo';
      case 'personalizada':
        return 'Escolha entre todas as opções disponíveis';
      default:
        return 'Selecione a forma de entrega';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Calculando Frete</h3>
              <p className="text-yellow-100 mt-1 text-lg">Buscando as melhores opções para você</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 font-medium">Buscando opções de frete...</p>
              <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns segundos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (opcoes.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 sm:p-6 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{getTituloForma()}</h3>
            <p className="text-yellow-100 mt-1 text-base sm:text-lg">{getDescricaoForma()}</p>
          </div>
        </div>
      </div>

      {/* Seletor de forma de entrega */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFormaEntrega('mais_rapida')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              formaEntrega === 'mais_rapida'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <Zap className="w-4 h-4" />
            🚀 Mais Rápida
          </button>
          <button
            onClick={() => setFormaEntrega('mais_barata')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              formaEntrega === 'mais_barata'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            💰 Mais Barata
          </button>
          <button
            onClick={() => setFormaEntrega('personalizada')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              formaEntrega === 'personalizada'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <Settings className="w-4 h-4" />
            ⚙️ Todas
          </button>
        </div>
      </div>

      {/* Opções de frete */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-3 sm:space-y-4">
          {getOpcoesExibidas().map((opcao, index) => {
            const isSelecionado = selecionado === opcao;
            const isMaisRapida = index === 0 && formaEntrega === 'mais_rapida';
            const isMaisBarata = index === 0 && formaEntrega === 'mais_barata';
            
            return (
              <label 
                key={index} 
                className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelecionado 
                    ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="frete"
                    value={index}
                    checked={isSelecionado}
                    onChange={() => onSelecionar(opcao)}
                    className="mr-4 w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {opcao.Codigo === '04014' ? 'SEDEX' : 'PAC'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {opcao.PrazoEntrega} dias úteis
                          </div>
                        </div>
                      </div>
                      
                      {isMaisRapida && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          ⚡ Mais Rápida
                        </span>
                      )}
                      {isMaisBarata && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          💰 Mais Barata
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {opcao.EntregaSabado === 'S' && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Entrega aos sábados
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {opcao.EntregaDomiciliar === 'S' ? 'Entrega domiciliar' : 'Retirada na agência'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-700">
                      R$ {opcao.Valor.replace(',', '.')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Frete incluso
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Dica de Entrega</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {formaEntrega === 'mais_rapida' 
                  ? 'SEDEX é ideal para entregas urgentes e oferece rastreamento completo' 
                  : formaEntrega === 'mais_barata'
                  ? 'PAC oferece o melhor custo-benefício para entregas não urgentes'
                  : 'Compare todas as opções para escolher a que melhor atende suas necessidades'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
