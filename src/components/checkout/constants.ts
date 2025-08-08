export const ESTADOS_BRASIL = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export const METODOS_PAGAMENTO = [
  {
    id: 'credit_card',
    title: 'Cartão de Crédito',
    description: 'Pagamento à vista',
    icon: '💳',
    colors: ['bg-blue-600', 'bg-yellow-500', 'bg-green-600']
  },
  {
    id: 'boleto',
    title: 'Boleto Bancário',
    description: 'Vencimento em 3 dias',
    icon: '📄',
    colors: ['bg-green-700']
  },
  {
    id: 'pix',
    title: 'PIX',
    description: 'Pagamento instantâneo',
    icon: '📱',
    colors: ['bg-green-500']
  }
];

export const CAMPOS_CARTAO = [
  { id: 'number', label: 'Número do Cartão *', placeholder: '0000 0000 0000 0000', maxLength: 19, colSpan: 'md:col-span-2' },
  { id: 'holderName', label: 'Nome no Cartão *', placeholder: 'Como está impresso no cartão', colSpan: 'md:col-span-2' },
  { id: 'expMonth', label: 'Mês de Expiração *', placeholder: 'MM', maxLength: 2 },
  { id: 'expYear', label: 'Ano de Expiração *', placeholder: 'AAAA', maxLength: 4 },
  { id: 'securityCode', label: 'CVV *', placeholder: '123', maxLength: 4 },
  { id: 'holderCPF', label: 'CPF do Titular *', placeholder: '000.000.000-00' }
];

export const CHECKOUT_STEPS = [
  { id: 'dados-pessoais', title: 'Dados Pessoais', icon: '👤', color: 'blue' },
  { id: 'endereco', title: 'Endereço', icon: '📍', color: 'green' },
  { id: 'frete', title: 'Frete', icon: '🚚', color: 'yellow' },
  { id: 'pagamento', title: 'Pagamento', icon: '💳', color: 'purple' },
  { id: 'confirmacao', title: 'Confirmação', icon: '✅', color: 'green' }
];

export const STEP_CONFIG = {
  'dados-pessoais': {
    title: 'Dados Pessoais',
    description: 'Preencha seus dados pessoais para continuar',
    color: 'blue',
    icon: '👤'
  },
  'endereco': {
    title: 'Endereço de Entrega',
    description: 'Digite o CEP para preenchimento automático',
    color: 'green',
    icon: '📍'
  },
  'frete': {
    title: 'Opções de Frete',
    description: 'Escolha a forma de entrega',
    color: 'yellow',
    icon: '🚚'
  },
  'pagamento': {
    title: 'Método de Pagamento',
    description: 'Escolha como deseja pagar',
    color: 'purple',
    icon: '💳'
  },
  'confirmacao': {
    title: 'Confirmação do Pedido',
    description: 'Revise seus dados antes de finalizar',
    color: 'green',
    icon: '✅'
  }
};
