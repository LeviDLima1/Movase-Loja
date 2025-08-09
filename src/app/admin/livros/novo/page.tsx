'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaBook, 
  FaArrowLeft, 
  FaSave, 
  FaTimes,
  FaUpload
} from 'react-icons/fa';

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

export default function NovoLivro() {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      // Aqui você implementaria a lógica para salvar o livro
      console.log('Dados do livro:', formData);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a lista de livros após salvar
      window.location.href = '/admin/livros';
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.titulo && formData.autor && formData.preco && formData.categoria;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/livros" 
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Livro</h1>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Descrição detalhada do livro..."
                />
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    <option value="">Selecione o idioma</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                  >
                    <option value="">Selecione o formato</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="15 x 21 x 2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Imagem do Livro */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Imagem do Livro</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload da Imagem
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <FaUpload className="w-4 h-4 text-gray-500 mr-2 inline" />
                        Selecionar Imagem
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      PNG, JPG até 5MB
                    </span>
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
              {isSubmitting ? 'Salvando...' : 'Salvar Livro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
