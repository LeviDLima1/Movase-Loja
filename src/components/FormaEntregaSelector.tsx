"use client"

import { useState } from 'react';
import { CorreiosResponse } from '../correios';

interface FormaEntregaSelectorProps {
  opcoes: CorreiosResponse[];
  selecionado: CorreiosResponse | null;
  onSelecionar: (opcao: CorreiosResponse) => void;
  isLoading?: boolean;
}

export default function FormaEntregaSelector({ 
  opcoes, 
  selecionado, 
  onSelecionar, 
  isLoading = false 
}: FormaEntregaSelectorProps) {
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3 sm:p-4 lg:p-6 border-b">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            Calculando opções de frete...
          </h3>
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">Buscando melhores opções...</span>
          </div>
        </div>
      </div>
    );
  }

  if (opcoes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-3 sm:p-4 lg:p-6 border-b">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {getTituloForma()}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">{getDescricaoForma()}</p>
      </div>

      {/* Seletor de forma de entrega */}
      <div className="p-2 sm:p-3 lg:p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFormaEntrega('mais_rapida')}
            className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              formaEntrega === 'mais_rapida'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            🚀 Mais Rápida
          </button>
          <button
            onClick={() => setFormaEntrega('mais_barata')}
            className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              formaEntrega === 'mais_barata'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            💰 Mais Barata
          </button>
          <button
            onClick={() => setFormaEntrega('personalizada')}
            className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              formaEntrega === 'personalizada'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            ⚙️ Todas
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-2 sm:space-y-3">
          {getOpcoesExibidas().map((opcao, index) => {
            const isSelecionado = selecionado === opcao;
            const isMaisRapida = index === 0 && formaEntrega === 'mais_rapida';
            const isMaisBarata = index === 0 && formaEntrega === 'mais_barata';
            
            return (
              <label 
                key={index} 
                className={`flex items-center p-2 sm:p-3 lg:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelecionado 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="frete"
                  value={index}
                  checked={isSelecionado}
                  onChange={() => onSelecionar(opcao)}
                  className="mr-2 sm:mr-3 lg:mr-4 w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 focus:ring-yellow-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="text-sm sm:text-base font-medium text-gray-900">
                      {opcao.Codigo === '04014' ? 'SEDEX' : 'PAC'}
                    </div>
                    {isMaisRapida && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Mais Rápida
                      </span>
                    )}
                    {isMaisBarata && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Mais Barata
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    📦 {opcao.PrazoEntrega} dias úteis
                  </div>
                  {opcao.EntregaSabado === 'S' && (
                    <div className="text-xs text-blue-600 mt-1">
                      ✅ Entrega aos sábados
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-yellow-700">
                    R$ {opcao.Valor.replace(',', '.')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {opcao.EntregaDomiciliar === 'S' ? '🏠 Domiciliar' : '📮 Agência'}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 lg:p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-1 sm:space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs sm:text-sm text-blue-800">
              <strong>Dica:</strong> {formaEntrega === 'mais_rapida' 
                ? 'SEDEX é ideal para entregas urgentes' 
                : formaEntrega === 'mais_barata'
                ? 'PAC oferece o melhor custo-benefício'
                : 'Compare todas as opções para escolher a melhor para você'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
