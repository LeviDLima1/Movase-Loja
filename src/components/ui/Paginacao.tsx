'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
  className?: string;
}

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
  className = ''
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  const gerarPaginas = () => {
    const paginas = [];
    const maxPaginasVisiveis = 5;
    
    if (totalPaginas <= maxPaginasVisiveis) {
      // Mostrar todas as páginas se houver 5 ou menos
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      // Lógica para mostrar páginas com elipses
      if (paginaAtual <= 3) {
        // Páginas iniciais
        for (let i = 1; i <= 4; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (paginaAtual >= totalPaginas - 2) {
        // Páginas finais
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        // Páginas do meio
        paginas.push(1);
        paginas.push('...');
        for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }
    
    return paginas;
  };

  const paginas = gerarPaginas();

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Botão Anterior */}
      <button
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </button>

      {/* Números das Páginas */}
      <div className="flex items-center gap-1">
        {paginas.map((pagina, index) => {
          if (pagina === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-400"
              >
                ...
              </span>
            );
          }

          const numeroPagina = pagina as number;
          const isCurrent = numeroPagina === paginaAtual;

          return (
            <button
              key={numeroPagina}
              onClick={() => onMudarPagina(numeroPagina)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isCurrent
                  ? 'bg-red-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {numeroPagina}
            </button>
          );
        })}
      </div>

      {/* Botão Próxima */}
      <button
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
