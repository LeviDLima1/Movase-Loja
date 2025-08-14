'use client';

import { useState, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { useLivros, FiltrosDisponiveis } from '@/hooks/useLivros';

interface BuscaFiltrosProps {
  filtrosDisponiveis: FiltrosDisponiveis | null;
  onBuscar: (termo: string) => void;
  onFiltrarCategoria: (categoria: string) => void;
  onFiltrarPreco: (min: string, max: string) => void;
  onOrdenar: (ordenacao: string) => void;
  onLimparFiltros: () => void;
  onFiltrarDestaque: (destaque: boolean) => void;
  onFiltrarNovidade: (novidade: boolean) => void;
  onFiltrarPromocao: (promocao: boolean) => void;
}

export default function BuscaFiltros({
  filtrosDisponiveis,
  onBuscar,
  onFiltrarCategoria,
  onFiltrarPreco,
  onOrdenar,
  onLimparFiltros,
  onFiltrarDestaque,
  onFiltrarNovidade,
  onFiltrarPromocao
}: BuscaFiltrosProps) {
  const [termoBusca, setTermoBusca] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    destaque: false,
    novidade: false,
    promocao: false
  });

  // Função para buscar
  const handleBuscar = useCallback(() => {
    onBuscar(termoBusca);
  }, [termoBusca, onBuscar]);

  // Função para buscar ao pressionar Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  }, [handleBuscar]);

  // Função para aplicar filtro de categoria
  const handleCategoriaChange = useCallback((categoria: string) => {
    setCategoriaSelecionada(categoria);
    onFiltrarCategoria(categoria);
  }, [onFiltrarCategoria]);

  // Função para aplicar filtro de preço
  const handlePrecoChange = useCallback(() => {
    onFiltrarPreco(precoMin, precoMax);
  }, [precoMin, precoMax, onFiltrarPreco]);

  // Função para limpar todos os filtros
  const handleLimparFiltros = useCallback(() => {
    setTermoBusca('');
    setPrecoMin('');
    setPrecoMax('');
    setCategoriaSelecionada('');
    setFiltrosAtivos({
      destaque: false,
      novidade: false,
      promocao: false
    });
    onLimparFiltros();
  }, [onLimparFiltros]);

  // Função para alternar filtros especiais
  const handleFiltroEspecial = useCallback((tipo: 'destaque' | 'novidade' | 'promocao') => {
    const novoValor = !filtrosAtivos[tipo];
    setFiltrosAtivos(prev => ({ ...prev, [tipo]: novoValor }));
    
    switch (tipo) {
      case 'destaque':
        onFiltrarDestaque(novoValor);
        break;
      case 'novidade':
        onFiltrarNovidade(novoValor);
        break;
      case 'promocao':
        onFiltrarPromocao(novoValor);
        break;
    }
  }, [filtrosAtivos, onFiltrarDestaque, onFiltrarNovidade, onFiltrarPromocao]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Barra de Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por título, autor ou sinopse..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            onClick={handleBuscar}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Botão para mostrar/ocultar filtros */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFiltros(!showFiltros)}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filtros Avançados
          {showFiltros ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={handleLimparFiltros}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
          Limpar Filtros
        </button>
      </div>

      {/* Filtros Especiais */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => handleFiltroEspecial('destaque')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            filtrosAtivos.destaque
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Star className="h-4 w-4" />
          Destaques
        </button>

        <button
          onClick={() => handleFiltroEspecial('novidade')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            filtrosAtivos.novidade
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Novidades
        </button>

        <button
          onClick={() => handleFiltroEspecial('promocao')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            filtrosAtivos.promocao
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Tag className="h-4 w-4" />
          Promoções
        </button>
      </div>

      {/* Filtros Avançados */}
      {showFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              onChange={(e) => onOrdenar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Relevância</option>
              <option value="preco_asc">Menor Preço</option>
              <option value="preco_desc">Maior Preço</option>
              <option value="titulo_asc">Título A-Z</option>
              <option value="titulo_desc">Título Z-A</option>
              <option value="avaliacoes">Melhor Avaliados</option>
              <option value="vendas">Mais Vendidos</option>
              <option value="novidade">Mais Recentes</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => handleCategoriaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todas as categorias</option>
              {filtrosDisponiveis?.categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Faixa de Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Preço
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <span className="flex items-center text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={handlePrecoChange}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <DollarSign className="h-4 w-4" />
              </button>
            </div>
            {filtrosDisponiveis && (
              <p className="text-xs text-gray-500 mt-1">
                Preço: R$ {filtrosDisponiveis.precoMin.toFixed(2)} - R$ {filtrosDisponiveis.precoMax.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Resultados */}
      {filtrosDisponiveis && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filtrosDisponiveis.totalEncontrados} livro(s) encontrado(s)
          </p>
        </div>
      )}
    </div>
  );
}
