// Tipos relacionados aos Correios

export interface CorreiosRequest {
  cepDestino: string;
  peso: number;
  comprimento?: number;
  altura?: number;
  largura?: number;
  diametro?: number;
}

export interface CorreiosResponse {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  ValorSemAdicionais: string;
  ValorMaoPropria: string;
  ValorAvisoRecebimento: string;
  ValorDeclarado: string;
  EntregaDomiciliar: string;
  EntregaSabado: string;
  Erro: string;
  MsgErro: string;
}

export interface CorreiosServiceCode {
  code: string;
  name: string;
  description: string;
}
