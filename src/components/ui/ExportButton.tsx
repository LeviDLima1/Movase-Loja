'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FaDownload, 
  FaFileCsv, 
  FaFileCode, 
  FaFilePdf, 
  FaChevronDown,
  FaSpinner
} from 'react-icons/fa';
import { exportDadosFiltrados, ExportOptions } from '@/lib/exportUtils';
import { useNotifications } from '@/contexts/NotificationContext';

interface ExportButtonProps {
  data: any[];
  filters: Record<string, any>;
  type: 'livros' | 'vendas' | 'estoque' | 'relatorio-vendas' | 'clientes';
  className?: string;
  disabled?: boolean;
}

export default function ExportButton({ 
  data, 
  filters, 
  type, 
  className = '', 
  disabled = false 
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addSuccessNotification, addErrorNotification } = useNotifications();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (format: ExportOptions['format']) => {
    if (data.length === 0) {
      addErrorNotification('Erro na Exportação', 'Nenhum dado disponível para exportar');
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      await exportDadosFiltrados(data, filters, type, { format });
      
      const formatNames = {
        csv: 'CSV',
        json: 'JSON',
        pdf: 'PDF'
      };
      
      addSuccessNotification(
        'Exportação Concluída', 
        `Dados exportados com sucesso em formato ${formatNames[format]}`
      );
    } catch (error) {
      console.error('Erro na exportação:', error);
      addErrorNotification(
        'Erro na Exportação', 
        'Ocorreu um erro ao exportar os dados. Tente novamente.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const getExportOptions = () => [
    {
      format: 'csv' as const,
      label: 'Exportar como CSV',
      icon: FaFileCsv,
      description: 'Arquivo de texto separado por vírgulas'
    },
    {
      format: 'json' as const,
      label: 'Exportar como JSON',
      icon: FaFileCode,
      description: 'Dados estruturados em formato JSON'
    },
    {
      format: 'pdf' as const,
      label: 'Exportar como PDF',
      icon: FaFilePdf,
      description: 'Documento em formato PDF'
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className={`
          inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium 
          text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500 cursor-pointer transition-colors
          ${disabled || isExporting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isExporting ? (
          <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FaDownload className="h-4 w-4 mr-2" />
        )}
        {isExporting ? 'Exportando...' : 'Exportar'}
        <FaChevronDown className="h-3 w-3 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-[60]">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Escolha o formato</h3>
              <p className="text-xs text-gray-500 mt-1">
                {data.length} item{data.length !== 1 ? 's' : ''} para exportar
              </p>
            </div>
            
            {getExportOptions().map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
