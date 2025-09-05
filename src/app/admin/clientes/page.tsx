'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShoppingCart,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaTimes
} from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/contexts/NotificationContext';
import LoadingSpinner, { Skeleton, TableSkeleton } from '@/components/ui/LoadingSpinner';
import NotificationPanel from '@/components/ui/NotificationPanel';
import ExportButton from '@/components/ui/ExportButton';
import { formatDate, formatCPF, formatPhone, formatCurrency, cn } from '@/lib/utils';

export default function AdminClientes() {
  const { state, actions } = useAdmin();
  const { clients, loading: isLoading, error } = state;
  const { fetchClients, deleteClient } = actions;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filtros avançados
  const [dataInicioFilter, setDataInicioFilter] = useState('');
  const [dataFimFilter, setDataFimFilter] = useState('');
  const [valorMinFilter, setValorMinFilter] = useState('');
  const [valorMaxFilter, setValorMaxFilter] = useState('');

  // Carregar dados dos clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, []); // Remover fetchClients da dependência para evitar loop infinito

  // Filtrar e ordenar clientes
  const filteredClientes = clients
    .filter(cliente => {
      const matchesSearch = 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.cpf && cliente.cpf.includes(searchTerm)) ||
        (cliente.telefone && cliente.telefone.includes(searchTerm));

      const matchesStatus = statusFilter === 'todos' || cliente.status === statusFilter;

      const matchesDateRange = 
        (!dataInicioFilter || new Date(cliente.dataCadastro) >= new Date(dataInicioFilter)) &&
        (!dataFimFilter || new Date(cliente.dataCadastro) <= new Date(dataFimFilter));

      const matchesValueRange = 
        (!valorMinFilter || valorMinFilter === '' || cliente.valorTotalCompras >= parseFloat(valorMinFilter)) &&
        (!valorMaxFilter || valorMaxFilter === '' || cliente.valorTotalCompras <= parseFloat(valorMaxFilter));

      return matchesSearch && matchesStatus && matchesDateRange && matchesValueRange;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'dataCadastro':
          aValue = new Date(a.dataCadastro);
          bValue = new Date(b.dataCadastro);
          break;
        case 'totalCompras':
          aValue = a.totalCompras || 0;
          bValue = b.totalCompras || 0;
          break;
        case 'valorTotal':
          aValue = a.valorTotalCompras || 0;
          bValue = b.valorTotalCompras || 0;
          break;
        case 'ultimaCompra':
          aValue = a.ultimaCompra ? new Date(a.ultimaCompra) : new Date(0);
          bValue = b.ultimaCompra ? new Date(b.ultimaCompra) : new Date(0);
          break;
        default:
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDeleteCliente = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteClient(id);
      addSuccessNotification('Sucesso', 'Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      addErrorNotification('Erro', 'Erro ao excluir o cliente. Tente novamente.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      default: return 'Desconhecido';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setDataInicioFilter('');
    setDataFimFilter('');
    setValorMinFilter('');
    setValorMaxFilter('');
  };

  const handleRetry = () => {
    fetchClients();
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
          <TableSkeleton rows={5} columns={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar clientes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
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
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <NotificationPanel />
              <ExportButton
                data={filteredClientes}
                filters={{
                  searchTerm,
                  statusFilter,
                  dataInicioFilter,
                  dataFimFilter,
                  valorMinFilter,
                  valorMaxFilter
                }}
                type="clientes"
              />
              <Link
                href="/admin/clientes/novo"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Novo Cliente
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
                <FaUser className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaUser className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'ativo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Compras</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, c) => sum + (c.totalCompras || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaStar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(clients.reduce((sum, c) => sum + (c.valorTotalCompras || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Busca */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email, CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtros básicos */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilter className="h-4 w-4 mr-2" />
                Filtros Avançados
                {showAdvancedFilters ? <FaChevronUp className="h-4 w-4 ml-2" /> : <FaChevronDown className="h-4 w-4 ml-2" />}
              </button>

              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaTimes className="h-4 w-4 mr-2" />
                Limpar
              </button>
            </div>
          </div>

          {/* Filtros avançados */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro (Início)
                  </label>
                  <input
                    type="date"
                    value={dataInicioFilter}
                    onChange={(e) => setDataInicioFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro (Fim)
                  </label>
                  <input
                    type="date"
                    value={dataFimFilter}
                    onChange={(e) => setDataFimFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={valorMinFilter}
                    onChange={(e) => setValorMinFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="9999.99"
                    value={valorMaxFilter}
                    onChange={(e) => setValorMaxFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Clientes */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nome')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Cliente</span>
                      {sortBy === 'nome' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Contato</span>
                      {sortBy === 'email' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('dataCadastro')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Cadastro</span>
                      {sortBy === 'dataCadastro' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalCompras')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Compras</span>
                      {sortBy === 'totalCompras' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('valorTotal')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Gasto</span>
                      {sortBy === 'valorTotal' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('ultimaCompra')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Última Compra</span>
                      {sortBy === 'ultimaCompra' && (
                        sortOrder === 'asc' ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">
                            {cliente.cpf ? formatCPF(cliente.cpf) : 'CPF não informado'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cliente.email}</div>
                      <div className="text-sm text-gray-500">
                        {cliente.telefone ? formatPhone(cliente.telefone) : 'Telefone não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cliente.dataCadastro)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cliente.totalCompras || 0}</div>
                      <div className="text-sm text-gray-500">pedidos</div>
                    </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(cliente.valorTotalCompras || 0)}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.ultimaCompra ? formatDate(cliente.ultimaCompra) : 'Nunca comprou'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(cliente.status)
                      )}>
                        {getStatusText(cliente.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/clientes/${cliente.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver detalhes"
                        >
                          <FaEye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/clientes/${cliente.id}/editar`}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Editar"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id)}
                          disabled={isDeleting === cliente.id}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir"
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

          {filteredClientes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'todos' || dataInicioFilter || dataFimFilter || valorMinFilter || valorMaxFilter
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Ainda não há clientes cadastrados.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
