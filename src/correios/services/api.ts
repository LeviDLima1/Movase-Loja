// API dos Correios

import { CorreiosRequest, CorreiosResponse } from '../types';
import { CORREIOS_SERVICE_CODES, CORREIOS_DEFAULT_DIMENSIONS, CORREIOS_CEP_ORIGEM } from '../constants';
import { parseCorreiosXML, validarRespostaCorreios } from './parser';
import { validarCEP } from './utils';

/**
 * Calcula o frete usando a API dos Correios
 */
export async function calcularFrete(
  cepDestino: string,
  peso: number,
  comprimento: number = CORREIOS_DEFAULT_DIMENSIONS.comprimento,
  altura: number = CORREIOS_DEFAULT_DIMENSIONS.altura,
  largura: number = CORREIOS_DEFAULT_DIMENSIONS.largura,
  diametro: number = CORREIOS_DEFAULT_DIMENSIONS.diametro
): Promise<CorreiosResponse[]> {
  try {
    // Validar CEP
    const cepDestinoFormatado = cepDestino.replace(/\D/g, '');
    if (!validarCEP(cepDestinoFormatado)) {
      throw new Error('CEP inválido');
    }

    // Preparar parâmetros
    const params = new URLSearchParams({
      cep: cepDestinoFormatado,
      peso: peso.toString()
    });

    // Fazer requisição para nossa API proxy
    const url = `/api/correios?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao consultar frete');
    }

    const xmlText = await response.text();
    const respostas = parseCorreiosXML(xmlText);
    
    // Validar se há erros na resposta
    validarRespostaCorreios(respostas);
    
    return respostas;
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    throw new Error('Erro ao calcular frete. Tente novamente.');
  }
}

/**
 * Calcula frete com dados completos
 */
export async function calcularFreteCompleto(request: CorreiosRequest): Promise<CorreiosResponse[]> {
  return calcularFrete(
    request.cepDestino,
    request.peso,
    request.comprimento,
    request.altura,
    request.largura,
    request.diametro
  );
}
