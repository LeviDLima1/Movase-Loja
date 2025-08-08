// Constantes dos Correios

export const CORREIOS_SERVICE_CODES = {
  PAC: '04510',
  SEDEX: '04014',
  SEDEX_10: '40215',
  SEDEX_12: '40290',
  SEDEX_HOJE: '40886'
} as const;

export const CORREIOS_SERVICE_NAMES = {
  [CORREIOS_SERVICE_CODES.PAC]: 'PAC',
  [CORREIOS_SERVICE_CODES.SEDEX]: 'SEDEX',
  [CORREIOS_SERVICE_CODES.SEDEX_10]: 'SEDEX 10',
  [CORREIOS_SERVICE_CODES.SEDEX_12]: 'SEDEX 12',
  [CORREIOS_SERVICE_CODES.SEDEX_HOJE]: 'SEDEX Hoje'
} as const;

export const CORREIOS_DEFAULT_DIMENSIONS = {
  comprimento: 16,
  altura: 2,
  largura: 11,
  diametro: 0
} as const;

export const CORREIOS_CEP_ORIGEM = '01001000'; // São Paulo - SP
