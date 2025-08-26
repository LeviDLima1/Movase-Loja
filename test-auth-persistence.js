// Teste de persistência de autenticação no frontend
console.log('🧪 Testando persistência de autenticação...\n');

// Simular localStorage
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock do window
global.window = {
  localStorage: mockLocalStorage
};

// Mock do AuthService
class MockAuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  async login(data) {
    // Simular login bem-sucedido
    const mockUser = {
      id: '1',
      nome: 'Teste Usuário',
      email: data.email,
      role: 'user'
    };

    const mockToken = 'mock-jwt-token-123';

    // Salvar no localStorage
    mockLocalStorage.setItem('auth_token', mockToken);
    mockLocalStorage.setItem('user_data', JSON.stringify(mockUser));

    this.token = mockToken;
    this.user = mockUser;

    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
        message: 'Login realizado com sucesso!'
      }
    };
  }

  async checkAuth() {
    const token = mockLocalStorage.getItem('auth_token');
    const userData = mockLocalStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        return {
          success: true,
          data: user
        };
      } catch (error) {
        return {
          success: false,
          error: 'Dados corrompidos'
        };
      }
    }

    return {
      success: false,
      error: 'Não autenticado'
    };
  }

  getCurrentUser() {
    const userData = mockLocalStorage.getItem('user_data');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        return JSON.parse(userData);
      } catch (error) {
        mockLocalStorage.removeItem('user_data');
        return null;
      }
    }
    return null;
  }

  async logout() {
    mockLocalStorage.removeItem('auth_token');
    mockLocalStorage.removeItem('user_data');
    this.token = null;
    this.user = null;
    return { success: true, message: 'Logout realizado com sucesso' };
  }
}

// Teste 1: Login e verificação
async function testLoginAndCheck() {
  console.log('📝 Teste 1: Login e verificação');
  
  const authService = new MockAuthService();
  
  // Fazer login
  const loginResult = await authService.login({
    email: 'teste@example.com',
    senha: '123456'
  });
  
  console.log('   Login resultado:', loginResult.success ? '✅ Sucesso' : '❌ Falha');
  
  // Verificar dados salvos
  const savedToken = mockLocalStorage.getItem('auth_token');
  const savedUser = mockLocalStorage.getItem('user_data');
  
  console.log('   Token salvo:', savedToken ? '✅ Sim' : '❌ Não');
  console.log('   Usuário salvo:', savedUser ? '✅ Sim' : '❌ Não');
  
  // Verificar autenticação
  const checkResult = await authService.checkAuth();
  console.log('   Verificação auth:', checkResult.success ? '✅ Sucesso' : '❌ Falha');
  
  // Obter usuário atual
  const currentUser = authService.getCurrentUser();
  console.log('   Usuário atual:', currentUser ? `✅ ${currentUser.nome}` : '❌ Nulo');
  
  console.log('');
}

// Teste 2: Persistência após refresh
async function testPersistenceAfterRefresh() {
  console.log('📝 Teste 2: Persistência após refresh');
  
  const authService = new MockAuthService();
  
  // Fazer login
  await authService.login({
    email: 'teste@example.com',
    senha: '123456'
  });
  
  // Simular refresh (nova instância do serviço)
  const newAuthService = new MockAuthService();
  
  // Verificar se ainda está autenticado
  const checkResult = await newAuthService.checkAuth();
  console.log('   Após refresh:', checkResult.success ? '✅ Ainda autenticado' : '❌ Perdeu autenticação');
  
  const currentUser = newAuthService.getCurrentUser();
  console.log('   Usuário após refresh:', currentUser ? `✅ ${currentUser.nome}` : '❌ Nulo');
  
  console.log('');
}

// Teste 3: Logout
async function testLogout() {
  console.log('📝 Teste 3: Logout');
  
  const authService = new MockAuthService();
  
  // Fazer login primeiro
  await authService.login({
    email: 'teste@example.com',
    senha: '123456'
  });
  
  // Fazer logout
  const logoutResult = await authService.logout();
  console.log('   Logout resultado:', logoutResult.success ? '✅ Sucesso' : '❌ Falha');
  
  // Verificar se dados foram removidos
  const savedToken = mockLocalStorage.getItem('auth_token');
  const savedUser = mockLocalStorage.getItem('user_data');
  
  console.log('   Token após logout:', savedToken ? '❌ Ainda existe' : '✅ Removido');
  console.log('   Usuário após logout:', savedUser ? '❌ Ainda existe' : '✅ Removido');
  
  // Verificar autenticação
  const checkResult = await authService.checkAuth();
  console.log('   Verificação após logout:', checkResult.success ? '❌ Ainda autenticado' : '✅ Não autenticado');
  
  console.log('');
}

// Teste 4: Dados corrompidos
async function testCorruptedData() {
  console.log('📝 Teste 4: Dados corrompidos');
  
  const authService = new MockAuthService();
  
  // Salvar dados corrompidos
  mockLocalStorage.setItem('user_data', 'invalid-json-data');
  mockLocalStorage.setItem('auth_token', 'valid-token');
  
  // Tentar obter usuário
  const currentUser = authService.getCurrentUser();
  console.log('   Usuário com dados corrompidos:', currentUser ? '❌ Retornou dados' : '✅ Retornou null');
  
  // Verificar se dados corrompidos foram removidos
  const savedUser = mockLocalStorage.getItem('user_data');
  console.log('   Dados corrompidos removidos:', savedUser ? '❌ Ainda existe' : '✅ Removido');
  
  console.log('');
}

// Executar todos os testes
async function runAllTests() {
  try {
    await testLoginAndCheck();
    await testPersistenceAfterRefresh();
    await testLogout();
    await testCorruptedData();
    
    console.log('✅ Todos os testes concluídos!');
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  }
}

runAllTests();
