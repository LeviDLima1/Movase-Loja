const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

// Simular dados de teste
const testUser = {
  email: 'teste@teste.com',
  senha: '123456'
};

const testBook = {
  id: 1,
  titulo: 'Livro Teste',
  autor: 'Autor Teste',
  price: 29.90,
  img1: 'http://localhost:3001/public/images/livros/livro1.svg'
};

async function testCartPersistence() {
  console.log('🔄 Testando persistência do carrinho...\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      throw new Error(`Erro no login: ${loginData.message}`);
    }

    const token = loginData.data.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Verificar carrinho inicial
    console.log('\n2️⃣ Verificando carrinho inicial...');
    const initialCartResponse = await fetch(`${BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const initialCartData = await initialCartResponse.json();
    console.log('📦 Carrinho inicial:', {
      success: initialCartData.success,
      itemCount: initialCartData.data?.data?.cart?.items?.length || 0
    });

    // 3. Adicionar item ao carrinho
    console.log('\n3️⃣ Adicionando item ao carrinho...');
    const addItemResponse = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookId: testBook.id,
        quantity: 2
      })
    });

    const addItemData = await addItemResponse.json();
    
    if (!addItemData.success) {
      throw new Error(`Erro ao adicionar item: ${addItemData.message}`);
    }

    console.log('✅ Item adicionado com sucesso');
    console.log('📦 Itens no carrinho:', addItemData.data.data.cart.items.length);

    // 4. Verificar carrinho após adição
    console.log('\n4️⃣ Verificando carrinho após adição...');
    const updatedCartResponse = await fetch(`${BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const updatedCartData = await updatedCartResponse.json();
    console.log('📦 Carrinho atualizado:', {
      success: updatedCartData.success,
      itemCount: updatedCartData.data?.data?.cart?.items?.length || 0,
      items: updatedCartData.data?.data?.cart?.items?.map(item => ({
        bookId: item.bookId,
        titulo: item.titulo,
        quantity: item.quantity
      }))
    });

    // 5. Simular "refresh da página" - fazer nova requisição
    console.log('\n5️⃣ Simulando refresh da página...');
    const refreshCartResponse = await fetch(`${BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const refreshCartData = await refreshCartResponse.json();
    console.log('📦 Carrinho após "refresh":', {
      success: refreshCartData.success,
      itemCount: refreshCartData.data?.data?.cart?.items?.length || 0,
      items: refreshCartData.data?.data?.cart?.items?.map(item => ({
        bookId: item.bookId,
        titulo: item.titulo,
        quantity: item.quantity
      }))
    });

    // 6. Verificar se os dados persistiram
    const initialCount = initialCartData.data?.data?.cart?.items?.length || 0;
    const finalCount = refreshCartData.data?.data?.cart?.items?.length || 0;
    
    console.log('\n📊 RESULTADO:');
    console.log(`Itens iniciais: ${initialCount}`);
    console.log(`Itens finais: ${finalCount}`);
    
    if (finalCount > initialCount) {
      console.log('✅ SUCCESS: Carrinho persistiu corretamente!');
    } else {
      console.log('❌ FAIL: Carrinho não persistiu!');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testCartPersistence();
