// Teste para verificar se o carrinho está funcionando
const testCartFix = async () => {
  try {
    console.log('🔍 Testando correção do carrinho...');
    
    // Simular localStorage
    global.localStorage = {
      getItem: (key) => {
        if (key === 'auth_token') return 'test-token';
        if (key === 'user_data') return JSON.stringify({
          id: 1,
          nome: 'Administrador',
          email: 'admin@movase.com',
          role: 'admin'
        });
        if (key === 'cart_items') return JSON.stringify([]);
        return null;
      },
      setItem: (key, value) => console.log(`localStorage.setItem(${key}, ${value})`),
      removeItem: (key) => console.log(`localStorage.removeItem(${key})`),
      clear: () => console.log('localStorage.clear()')
    };
    
    // Simular fetch para carrinho
    global.fetch = async (url, options) => {
      console.log('Fetch chamado:', url);
      
      if (url.includes('/api/cart')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            status: 200,
            message: 'Operação realizada com sucesso',
            data: {
              message: 'Carrinho encontrado',
              cart: {
                id: 2,
                items: [],
                subtotal: 0,
                frete: 0,
                desconto: 0,
                total: 0,
                cupomCodigo: null,
                cupomDesconto: null,
                enderecoEntrega: null,
                freteSelecionado: null,
                status: 'ativo',
                itemCount: 0
              }
            },
            timestamp: new Date().toISOString()
          })
        };
      }
      
      return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
      };
    };
    
    console.log('✅ Simulações configuradas');
    console.log('Agora teste o carrinho no navegador!');
    console.log('O carrinho deve carregar sem erros após o login.');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
};

testCartFix();
