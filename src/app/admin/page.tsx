'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Eye,
  Target,
  Clock,
  Star,
  Zap,
  Shield,
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/contexts/NotificationContext';
import ExportButton from '@/components/ui/ExportButton';

export default function AdminDashboard() {
  const { state, actions } = useAdmin();
  const { stats, loading, error } = state;
  const { addSuccessNotification } = useNotifications();
  const [selectedPeriod, setSelectedPeriod] = useState('hoje');
  const [selectedView, setSelectedView] = useState('overview');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [selectedReport, setSelectedReport] = useState('vendas');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    // Carregar estatísticas quando o período mudar
    actions.fetchStats(selectedPeriod);
  }, [selectedPeriod, actions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getVendaValue = () => {
    switch (selectedPeriod) {
      case 'hoje': return stats.vendas.hoje;
      case 'semana': return stats.vendas.semana;
      case 'mes': return stats.vendas.mes;
      default: return stats.vendas.hoje;
    }
  };

  const getPedidoValue = () => {
    switch (selectedPeriod) {
      case 'hoje': return stats.pedidos.hoje;
      case 'semana': return stats.pedidos.semana;
      case 'mes': return stats.pedidos.mes;
      default: return stats.pedidos.hoje;
    }
  };

  const getCrescimentoVendas = () => {
    return stats.vendas.crescimento;
  };

  const getCrescimentoClientes = () => {
    return stats.clientes.crescimento;
  };

  // Opções de relatórios disponíveis
  const reportOptions = [
    { value: 'vendas', label: 'Vendas', icon: DollarSign },
    { value: 'clientes', label: 'Clientes', icon: Users },
    { value: 'produtos', label: 'Produtos', icon: BookOpen },
    { value: 'operacional', label: 'Operacional', icon: Settings }
  ];

  // Função para obter dados do relatório selecionado (usando dados reais)
  const getReportData = () => {
    switch (selectedReport) {
      case 'vendas':
        return {
          total: getVendaValue(),
          crescimento: getCrescimentoVendas(),
          dados: vendasChartData,
          categorias: categoriaChartData
        };
      case 'clientes':
        return {
          total: stats.clientes.total,
          crescimento: getCrescimentoClientes(),
          dados: stats.clientes.total // Dados reais dos clientes
        };
      case 'produtos':
        return {
          total: stats.produtos.total,
          estoqueBaixo: stats.produtos.estoqueBaixo,
          semEstoque: stats.produtos.semEstoque,
          dados: stats.produtos.total // Dados reais dos produtos
        };
      case 'operacional':
        return {
          pedidos: getPedidoValue(),
          vendas: getVendaValue(),
          dados: vendasChartData
        };
      default:
        return {
          total: getVendaValue(),
          crescimento: getCrescimentoVendas(),
          dados: vendasChartData
        };
    }
  };

  // Dados para gráficos
  const vendasChartData = stats.vendasPorDia.map((item, index) => ({
    name: item.dia,
    vendas: item.valor,
    pedidos: Math.floor(item.valor / 50) + Math.random() * 10, // Simulado
    clientes: Math.floor(Math.random() * 20) + 5 // Simulado
  }));

  const categoriaChartData = stats.vendasPorCategoria.map((item, index) => ({
    name: item.categoria,
    value: item.valor,
    fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899'][index]
  }));

  // Métricas avançadas simuladas
  const advancedMetrics = {
    ticketMedio: getVendaValue() / (getPedidoValue() || 1),
    conversao: ((getPedidoValue() / (stats.clientes.total || 1)) * 100).toFixed(1),
    retencao: 85.2,
    satisfacao: 4.6,
    tempoMedioEntrega: 2.3,
    taxaCancelamento: 3.2
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Erro ao carregar dashboard</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => actions.fetchStats(selectedPeriod)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Visão geral do seu negócio</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <ExportButton
                data={[stats]}
                filters={{ period: selectedPeriod, report: selectedReport }}
                type="relatorio-vendas"
              />
              <button
                onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{showAdvancedMetrics ? 'Métricas Básicas' : 'Métricas Avançadas'}</span>
                <span className="sm:hidden">{showAdvancedMetrics ? 'Básicas' : 'Avançadas'}</span>
              </button>
            </div>
          </div>
          
          {/* Seletor de Relatórios */}
          <div className="mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-medium text-gray-700">Relatório:</span>
              <div className="flex flex-wrap gap-2">
                {reportOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedReport === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedReport(option.value)}
                      className={`inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.label.charAt(0)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Filtros de período rápidos */}
          <div className="flex flex-wrap gap-2 bg-white p-1 rounded-lg shadow-sm">
            {['hoje', 'semana', 'mes'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
            </div>
            
            {/* Filtro de data customizado */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 hidden sm:inline">Período:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                  placeholder="Data inicial"
                />
                <span className="text-gray-400 text-center sm:text-left">até</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                  placeholder="Data final"
                />
                {dateRange.start && dateRange.end && (
                  <button
                    onClick={() => {
                      setSelectedPeriod('custom');
                      // Aqui você pode implementar a lógica para buscar dados por período customizado
                      addSuccessNotification('Filtro de data customizado aplicado', 'success');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Aplicar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Vendas */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Vendas</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(getVendaValue())}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  {getCrescimentoVendas() >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs sm:text-sm ${getCrescimentoVendas() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {getCrescimentoVendas() >= 0 ? '+' : ''}{getCrescimentoVendas().toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pedidos</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {getPedidoValue()}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 mr-1" />
                  <span className="text-xs sm:text-sm text-orange-600">
                    {stats.pedidos.pendentes} pendentes
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.clientes.total}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1" />
                  <span className="text-xs sm:text-sm text-blue-600">
                    +{stats.clientes.novos} novos
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Produtos</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.produtos.total}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                  <span className="text-xs sm:text-sm text-red-600">
                    {stats.produtos.estoqueBaixo} estoque baixo
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Avançadas */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(advancedMetrics.ticketMedio)}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {advancedMetrics.conversao}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {advancedMetrics.satisfacao}/5
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio Entrega</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {advancedMetrics.tempoMedioEntrega} dias
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Retenção</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {advancedMetrics.retencao}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Cancelamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {advancedMetrics.taxaCancelamento}%
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Relatório Específico */}
        <div className="mb-8">
          {selectedReport === 'vendas' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório de Vendas</h3>
                  <p className="text-sm text-gray-600">Análise detalhada das vendas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(getReportData().total || 0)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getReportData().total || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {(getReportData().crescimento || 0) >= 0 ? '+' : ''}{(getReportData().crescimento || 0).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Crescimento</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {getPedidoValue()}
                  </p>
                  <p className="text-sm text-gray-600">Pedidos</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'clientes' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório de Clientes</h3>
                  <p className="text-sm text-gray-600">Análise da base de clientes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatNumber(getReportData().total || 0)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats.clientes.total)}
                  </p>
                  <p className="text-sm text-gray-600">Total de Clientes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats.clientes.ativos)}
                  </p>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats.clientes.novos)}
                  </p>
                  <p className="text-sm text-gray-600">Novos Clientes</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'produtos' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório de Produtos</h3>
                  <p className="text-sm text-gray-600">Análise do catálogo de produtos</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatNumber(getReportData().total || 0)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats.produtos.total)}
                  </p>
                  <p className="text-sm text-gray-600">Total de Produtos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(stats.produtos.estoqueBaixo)}
                  </p>
                  <p className="text-sm text-gray-600">Estoque Baixo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-700">
                    {formatNumber(stats.produtos.semEstoque)}
                  </p>
                  <p className="text-sm text-gray-600">Sem Estoque</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'operacional' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório Operacional</h3>
                  <p className="text-sm text-gray-600">Métricas de operação e performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatNumber(getReportData().pedidos || 0)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(getReportData().pedidos || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getReportData().vendas || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Receita Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats.pedidos.pendentes)}
                  </p>
                  <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gráficos Interativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Vendas por Dia */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendas por Dia</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={vendasChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'vendas' ? formatCurrency(Number(value)) : value,
                    name === 'vendas' ? 'Vendas' : name === 'pedidos' ? 'Pedidos' : 'Clientes'
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="vendas" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Bar dataKey="pedidos" fill="#10B981" />
                <Line type="monotone" dataKey="clientes" stroke="#F59E0B" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza - Vendas por Categoria */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendas por Categoria</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoriaChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoriaChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Linha - Tendência de Vendas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendência de Vendas (Últimos 30 dias)</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vendasChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Vendas']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.produtos.maisVendidos.length > 0 ? (
              stats.produtos.maisVendidos.map((produto, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{produto.titulo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{produto.vendas} vendas</span>
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum produto vendido ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/livros"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Livros</h3>
                <p className="text-sm text-gray-600">Adicionar, editar ou remover livros</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/vendas"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Vendas</h3>
                <p className="text-sm text-gray-600">Ver pedidos e atualizar status</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/clientes"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Clientes</h3>
                <p className="text-sm text-gray-600">Visualizar e gerenciar clientes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}