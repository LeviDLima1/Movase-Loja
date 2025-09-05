'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  BookOpen,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Star,
  Zap,
  Shield,
  AlertTriangle,
  Eye,
  FileText,
  Settings
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
import LoadingSpinner, { Skeleton } from '@/components/ui/LoadingSpinner';

export default function AdminRelatorios() {
  const { state, actions } = useAdmin();
  const { stats, loading, error } = state;
  const { addSuccessNotification } = useNotifications();
  
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedReport, setSelectedReport] = useState('vendas');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
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

  // Dados simulados para relatórios avançados
  const relatorioVendas = {
    totalVendas: 125000,
    crescimento: 12.5,
    ticketMedio: 89.50,
    vendasPorDia: [
      { dia: 'Seg', vendas: 8500, pedidos: 95, clientes: 87 },
      { dia: 'Ter', vendas: 9200, pedidos: 103, clientes: 92 },
      { dia: 'Qua', vendas: 7800, pedidos: 87, clientes: 81 },
      { dia: 'Qui', vendas: 10500, pedidos: 117, clientes: 105 },
      { dia: 'Sex', vendas: 12800, pedidos: 143, clientes: 128 },
      { dia: 'Sáb', vendas: 9500, pedidos: 106, clientes: 98 },
      { dia: 'Dom', vendas: 7200, pedidos: 80, clientes: 75 }
    ],
    vendasPorCategoria: [
      { categoria: 'Ficção', vendas: 45000, percentual: 36 },
      { categoria: 'Técnico', vendas: 32000, percentual: 25.6 },
      { categoria: 'Infantil', vendas: 28000, percentual: 22.4 },
      { categoria: 'Biografia', vendas: 15000, percentual: 12 },
      { categoria: 'Outros', vendas: 5000, percentual: 4 }
    ],
    vendasPorRegiao: [
      { regiao: 'Sudeste', vendas: 65000, percentual: 52 },
      { regiao: 'Sul', vendas: 28000, percentual: 22.4 },
      { regiao: 'Nordeste', vendas: 22000, percentual: 17.6 },
      { regiao: 'Centro-Oeste', vendas: 7000, percentual: 5.6 },
      { regiao: 'Norte', vendas: 3000, percentual: 2.4 }
    ]
  };

  const relatorioClientes = {
    totalClientes: 2847,
    novosClientes: 156,
    clientesAtivos: 2156,
    clientesInativos: 691,
    retencao: 85.2,
    satisfacao: 4.6,
    distribuicaoIdade: [
      { faixa: '18-25', quantidade: 456, percentual: 16 },
      { faixa: '26-35', quantidade: 854, percentual: 30 },
      { faixa: '36-45', quantidade: 712, percentual: 25 },
      { faixa: '46-55', quantidade: 569, percentual: 20 },
      { faixa: '55+', quantidade: 256, percentual: 9 }
    ],
    comportamentoCompra: [
      { tipo: 'Primeira Compra', quantidade: 156, percentual: 5.5 },
      { tipo: 'Compra Recorrente', quantidade: 2156, percentual: 75.7 },
      { tipo: 'Compra Alta Frequência', quantidade: 535, percentual: 18.8 }
    ]
  };

  const relatorioProdutos = {
    totalProdutos: 1247,
    produtosAtivos: 1189,
    produtosInativos: 58,
    estoqueBaixo: 23,
    produtosMaisVendidos: [
      { titulo: 'O Senhor dos Anéis', vendas: 156, receita: 18720 },
      { titulo: 'Harry Potter e a Pedra Filosofal', vendas: 143, receita: 17160 },
      { titulo: 'Clean Code', vendas: 128, receita: 15360 },
      { titulo: '1984', vendas: 115, receita: 13800 },
      { titulo: 'O Hobbit', vendas: 98, receita: 11760 }
    ],
    categoriasPerformance: [
      { categoria: 'Ficção', produtos: 456, vendas: 2340, receita: 280800 },
      { categoria: 'Técnico', produtos: 234, vendas: 1890, receita: 226800 },
      { categoria: 'Infantil', produtos: 189, vendas: 1560, receita: 187200 },
      { categoria: 'Biografia', produtos: 156, vendas: 890, receita: 106800 },
      { categoria: 'Outros', produtos: 212, vendas: 670, receita: 80400 }
    ]
  };

  const relatorioOperacional = {
    tempoMedioEntrega: 2.3,
    taxaEntregaNoPrazo: 94.8,
    taxaCancelamento: 3.2,
    satisfacaoEntrega: 4.5,
    problemasFrequentes: [
      { problema: 'Atraso na entrega', ocorrencias: 45, percentual: 2.1 },
      { problema: 'Produto danificado', ocorrencias: 23, percentual: 1.1 },
      { problema: 'Produto errado', ocorrencias: 18, percentual: 0.8 },
      { problema: 'Problema no pagamento', ocorrencias: 12, percentual: 0.6 }
    ],
    performanceMensal: [
      { mes: 'Jan', entregas: 156, prazo: 94.2, satisfacao: 4.3 },
      { mes: 'Fev', entregas: 143, prazo: 95.1, satisfacao: 4.4 },
      { mes: 'Mar', entregas: 167, prazo: 93.8, satisfacao: 4.2 },
      { mes: 'Abr', entregas: 189, prazo: 94.5, satisfacao: 4.5 },
      { mes: 'Mai', entregas: 234, prazo: 95.3, satisfacao: 4.6 },
      { mes: 'Jun', entregas: 256, prazo: 94.8, satisfacao: 4.5 }
    ]
  };

  const getReportData = () => {
    switch (selectedReport) {
      case 'vendas': return relatorioVendas;
      case 'clientes': return relatorioClientes;
      case 'produtos': return relatorioProdutos;
      case 'operacional': return relatorioOperacional;
      default: return relatorioVendas;
    }
  };

  const currentReport = getReportData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton lines={1} className="h-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} lines={3} className="h-32" />
            ))}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar relatórios</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => actions.fetchStats(selectedPeriod)}
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
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <ExportButton
                data={[currentReport]}
                filters={{ 
                  period: selectedPeriod, 
                  report: selectedReport,
                  dateRange 
                }}
                type="relatorio-vendas"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Seleção de Relatório */}
            <div className="flex space-x-2">
              {[
                { id: 'vendas', label: 'Vendas', icon: DollarSign },
                { id: 'clientes', label: 'Clientes', icon: Users },
                { id: 'produtos', label: 'Produtos', icon: BookOpen },
                { id: 'operacional', label: 'Operacional', icon: Settings }
              ].map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                      selectedReport === report.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {report.label}
                  </button>
                );
              })}
            </div>

            {/* Filtros de Período */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="trimestre">Este Trimestre</option>
                <option value="ano">Este Ano</option>
              </select>

              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">até</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        {selectedReport === 'vendas' && (
          <div className="space-y-8">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(relatorioVendas.totalVendas)}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{relatorioVendas.crescimento}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(relatorioVendas.ticketMedio)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vendas por Dia</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(relatorioVendas.totalVendas / 30)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Crescimento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      +{relatorioVendas.crescimento}%
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vendas por Dia */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Dia da Semana</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={relatorioVendas.vendasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
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

              {/* Vendas por Categoria */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Categoria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={relatorioVendas.vendasPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, percentual }) => `${categoria} ${percentual}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="vendas"
                    >
                      {relatorioVendas.vendasPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Vendas']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vendas por Região */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Região</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={relatorioVendas.vendasPorRegiao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regiao" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Vendas']} />
                  <Legend />
                  <Bar dataKey="vendas" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedReport === 'clientes' && (
          <div className="space-y-8">
            {/* Métricas de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(relatorioClientes.totalClientes)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Novos Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      +{relatorioClientes.novosClientes}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Retenção</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioClientes.retencao}%
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
                    <p className="text-sm font-medium text-gray-600">Satisfação</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioClientes.satisfacao}/5
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos de Clientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição por Idade */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Idade</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={relatorioClientes.distribuicaoIdade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faixa" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comportamento de Compra */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comportamento de Compra</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={relatorioClientes.comportamentoCompra}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, percentual }) => `${tipo} ${percentual}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {relatorioClientes.comportamentoCompra.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'produtos' && (
          <div className="space-y-8">
            {/* Métricas de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(relatorioProdutos.totalProdutos)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(relatorioProdutos.produtosAtivos)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioProdutos.estoqueBaixo}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Inativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioProdutos.produtosInativos}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos Mais Vendidos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
              <div className="space-y-3">
                {relatorioProdutos.produtosMaisVendidos.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{produto.titulo}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{produto.vendas} vendas</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(produto.receita)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance por Categoria */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={relatorioProdutos.categoriasPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'receita' ? formatCurrency(Number(value)) : value,
                      name === 'receita' ? 'Receita' : name === 'vendas' ? 'Vendas' : 'Produtos'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="produtos" fill="#3B82F6" />
                  <Bar yAxisId="left" dataKey="vendas" fill="#10B981" />
                  <Line yAxisId="right" type="monotone" dataKey="receita" stroke="#F59E0B" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedReport === 'operacional' && (
          <div className="space-y-8">
            {/* Métricas Operacionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio Entrega</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioOperacional.tempoMedioEntrega} dias
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
                    <p className="text-sm font-medium text-gray-600">Entrega no Prazo</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioOperacional.taxaEntregaNoPrazo}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Cancelamento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioOperacional.taxaCancelamento}%
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfação Entrega</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {relatorioOperacional.satisfacaoEntrega}/5
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Mensal */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={relatorioOperacional.performanceMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="entregas" fill="#3B82F6" />
                  <Line yAxisId="right" type="monotone" dataKey="prazo" stroke="#10B981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="satisfacao" stroke="#F59E0B" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Problemas Frequentes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Problemas Frequentes</h3>
              <div className="space-y-3">
                {relatorioOperacional.problemasFrequentes.map((problema, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-red-600">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{problema.problema}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{problema.ocorrencias} ocorrências</span>
                      <span className="text-sm font-medium text-gray-900">
                        {problema.percentual}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
