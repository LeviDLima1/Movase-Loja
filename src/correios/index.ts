// Módulo principal dos Correios

// Exportar tipos
export type { CorreiosRequest, CorreiosResponse, CorreiosServiceCode } from './types';

// Exportar constantes
export { 
  CORREIOS_SERVICE_CODES, 
  CORREIOS_SERVICE_NAMES, 
  CORREIOS_DEFAULT_DIMENSIONS,
  CORREIOS_CEP_ORIGEM 
} from './constants';

// Exportar funções principais
export { calcularFrete, calcularFreteCompleto } from './services/api';

// Exportar utilitários
export { 
  formatarValorFrete, 
  getNomeServico, 
  validarCEP, 
  formatarCEP, 
  calcularPesoTotal 
} from './services/utils';

// Exportar funções de parser
export { parseCorreiosXML, validarRespostaCorreios } from './services/parser';
