:# Sistema de Autenticação

## Configuração

O sistema de autenticação pode ser controlado através do arquivo `src/config/auth.ts`.

### Configurações Principais

```typescript
export const authConfig = {
  // Desabilitar proteção de rotas durante desenvolvimento
  disableRouteProtection: true, // ← Mude para false para habilitar
  
  // Rotas protegidas
  protectedRoutes: ['/admin'],
  
  // URLs de redirecionamento
  redirects: {
    login: '/login',
    admin: '/admin',
    home: '/'
  }
};
```

## Como Controlar a Proteção de Rotas

### 1. Durante Desenvolvimento (Recomendado)
```typescript
// src/config/auth.ts
disableRouteProtection: true
```
- ✅ Acesso livre a todas as rotas
- ✅ Ideal para desenvolvimento
- ✅ Não precisa fazer login

### 2. Para Testar a Autenticação
```typescript
// src/config/auth.ts
disableRouteProtection: false
```
- 🔒 Rotas admin protegidas
- 🔒 Redirecionamento para login
- 🔒 Precisa fazer login

## Credenciais de Teste

### Administrador
- **Email:** admin@movase.com
- **Senha:** admin123
- **Acesso:** Todas as funcionalidades admin

### Usuário Comum
- **Email:** user@movase.com
- **Senha:** user123
- **Acesso:** Funcionalidades básicas

## Componentes de Proteção

### 1. Middleware (Proteção de Rota)
- Localização: `src/middleware.ts`
- Função: Bloqueia acesso antes da página carregar
- Configuração: `src/config/auth.ts`

### 2. ProtectedRoute (Proteção de Componente)
- Localização: `src/components/auth/ProtectedRoute.tsx`
- Função: Proteção dentro da página
- Uso opcional para proteção adicional

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}
```

## Fluxo de Autenticação

1. **Usuário acessa rota protegida**
2. **Middleware verifica token**
3. **Se não há token → Redireciona para login**
4. **Usuário faz login**
5. **Token salvo no localStorage**
6. **Redirecionamento para rota original**

## Estrutura de Dados

### User Interface
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}
```

### RegisterData Interface
```typescript
interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  aceiteNewsletter: boolean;
}
```

## Como Habilitar/Desabilitar Proteção

### Para Desenvolvimento (Acesso Livre)
```bash
# Edite src/config/auth.ts
disableRouteProtection: true
```

### Para Produção (Proteção Ativa)
```bash
# Edite src/config/auth.ts
disableRouteProtection: false
```

## Troubleshooting

### Problema: Não consigo acessar /admin
**Solução:** Verifique se `disableRouteProtection: true` em `src/config/auth.ts`

### Problema: Middleware não funciona
**Solução:** 
1. Verifique se o arquivo `src/middleware.ts` existe
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador

### Problema: Login não funciona
**Solução:**
1. Use as credenciais corretas
2. Verifique se o AuthProvider está no layout
3. Verifique o console do navegador para erros

## Próximos Passos

1. **Implementar backend real** (substituir mocks)
2. **Adicionar JWT tokens**
3. **Implementar refresh tokens**
4. **Adicionar logout automático**
5. **Implementar recuperação de senha**
