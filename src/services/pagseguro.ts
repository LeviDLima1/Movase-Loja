// Tipos para a API do PagSeguro
export interface PagSeguroItem {
  id: string;
  description: string;
  amount: number; // Valor em centavos
  quantity: number;
  weight?: number; // Peso em gramas
}

export interface PagSeguroAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PagSeguroCustomer {
  name: string;
  email: string;
  taxId: string; // CPF
  phones: {
    country: string;
    area: string;
    number: string;
  }[];
  address: PagSeguroAddress;
}

export interface PagSeguroPayment {
  charge: boolean;
  billing: {
    name: string;
    email: string;
    taxId: string;
    address: PagSeguroAddress;
  };
  paymentMethod: {
    type: 'CREDIT_CARD' | 'BOLETO' | 'PIX';
    installments?: number;
    capture?: boolean;
    card?: {
      number: string;
      expMonth: string;
      expYear: string;
      securityCode: string;
      holder: {
        name: string;
        birthDate: string;
        taxId: string;
        billingAddress: PagSeguroAddress;
        phone: {
          country: string;
          area: string;
          number: string;
        };
      };
    };
  };
}

export interface PagSeguroOrder {
  reference_id: string;
  customer: PagSeguroCustomer;
  items: PagSeguroItem[];
  shipping: {
    address: PagSeguroAddress;
  };
  charges: {
    reference_id: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: PagSeguroPayment['paymentMethod'];
  }[];
}

export interface PagSeguroResponse {
  id: string;
  reference_id: string;
  created_at: string;
  customer: PagSeguroCustomer;
  items: PagSeguroItem[];
  shipping: {
    address: PagSeguroAddress;
  };
  charges: {
    id: string;
    reference_id: string;
    status: string;
    created_at: string;
    paid_at?: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_response: {
      code: string;
      message: string;
    };
    payment_method: {
      type: string;
      installments: number;
      capture: boolean;
      card?: {
        brand: string;
        first_digits: string;
        last_digits: string;
        exp_month: string;
        exp_year: string;
        holder: {
          name: string;
        };
      };
    };
    links: {
      rel: string;
      href: string;
      media: string;
      type: string;
    }[];
  }[];
}

// Configurações do PagSeguro
const PAGSEGURO_CONFIG = {
  // Em produção, use variáveis de ambiente
  SANDBOX_URL: 'https://sandbox.api.pagseguro.com',
  PRODUCTION_URL: 'https://api.pagseguro.com',
  SANDBOX_TOKEN: 'SEU_TOKEN_SANDBOX_AQUI', // Substitua pelo seu token
  PRODUCTION_TOKEN: 'SEU_TOKEN_PRODUCAO_AQUI', // Substitua pelo seu token
  IS_SANDBOX: true // Mude para false em produção
};

// Função para obter o token baseado no ambiente
function getPagSeguroToken(): string {
  return PAGSEGURO_CONFIG.IS_SANDBOX 
    ? PAGSEGURO_CONFIG.SANDBOX_TOKEN 
    : PAGSEGURO_CONFIG.PRODUCTION_TOKEN;
}

// Função para obter a URL base
function getPagSeguroURL(): string {
  return PAGSEGURO_CONFIG.IS_SANDBOX 
    ? PAGSEGURO_CONFIG.SANDBOX_URL 
    : PAGSEGURO_CONFIG.PRODUCTION_URL;
}

// Função para criar um pedido no PagSeguro
export async function criarPedidoPagSeguro(
  orderData: Omit<PagSeguroOrder, 'charges'>,
  paymentMethod: PagSeguroPayment['paymentMethod']
): Promise<PagSeguroResponse> {
  try {
    const token = getPagSeguroToken();
    const baseURL = getPagSeguroURL();
    
    // Calcula o valor total em centavos
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + (item.amount * item.quantity), 
      0
    );

    // Monta o payload completo
    const payload: PagSeguroOrder = {
      ...orderData,
      charges: [
        {
          reference_id: orderData.reference_id,
          description: `Pedido ${orderData.reference_id}`,
          amount: {
            value: totalAmount,
            currency: 'BRL'
          },
          payment_method: paymentMethod
        }
      ]
    };

    const response = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': orderData.reference_id // Evita duplicação
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro PagSeguro: ${errorData.error_messages?.join(', ') || 'Erro desconhecido'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar pedido no PagSeguro:', error);
    throw new Error('Erro ao processar pagamento. Tente novamente.');
  }
}

// Função para processar pagamento com cartão de crédito
export async function processarPagamentoCartao(
  orderData: Omit<PagSeguroOrder, 'charges'>,
  cardData: {
    number: string;
    expMonth: string;
    expYear: string;
    securityCode: string;
    holderName: string;
    holderBirthDate: string;
    holderTaxId: string;
  }
): Promise<PagSeguroResponse> {
  const paymentMethod: PagSeguroPayment['paymentMethod'] = {
    type: 'CREDIT_CARD',
    installments: 1,
    capture: true,
    card: {
      number: cardData.number.replace(/\s/g, ''),
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      securityCode: cardData.securityCode,
      holder: {
        name: cardData.holderName,
        birthDate: cardData.holderBirthDate,
        taxId: cardData.holderTaxId.replace(/\D/g, ''),
        billingAddress: orderData.customer.address,
        phone: orderData.customer.phones[0]
      }
    }
  };

  return criarPedidoPagSeguro(orderData, paymentMethod);
}

// Função para gerar boleto
export async function gerarBoleto(
  orderData: Omit<PagSeguroOrder, 'charges'>
): Promise<PagSeguroResponse> {
  const paymentMethod: PagSeguroPayment['paymentMethod'] = {
    type: 'BOLETO',
    boleto: {
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
      instructionLines: {
        line1: 'Pagamento processado via PagSeguro',
        line2: 'Após o pagamento, seu pedido será processado'
      },
      holder: {
        name: orderData.customer.name,
        taxId: orderData.customer.taxId,
        email: orderData.customer.email,
        address: orderData.customer.address
      }
    }
  };

  return criarPedidoPagSeguro(orderData, paymentMethod);
}

// Função para gerar PIX
export async function gerarPIX(
  orderData: Omit<PagSeguroOrder, 'charges'>
): Promise<PagSeguroResponse> {
  const paymentMethod: PagSeguroPayment['paymentMethod'] = {
    type: 'PIX',
    pix: {
      expiresIn: 3600 // Expira em 1 hora
    }
  };

  return criarPedidoPagSeguro(orderData, paymentMethod);
}

// Função para consultar status de um pedido
export async function consultarPedido(orderId: string): Promise<PagSeguroResponse> {
  try {
    const token = getPagSeguroToken();
    const baseURL = getPagSeguroURL();

    const response = await fetch(`${baseURL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao consultar pedido:', error);
    throw new Error('Erro ao consultar status do pedido.');
  }
}

// Função para formatar CPF
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para validar CPF
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[10])) return false;
  
  return true;
}
