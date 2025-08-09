'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaChartLine, 
  FaUsers, 
  FaShoppingCart, 
  FaPercent,
  FaBook,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaMinus
} from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, formatRelativeTime, cn } from '@/lib/utils';

// Mock data for demonstration
const salesData = [
  { day: 'Seg', sales: 1200, orders: 8 },
  { day: 'Ter', sales: 1800, orders: 12 },
  { day: 'Qua', sales: 1400, orders: 9 },
  { day: 'Qui', sales: 2200, orders: 15 },
  { day: 'Sex', sales: 1900, orders: 13 },
  { day: 'Sab', sales: 2800, orders: 18 },
  { day: 'Dom', sales: 2400, orders: 16 }
];

const recentOrders = [
  { id: '#001', customer: 'João Silva', product: 'Livro A', total: 89.90, status: 'Pendente', date: '2024-01-15' },
  { id: '#002', customer: 'Maria Santos', product: 'Livro B', total: 129.90, status: 'Enviado', date: '2024-01-14' },
  { id: '#003', customer: 'Pedro Costa', product: 'Livro C', total: 69.90, status: 'Entregue', date: '2024-01-13' },
  { id: '#004', customer: 'Ana Oliveira', product: 'Livro D', total: 159.90, status: 'Pendente', date: '2024-01-12' }
];

const notifications = [
  { id: 1, type: 'warning', message: 'Estoque baixo: Livro A (apenas 3 unidades)', time: '2h atrás' },
  { id: 2, type: 'info', message: 'Novo pedido recebido: #001', time: '4h atrás' },
  { id: 3, type: 'success', message: 'Pedido #002 enviado com sucesso', time: '6h atrás' },
  { id: 4, type: 'error', message: 'Falha no processamento do pagamento #003', time: '8h atrás' }
];

const recentProducts = [
  { id: 1, name: 'Livro A', price: 89.90, stock: 15, sales: 45, image: '/global/Books/CapaLivro1Front.png' },
  { id: 2, name: 'Livro B', price: 129.90, stock: 8, sales: 32, image: '/global/Books/CapaLivro2Front.jpg' },
  { id: 3, name: 'Livro C', price: 69.90, stock: 22, sales: 28, image: '/global/Books/CapaLivro1Front.png' },
  { id: 4, name: 'Livro D', price: 159.90, stock: 5, sales: 18, image: '/global/Books/CapaLivro2Front.jpg' }
];

export default function AdminDashboard() {
  const { state, actions } = useAdmin();
  const { stats, loading: isLoading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton lines={8} className="h-64 lg:col-span-2" />
            <Skeleton lines={6} className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar dashboard</h2>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Enviado': return 'bg-blue-100 text-blue-800';
      case 'Entregue': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <FaArrowUp className="text-green-500" />;
      case 'down': return <FaArrowDown className="text-red-500" />;
      default: return <FaMinus className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  <FaBell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-start">
                            <span className="text-lg mr-3">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link href="/admin/notificacoes" className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                          Ver todas as notificações
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Administrador</p>
                  <p className="text-xs text-gray-500">admin@loja.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {getTrendIcon('up')}
              <span className="text-green-600 font-medium ml-1">+12.5%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {getTrendIcon('up')}
              <span className="text-green-600 font-medium ml-1">+8.2%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.newCustomers || 0}</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaUsers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {getTrendIcon('up')}
              <span className="text-green-600 font-medium ml-1">+15.3%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate || 0}%</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaPercent className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {getTrendIcon('up')}
              <span className="text-green-600 font-medium ml-1">+2.1%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Vendas e Ações Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gráfico de Vendas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gráfico de Vendas dos Últimos 7 Dias</h3>
                <p className="text-sm text-gray-500">Receita total: {formatCurrency(salesData.reduce((sum, day) => sum + day.sales, 0))}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <FaFilter className="h-4 w-4 inline mr-1" />
                  Filtros
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <FaDownload className="h-4 w-4 inline mr-1" />
                  Exportar
                </button>
              </div>
            </div>
            
            {/* Gráfico Simulado */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-100 rounded-t-sm" style={{ height: `${(day.sales / 2800) * 200}px` }}>
                    <div className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors" style={{ height: '100%' }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    <div className="font-medium">{day.day}</div>
                    <div className="text-gray-500">{formatCurrency(day.sales)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Link href="/admin/livros/novo" className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <FaPlus className="h-4 w-4 mr-3 text-blue-600" />
                Adicionar Livro
              </Link>
              <Link href="/admin/vendas" className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <FaShoppingCart className="h-4 w-4 mr-3 text-green-600" />
                Ver Pedidos
              </Link>
              <Link href="/admin/postagens/nova" className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <FaFileAlt className="h-4 w-4 mr-3 text-purple-600" />
                Nova Postagem
              </Link>
              <Link href="/admin/relatorios" className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <FaChartBar className="h-4 w-4 mr-3 text-orange-600" />
                Relatórios
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Principal de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/livros" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FaBook className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Produtos</h3>
            <p className="text-sm text-gray-600">Gerencie livros, estoque e categorias</p>
          </Link>

          <Link href="/admin/vendas" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <FaShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle de Vendas</h3>
            <p className="text-sm text-gray-600">Acompanhe pedidos e gerencie entregas</p>
          </Link>

          <Link href="/admin/postagens" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <FaFileAlt className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Conteúdo</h3>
            <p className="text-sm text-gray-600">Crie e edite postagens do blog</p>
          </Link>

          <Link href="/admin/configuracoes" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <FaCog className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h3>
            <p className="text-sm text-gray-600">Configure o site e preferências</p>
          </Link>
        </div>

        {/* Atividade Recente e Notificações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Recentes */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.product}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</span>
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(order.status))}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(order.date)}</span>
                    <Link href={`/admin/vendas/${order.id}`} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/vendas" className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                Ver todos os pedidos →
              </Link>
            </div>
          </div>

          {/* Notificações e Alertas */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notificações e Alertas</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-6 py-4">
                  <div className="flex items-start">
                    <span className="text-lg mr-3">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/notificacoes" className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                Ver todas as notificações →
              </Link>
            </div>
          </div>
        </div>

        {/* Produtos em Destaque */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Produtos em Destaque</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <div key={product.id} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{formatCurrency(product.price)}</p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Estoque: {product.stock}</span>
                    <span>Vendas: {product.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}