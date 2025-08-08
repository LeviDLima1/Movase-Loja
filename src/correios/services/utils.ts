// Utilitários dos Correios

import { CORREIOS_SERVICE_NAMES } from '../constants';

/**
 * Formata o valor do frete para exibição
 */
export function formatarValorFrete(valor: string): string {
  return valor.replace(',', '.');
}

/**
 * Obtém o nome do serviço baseado no código
 */
export function getNomeServico(codigo: string): string {
  return CORREIOS_SERVICE_NAMES[codigo as keyof typeof CORREIOS_SERVICE_NAMES] || 'Serviço não identificado';
}

/**
 * Valida se um CEP é válido
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}

/**
 * Formata um CEP para exibição (00000-000)
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
  }
  return cep;
}

/**
 * Calcula o peso total baseado nos itens
 */
export function calcularPesoTotal(quantidade: number, pesoUnitario: number = 0.5): number {
  return quantidade * pesoUnitario;
}
