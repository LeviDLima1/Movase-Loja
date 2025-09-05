# 🚀 Guia de Migração - Movase

## 📋 Visão Geral

Este guia explica como migrar o sistema Movase entre diferentes ambientes (desenvolvimento, staging, produção) de forma fácil e segura.

## 🔧 Estrutura Otimizada para Migração

### ✅ **Configurações Centralizadas**
- **`src/config/environment.ts`** - Todas as configurações em um local
- **`env.production.example`** - Exemplo para produção
- **`scripts/migrate-environment.js`** - Script automático de migração

### ✅ **URLs Dinâmicas**
- Todas as URLs são gerenciadas via variáveis de ambiente
- Mudança automática entre ambientes
- Sem URLs hardcoded no código

### ✅ **Configurações por Ambiente**
- Desenvolvimento: `localhost:3001`
- Staging: `api-staging.movase.com`
- Produção: `api.movase.com`

## 🚀 Como Migrar

### **1. Migração Automática (Recomendado)**

```bash
# Para desenvolvimento
node scripts/migrate-environment.js development

# Para staging
node scripts/migrate-environment.js staging

# Para produção
node scripts/migrate-environment.js production
```

### **2. Migração Manual**

#### **Desenvolvimento:**
```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar configurações
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### **Produção:**
```bash
# Copiar arquivo de produção
cp env.production.example .env.local

# Editar configurações
NEXT_PUBLIC_API_URL=https://api.movase.com
NEXT_PUBLIC_SITE_URL=https://movase.com
```

## 📁 Estrutura de Arquivos

```
loja/
├── src/
│   ├── config/
│   │   ├── environment.ts      # 🔧 Configurações centralizadas
│   │   └── index.ts           # 📋 Configurações principais
│   └── services/
│       └── api.ts             # 🔗 Serviço de API centralizado
├── scripts/
│   └── migrate-environment.js # 🚀 Script de migração
├── env.example                # 📝 Exemplo para desenvolvimento
├── env.production.example     # 📝 Exemplo para produção
└── docs/
    └── MIGRATION.md           # 📚 Este guia
```

## 🔧 Configurações por Ambiente

### **Desenvolvimento**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=info
PAGSEGURO_SANDBOX=true
```

### **Staging**
```env
NEXT_PUBLIC_API_URL=https://api-staging.movase.com
NEXT_PUBLIC_SITE_URL=https://staging.movase.com
NODE_ENV=production
LOG_LEVEL=warn
PAGSEGURO_SANDBOX=true
```

### **Produção**
```env
NEXT_PUBLIC_API_URL=https://api.movase.com
NEXT_PUBLIC_SITE_URL=https://movase.com
NODE_ENV=production
LOG_LEVEL=warn
PAGSEGURO_SANDBOX=false
```

## 🗄️ Configurações de Banco de Dados

### **Desenvolvimento**
```env
BACKEND_DATABASE_URL=postgresql://user:password@localhost:5432/movase_db
```

### **Produção**
```env
BACKEND_DATABASE_URL=postgresql://user:password@db.movase.com:5432/movase_db
```

## 💳 Configurações de Pagamento

### **Desenvolvimento/Staging**
```env
PAGSEGURO_SANDBOX=true
PIX_KEY=your-test-pix-key
```

### **Produção**
```env
PAGSEGURO_SANDBOX=false
PIX_KEY=your-production-pix-key
```

## 📧 Configurações de Email

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@movase.com
```

## 🔐 Configurações de Segurança

### **Desenvolvimento**
```env
JWT_SECRET=your-dev-secret
CORS_ORIGIN=http://localhost:3000
```

### **Produção**
```env
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://movase.com
```

## 📊 Configurações de Analytics

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-pixel-id
```

## 🚀 Processo de Deploy

### **1. Preparação**
```bash
# Migrar para produção
node scripts/migrate-environment.js production

# Verificar configurações
node scripts/migrate-environment.js production --show
```

### **2. Build**
```bash
npm run build
```

### **3. Deploy**
```bash
# Para Vercel
vercel --prod

# Para outros provedores
npm run start
```

## 🔍 Verificações Pós-Migração

### **1. URLs**
- [ ] Frontend acessível
- [ ] API respondendo
- [ ] Banco de dados conectado

### **2. Funcionalidades**
- [ ] Autenticação funcionando
- [ ] Pagamentos funcionando
- [ ] Emails sendo enviados

### **3. Performance**
- [ ] Cache funcionando
- [ ] Logs sendo gerados
- [ ] Analytics funcionando

## 🛠️ Troubleshooting

### **Problema: URLs não mudaram**
**Solução:** Verificar se o arquivo `.env.local` foi criado corretamente

### **Problema: Banco não conecta**
**Solução:** Verificar `BACKEND_DATABASE_URL` e credenciais

### **Problema: Pagamentos não funcionam**
**Solução:** Verificar `PAGSEGURO_SANDBOX` e chaves de API

### **Problema: Emails não enviam**
**Solução:** Verificar configurações SMTP e credenciais

## 📞 Suporte

Para dúvidas sobre migração:
- 📧 Email: suporte@movase.com
- 📚 Documentação: docs/
- 🐛 Issues: GitHub Issues

## 🎯 Próximos Passos

1. **Configurar CI/CD** para deploy automático
2. **Implementar monitoramento** de produção
3. **Configurar backups** automáticos
4. **Implementar rollback** automático

---

**✅ Sistema otimizado para migração fácil e segura!**
