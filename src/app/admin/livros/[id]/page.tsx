'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaBook, 
  FaUser, 
  FaTag, 
  FaCalendar, 
  FaLanguage, 
  FaWeight, 
  FaRuler, 
  FaEye, 
  FaShoppingCart,
  FaChartLine,
  FaBox,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

// Mock data para demonstração (será substituído por dados reais)
const mockLivros = [
  {
    id: '1',
    titulo: 'Aventuras Fantásticas',
    autor: 'João Silva',
    descricao: 'Uma história emocionante de aventuras e descobertas que transporta o leitor para mundos extraordinários. Com personagens cativantes e enredos envolventes, este livro oferece uma experiência de leitura única que combina fantasia, ação e reflexão sobre a natureza humana.',
    preco: 89.90,
    estoque: 15,
    categoria: 'Ficção',
    isbn: '978-85-0000-000-1',
    paginas: '320',
    editora: 'Editora ABC',
    anoPublicacao: '2024',
    idioma: 'Português',
    formato: 'Físico',
    peso: '0.5',
    dimensoes: '16x23cm',
    status: 'ativo' as const,
    dataCriacao: '2024-01-10',
    vendas: 23,
    visualizacoes: 156,
    avaliacoes: 4.5,
    numAvaliacoes: 12
  },
  {
    id: '2',
    titulo: 'Mistério do Século',
    autor: 'Maria Santos',
    descricao: 'Um mistério envolvente que mantém o leitor em suspense até o final. Com uma narrativa habilidosa e personagens bem desenvolvidos, este thriller psicológico explora os limites entre realidade e ilusão.',
    preco: 129.90,
    estoque: 8,
    categoria: 'Mistério',
    isbn: '978-85-0000-000-2',
    paginas: '280',
    editora: 'Editora XYZ',
    anoPublicacao: '2023',
    idioma: 'Português',
    formato: 'Físico',
    peso: '0.4',
    dimensoes: '14x21cm',
    status: 'ativo' as const,
    dataCriacao: '2024-01-08',
    vendas: 15,
    visualizacoes: 89,
    avaliacoes: 4.2,
    numAvaliacoes: 8
  }
];

export default function VisualizarLivro({ params }: { params: Promise<{ id: string }> }) {
  const { state } = useAdmin();
  const { products } = state;
  
  const [livro, setLivro] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Resolver params
  useEffect(() => {
    const resolveParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData);
    };
    resolveParams();
  }, [params]);

  // Carregar dados do livro
  useEffect(() => {
    if (!resolvedParams) return;

    const loadLivro = async () => {
      try {
        setIsLoading(true);
        
        // Buscar livro via API
        const response = await fetch(`/api/admin/livros/${resolvedParams.id}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          setError(data.error || 'Livro não encontrado');
          return;
        }

        setLivro(data.data);
      } catch (error) {
        console.error('Erro ao carregar livro:', error);
        setError('Erro ao carregar dados do livro');
      } finally {
        setIsLoading(false);
      }
    };

    loadLivro();
  }, [resolvedParams]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/livros/${resolvedParams?.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        alert(data.error || 'Erro ao excluir livro');
        return;
      }
      
      // Redirecionar para a lista de livros
      window.location.href = '/admin/livros';
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      alert('Erro ao excluir livro');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </span>
        );
      case 'inativo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="w-3 h-3 mr-1" />
            Inativo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getEstoqueBadge = (estoque: number) => {
    if (estoque === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaBox className="w-3 h-3 mr-1" />
          Sem estoque
        </span>
      );
    } else if (estoque <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaBox className="w-3 h-3 mr-1" />
          Estoque baixo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaBox className="w-3 h-3 mr-1" />
          Em estoque
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaTimesCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Erro ao carregar livro</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              href="/admin/livros"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Voltar para lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !livro && !error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <FaTimesCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-yellow-900 mb-2">Livro não encontrado</h2>
            <p className="text-yellow-700 mb-4">O livro solicitado não foi encontrado.</p>
            <Link
              href="/admin/livros"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Voltar para lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/livros"
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{livro.titulo}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/livros/editar/${livro.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FaEdit className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Informações básicas */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaBook className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Título:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{livro.titulo}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Autor:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{livro.autor}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTag className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Categoria:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{livro.categoria}</span>
                  </div>
                  <div className="flex items-center">
                    <FaShoppingCart className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Preço:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{formatCurrency(livro.preco)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status e Estoque</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">Status:</span>
                    {getStatusBadge(livro.status)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">Estoque:</span>
                    {getEstoqueBadge(livro.estoque)}
                  </div>
                  <div className="flex items-center">
                    <FaBox className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Quantidade:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{livro.estoque} unidades</span>
                  </div>
                  <div className="flex items-center">
                    <FaChartLine className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Vendas:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{livro.vendas} unidades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h2>
            <p className="text-gray-700 leading-relaxed">{livro.descricao}</p>
          </div>

          {/* Detalhes técnicos */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes Técnicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaBook className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">ISBN:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.isbn}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Ano:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.anoPublicacao}</span>
                </div>
                <div className="flex items-center">
                  <FaLanguage className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Idioma:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.idioma}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaBook className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Páginas:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.paginas}</span>
                </div>
                <div className="flex items-center">
                  <FaWeight className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Peso:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.peso} kg</span>
                </div>
                <div className="flex items-center">
                  <FaRuler className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Dimensões:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.dimensoes}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaBook className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.formato}</span>
                </div>
                <div className="flex items-center">
                  <FaBook className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Editora:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{livro.editora}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Cadastrado em:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{formatDate(livro.dataCriacao)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FaEye className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600">Visualizações</p>
                    <p className="text-lg font-semibold text-blue-900">{livro.visualizacoes}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FaShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-600">Vendas</p>
                    <p className="text-lg font-semibold text-green-900">{livro.vendas}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FaChartLine className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-yellow-600">Avaliação</p>
                    <p className="text-lg font-semibold text-yellow-900">{livro.avaliacoes}/5 ({livro.numAvaliacoes} avaliações)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-6 flex justify-center space-x-4">
          <Link
            href={`/admin/livros/editar/${livro.id}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FaEdit className="h-5 w-5 mr-2" />
            Editar Livro
          </Link>
          <Link
            href={`/livros/${livro.id}`}
            target="_blank"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FaEye className="h-5 w-5 mr-2" />
            Ver na Loja
          </Link>
        </div>
      </div>
    </div>
  );
}
