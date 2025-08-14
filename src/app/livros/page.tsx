'use client';

import Header from '../../components/header/page';
import { useLivros } from '@/hooks/useLivros';
import BuscaFiltros from '@/components/livros/BuscaFiltros';
import LivroCard from '@/components/livros/LivroCard';
import Paginacao from '@/components/ui/Paginacao';
import { 
  Loader2, 
  Grid3X3, 
  List, 
  Filter, 
  ChevronRight,
  BookOpen,
  Star,
  TrendingUp,
  Package
} from 'lucide-react';
import { useState } from 'react';

export default function LivrosVitrine() {
  const {
    livros,
    paginacao,
    filtrosDisponiveis,
    loading,
    error,
    buscarPorTexto,
    filtrarPorCategoria,
    filtrarPorPreco,
    ordenarPor,
    limparFiltros,
    mudarPagina,
    filtrarPorDestaque,
    filtrarPorNovidade,
    filtrarPorPromocao
  } = useLivros();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center py-12">
              <div className="text-red-600 text-lg mb-4">Erro ao carregar livros</div>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-red-600 transition-colors">Início</a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Catálogo de Livros</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          
          {/* Header da Página */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Catálogo de Livros
                </h1>
                <p className="text-gray-600">
                  Explore nossa coleção completa de livros cristãos
                </p>
              </div>
              
              {/* Estatísticas */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{paginacao?.totalLivros || 0} livros</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="h-4 w-4" />
                  <span>4.8/5 avaliação</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+1000 vendas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Busca e Controles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <BuscaFiltros
              filtrosDisponiveis={filtrosDisponiveis}
              onBuscar={buscarPorTexto}
              onFiltrarCategoria={filtrarPorCategoria}
              onFiltrarPreco={filtrarPorPreco}
              onOrdenar={ordenarPor}
              onLimparFiltros={limparFiltros}
              onFiltrarDestaque={filtrarPorDestaque}
              onFiltrarNovidade={filtrarPorNovidade}
              onFiltrarPromocao={filtrarPorPromocao}
            />
          </div>

          {/* Controles de Visualização */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
              
              <div className="text-sm text-gray-600">
                Mostrando {livros.length} de {paginacao?.totalLivros || 0} livros
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Visualizar:</span>
              <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filtros Laterais - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
                
                {/* Categorias */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Categorias</h4>
                  <div className="space-y-2">
                    {filtrosDisponiveis?.categorias?.map((categoria) => (
                      <label key={categoria} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600">{categoria}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Faixa de Preço */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Faixa de Preço</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="price" className="text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600">Até R$ 30</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="price" className="text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600">R$ 30 - R$ 60</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="price" className="text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600">Acima de R$ 60</span>
                    </label>
                  </div>
                </div>

                {/* Disponibilidade */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Disponibilidade</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600">Em estoque</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-600">Promoções</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={limparFiltros}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1">
              {/* Loading */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                    <span className="text-gray-600">Carregando livros...</span>
                  </div>
                </div>
              )}

              {/* Grid de Livros */}
              {!loading && livros.length > 0 && (
                <>
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }>
                    {livros.map((livro) => (
                      <LivroCard 
                        key={livro.id} 
                        livro={livro} 
                      />
                    ))}
                  </div>

                  {/* Paginação */}
                  {paginacao && paginacao.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Paginacao
                        paginaAtual={paginacao.page}
                        totalPaginas={paginacao.totalPages}
                        onMudarPagina={mudarPagina}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Nenhum resultado */}
              {!loading && livros.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500 text-lg mb-2">Nenhum livro encontrado</div>
                  <p className="text-gray-400 mb-6">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <button
                    onClick={limparFiltros}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
