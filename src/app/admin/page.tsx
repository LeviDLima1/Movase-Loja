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
  ArrowDownRight
} from 'lucide-react';

// Mock data para demonstração
const mockData = {
  vendas: {
    hoje: 1250.50,
    ontem: 980.25,
    semana: 8750.75,
    mes: 32450.00,
    crescimento: 12.5
  },
  pedidos: {
    hoje: 8,
    ontem: 6,
    semana: 45,
    mes: 180,
    pendentes: 3
  },
  clientes: {
    total: 1247,
    ativos: 1189,
    novos: 23,
    crescimento: 8.2
  },
  produtos: {
    total: 156,
    estoqueBaixo: 12,
    semEstoque: 3,
    maisVendidos: [
      { titulo: 'O Senhor dos Anéis', vendas: 45 },
      { titulo: 'Harry Potter', vendas: 38 },
      { titulo: '1984', vendas: 32 },
      { titulo: 'Dom Casmurro', vendas: 28 },
      { titulo: 'Grande Sertão', vendas: 25 }
    ]
  },
  vendasPorDia: [
    { dia: 'Seg', valor: 1200 },
    { dia: 'Ter', valor: 1350 },
    { dia: 'Qua', valor: 980 },
    { dia: 'Qui', valor: 1450 },
    { dia: 'Sex', valor: 1650 },
    { dia: 'Sáb', valor: 2100 },
    { dia: 'Dom', valor: 1800 }
  ],
  vendasPorCategoria: [
    { categoria: 'Ficção', valor: 45 },
    { categoria: 'Não-Ficção', valor: 30 },
    { categoria: 'Tecnologia', valor: 15 },
    { categoria: 'Biografia', valor: 10 }
  ]
};

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('hoje');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getVendaValue = () => {
    switch (selectedPeriod) {
      case 'hoje': return mockData.vendas.hoje;
      case 'semana': return mockData.vendas.semana;
      case 'mes': return mockData.vendas.mes;
      default: return mockData.vendas.hoje;
    }
  };

  const getPedidoValue = () => {
    switch (selectedPeriod) {
      case 'hoje': return mockData.pedidos.hoje;
      case 'semana': return mockData.pedidos.semana;
      case 'mes': return mockData.pedidos.mes;
      default: return mockData.pedidos.hoje;
    }
  };

  if (isLoading) {
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
            {['hoje', 'semana', 'mes'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Vendas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getVendaValue())}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{mockData.vendas.crescimento}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getPedidoValue()}
                </p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">
                    {mockData.pedidos.pendentes} pendentes
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockData.clientes.total}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">
                    +{mockData.clientes.novos} novos
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockData.produtos.total}
                </p>
                <div className="flex items-center mt-2">
                  <Package className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">
                    {mockData.produtos.estoqueBaixo} estoque baixo
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Relatórios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Vendas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendas da Semana</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.vendasPorDia.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-12 text-sm text-gray-600">{item.dia}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.valor / Math.max(...mockData.vendasPorDia.map(v => v.valor))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Categorias */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendas por Categoria</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.vendasPorCategoria.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]
                      }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.categoria}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.valor}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockData.produtos.maisVendidos.map((produto, index) => (
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
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}