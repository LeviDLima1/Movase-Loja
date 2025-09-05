#!/usr/bin/env node

/**
 * Script de Migração de Ambiente
 * Facilita a mudança entre desenvolvimento, staging e produção
 */

const fs = require('fs');
const path = require('path');

// Configurações por ambiente - Baseadas no seu .env do backend
const ENVIRONMENTS = {
  development: {
    // Frontend
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    BACKEND_API_URL: 'http://localhost:3001/api',
    NODE_ENV: 'development',
    NEXT_PUBLIC_APP_ENV: 'development',
    
    // Banco de Dados (baseado no seu .env)
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_NAME: 'movase',
    DB_USER: 'postgres',
    DB_PASS: '0000',
    
    // Servidor
    PORT: '3001',
    
    // Email (baseado no seu .env)
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'duartelevi02@gmail.com',
    SMTP_PASS: 'urqj sysh yfgf yzww',
    FRONTEND_URL: 'http://localhost:3000',
    ADMIN_EMAILS: 'admin@movase.com',
    
    // Segurança (baseado no seu .env)
    JWT_SECRET: 'movase_jwt_secret_key_2024_very_secure',
    JWT_EXPIRES_IN: '7d',
    
    // Outros
    LOG_LEVEL: 'info',
    PAGSEGURO_SANDBOX: 'true',
  },
  
  staging: {
    // Frontend
    NEXT_PUBLIC_API_URL: 'https://api-staging.movase.com',
    NEXT_PUBLIC_SITE_URL: 'https://staging.movase.com',
    BACKEND_API_URL: 'https://api-staging.movase.com/api',
    NODE_ENV: 'production',
    NEXT_PUBLIC_APP_ENV: 'staging',
    
    // Banco de Dados (staging)
    DB_HOST: 'db-staging.movase.com',
    DB_PORT: '5432',
    DB_NAME: 'movase_staging',
    DB_USER: 'postgres',
    DB_PASS: 'your-staging-password',
    
    // Servidor
    PORT: '3001',
    
    // Email (mesmo do desenvolvimento)
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'duartelevi02@gmail.com',
    SMTP_PASS: 'urqj sysh yfgf yzww',
    FRONTEND_URL: 'https://staging.movase.com',
    ADMIN_EMAILS: 'admin@movase.com',
    
    // Segurança (staging)
    JWT_SECRET: 'movase_jwt_secret_key_2024_staging',
    JWT_EXPIRES_IN: '7d',
    
    // Outros
    LOG_LEVEL: 'warn',
    PAGSEGURO_SANDBOX: 'true',
  },
  
  production: {
    // Frontend
    NEXT_PUBLIC_API_URL: 'https://api.movase.com',
    NEXT_PUBLIC_SITE_URL: 'https://movase.com',
    BACKEND_API_URL: 'https://api.movase.com/api',
    NODE_ENV: 'production',
    NEXT_PUBLIC_APP_ENV: 'production',
    
    // Banco de Dados (produção)
    DB_HOST: 'db.movase.com',
    DB_PORT: '5432',
    DB_NAME: 'movase_production',
    DB_USER: 'postgres',
    DB_PASS: 'your-production-password',
    
    // Servidor
    PORT: '3001',
    
    // Email (produção)
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'true',
    SMTP_USER: 'duartelevi02@gmail.com',
    SMTP_PASS: 'urqj sysh yfgf yzww',
    FRONTEND_URL: 'https://movase.com',
    ADMIN_EMAILS: 'admin@movase.com',
    
    // Segurança (produção)
    JWT_SECRET: 'movase_jwt_secret_key_2024_production_very_secure',
    JWT_EXPIRES_IN: '7d',
    
    // Outros
    LOG_LEVEL: 'warn',
    PAGSEGURO_SANDBOX: 'false',
  }
};

// Função para criar arquivo .env
function createEnvFile(environment) {
  const config = ENVIRONMENTS[environment];
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envPath = path.join(__dirname, '..', '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`✅ Arquivo .env.local criado para ambiente: ${environment}`);
  console.log(`📁 Localização: ${envPath}`);
}

// Função para validar ambiente
function validateEnvironment(environment) {
  if (!ENVIRONMENTS[environment]) {
    console.error(`❌ Ambiente inválido: ${environment}`);
    console.log(`✅ Ambientes disponíveis: ${Object.keys(ENVIRONMENTS).join(', ')}`);
    process.exit(1);
  }
}

// Função para mostrar configurações
function showConfig(environment) {
  const config = ENVIRONMENTS[environment];
  console.log(`\n🔧 Configurações para ${environment.toUpperCase()}:`);
  console.log('=====================================');
  
  Object.entries(config).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  
  console.log('=====================================\n');
}

// Função para mostrar ajuda
function showHelp() {
  console.log(`
🚀 Script de Migração de Ambiente - Movase

Uso:
  node scripts/migrate-environment.js <ambiente> [opções]

Ambientes disponíveis:
  development  - Ambiente de desenvolvimento local
  staging      - Ambiente de teste/staging
  production   - Ambiente de produção

Opções:
  --show       - Mostrar configurações sem criar arquivo
  --help       - Mostrar esta ajuda

Exemplos:
  node scripts/migrate-environment.js development
  node scripts/migrate-environment.js production --show
  node scripts/migrate-environment.js staging

📁 O arquivo .env.local será criado na raiz do projeto
🔧 Todas as configurações serão centralizadas automaticamente
`);
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    showHelp();
    return;
  }
  
  const environment = args[0];
  const showOnly = args.includes('--show');
  
  validateEnvironment(environment);
  
  if (showOnly) {
    showConfig(environment);
  } else {
    showConfig(environment);
    createEnvFile(environment);
    
    console.log(`
🎉 Migração concluída!

📋 Próximos passos:
1. Verifique o arquivo .env.local criado
2. Configure as variáveis específicas do seu ambiente
3. Reinicie o servidor de desenvolvimento
4. Teste as funcionalidades

🔧 Configurações centralizadas:
- Todas as URLs são gerenciadas automaticamente
- Configurações de banco de dados centralizadas
- Configurações de pagamento por ambiente
- Logs configurados por ambiente

📚 Documentação: docs/MIGRATION.md
`);
  }
}

// Executar script
main();
