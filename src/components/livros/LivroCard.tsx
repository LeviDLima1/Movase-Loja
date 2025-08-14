'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Eye, Heart, Tag, TrendingUp } from 'lucide-react';
import { Livro } from '@/hooks/useLivros';
import AddToCartButton from '../AddToCartButton';

interface LivroCardProps {
  livro: Livro;
}

export default function LivroCard({ livro }: LivroCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleLivroClick = () => {
    router.push(`/livros/${livro.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = () => {
    switch (livro.status) {
      case 'disponivel':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Disponível
          </span>
        );
      case 'indisponivel':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Indisponível
          </span>
        );
      case 'esgotado':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Esgotado
          </span>
        );
      default:
        return null;
    }
  };

  const getDiscountPercentage = () => {
    if (livro.precoOriginal > livro.preco) {
      const discount = ((livro.precoOriginal - livro.preco) / livro.precoOriginal) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLivroClick}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {livro.destaque && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <Star className="h-3 w-3" />
            Destaque
          </span>
        )}
        {livro.novidade && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <TrendingUp className="h-3 w-3" />
            Novo
          </span>
        )}
        {livro.promocao && getDiscountPercentage() > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Tag className="h-3 w-3" />
            -{getDiscountPercentage()}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <Heart 
          className={`h-4 w-4 ${isWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
        />
      </button>

      {/* Imagem */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={isHovered && livro.imagemBack ? livro.imagemBack : livro.imagemFront}
          alt={livro.titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback para placeholder se a imagem não carregar
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/300/400';
          }}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay com informações rápidas */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              <Eye className="h-4 w-4 inline mr-2" />
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Status */}
        <div className="mb-2">
          {getStatusBadge()}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
          {livro.titulo}
        </h3>

        {/* Autor */}
        <p className="text-sm text-gray-600 mb-2">
          por {livro.autor}
        </p>

        {/* Avaliações */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(livro.avaliacoes)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({livro.totalAvaliacoes})
          </span>
        </div>

        {/* Preço */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-red-600">
            {formatPrice(livro.preco)}
          </span>
          {livro.precoOriginal > livro.preco && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(livro.precoOriginal)}
            </span>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          <p>{livro.paginas} páginas • {livro.ano}</p>
          <p>ISBN: {livro.isbn}</p>
          {livro.estoque > 0 && (
            <p className="text-green-600">Em estoque: {livro.estoque} un.</p>
          )}
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <div className="flex gap-2">
          <AddToCartButton
            livro={{
              id: livro.id,
              titulo: livro.titulo,
              autor: livro.autor,
              price: livro.preco,
              img1: livro.imagemFront
            }}
            className={`flex-1 ${livro.status !== 'disponivel' ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Tags */}
        {livro.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {livro.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {livro.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{livro.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
