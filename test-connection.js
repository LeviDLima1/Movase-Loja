// ===== TESTE DE CONEXÃO FRONTEND-BACKEND =====

const API_BASE = 'http://localhost:3001/api';

async function testConnection() {
  console.log('🔍 Testando conexão frontend-backend...\n');

  try {
    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Health Check: OK');
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Message: ${healthData.message}`);
    } else {
      console.log('❌ Health Check: FALHOU');
    }

    // Teste 2: API Books (sem autenticação)
    console.log('\n2️⃣ Testando API de Livros...');
    const booksResponse = await fetch(`${API_BASE}/books`);
    const booksData = await booksResponse.json();
    
    if (booksResponse.ok) {
      console.log('✅ API Books: OK');
      console.log(`   Total de livros: ${booksData.data?.length || 0}`);
      if (booksData.data && booksData.data.length > 0) {
        console.log(`   Primeiro livro: ${booksData.data[0].titulo}`);
      }
    } else {
      console.log('❌ API Books: FALHOU');
      console.log(`   Erro: ${booksData.error || booksData.message}`);
    }

    // Teste 3: Login (com usuário admin)
    console.log('\n3️⃣ Testando Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@movase.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok && loginData.success) {
      console.log('✅ Login: OK');
      console.log(`   Token: ${loginData.data?.token ? 'Recebido' : 'Não recebido'}`);
      console.log(`   Usuário: ${loginData.data?.user?.nome || 'N/A'}`);
      
      // Teste 4: API com autenticação
      if (loginData.data?.token) {
        console.log('\n4️⃣ Testando API autenticada...');
        const authResponse = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${loginData.data.token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const authData = await authResponse.json();
        
        if (authResponse.ok && authData.success) {
          console.log('✅ API Autenticada: OK');
          console.log(`   Usuário logado: ${authData.data?.nome || 'N/A'}`);
          console.log(`   Email: ${authData.data?.email || 'N/A'}`);
        } else {
          console.log('❌ API Autenticada: FALHOU');
          console.log(`   Erro: ${authData.error || authData.message}`);
        }
      }
    } else {
      console.log('❌ Login: FALHOU');
      console.log(`   Erro: ${loginData.error || loginData.message}`);
    }

    // Teste 5: Verificar CORS
    console.log('\n5️⃣ Testando CORS...');
    const corsResponse = await fetch(`${API_BASE}/books`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    if (corsResponse.ok) {
      console.log('✅ CORS: OK');
      console.log(`   Access-Control-Allow-Origin: ${corsResponse.headers.get('Access-Control-Allow-Origin')}`);
    } else {
      console.log('❌ CORS: FALHOU');
    }

    console.log('\n🎉 Teste de conexão concluído!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verificar se o backend está rodando na porta 3001');
    console.log('   2. Verificar se o PostgreSQL está rodando');
    console.log('   3. Verificar configurações de CORS');
    console.log('   4. Verificar se as rotas estão configuradas corretamente');
  }
}

// Executar teste
testConnection();
