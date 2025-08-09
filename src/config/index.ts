// Configurações gerais da aplicação
export const APP_CONFIG = {
  name: 'Loja de Livros',
  description: 'Sua livraria online de confiança',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // URLs
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // Configurações de paginação
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100]
  },
  
  // Configurações de upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  
  // Configurações de cache
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxTTL: 60 * 60 * 1000 // 1 hora
  }
} as const;

// Configurações de autenticação
export const AUTH_CONFIG = {
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // Sessão
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    updateAge: 60 * 60 * 1000 // 1 hora
  },
  
  // Permissões
  permissions: {
    admin: ['read', 'write', 'delete', 'manage'],
    user: ['read', 'write'],
    guest: ['read']
  }
} as const;

// Configurações de pagamento
export const PAYMENT_CONFIG = {
  // PagSeguro
  pagseguro: {
    email: process.env.PAGSEGURO_EMAIL || '',
    token: process.env.PAGSEGURO_TOKEN || '',
    sandbox: process.env.NODE_ENV === 'development',
    notificationUrl: `${APP_CONFIG.baseUrl}/api/pagseguro/notifications`
  },
  
  // Métodos de pagamento
  methods: {
    pix: {
      enabled: true,
      expiresIn: 30 * 60 * 1000 // 30 minutos
    },
    boleto: {
      enabled: true,
      expiresIn: 3 * 24 * 60 * 60 * 1000 // 3 dias
    },
    cartao: {
      enabled: true,
      installments: [1, 2, 3, 6, 12],
      maxInstallments: 12
    }
  },
  
  // Taxas
  fees: {
    pix: 0,
    boleto: 2.99,
    cartao: 2.99
  }
} as const;

// Configurações de frete
export const SHIPPING_CONFIG = {
  // Correios
  correios: {
    cepOrigem: process.env.CORREIOS_CEP_ORIGEM || '01001-000',
    codigoServico: {
      sedex: '40010',
      pac: '41106'
    }
  },
  
  // Opções de frete
  options: [
    {
      id: 'sedex',
      name: 'SEDEX',
      description: 'Entrega em 1-2 dias úteis',
      basePrice: 15.00,
      pricePerKg: 2.50
    },
    {
      id: 'pac',
      name: 'PAC',
      description: 'Entrega em 5-10 dias úteis',
      basePrice: 8.00,
      pricePerKg: 1.50
    },
    {
      id: 'retirada',
      name: 'Retirada na Loja',
      description: 'Retire gratuitamente em nossa loja',
      basePrice: 0,
      pricePerKg: 0
    }
  ],
  
  // Regiões e prazos
  regions: {
    'SP': { sedex: 1, pac: 3 },
    'RJ': { sedex: 1, pac: 4 },
    'MG': { sedex: 2, pac: 5 },
    'RS': { sedex: 2, pac: 6 },
    'PR': { sedex: 2, pac: 5 },
    'SC': { sedex: 2, pac: 6 },
    'BA': { sedex: 3, pac: 7 },
    'PE': { sedex: 3, pac: 7 },
    'CE': { sedex: 3, pac: 8 },
    'GO': { sedex: 2, pac: 6 },
    'DF': { sedex: 2, pac: 5 }
  }
} as const;

// Configurações de email
export const EMAIL_CONFIG = {
  // SMTP
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },
  
  // Templates
  templates: {
    orderConfirmation: 'order-confirmation',
    orderShipped: 'order-shipped',
    orderDelivered: 'order-delivered',
    passwordReset: 'password-reset',
    welcome: 'welcome'
  },
  
  // Configurações de envio
  sending: {
    from: process.env.EMAIL_FROM || 'noreply@lojadelivros.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'suporte@lojadelivros.com',
    maxRetries: 3,
    retryDelay: 5000 // 5 segundos
  }
} as const;

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  // Tipos
  types: {
    order: {
      icon: 'shopping-cart',
      color: 'blue',
      priority: 'high'
    },
    stock: {
      icon: 'exclamation-triangle',
      color: 'yellow',
      priority: 'medium'
    },
    payment: {
      icon: 'credit-card',
      color: 'green',
      priority: 'high'
    },
    system: {
      icon: 'cog',
      color: 'gray',
      priority: 'low'
    }
  },
  
  // Configurações de push
  push: {
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || ''
  }
} as const;

// Configurações de SEO
export const SEO_CONFIG = {
  // Meta tags padrão
  default: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    keywords: 'livros, livraria, online, compra, venda',
    author: APP_CONFIG.name,
    robots: 'index, follow'
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_CONFIG.name
  },
  
  // Twitter Card
  twitter: {
    cardType: 'summary_large_image',
    site: '@lojadelivros'
  }
} as const;

// Configurações de analytics
export const ANALYTICS_CONFIG = {
  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    debug: process.env.NODE_ENV === 'development'
  },
  
  // Facebook Pixel
  facebookPixel: {
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''
  }
} as const;

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  // Logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV === 'development',
    enableFile: process.env.NODE_ENV === 'production'
  },
  
  // Debug
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    showQueryParams: true,
    showPerformanceMetrics: true
  },
  
  // Hot reload
  hotReload: {
    enabled: process.env.NODE_ENV === 'development',
    port: 3001
  }
} as const;

// Configurações de produção
export const PROD_CONFIG = {
  // Performance
  performance: {
    enableCompression: true,
    enableMinification: true,
    enableCaching: true,
    enableCDN: true
  },
  
  // Segurança
  security: {
    enableHTTPS: true,
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true
  },
  
  // Monitoramento
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUptimeMonitoring: true
  }
} as const;

// Função para obter configuração baseada no ambiente
export function getConfig() {
  const isDev = APP_CONFIG.environment === 'development';
  const isProd = APP_CONFIG.environment === 'production';
  
  return {
    ...APP_CONFIG,
    auth: AUTH_CONFIG,
    payment: PAYMENT_CONFIG,
    shipping: SHIPPING_CONFIG,
    email: EMAIL_CONFIG,
    notification: NOTIFICATION_CONFIG,
    seo: SEO_CONFIG,
    analytics: ANALYTICS_CONFIG,
    dev: isDev ? DEV_CONFIG : {},
    prod: isProd ? PROD_CONFIG : {}
  };
}

// Função para validar configurações obrigatórias
export function validateConfig() {
  const requiredEnvVars = [
    'JWT_SECRET',
    'PAGSEGURO_EMAIL',
    'PAGSEGURO_TOKEN',
    'SMTP_USER',
    'SMTP_PASS'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
    console.warn('   Algumas funcionalidades podem não funcionar corretamente.');
  }
  
  return missingVars.length === 0;
}

// Exportar configuração principal
export default getConfig();
