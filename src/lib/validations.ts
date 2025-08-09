import { z } from 'zod';

// Schema para dados pessoais do cliente
export const customerDataSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
    .refine((cpf) => {
      // Validação básica de CPF
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
      
      // Validação dos dígitos verificadores
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
      }
      let remainder = sum % 11;
      let digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
      }
      remainder = sum % 11;
      let digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      return digit1 === parseInt(cleanCpf.charAt(9)) && digit2 === parseInt(cleanCpf.charAt(10));
    }, 'CPF inválido'),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
});

// Schema para endereço
export const addressSchema = z.object({
  cep: z.string()
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
  
  street: z.string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  
  number: z.string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  complement: z.string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional(),
  
  neighborhood: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  
  state: z.string()
    .length(2, 'Estado deve ter exatamente 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'Estado deve estar em maiúsculas')
});

// Schema para dados de pagamento
export const paymentSchema = z.object({
  method: z.enum(['pix', 'boleto', 'cartao'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' })
  }),
  
  cardData: z.object({
    number: z.string()
      .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Número do cartão deve estar no formato XXXX XXXX XXXX XXXX')
      .refine((num) => {
        const cleanNum = num.replace(/\s/g, '');
        return cleanNum.length >= 13 && cleanNum.length <= 19;
      }, 'Número do cartão deve ter entre 13 e 19 dígitos'),
    
    holder: z.string()
      .min(2, 'Nome do titular deve ter pelo menos 2 caracteres')
      .max(100, 'Nome do titular deve ter no máximo 100 caracteres'),
    
    expiry: z.string()
      .regex(/^\d{2}\/\d{2}$/, 'Data de validade deve estar no formato MM/AA')
      .refine((expiry) => {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;
        if (expMonth < 1 || expMonth > 12) return false;
        
        return true;
      }, 'Data de validade inválida ou expirada'),
    
    cvv: z.string()
      .regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos')
  }).optional()
});

// Schema para dados do livro (admin)
export const bookSchema = z.object({
  titulo: z.string()
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  
  autor: z.string()
    .min(2, 'Autor deve ter pelo menos 2 caracteres')
    .max(100, 'Autor deve ter no máximo 100 caracteres'),
  
  descricao: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
  
  preco: z.string()
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Preço deve ser um número maior que zero'),
  
  estoque: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    }, 'Estoque deve ser um número maior ou igual a zero'),
  
  categoria: z.string()
    .min(1, 'Categoria é obrigatória'),
  
  isbn: z.string()
    .regex(/^(\d{10}|\d{13})$/, 'ISBN deve ter 10 ou 13 dígitos')
    .optional(),
  
  paginas: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, 'Número de páginas deve ser um número maior que zero')
    .optional(),
  
  editora: z.string()
    .min(2, 'Editora deve ter pelo menos 2 caracteres')
    .max(100, 'Editora deve ter no máximo 100 caracteres')
    .optional(),
  
  anoPublicacao: z.string()
    .regex(/^\d{4}$/, 'Ano de publicação deve ter 4 dígitos')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, 'Ano de publicação deve estar entre 1900 e o próximo ano')
    .optional(),
  
  idioma: z.string()
    .min(1, 'Idioma é obrigatório'),
  
  formato: z.string()
    .min(1, 'Formato é obrigatório'),
  
  peso: z.string()
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Peso deve ser um número maior que zero')
    .optional(),
  
  dimensoes: z.string()
    .regex(/^\d+x\d+x\d+$/, 'Dimensões devem estar no formato LxAxP')
    .optional(),
  
  status: z.enum(['ativo', 'inativo'])
});

// Schema para dados de postagem (admin)
export const postSchema = z.object({
  titulo: z.string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  
  conteudo: z.string()
    .min(50, 'Conteúdo deve ter pelo menos 50 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10000 caracteres'),
  
  resumo: z.string()
    .min(20, 'Resumo deve ter pelo menos 20 caracteres')
    .max(500, 'Resumo deve ter no máximo 500 caracteres'),
  
  categoria: z.string()
    .min(1, 'Categoria é obrigatória'),
  
  tags: z.array(z.string())
    .min(1, 'Pelo menos uma tag é obrigatória')
    .max(10, 'Máximo de 10 tags permitidas'),
  
  status: z.enum(['rascunho', 'publicado', 'arquivado']),
  
  dataPublicacao: z.string()
    .optional()
});

// Schema para filtros de busca
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['date', 'name', 'price', 'sales']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
});

// Schema para configurações do admin
export const adminConfigSchema = z.object({
  siteName: z.string().min(2).max(100),
  siteDescription: z.string().max(500).optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: addressSchema.optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional()
  }).optional(),
  paymentMethods: z.array(z.enum(['pix', 'boleto', 'cartao'])),
  shippingOptions: z.array(z.object({
    name: z.string(),
    price: z.number().min(0),
    estimatedDays: z.number().min(1)
  }))
});

// Tipos derivados dos schemas
export type CustomerData = z.infer<typeof customerDataSchema>;
export type Address = z.infer<typeof addressSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type BookData = z.infer<typeof bookSchema>;
export type PostData = z.infer<typeof postSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type AdminConfig = z.infer<typeof adminConfigSchema>;

// Função utilitária para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}

// Função para formatar erros de validação
export function formatValidationErrors(errors: string[]): string {
  return errors.join('. ');
}
