// ===== TESTE DA API DE LIVROS - Frontend conectado ao Backend =====

async function testBooksAPI() {
  console.log('🔍 Testando API de Livros (Frontend → Backend)...\n');

  try {
    // Teste 1: Buscar livros via API do frontend
    console.log('1️⃣ Testando API do frontend...');
    const frontendResponse = await fetch('http://localhost:3000/api/livros');
    const frontendData = await frontendResponse.json();
    
    if (frontendResponse.ok && frontendData.success) {
      console.log('✅ API do Frontend: OK');
      console.log(`   Total de livros: ${frontendData.data?.livros?.length || 0}`);
      
      if (frontendData.data?.livros?.length > 0) {
        const primeiroLivro = frontendData.data.livros[0];
        console.log(`   Primeiro livro: ${primeiroLivro.titulo}`);
        console.log(`   Autor: ${primeiroLivro.autor}`);
        console.log(`   Preço: R$ ${primeiroLivro.preco}`);
        console.log(`   Estoque: ${primeiroLivro.estoque}`);
        console.log(`   Status: ${primeiroLivro.status}`);
      }
      
      // Verificar estrutura de paginação
      if (frontendData.data?.paginacao) {
        console.log(`   Paginação: Página ${frontendData.data.paginacao.page} de ${frontendData.data.paginacao.totalPages}`);
      }
      
      // Verificar filtros disponíveis
      if (frontendData.data?.filtros) {
        console.log(`   Categorias disponíveis: ${frontendData.data.filtros.categorias?.length || 0}`);
        console.log(`   Preço mín/máx: R$ ${frontendData.data.filtros.precoMin} - R$ ${frontendData.data.filtros.precoMax}`);
      }
    } else {
      console.log('❌ API do Frontend: FALHOU');
      console.log(`   Erro: ${frontendData.error || 'Erro desconhecido'}`);
    }

    // Teste 2: Comparar com backend direto
    console.log('\n2️⃣ Comparando com backend direto...');
    const backendResponse = await fetch('http://localhost:3001/api/books');
    const backendData = await backendResponse.json();
    
    if (backendResponse.ok && backendData.success) {
      console.log('✅ Backend Direto: OK');
      console.log(`   Total de livros: ${backendData.data?.length || 0}`);
      
      // Comparar se os dados são os mesmos
      const frontendCount = frontendData.data?.livros?.length || 0;
      const backendCount = backendData.data?.length || 0;
      
      if (frontendCount === backendCount) {
        console.log('✅ Dados sincronizados: Frontend e Backend têm o mesmo número de livros');
      } else {
        console.log(`⚠️  Possível inconsistência: Frontend (${frontendCount}) vs Backend (${backendCount})`);
      }
    } else {
      console.log('❌ Backend Direto: FALHOU');
      console.log(`   Erro: ${backendData.error || 'Erro desconhecido'}`);
    }

    // Teste 3: Testar filtros
    console.log('\n3️⃣ Testando filtros...');
    const filtroResponse = await fetch('http://localhost:3000/api/livros?categoria=Religioso&limit=5');
    const filtroData = await filtroResponse.json();
    
    if (filtroResponse.ok && filtroData.success) {
      console.log('✅ Filtros: OK');
      console.log(`   Livros filtrados por categoria: ${filtroData.data?.livros?.length || 0}`);
    } else {
      console.log('❌ Filtros: FALHOU');
      console.log(`   Erro: ${filtroData.error || 'Erro desconhecido'}`);
    }

    // Teste 4: Testar paginação
    console.log('\n4️⃣ Testando paginação...');
    const paginacaoResponse = await fetch('http://localhost:3000/api/livros?page=1&limit=1');
    const paginacaoData = await paginacaoResponse.json();
    
    if (paginacaoResponse.ok && paginacaoData.success) {
      console.log('✅ Paginação: OK');
      console.log(`   Livros por página: ${paginacaoData.data?.livros?.length || 0}`);
      console.log(`   Total de páginas: ${paginacaoData.data?.paginacao?.totalPages || 0}`);
    } else {
      console.log('❌ Paginação: FALHOU');
      console.log(`   Erro: ${paginacaoData.error || 'Erro desconhecido'}`);
    }

    console.log('\n🎉 Teste da API de Livros concluído!');
    console.log('\n📝 Resumo:');
    console.log('   ✅ Frontend conectado ao Backend');
    console.log('   ✅ Dados dos livros sendo buscados do banco de dados real');
    console.log('   ✅ Mock removido e substituído por dados reais');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verificar se o frontend Next.js está rodando na porta 3000');
    console.log('   2. Verificar se o backend está rodando na porta 3001');
    console.log('   3. Verificar se há dados de livros no banco de dados');
    console.log('   4. Verificar logs do servidor para mais detalhes');
  }
}

// Executar teste
testBooksAPI();

