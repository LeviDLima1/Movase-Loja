'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaBook } from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton, TableSkeleton } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import NotificationPanel from '@/components/ui/NotificationPanel';
import ExportButton from '@/components/ui/ExportButton';
import { useNotifications } from '@/contexts/NotificationContext';

export default function AdminLivros() {
  const { state, actions } = useAdmin();
  const { products, loading: isLoading, error } = state;
  const { fetchProducts, deleteProduct } = actions;
  const { addSuccessNotification, addErrorNotification, addEstoqueNotification } = useNotifications();
  
  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todos');
  const [precoMinFilter, setPrecoMinFilter] = useState('');
  const [precoMaxFilter, setPrecoMaxFilter] = useState('');
  const [sortBy, setSortBy] = useState('titulo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debug: Log quando o componente renderiza
  console.log('🔄 AdminLivros renderizando:', { 
    productsCount: products.length, 
    loading: isLoading, 
    error, 
    initialized: state.initialized 
  });

  // Filtrar livros baseado nos filtros aplicados
  const filteredLivros = products.filter(livro => {
    const matchesSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livro.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || livro.status === statusFilter;
    const matchesCategoria = categoriaFilter === 'todos' || livro.categoria === categoriaFilter;
    
    const preco = livro.preco;
    const matchesPrecoMin = !precoMinFilter || preco >= parseFloat(precoMinFilter);
    const matchesPrecoMax = !precoMaxFilter || preco <= parseFloat(precoMaxFilter);
    
    return matchesSearch && matchesStatus && matchesCategoria && matchesPrecoMin && matchesPrecoMax;
  });

  // Ordenar livros
  const sortedLivros = [...filteredLivros].sort((a, b) => {
    let aValue: any = a[sortBy as keyof typeof a];
    let bValue: any = b[sortBy as keyof typeof b];
    
    // Converter para string para comparação de texto
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Função para excluir livro
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await deleteProduct(id);
        addSuccessNotification('Livro Excluído', 'Livro excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        addErrorNotification('Erro ao Excluir', 'Erro ao excluir o livro. Tente novamente.');
      }
    }
  };

  // Verificar estoque baixo e enviar notificações
  useEffect(() => {
    const livrosComEstoqueBaixo = products.filter(livro => livro.estoque <= 5 && livro.estoque > 0);
    livrosComEstoqueBaixo.forEach(livro => {
      addEstoqueNotification(
        `"${livro.titulo}" está com estoque baixo (${livro.estoque} unidades)`,
        `/admin/livros/${livro.id}`
      );
    });
  }, [products, addEstoqueNotification]);

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800'
    };
    
    return cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusConfig[status as keyof typeof statusConfig] || statusConfig.inativo
    );
  };

  // Função para obter badge de estoque
  const getEstoqueBadge = (estoque: number) => {
    if (estoque === 0) {
      return 'bg-red-100 text-red-800';
    } else if (estoque <= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  // Obter categorias únicas dos produtos
  const categorias = [...new Set(products.map(livro => livro.categoria))].sort();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton lines={1} className="h-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} lines={3} className="h-32" />
            ))}
          </div>
          <TableSkeleton rows={5} columns={7} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar livros</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin" 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Livros</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <NotificationPanel />
              
              <ExportButton
                data={sortedLivros}
                filters={{
                  searchTerm,
                  statusFilter,
                  categoriaFilter,
                  precoMinFilter,
                  precoMaxFilter
                }}
                type="livros"
              />
              
              <Link 
                href="/admin/livros/novo"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Novo Livro
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBook className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Livros</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaBook className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livros Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(l => l.status === 'ativo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <FaBook className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livros Inativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(l => l.status === 'inativo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaBook className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(l => l.estoque <= 5).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="space-y-4">
            {/* Filtros Básicos */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por título ou autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                
                <select
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="todos">Todas as Categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <FaFilter className="h-4 w-4 inline mr-2" />
                  Filtros Avançados
                </button>
              </div>
            </div>

            {/* Filtros Avançados */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo</label>
                    <input
                      type="number"
                      placeholder="R$ 0,00"
                      value={precoMinFilter}
                      onChange={(e) => setPrecoMinFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo</label>
                    <input
                      type="number"
                      placeholder="R$ 999,99"
                      value={precoMaxFilter}
                      onChange={(e) => setPrecoMaxFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="titulo">Título</option>
                      <option value="autor">Autor</option>
                      <option value="preco">Preço</option>
                      <option value="estoque">Estoque</option>
                      <option value="categoria">Categoria</option>
                      <option value="dataCriacao">Data de Criação</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="asc"
                      checked={sortOrder === 'asc'}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Crescente</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="desc"
                      checked={sortOrder === 'desc'}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Decrescente</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLivros.map((livro) => (
                  <tr key={livro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{livro.titulo}</div>
                        <div className="text-sm text-gray-500">ID: {livro.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {livro.autor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(livro.preco)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getEstoqueBadge(livro.estoque)
                      )}>
                        {livro.estoque} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {livro.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(livro.status)}>
                        {livro.status.charAt(0).toUpperCase() + livro.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/livros/${livro.id}`}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          <FaEye className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/admin/livros/editar/${livro.id}`}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(livro.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {sortedLivros.map((livro) => (
              <div key={livro.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{livro.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2">por {livro.autor}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={getStatusBadge(livro.status)}>
                        {livro.status.charAt(0).toUpperCase() + livro.status.slice(1)}
                      </span>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getEstoqueBadge(livro.estoque)
                      )}>
                        {livro.estoque} unidades
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600 mb-1">
                      {formatCurrency(livro.preco)}
                    </div>
                    <p className="text-sm text-gray-500">{livro.categoria}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">ID: {livro.id}</div>
                  <div className="flex space-x-3">
                    <Link 
                      href={`/admin/livros/${livro.id}`}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer p-1"
                    >
                      <FaEye className="h-4 w-4" />
                    </Link>
                    <Link 
                      href={`/admin/livros/editar/${livro.id}`}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1"
                    >
                      <FaEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(livro.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer p-1"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sortedLivros.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum livro encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'todos' || categoriaFilter !== 'todos' || precoMinFilter || precoMaxFilter
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece adicionando seu primeiro livro.'}
              </p>
              {!searchTerm && statusFilter === 'todos' && categoriaFilter === 'todos' && !precoMinFilter && !precoMaxFilter && (
                <Link 
                  href="/admin/livros/novo"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Adicionar Livro
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}