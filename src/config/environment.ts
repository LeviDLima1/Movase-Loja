// 🔧 CONFIGURAÇÕES DE AMBIENTE - CENTRALIZADAS PARA MIGRAÇÃO FÁCIL

export const ENV_CONFIG = {
  // 🌍 Ambiente
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  
  // 🔗 URLs - FÁCIL DE MUDAR PARA PRODUÇÃO
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3001/api',
  
  // 🗄️ Banco de Dados
  DATABASE_URL: process.env.BACKEND_DATABASE_URL || 'postgresql://user:password@localhost:5432/movase_db',
  
  // 🔐 Autenticação
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // 📧 Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@movase.com',
  EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || 'suporte@movase.com',
  
  // 💳 Pagamento
  PIX_KEY: process.env.PIX_KEY || '',
  PAGSEGURO_EMAIL: process.env.PAGSEGURO_EMAIL || '',
  PAGSEGURO_TOKEN: process.env.PAGSEGURO_TOKEN || '',
  PAGSEGURO_SANDBOX: process.env.PAGSEGURO_SANDBOX === 'true',
  
  // 📦 Frete
  CORREIOS_CEP_ORIGEM: process.env.CORREIOS_CEP_ORIGEM || '01001-000',
  CORREIOS_CODIGO_EMPRESA: process.env.CORREIOS_CODIGO_EMPRESA || '',
  CORREIOS_SENHA: process.env.CORREIOS_SENHA || '',
  
  // 📊 Analytics
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
  
  // 🔔 Notificações
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || '',
  
  // 🗄️ Cache
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300'),
  
  // 📁 Upload
  UPLOAD_MAX_SIZE: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880'),
  UPLOAD_ALLOWED_TYPES: process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp',
  
  // 🔒 Segurança
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
  
  // 📝 Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

// 🎯 Função para obter configuração baseada no ambiente
export function getEnvironmentConfig() {
  const isDevelopment = ENV_CONFIG.NODE_ENV === 'development';
  const isProduction = ENV_CONFIG.NODE_ENV === 'production';
  
  return {
    ...ENV_CONFIG,
    isDevelopment,
    isProduction,
    isStaging: ENV_CONFIG.APP_ENV === 'staging',
    
    // Configurações específicas por ambiente
    api: {
      baseUrl: ENV_CONFIG.API_URL,
      backendUrl: ENV_CONFIG.BACKEND_API_URL,
      timeout: isProduction ? 10000 : 30000,
      retries: isProduction ? 3 : 1,
    },
    
    database: {
      url: ENV_CONFIG.DATABASE_URL,
      ssl: isProduction,
      pool: {
        min: isProduction ? 2 : 1,
        max: isProduction ? 10 : 5,
      },
    },
    
    cache: {
      ttl: ENV_CONFIG.CACHE_TTL,
      redis: ENV_CONFIG.REDIS_URL,
      enabled: isProduction,
    },
    
    security: {
      cors: ENV_CONFIG.CORS_ORIGIN,
      rateLimit: {
        max: ENV_CONFIG.RATE_LIMIT_MAX,
        window: ENV_CONFIG.RATE_LIMIT_WINDOW,
      },
      https: isProduction,
    },
    
    logging: {
      level: ENV_CONFIG.LOG_LEVEL,
      console: isDevelopment,
      file: isProduction,
    },
  };
}

// 🔍 Função para validar configurações obrigatórias
export function validateEnvironmentConfig() {
  const requiredVars = [
    'JWT_SECRET',
    'SMTP_USER',
    'SMTP_PASS',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
    console.warn('   Algumas funcionalidades podem não funcionar corretamente.');
  }
  
  return missingVars.length === 0;
}

// 🚀 Função para obter configuração de migração
export function getMigrationConfig() {
  const config = getEnvironmentConfig();
  
  return {
    // URLs que precisam ser alteradas na migração
    urls: {
      frontend: config.api.baseUrl,
      backend: config.api.backendUrl,
      database: config.database.url,
      redis: config.cache.redis,
    },
    
    // Configurações que mudam entre ambientes
    environment: {
      nodeEnv: config.NODE_ENV,
      appEnv: config.APP_ENV,
      isProduction: config.isProduction,
    },
    
    // Configurações de segurança para produção
    security: {
      https: config.security.https,
      cors: config.security.cors,
      rateLimit: config.security.rateLimit,
    },
    
    // Configurações de performance para produção
    performance: {
      cache: config.cache.enabled,
      database: config.database.pool,
      api: config.api,
    },
  };
}

// Exportar configuração principal
export default getEnvironmentConfig();
