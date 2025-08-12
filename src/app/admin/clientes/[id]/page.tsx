'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaShoppingCart, 
  FaStar, 
  FaChartLine, 
  FaFileInvoice,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaPrint
} from 'react-icons/fa';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDate, formatCPF, formatPhone, formatCurrency, formatRelativeTime, cn } from '@/lib/utils';

// Mock data para cliente específico
const mockCliente = {
  id: '1',
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  endereco: {
    cep: '01234-567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP'
  },
  dataCadastro: '2024-01-15T10:30:00',
  status: 'ativo',
  observacoes: 'Cliente fiel, sempre compra livros de ficção. Prefere entrega express.',
  totalCompras: 5,
  valorTotal: 1245.80,
  ultimaCompra: '2024-01-15T10:30:00',
  mediaTicket: 249.16,
  categoria: 'Cliente Fiel'
};

// Mock data para histórico de compras
const mockHistoricoCompras = [
  {
    id: '1',
    numero: '#001',
    data: '2024-01-15T10:30:00',
    status: 'entregue',
    valor: 89.90,
    produtos: [
      { nome: 'Aventuras Fantásticas', quantidade: 1, preco: 89.90 }
    ],
    formaPagamento: 'Pix',
    frete: 15.00
  },
  {
    id: '2',
    numero: '#002',
    data: '2024-01-10T14:20:00',
    status: 'enviado',
    valor: 129.90,
    produtos: [
      { nome: 'Mistério do Século', quantidade: 1, preco: 129.90 }
    ],
    formaPagamento: 'Cartão de Crédito',
    frete: 12.00
  },
  {
    id: '3',
    numero: '#003',
    data: '2024-01-05T09:15:00',
    status: 'pendente',
    valor: 299.80,
    produtos: [
      { nome: 'História da Arte', quantidade: 1, preco: 159.90 },
      { nome: 'Poesia Moderna', quantidade: 1, preco: 139.90 }
    ],
    formaPagamento: 'Boleto',
    frete: 18.00
  }
];

// Mock data para estatísticas
const mockEstatisticas = {
  comprasUltimos30Dias: 2,
  valorUltimos30Dias: 219.80,
  comprasUltimos90Dias: 4,
  valorUltimos90Dias: 519.70,
  categoriaFavorita: 'Ficção',
  produtoMaisComprado: 'Aventuras Fantásticas',
  frequenciaCompra: '15 dias',
  preferenciaPagamento: 'Pix'
};

export default function ClienteDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [cliente, setCliente] = useState(mockCliente);
  const [historicoCompras, setHistoricoCompras] = useState(mockHistoricoCompras);
  const [estatisticas, setEstatisticas] = useState(mockEstatisticas);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Resolver params
  useEffect(() => {
    const resolveParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData);
    };
    resolveParams();
  }, [params]);

  const clienteId = resolvedParams?.id || '';

  useEffect(() => {
    // Aqui você faria a chamada para buscar os dados do cliente
    console.log('Carregando dados do cliente:', clienteId);
  }, [clienteId]);

  const handleDeleteCliente = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;

    setLoading(true);
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      addSuccessNotification('Cliente Excluído', 'Cliente excluído com sucesso');
      // Redirecionar para lista de clientes
      window.location.href = '/admin/clientes';
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      addErrorNotification('Erro ao Excluir', 'Erro ao excluir o cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'entregue': return 'Entregue';
      case 'enviado': return 'Enviado';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregue': return <FaCheckCircle className="h-4 w-4" />;
      case 'enviado': return <FaTruck className="h-4 w-4" />;
      case 'pendente': return <FaClock className="h-4 w-4" />;
      case 'cancelado': return <FaExclamationTriangle className="h-4 w-4" />;
      default: return <FaClock className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'detalhes', label: 'Detalhes', icon: <FaUser className="h-4 w-4" /> },
    { id: 'compras', label: 'Histórico de Compras', icon: <FaShoppingCart className="h-4 w-4" /> },
    { id: 'estatisticas', label: 'Estatísticas', icon: <FaChartLine className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/clientes" 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{cliente.nome}</h1>
                <p className="text-sm text-gray-500">Cliente #{cliente.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/clientes/${cliente.id}/editar`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaEdit className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button
                onClick={handleDeleteCliente}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 cursor-pointer"
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'detalhes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informações Básicas */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <FaUser className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nome</p>
                          <p className="text-sm text-gray-900">{cliente.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{cliente.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaUser className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">CPF</p>
                          <p className="text-sm text-gray-900">{formatCPF(cliente.cpf)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Telefone</p>
                          <p className="text-sm text-gray-900">{formatPhone(cliente.telefone)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Data de Cadastro</p>
                          <p className="text-sm text-gray-900">{formatDate(cliente.dataCadastro)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaStar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Categoria</p>
                          <p className="text-sm text-gray-900">{cliente.categoria}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {cliente.endereco.logradouro}, {cliente.endereco.numero}
                          {cliente.endereco.complemento && `, ${cliente.endereco.complemento}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.uf}
                        </p>
                        <p className="text-sm text-gray-500">CEP: {cliente.endereco.cep}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                    <p className="text-sm text-gray-700">{cliente.observacoes}</p>
                  </div>
                </div>

                {/* Resumo */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Resumo</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Total de Compras:</span>
                        <span className="text-sm font-medium text-blue-900">{cliente.totalCompras}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Valor Total:</span>
                        <span className="text-sm font-medium text-blue-900">{formatCurrency(cliente.valorTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Ticket Médio:</span>
                        <span className="text-sm font-medium text-blue-900">{formatCurrency(cliente.mediaTicket)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Última Compra:</span>
                        <span className="text-sm font-medium text-blue-900">{formatDate(cliente.ultimaCompra)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        cliente.status === 'ativo' ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span className="text-sm font-medium text-green-900 capitalize">
                        {cliente.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compras' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Histórico de Compras</h3>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Exportar
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FaPrint className="h-4 w-4 mr-2" />
                      Imprimir
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pedido
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produtos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pagamento
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {historicoCompras.map((compra) => (
                          <tr key={compra.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {compra.numero}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(compra.data)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="space-y-1">
                                {compra.produtos.map((produto, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span>{produto.nome}</span>
                                    <span className="text-gray-500">x{produto.quantidade}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(compra.valor)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(compra.status)}
                                <span className={cn(
                                  "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                  getStatusColor(compra.status)
                                )}>
                                  {getStatusText(compra.status)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {compra.formaPagamento}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/admin/vendas/${compra.id}`}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Ver detalhes"
                              >
                                <FaEye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'estatisticas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Últimos 30 dias</p>
                      <p className="text-2xl font-bold text-gray-900">{estatisticas.comprasUltimos30Dias}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(estatisticas.valorUltimos30Dias)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaChartLine className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Últimos 90 dias</p>
                      <p className="text-2xl font-bold text-gray-900">{estatisticas.comprasUltimos90Dias}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(estatisticas.valorUltimos90Dias)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FaStar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Categoria Favorita</p>
                      <p className="text-2xl font-bold text-gray-900">{estatisticas.categoriaFavorita}</p>
                      <p className="text-sm text-gray-500">Mais comprada</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FaFileInvoice className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Frequência</p>
                      <p className="text-2xl font-bold text-gray-900">{estatisticas.frequenciaCompra}</p>
                      <p className="text-sm text-gray-500">Entre compras</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Produto Mais Comprado</h4>
                      <p className="text-sm text-gray-900">{estatisticas.produtoMaisComprado}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Forma de Pagamento Preferida</h4>
                      <p className="text-sm text-gray-900">{estatisticas.preferenciaPagamento}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
