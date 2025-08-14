// Configurações de autenticação
export const authConfig = {
  // Desabilitar proteção de rotas durante desenvolvimento
  disableRouteProtection: true,
  
  // Rotas protegidas
  protectedRoutes: ['/admin'],
  
  // Configurações de token
  tokenConfig: {
    // Nome do cookie para token (se usar cookies)
    cookieName: 'auth_token',
    
    // Nome da chave no localStorage (se usar localStorage)
    localStorageKey: 'auth_token',
    
    // Prefixo para token no header Authorization
    headerPrefix: 'Bearer '
  },
  
  // URLs de redirecionamento
  redirects: {
    login: '/login',
    admin: '/admin',
    home: '/'
  }
};

// Função para verificar se a proteção está habilitada
export const isRouteProtectionEnabled = () => {
  return !authConfig.disableRouteProtection;
};

// Função para verificar se uma rota é protegida
export const isProtectedRoute = (pathname: string) => {
  return authConfig.protectedRoutes.some(route => pathname.startsWith(route));
};
