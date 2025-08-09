'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSearch, FaFilter, FaEye, FaCheck, FaTruck, FaFileInvoice, FaChartBar, FaDownload } from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton, TableSkeleton } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, formatCPF, formatPhone, cn } from '@/lib/utils';

// Importar tipos do AdminContext
import { Order } from '@/contexts/AdminContext';

// Mock data for demonstration
const mockPedidos: Order[] = [
  {
    id: '1',
    numero: '#001',
    cliente: {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '11987654321',
      endereco: 'Rua das Flores, 123, Apto 45, Centro, São Paulo - SP, CEP: 01234-567'
    },
    produtos: [
      { id: '1', titulo: 'Aventuras Fantásticas', quantidade: 1, preco: 89.90 }
    ],
    total: 89.90,
    status: 'pendente',
    dataPedido: '2024-01-15T10:30:00',
    formaPagamento: 'Pix',
    frete: 15.00
  },
  {
    id: '2',
    numero: '#002',
    cliente: {
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '11987654322',
      endereco: 'Avenida Paulista, 1000, Bela Vista, São Paulo - SP, CEP: 04567-890'
    },
    produtos: [
      { id: '2', titulo: 'Mistério do Século', quantidade: 1, preco: 129.90 },
      { id: '3', titulo: 'História da Arte', quantidade: 1, preco: 69.90 }
    ],
    total: 199.80,
    status: 'enviado',
    dataPedido: '2024-01-14T14:20:00',
    dataPagamento: '2024-01-14T14:25:00',
    formaPagamento: 'Cartão de Crédito',
    frete: 18.00
  },
  {
    id: '3',
    numero: '#003',
    cliente: {
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      telefone: '11987654323',
      endereco: 'Rua Augusta, 500, Consolação, São Paulo - SP, CEP: 07890-123'
    },
    produtos: [
      { id: '4', titulo: 'Ciência Moderna', quantidade: 1, preco: 159.90 }
    ],
    total: 159.90,
    status: 'entregue',
    dataPedido: '2024-01-13T09:15:00',
    dataPagamento: '2024-01-13T09:20:00',
    formaPagamento: 'Boleto',
    frete: 20.00
  },
  {
    id: '4',
    numero: '#004',
    cliente: {
      nome: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      telefone: '11987654324',
      endereco: 'Rua das Palmeiras, 789, Jardins, São Paulo - SP, CEP: 01234-567'
    },
    produtos: [
      { id: '5', titulo: 'Filosofia Contemporânea', quantidade: 1, preco: 99.90 }
    ],
    total: 99.90,
    status: 'confirmado',
    dataPedido: '2024-01-12T16:45:00',
    dataPagamento: '2024-01-12T17:00:00',
    formaPagamento: 'Pix',
    frete: 16.00
  }
];

export default function AdminVendas() {
  const { state, actions } = useAdmin();
  const { orders, loading: isLoading, error } = state;
  const { updateOrderStatus } = actions;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('todos');

  // Use mock data for now, will be replaced with real data from context
  const pedidos = orders.length > 0 ? orders : mockPedidos;

  const statusConfig = {
    pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    confirmado: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
    enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
    entregue: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = 
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || pedido.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'todos') {
      const pedidoDate = new Date(pedido.dataPedido);
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(hoje.getDate() - 1);
      const semanaPassada = new Date(hoje);
      semanaPassada.setDate(hoje.getDate() - 7);
      
      switch (dateFilter) {
        case 'hoje':
          matchesDate = pedidoDate.toDateString() === hoje.toDateString();
          break;
        case 'ontem':
          matchesDate = pedidoDate.toDateString() === ontem.toDateString();
          break;
        case 'semana':
          matchesDate = pedidoDate >= semanaPassada;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status];
    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color
      )}>
        {config.label}
      </span>
    );
  };

  const getTotalStats = () => {
    const total = pedidos.length;
    const pendentes = pedidos.filter(p => p.status === 'pendente').length;
    const enviados = pedidos.filter(p => p.status === 'enviado').length;
    const receita = pedidos
      .filter(p => p.status !== 'cancelado')
      .reduce((sum, p) => sum + p.total, 0);
    
    return { total, pendentes, enviados, receita };
  };

  const handleStatusUpdate = async (pedidoId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(pedidoId, newStatus);
      // The context will handle the state update
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar vendas</h2>
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

  const stats = getTotalStats();

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
              <h1 className="text-2xl font-bold text-gray-900">Controle de Vendas</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/vendas/relatorios"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaChartBar className="h-4 w-4 mr-2" />
                Relatórios
              </Link>
              <Link 
                href="/admin/vendas/notas-fiscais"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaFileInvoice className="h-4 w-4 mr-2" />
                Notas Fiscais
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
                <FaFileInvoice className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaFileInvoice className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaTruck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos Enviados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enviados}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaFileInvoice className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.receita)}</p>
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
                  placeholder="Buscar por número do pedido, cliente ou email..."
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
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="enviado">Enviado</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="todos">Todas as Datas</option>
                <option value="hoje">Hoje</option>
                <option value="ontem">Ontem</option>
                <option value="semana">Última Semana</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                <FaFilter className="h-4 w-4 inline mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produtos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pedido.numero}</div>
                        <div className="text-sm text-gray-500">{pedido.formaPagamento}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pedido.cliente.nome}</div>
                        <div className="text-sm text-gray-500">{pedido.cliente.email}</div>
                        <div className="text-xs text-gray-400">
                          {formatPhone(pedido.cliente.telefone)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pedido.produtos.map(p => `${p.titulo} (${p.quantidade}x)`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(pedido.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(pedido.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(pedido.dataPedido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/vendas/${pedido.id}`}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="Ver detalhes"
                        >
                          <FaEye className="h-4 w-4" />
                        </Link>
                        
                        {pedido.status === 'pendente' && (
                          <button
                            onClick={() => handleStatusUpdate(pedido.id, 'confirmado')}
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            title="Confirmar pedido"
                          >
                            <FaCheck className="h-4 w-4" />
                          </button>
                        )}
                        
                        {pedido.status === 'confirmado' && (
                          <button
                            onClick={() => handleStatusUpdate(pedido.id, 'enviado')}
                            className="text-purple-600 hover:text-purple-900 cursor-pointer"
                            title="Marcar como enviado"
                          >
                            <FaTruck className="h-4 w-4" />
                          </button>
                        )}
                        
                        <Link 
                          href={`/admin/vendas/${pedido.id}/nota-fiscal`}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          title="Gerar nota fiscal"
                        >
                          <FaFileInvoice className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPedidos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'todos' || dateFilter !== 'todos'
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Ainda não há pedidos registrados.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

