'use client';

import Header from '../components/header/page';
import Footer from '@/components/footer/page';
import { useLivros } from '@/hooks/useLivros';
import LivroCard from '@/components/livros/LivroCard';
import { Loader2, Star, TrendingUp, Tag } from 'lucide-react';
import { Suspense } from 'react';

// Componente específico para a home
function HomeLivrosVitrine() {
  const {
    livros,
    loading,
    error
  } = useLivros();

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Erro ao carregar livros</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          <span className="text-gray-600">Carregando livros...</span>
        </div>
      </div>
    );
  }

  // Mostrar apenas os primeiros 8 livros na home
  const livrosHome = livros.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Seção Destaques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Destaques</h3>
          <a 
            href="/livros" 
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {livrosHome.slice(0, 4).map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </div>
      </div>

      {/* Seção Novidades */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Novidades</h3>
          <a 
            href="/livros" 
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {livrosHome.slice(4, 8).map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Banner Principal */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Livraria Movase
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Encontre os melhores livros cristãos para sua jornada espiritual
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/livros"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Todos os Livros
              </a>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                Lançamentos
              </button>
            </div>
          </div>
        </div>

        {/* Vitrine de Livros */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Livros
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra uma coleção cuidadosamente selecionada de livros que inspiram, 
              educam e fortalecem sua fé cristã.
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                <span className="text-gray-600">Carregando livros...</span>
              </div>
            </div>
          }>
            <HomeLivrosVitrine />
          </Suspense>
        </div>
      </div>

      <Footer />
    </>
  );
}
