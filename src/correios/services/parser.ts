// Parser do XML dos Correios

import { CorreiosResponse } from '../types';

/**
 * Extrai dados de um serviço individual do XML
 */
function extrairDadosServico(servicoXml: string): CorreiosResponse {
  const extrairCampo = (campo: string): string => {
    const regex = new RegExp(`<${campo}>(.*?)</${campo}>`);
    const match = servicoXml.match(regex);
    return match ? match[1] : '';
  };

  return {
    Codigo: extrairCampo('Codigo'),
    Valor: extrairCampo('Valor'),
    PrazoEntrega: extrairCampo('PrazoEntrega'),
    ValorSemAdicionais: extrairCampo('ValorSemAdicionais'),
    ValorMaoPropria: extrairCampo('ValorMaoPropria'),
    ValorAvisoRecebimento: extrairCampo('ValorAvisoRecebimento'),
    ValorDeclarado: extrairCampo('ValorDeclarado'),
    EntregaDomiciliar: extrairCampo('EntregaDomiciliar'),
    EntregaSabado: extrairCampo('EntregaSabado'),
    Erro: extrairCampo('Erro'),
    MsgErro: extrairCampo('MsgErro')
  };
}

/**
 * Parseia o XML de resposta dos Correios
 */
export function parseCorreiosXML(xmlText: string): CorreiosResponse[] {
  try {
    // Extrair todos os serviços do XML
    const servicoRegex = /<cServico>([\s\S]*?)<\/cServico>/g;
    const servicos: string[] = [];
    let match;

    while ((match = servicoRegex.exec(xmlText)) !== null) {
      servicos.push(match[1]);
    }

    // Converter cada serviço para objeto
    return servicos.map(servico => extrairDadosServico(servico));
  } catch (error) {
    console.error('Erro ao fazer parse do XML dos Correios:', error);
    throw new Error('Erro ao processar resposta dos Correios');
  }
}

/**
 * Valida se a resposta dos Correios contém erros
 */
export function validarRespostaCorreios(respostas: CorreiosResponse[]): void {
  const erros = respostas.filter(resposta => resposta.Erro !== '0');
  
  if (erros.length > 0) {
    const mensagensErro = erros.map(erro => erro.MsgErro).filter(msg => msg);
    throw new Error(`Erro nos Correios: ${mensagensErro.join(', ')}`);
  }
}
