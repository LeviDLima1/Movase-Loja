// Serviço para buscar endereços pelo CEP usando ViaCEP

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 */
export async function buscarEnderecoPorCEP(cep: string): Promise<ViaCEPResponse> {
  try {
    // Limpar CEP (remover caracteres especiais)
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    // Fazer requisição para ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao consultar CEP');
    }

    const data: ViaCEPResponse = await response.json();
    
    // Verificar se o CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    throw new Error('Erro ao buscar endereço. Verifique o CEP.');
  }
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
  }
  return cep;
}

/**
 * Valida se um CEP é válido
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}
