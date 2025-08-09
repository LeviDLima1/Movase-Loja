'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaBook } from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton, TableSkeleton } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

// Mock data for demonstration
const mockLivros = [
  {
    id: '1',
    titulo: 'Aventuras Fantásticas',
    autor: 'João Silva',
    preco: 89.90,
    estoque: 15,
    categoria: 'Ficção',
    status: 'ativo',
    dataCriacao: '2024-01-10',
    vendas: 23
  },
  {
    id: '2',
    titulo: 'Mistério do Século',
    autor: 'Maria Santos',
    preco: 129.90,
    estoque: 8,
    categoria: 'Mistério',
    status: 'ativo',
    dataCriacao: '2024-01-08',
    vendas: 15
  },
  {
    id: '3',
    titulo: 'História da Arte',
    autor: 'Pedro Costa',
    preco: 69.90,
    estoque: 22,
    categoria: 'Arte',
    status: 'ativo',
    dataCriacao: '2024-01-05',
    vendas: 8
  },
  {
    id: '4',
    titulo: 'Ciência Moderna',
    autor: 'Ana Oliveira',
    preco: 159.90,
    estoque: 5,
    categoria: 'Ciência',
    status: 'inativo',
    dataCriacao: '2024-01-03',
    vendas: 12
  },
  {
    id: '5',
    titulo: 'Filosofia Contemporânea',
    autor: 'Carlos Lima',
    preco: 99.90,
    estoque: 12,
    categoria: 'Filosofia',
    status: 'ativo',
    dataCriacao: '2024-01-01',
    vendas: 19
  }
];

export default function AdminLivros() {
  const { state, actions } = useAdmin();
  const { products, loading: isLoading, error } = state;
  const { deleteProduct } = actions;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Use mock data for now, will be replaced with real data from context
  const livros = products.length > 0 ? products : mockLivros;

  const filteredLivros = livros.filter(livro => {
    const matchesSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livro.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || livro.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await deleteProduct(id);
        // The context will handle the state update
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
      }
    }
  };

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

  const getEstoqueBadge = (estoque: number) => {
    if (estoque === 0) {
      return 'bg-red-100 text-red-800';
    } else if (estoque <= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar livros</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
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
                <p className="text-2xl font-bold text-gray-900">{livros.length}</p>
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
                  {livros.filter(l => l.status === 'ativo').length}
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
                  {livros.filter(l => l.status === 'inativo').length}
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
                  {livros.filter(l => l.estoque <= 5).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
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
              
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                <FaFilter className="h-4 w-4 inline mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
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
                {filteredLivros.map((livro) => (
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
          
          {filteredLivros.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum livro encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece adicionando seu primeiro livro.'}
              </p>
              {!searchTerm && statusFilter === 'todos' && (
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