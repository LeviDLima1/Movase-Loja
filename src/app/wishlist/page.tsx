'use client';

import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Heart, ShoppingCart, Trash2, Loader2, BookOpen, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, loading, error } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { addSuccessNotification, addErrorNotification } = useNotification();

  const handleRemoveFromWishlist = async (id: number) => {
    try {
      await removeFromWishlist(id);
      addSuccessNotification('Item removido da lista de desejos!', 'success');
    } catch (error) {
      addErrorNotification('Erro ao remover item. Tente novamente.');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista de desejos?')) {
      try {
        await clearWishlist();
        addSuccessNotification('Lista de desejos limpa!', 'success');
      } catch (error) {
        addErrorNotification('Erro ao limpar lista. Tente novamente.');
      }
    }
  };

  const handleAddToCart = async (livro: any) => {
    try {
      await addToCart({
        id: livro.id,
        titulo: livro.titulo,
        autor: livro.autor,
        price: livro.price,
        img1: livro.img1,
      });
      addSuccessNotification('Item adicionado ao carrinho!', 'success');
    } catch (error) {
      addErrorNotification('Erro ao adicionar ao carrinho. Tente novamente.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <User className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 mb-8">
              Faça login para acessar sua lista de desejos
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Carregando lista de desejos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Heart className="mx-auto h-12 w-12 mb-2" />
              <p className="text-lg font-medium">Erro ao carregar lista de desejos</p>
            </div>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                Lista de Desejos
              </h1>
              <p className="text-gray-600 mt-2">
                {items.length} {items.length === 1 ? 'item' : 'itens'} na sua lista
              </p>
            </div>
            
            {items.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Lista
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sua lista de desejos está vazia
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione livros que você gostaria de comprar mais tarde
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explorar Livros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((livro) => (
              <div
                key={livro.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100">
                  {livro.img1 ? (
                    <Image
                      src={livro.img1}
                      alt={livro.titulo}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {livro.novidade && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                        Novo
                      </span>
                    )}
                    {livro.promocao && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                        Promoção
                      </span>
                    )}
                    {livro.destaque && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded-full">
                        Destaque
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {livro.titulo}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    por {livro.autor}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {livro.categoria}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(livro.price)}
                    </span>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(livro.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remover da lista de desejos"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(livro)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Adicionar ao Carrinho
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Adicionado em {formatDate(livro.dataAdicionado)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
