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
  FaTrash,
  FaImage
} from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/contexts/NotificationContext';
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
  destaque: boolean;
  novidade: boolean;
  promocao: boolean;
}

const categorias = [
  'Ficção', 'Não-ficção', 'Romance', 'Suspense', 'Terror', 'Fantasia',
  'Ciência', 'História', 'Biografia', 'Auto-ajuda', 'Tecnologia', 'Arte',
  'Filosofia', 'Religião', 'Infantil', 'Juvenil', 'Acadêmico', 'Outros'
];

const formatos = ['Físico', 'Digital', 'Ambos'];
const idiomas = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano'];

export default function EditarLivro({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { state, actions } = useAdmin();
  const { products } = state;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  
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
    idioma: 'Português',
    formato: 'Físico',
    peso: '',
    dimensoes: '',
    status: 'ativo',
    destaque: false,
    novidade: false,
    promocao: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFront, setImageFront] = useState<File | null>(null);
  const [imageBack, setImageBack] = useState<File | null>(null);
  const [imageFrontPreview, setImageFrontPreview] = useState<string | null>(null);
  const [imageBackPreview, setImageBackPreview] = useState<string | null>(null);
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
        
        // Buscar livro nos dados do contexto
        const livro = products.find(l => l.id === resolvedParams.id);
        
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
          paginas: livro.paginas ? livro.paginas.toString() : '',
          editora: livro.editora || '',
          anoPublicacao: livro.anoPublicacao ? livro.anoPublicacao.toString() : '',
          idioma: livro.idioma || 'Português',
          formato: livro.formato || 'Físico',
          peso: livro.peso ? livro.peso.toString() : '',
          dimensoes: livro.dimensoes || '',
          status: livro.status,
          destaque: livro.destaque || false,
          novidade: livro.novidade || false,
          promocao: livro.promocao || false
        });

        // Carregar previews das imagens existentes
        if (livro.imagemFront) {
          setImageFrontPreview(livro.imagemFront);
        }
        if (livro.imagemBack) {
          setImageBackPreview(livro.imagemBack);
        }

      } catch (error) {
        console.error('Erro ao carregar livro:', error);
        setError('Erro ao carregar dados do livro');
      } finally {
        setIsLoading(false);
      }
    };

    loadLivro();
  }, [resolvedParams, products]);

  const handleInputChange = (field: keyof LivroForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        addErrorNotification('Erro', 'Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        addErrorNotification('Erro', 'A imagem deve ter no máximo 5MB.');
        return;
      }

      if (tipo === 'front') {
        setImageFront(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageFrontPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImageBack(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageBackPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!resolvedParams) {
        throw new Error('ID do livro não encontrado');
      }

      // Preparar dados do livro
      const livroData = {
        titulo: formData.titulo,
        autor: formData.autor,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque) || 0,
        categoria: formData.categoria,
        isbn: formData.isbn,
        paginas: formData.paginas ? parseInt(formData.paginas) : undefined,
        editora: formData.editora,
        anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : undefined,
        idioma: formData.idioma,
        formato: formData.formato,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        dimensoes: formData.dimensoes,
        status: formData.status,
        destaque: formData.destaque,
        novidade: formData.novidade,
        promocao: formData.promocao
      };

      // Atualizar o livro
      await actions.updateProduct(resolvedParams.id, livroData);

      // Se houver novas imagens, fazer upload
      if (imageFront) {
        await actions.uploadImage(imageFront, 'front');
      }
      if (imageBack) {
        await actions.uploadImage(imageBack, 'back');
      }

      addSuccessNotification('Sucesso', 'Livro atualizado com sucesso!');
      router.push('/admin/livros');
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      addErrorNotification('Erro', 'Erro ao atualizar o livro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!resolvedParams) return;

    if (confirm('Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.')) {
      try {
        setIsSubmitting(true);
        
        await actions.deleteProduct(resolvedParams.id);
        addSuccessNotification('Sucesso', 'Livro excluído com sucesso!');
        router.push('/admin/livros');
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        addErrorNotification('Erro', 'Erro ao excluir o livro. Tente novamente.');
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do autor"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descrição detalhada do livro..."
                />
              </div>

              {/* Flags especiais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.destaque}
                    onChange={(e) => handleInputChange('destaque', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Destaque</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.novidade}
                    onChange={(e) => handleInputChange('novidade', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Novidade</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promocao}
                    onChange={(e) => handleInputChange('promocao', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Promoção</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preço e Estoque */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Preço e Estoque</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) => handleInputChange('preco', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estoque}
                    onChange={(e) => handleInputChange('estoque', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Detalhes Técnicos</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="978-0-000000-0-0"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="200"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {idiomas.map(idioma => (
                      <option key={idioma} value={idioma}>{idioma}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {formatos.map(formato => (
                      <option key={formato} value={formato}>{formato}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (gramas)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensões (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.dimensoes}
                    onChange={(e) => handleInputChange('dimensoes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="15 x 21 x 2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Imagens do Livro */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaImage className="w-5 h-5 text-blue-600 mr-3" />
                Imagens do Livro
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagem da Capa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem da Capa
                  </label>
                  <div className="space-y-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                        <FaUpload className="w-4 h-4 text-gray-500 mr-2 inline" />
                        Selecionar Nova Imagem da Capa
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                    
                    {imageFrontPreview && (
                      <div className="mt-4">
                        <img
                          src={imageFrontPreview}
                          alt="Capa do livro"
                          className="w-32 h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Imagem da Contracapa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem da Contracapa (Opcional)
                  </label>
                  <div className="space-y-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                        <FaUpload className="w-4 h-4 text-gray-500 mr-2 inline" />
                        Selecionar Nova Imagem da Contracapa
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                    
                    {imageBackPreview && (
                      <div className="mt-4">
                        <img
                          src={imageBackPreview}
                          alt="Contracapa do livro"
                          className="w-32 h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Formatos aceitos: PNG, JPG, JPEG, WebP</p>
                <p>Tamanho máximo: 5MB por imagem</p>
                <p>Deixe em branco para manter a imagem atual</p>
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
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
