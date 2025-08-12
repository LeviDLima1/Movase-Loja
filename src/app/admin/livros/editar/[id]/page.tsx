'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBook, 
  FaArrowLeft, 
  FaSave, 
  FaTimes,
  FaUpload,
  FaEye,
  FaTrash
} from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import LoadingSpinner, { Skeleton } from '@/components/ui/LoadingSpinner';

interface LivroForm {
  titulo: string;
  autor: string;
  descricao: string;
  preco: string;
  estoque: string;
  categoria: string;
  isbn: string;
  paginas: string;
  editora: string;
  anoPublicacao: string;
  idioma: string;
  formato: string;
  peso: string;
  dimensoes: string;
  status: 'ativo' | 'inativo';
}

const categorias = [
  'Ficção', 'Não-ficção', 'Romance', 'Suspense', 'Terror', 'Fantasia',
  'Ciência', 'História', 'Biografia', 'Auto-ajuda', 'Tecnologia', 'Arte',
  'Filosofia', 'Religião', 'Infantil', 'Juvenil', 'Acadêmico', 'Outros'
];

const formatos = ['Físico', 'Digital', 'Ambos'];
const idiomas = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano'];

// Mock data para demonstração (será substituído por dados reais)
const mockLivros = [
  {
    id: '1',
    titulo: 'Aventuras Fantásticas',
    autor: 'João Silva',
    descricao: 'Uma história emocionante de aventuras e descobertas.',
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
    vendas: 23
  },
  {
    id: '2',
    titulo: 'Mistério do Século',
    autor: 'Maria Santos',
    descricao: 'Um mistério envolvente que mantém o leitor em suspense até o final.',
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
    vendas: 15
  }
];

export default function EditarLivro({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { state } = useAdmin();
  const { products } = state;
  
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: '',
    autor: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoria: '',
    isbn: '',
    paginas: '',
    editora: '',
    anoPublicacao: '',
    idioma: '',
    formato: '',
    peso: '',
    dimensoes: '',
    status: 'ativo'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        
        // Buscar livro nos dados do contexto ou mock
        const livros = products.length > 0 ? products : mockLivros;
        const livro = livros.find(l => l.id === resolvedParams.id);
        
        if (!livro) {
          setError('Livro não encontrado');
          return;
        }

        // Preencher formulário com dados do livro
        setFormData({
          titulo: livro.titulo,
          autor: livro.autor,
          descricao: livro.descricao || '',
          preco: livro.preco.toString(),
          estoque: livro.estoque.toString(),
          categoria: livro.categoria,
          isbn: livro.isbn || '',
          paginas: livro.paginas || '',
          editora: livro.editora || '',
          anoPublicacao: livro.anoPublicacao || '',
          idioma: livro.idioma || 'Português',
          formato: livro.formato || 'Físico',
          peso: livro.peso || '',
          dimensoes: livro.dimensoes || '',
          status: livro.status
        });

      } catch (error) {
        console.error('Erro ao carregar livro:', error);
        setError('Erro ao carregar dados do livro');
      } finally {
        setIsLoading(false);
      }
    };

    loadLivro();
  }, [resolvedParams, products]);

  const handleInputChange = (field: keyof LivroForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui você implementaria a lógica para atualizar o livro
      console.log('Dados do livro atualizados:', formData);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a lista de livros após salvar
      router.push('/admin/livros');
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.')) {
      try {
        setIsSubmitting(true);
        
        // Aqui você implementaria a lógica para excluir o livro
        console.log('Excluindo livro:', resolvedParams?.id);
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirecionar para a lista de livros
        router.push('/admin/livros');
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        setError('Erro ao excluir livro');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = formData.titulo && formData.autor && formData.preco && formData.categoria;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton lines={1} className="h-16 mb-8" />
          <div className="space-y-8">
            <Skeleton lines={6} className="h-96" />
            <Skeleton lines={6} className="h-96" />
            <Skeleton lines={6} className="h-96" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar livro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/admin/livros"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Voltar para lista
          </Link>
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
                href="/admin/livros" 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Editar Livro</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/livros/${resolvedParams?.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <FaEye className="h-4 w-4 mr-2" />
                Visualizar
              </Link>
              
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaBook className="w-5 h-5 text-blue-600 mr-3" />
                Informações Básicas
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Livro *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Digite o título do livro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor *
                  </label>
                  <input
                    type="text"
                    value={formData.autor}
                    onChange={(e) => handleInputChange('autor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nome do autor"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Descrição detalhada do livro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) => handleInputChange('preco', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estoque}
                    onChange={(e) => handleInputChange('estoque', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Quantidade em estoque"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Informações Técnicas</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="978-85-0000-000-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.paginas}
                    onChange={(e) => handleInputChange('paginas', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="320"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editora
                  </label>
                  <input
                    type="text"
                    value={formData.editora}
                    onChange={(e) => handleInputChange('editora', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nome da editora"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano de Publicação
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.anoPublicacao}
                    onChange={(e) => handleInputChange('anoPublicacao', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    value={formData.idioma}
                    onChange={(e) => handleInputChange('idioma', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                  >
                    {idiomas.map((idioma) => (
                      <option key={idioma} value={idioma}>
                        {idioma}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato
                  </label>
                  <select
                    value={formData.formato}
                    onChange={(e) => handleInputChange('formato', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                  >
                    {formatos.map((formato) => (
                      <option key={formato} value={formato}>
                        {formato}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensões
                  </label>
                  <input
                    type="text"
                    value={formData.dimensoes}
                    onChange={(e) => handleInputChange('dimensoes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="16x23cm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload de Imagens */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Imagens do Livro</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capa Frontal
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                          <span>Fazer upload</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capa Traseira
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                          <span>Fazer upload</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/livros"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FaTimes className="w-4 h-4 mr-2 inline" />
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                isFormValid && !isSubmitting
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaSave className="w-4 h-4 mr-2 inline" />
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
