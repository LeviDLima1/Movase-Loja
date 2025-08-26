// Teste para identificar o problema real de persistência de login
console.log('🔍 Investigando problema real de persistência...\n');

// Simular o problema real
const mockLocalStorage = {
  data: {},
  getItem(key) {
    console.log(`   📥 localStorage.getItem('${key}') = ${this.data[key] || 'null'}`);
    return this.data[key] || null;
  },
  setItem(key, value) {
    console.log(`   📤 localStorage.setItem('${key}', '${value}')`);
    this.data[key] = value;
  },
  removeItem(key) {
    console.log(`   🗑️ localStorage.removeItem('${key}')`);
    delete this.data[key];
  }
};

// Simular o AuthContext
class MockAuthContext {
  constructor() {
    this.user = null;
    this.isLoading = true;
  }

  async checkAuth() {
    console.log('\n🔍 MockAuthContext.checkAuth()');
    
    // Verificar se estamos no browser
    if (typeof window === 'undefined') {
      console.log('   ❌ Não está no browser');
      this.user = null;
      return;
    }
    
    // Primeiro, verificar se há dados no localStorage
    const userData = this.getCurrentUser();
    const token = mockLocalStorage.getItem('auth_token');
    
    console.log('   📊 Dados encontrados:', {
      hasUserData: !!userData,
      hasToken: !!token,
      userData: userData ? `${userData.nome} (${userData.email})` : 'null'
    });
    
    if (userData && token) {
      // Se há dados locais, definir usuário temporariamente
      this.user = userData;
      console.log('   ✅ Usuário definido temporariamente:', userData.nome);
      
      // Tentar verificar com o backend (simulado)
      try {
        const response = await this.mockBackendCheck();
        
        if (response.success && response.data) {
          // Backend confirmou autenticação
          this.user = response.data;
          console.log('   ✅ Backend confirmou autenticação:', response.data.nome);
        } else {
          // Backend rejeitou, limpar dados
          console.log('   ❌ Backend rejeitou autenticação, limpando dados');
          this.user = null;
          mockLocalStorage.removeItem('user_data');
          mockLocalStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.log('   ⚠️ Erro ao verificar com backend, mantendo dados locais');
      }
    } else {
      // Não há dados locais
      console.log('   ❌ Nenhuma autenticação válida encontrada');
      this.user = null;
    }
    
    this.isLoading = false;
  }

  getCurrentUser() {
    const userData = mockLocalStorage.getItem('user_data');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.log('   ❌ Erro ao parsear dados do usuário:', error.message);
        mockLocalStorage.removeItem('user_data');
        return null;
      }
    }
    return null;
  }

  async mockBackendCheck() {
    // Simular verificação com backend
    const token = mockLocalStorage.getItem('auth_token');
    if (token && token.includes('valid')) {
      return {
        success: true,
        data: {
          id: '1',
          nome: 'Teste Usuário',
          email: 'teste@example.com',
          role: 'user'
        }
      };
    } else {
      return {
        success: false,
        error: 'Token inválido'
      };
    }
  }

  get isAuthenticated() {
    return !!this.user;
  }
}

// Teste do problema real
async function testRealIssue() {
  console.log('📝 Teste do problema real de persistência');
  
  const authContext = new MockAuthContext();
  
  // Simular login bem-sucedido
  console.log('\n1️⃣ Simulando login...');
  const mockUser = {
    id: '1',
    nome: 'Teste Usuário',
    email: 'teste@example.com',
    role: 'user'
  };
  
  mockLocalStorage.setItem('auth_token', 'valid-jwt-token-123');
  mockLocalStorage.setItem('user_data', JSON.stringify(mockUser));
  
  console.log('   ✅ Login simulado com sucesso');
  
  // Verificar autenticação
  console.log('\n2️⃣ Verificando autenticação...');
  await authContext.checkAuth();
  
  console.log('   📊 Estado final:', {
    isAuthenticated: authContext.isAuthenticated,
    user: authContext.user ? authContext.user.nome : 'null',
    isLoading: authContext.isLoading
  });
  
  // Simular refresh da página
  console.log('\n3️⃣ Simulando refresh da página...');
  const newAuthContext = new MockAuthContext();
  await newAuthContext.checkAuth();
  
  console.log('   📊 Estado após refresh:', {
    isAuthenticated: newAuthContext.isAuthenticated,
    user: newAuthContext.user ? newAuthContext.user.nome : 'null',
    isLoading: newAuthContext.isLoading
  });
  
  // Verificar se o problema está na lógica
  console.log('\n4️⃣ Análise do problema:');
  const token = mockLocalStorage.getItem('auth_token');
  const userData = mockLocalStorage.getItem('user_data');
  
  console.log('   🔍 Dados no localStorage:', {
    token: token ? 'EXISTE' : 'NÃO EXISTE',
    userData: userData ? 'EXISTE' : 'NÃO EXISTE'
  });
  
  if (token && userData) {
    console.log('   ✅ Dados estão no localStorage');
    console.log('   ❓ Problema pode estar na lógica de verificação');
  } else {
    console.log('   ❌ Dados não estão no localStorage');
    console.log('   ❓ Problema pode estar na persistência');
  }
}

// Executar teste
testRealIssue().then(() => {
  console.log('\n✅ Teste concluído!');
}).catch(error => {
  console.error('❌ Erro no teste:', error);
});
