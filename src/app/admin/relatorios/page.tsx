'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { exportRelatorioAvancado, ExportOptions } from '@/lib/exportUtils';
import { useNotifications } from '@/contexts/NotificationContext';

// Mock data para demonstração
const mockData = {
  vendasMensais: [
    { mes: 'Jan', vendas: 12500, pedidos: 45 },
    { mes: 'Fev', vendas: 15800, pedidos: 52 },
    { mes: 'Mar', vendas: 14200, pedidos: 48 },
    { mes: 'Abr', vendas: 18900, pedidos: 63 },
    { mes: 'Mai', vendas: 22100, pedidos: 74 },
    { mes: 'Jun', vendas: 19800, pedidos: 68 },
    { mes: 'Jul', vendas: 24500, pedidos: 82 },
    { mes: 'Ago', vendas: 26700, pedidos: 89 },
    { mes: 'Set', vendas: 28900, pedidos: 96 },
    { mes: 'Out', vendas: 31200, pedidos: 104 },
    { mes: 'Nov', vendas: 29800, pedidos: 99 },
    { mes: 'Dez', vendas: 35600, pedidos: 118 }
  ],
  vendasPorCategoria: [
    { categoria: 'Ficção', vendas: 45, valor: 125000 },
    { categoria: 'Não-Ficção', vendas: 30, valor: 89000 },
    { categoria: 'Tecnologia', vendas: 15, valor: 67000 },
    { categoria: 'Biografia', vendas: 10, valor: 45000 }
  ],
  clientesPorRegiao: [
    { regiao: 'São Paulo', clientes: 45, vendas: 89000 },
    { regiao: 'Rio de Janeiro', clientes: 32, vendas: 67000 },
    { regiao: 'Minas Gerais', clientes: 28, vendas: 54000 },
    { regiao: 'Bahia', clientes: 22, vendas: 43000 },
    { regiao: 'Outros', clientes: 35, vendas: 72000 }
  ],
  produtosMaisVendidos: [
    { titulo: 'O Senhor dos Anéis', vendas: 45, receita: 4500 },
    { titulo: 'Harry Potter', vendas: 38, receita: 3800 },
    { titulo: '1984', vendas: 32, receita: 3200 },
    { titulo: 'Dom Casmurro', vendas: 28, receita: 2800 },
    { titulo: 'Grande Sertão', vendas: 25, receita: 2500 },
    { titulo: 'Memórias Póstumas', vendas: 22, receita: 2200 },
    { titulo: 'Vidas Secas', vendas: 20, receita: 2000 },
    { titulo: 'Capitães da Areia', vendas: 18, receita: 1800 }
  ],
  metricas: {
    receitaTotal: 356000,
    pedidosTotal: 118,
    clientesAtivos: 1247,
    ticketMedio: 3016.95,
    crescimentoReceita: 12.5,
    crescimentoPedidos: 8.2,
    crescimentoClientes: 15.3
  }
};

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('vendas');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { addSuccessNotification, addErrorNotification } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else if (growth < 0) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleExport = async (format: ExportOptions['format']) => {
    setIsExporting(true);
    
    try {
      await exportRelatorioAvancado(mockData, { format });
      
      const formatNames = {
        csv: 'CSV',
        json: 'JSON',
        pdf: 'PDF'
      };
      
      addSuccessNotification(
        'Exportação Concluída', 
        `Relatório exportado com sucesso em formato ${formatNames[format]}`
      );
    } catch (error) {
      console.error('Erro na exportação:', error);
      addErrorNotification(
        'Erro na Exportação', 
        'Ocorreu um erro ao exportar o relatório. Tente novamente.'
      );
    } finally {
      setIsExporting(false);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios Avançados</h1>
              <p className="text-gray-600">Análises detalhadas e métricas do negócio</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exportando...' : 'CSV'}
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exportando...' : 'JSON'}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exportando...' : 'PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vendas">Vendas</option>
                <option value="pedidos">Pedidos</option>
                <option value="clientes">Clientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Receita Total */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(mockData.metricas.receitaTotal)}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(mockData.metricas.crescimentoReceita)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockData.metricas.crescimentoReceita)}`}>
                    +{mockData.metricas.crescimentoReceita}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total de Pedidos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(mockData.metricas.pedidosTotal)}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(mockData.metricas.crescimentoPedidos)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockData.metricas.crescimentoPedidos)}`}>
                    +{mockData.metricas.crescimentoPedidos}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Clientes Ativos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(mockData.metricas.clientesAtivos)}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(mockData.metricas.crescimentoClientes)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockData.metricas.crescimentoClientes)}`}>
                    +{mockData.metricas.crescimentoClientes}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(mockData.metricas.ticketMedio)}
                </p>
                <p className="text-sm text-gray-500 mt-2">Por pedido</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Vendas Mensais */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendas Mensais</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.vendasMensais.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-12 text-sm text-gray-600">{item.mes}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.vendas / Math.max(...mockData.vendasMensais.map(v => v.vendas))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.vendas)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Vendas por Categoria */}
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
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.valor)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.vendas} vendas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabelas Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Produtos Mais Vendidos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.produtosMaisVendidos.slice(0, 6).map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{produto.titulo}</div>
                      <div className="text-xs text-gray-500">{produto.vendas} vendas</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(produto.receita)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clientes por Região */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Clientes por Região</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.clientesPorRegiao.map((regiao, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                      }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{regiao.regiao}</div>
                      <div className="text-xs text-gray-500">{regiao.clientes} clientes</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(regiao.vendas)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise de Tendências */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Tendências</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Crescimento Constante</h4>
              <p className="text-sm text-green-700 mt-1">
                Vendas aumentaram 12.5% em relação ao ano anterior
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Base de Clientes</h4>
              <p className="text-sm text-blue-700 mt-1">
                1.247 clientes ativos com alta retenção
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Ticket Médio</h4>
              <p className="text-sm text-purple-700 mt-1">
                R$ 3.016,95 por pedido, acima da média do setor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
