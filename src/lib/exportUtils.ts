// Utilitários para exportação de dados

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

// Função para converter dados para CSV
export function exportToCSV(data: any[], options: ExportOptions = { format: 'csv' }) {
  if (data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  const { includeHeaders = true, filename = 'export' } = options;
  
  // Obter cabeçalhos das colunas
  const headers = Object.keys(data[0]);
  
  // Criar linhas CSV
  let csvContent = '';
  
  // Adicionar cabeçalhos
  if (includeHeaders) {
    csvContent += headers.map(header => `"${header}"`).join(',') + '\n';
  }
  
  // Adicionar dados
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escapar aspas e converter para string
      const escapedValue = String(value).replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvContent += values.join(',') + '\n';
  });
  
  // Criar e baixar arquivo
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

// Função para exportar dados como JSON
export function exportToJSON(data: any[], options: ExportOptions = { format: 'json' }) {
  const { filename = 'export' } = options;
  
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

// Função para exportar dados como PDF (simplificada)
export function exportToPDF(data: any[], options: ExportOptions = { format: 'pdf' }) {
  const { filename = 'export' } = options;
  
  // Esta é uma implementação básica. Em produção, você usaria uma biblioteca como jsPDF
  const pdfContent = generatePDFContent(data);
  downloadFile(pdfContent, `${filename}.pdf`, 'application/pdf');
}

// Função auxiliar para baixar arquivo
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL
  URL.revokeObjectURL(url);
}

// Função para gerar conteúdo PDF básico (simplificada)
function generatePDFContent(data: any[]): string {
  // Esta é uma implementação muito básica
  // Em produção, você usaria jsPDF ou similar
  let content = '%PDF-1.4\n';
  content += '1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n';
  content += '2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n';
  
  // Adicionar dados como texto simples
  const textContent = data.map(row => 
    Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
  ).join('\n');
  
  content += `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n`;
  content += `4 0 obj\n<<\n/Length ${textContent.length}\n>>\nstream\n${textContent}\nendstream\nendobj\n`;
  content += 'xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n284\n%%EOF\n';
  
  return content;
}

// Funções específicas para diferentes tipos de dados

// Exportar livros
export function exportLivros(livros: any[], options: ExportOptions) {
  const dataToExport = livros.map(livro => ({
    ID: livro.id,
    Título: livro.titulo,
    Autor: livro.autor,
    Preço: `R$ ${livro.preco.toFixed(2)}`,
    Estoque: livro.estoque,
    Categoria: livro.categoria,
    Status: livro.status,
    'Data de Criação': new Date(livro.dataCriacao).toLocaleDateString('pt-BR'),
    Vendas: livro.vendas || 0,
    ISBN: livro.isbn || '',
    Editora: livro.editora || '',
    'Ano de Publicação': livro.anoPublicacao || '',
    Idioma: livro.idioma || '',
    Formato: livro.formato || ''
  }));

  switch (options.format) {
    case 'csv':
      exportToCSV(dataToExport, { ...options, filename: 'livros' });
      break;
    case 'json':
      exportToJSON(dataToExport, { ...options, filename: 'livros' });
      break;
    case 'pdf':
      exportToPDF(dataToExport, { ...options, filename: 'livros' });
      break;
  }
}

// Exportar vendas/pedidos
export function exportVendas(vendas: any[], options: ExportOptions) {
  const dataToExport = vendas.map(venda => ({
    'Número do Pedido': venda.numero,
    'Nome do Cliente': venda.cliente.nome,
    'Email do Cliente': venda.cliente.email,
    'Telefone': venda.cliente.telefone,
    'Endereço': venda.cliente.endereco,
    'Total': `R$ ${venda.total.toFixed(2)}`,
    'Status': venda.status,
    'Data do Pedido': new Date(venda.dataPedido).toLocaleDateString('pt-BR'),
    'Forma de Pagamento': venda.formaPagamento,
    'Frete': `R$ ${venda.frete.toFixed(2)}`,
    'Produtos': venda.produtos.map((p: any) => `${p.titulo} (${p.quantidade}x)`).join(', ')
  }));

  switch (options.format) {
    case 'csv':
      exportToCSV(dataToExport, { ...options, filename: 'vendas' });
      break;
    case 'json':
      exportToJSON(dataToExport, { ...options, filename: 'vendas' });
      break;
    case 'pdf':
      exportToPDF(dataToExport, { ...options, filename: 'vendas' });
      break;
  }
}

// Exportar relatório de estoque
export function exportRelatorioEstoque(livros: any[], options: ExportOptions) {
  const dataToExport = livros.map(livro => ({
    'ID do Produto': livro.id,
    'Título': livro.titulo,
    'Autor': livro.autor,
    'Estoque Atual': livro.estoque,
    'Status do Estoque': livro.estoque === 0 ? 'Sem estoque' : 
                        livro.estoque <= 5 ? 'Estoque baixo' : 'Em estoque',
    'Vendas Totais': livro.vendas || 0,
    'Preço': `R$ ${livro.preco.toFixed(2)}`,
    'Valor Total em Estoque': `R$ ${(livro.preco * livro.estoque).toFixed(2)}`,
    'Categoria': livro.categoria,
    'Última Atualização': new Date().toLocaleDateString('pt-BR')
  }));

  switch (options.format) {
    case 'csv':
      exportToCSV(dataToExport, { ...options, filename: 'relatorio-estoque' });
      break;
    case 'json':
      exportToJSON(dataToExport, { ...options, filename: 'relatorio-estoque' });
      break;
    case 'pdf':
      exportToPDF(dataToExport, { ...options, filename: 'relatorio-estoque' });
      break;
  }
}

// Exportar relatório de vendas
export function exportRelatorioVendas(vendas: any[], options: ExportOptions) {
  // Calcular estatísticas
  const totalVendas = vendas.reduce((sum, venda) => sum + venda.total, 0);
  const totalPedidos = vendas.length;
  const vendasPorStatus = vendas.reduce((acc, venda) => {
    acc[venda.status] = (acc[venda.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataToExport = [
    // Resumo
    {
      'Métrica': 'Total de Vendas',
      'Valor': `R$ ${totalVendas.toFixed(2)}`
    },
    {
      'Métrica': 'Total de Pedidos',
      'Valor': totalPedidos
    },
    {
      'Métrica': 'Ticket Médio',
      'Valor': totalPedidos > 0 ? `R$ ${(totalVendas / totalPedidos).toFixed(2)}` : 'R$ 0,00'
    },
    // Status dos pedidos
    ...Object.entries(vendasPorStatus).map(([status, count]) => ({
      'Métrica': `Pedidos ${status}`,
      'Valor': count
    })),
    // Dados detalhados
    ...vendas.map(venda => ({
      'Número do Pedido': venda.numero,
      'Cliente': venda.cliente.nome,
      'Total': `R$ ${venda.total.toFixed(2)}`,
      'Status': venda.status,
      'Data': new Date(venda.dataPedido).toLocaleDateString('pt-BR'),
      'Forma de Pagamento': venda.formaPagamento
    }))
  ];

  switch (options.format) {
    case 'csv':
      exportToCSV(dataToExport, { ...options, filename: 'relatorio-vendas' });
      break;
    case 'json':
      exportToJSON(dataToExport, { ...options, filename: 'relatorio-vendas' });
      break;
    case 'pdf':
      exportToPDF(dataToExport, { ...options, filename: 'relatorio-vendas' });
      break;
  }
}

// Exportar clientes
export function exportClientes(clientes: any[], options: ExportOptions) {
  const dataToExport = clientes.map(cliente => ({
    'ID': cliente.id,
    'Nome': cliente.nome,
    'Email': cliente.email,
    'CPF': cliente.cpf,
    'Telefone': cliente.telefone,
    'Endereço': `${cliente.endereco?.logradouro || ''}, ${cliente.endereco?.numero || ''}${cliente.endereco?.complemento ? `, ${cliente.endereco.complemento}` : ''}`,
    'Bairro': cliente.endereco?.bairro || '',
    'Cidade': cliente.endereco?.cidade || '',
    'UF': cliente.endereco?.uf || '',
    'CEP': cliente.endereco?.cep || '',
    'Data de Cadastro': new Date(cliente.dataCadastro).toLocaleDateString('pt-BR'),
    'Status': cliente.status === 'ativo' ? 'Ativo' : 'Inativo',
    'Total de Compras': cliente.totalCompras || 0,
    'Valor Total': `R$ ${(cliente.valorTotal || 0).toFixed(2)}`,
    'Última Compra': cliente.ultimaCompra ? new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR') : 'Nunca comprou',
    'Observações': cliente.observacoes || ''
  }));

  switch (options.format) {
    case 'csv':
      exportToCSV(dataToExport, { ...options, filename: 'clientes' });
      break;
    case 'json':
      exportToJSON(dataToExport, { ...options, filename: 'clientes' });
      break;
    case 'pdf':
      exportToPDF(dataToExport, { ...options, filename: 'clientes' });
      break;
  }
}

// Função para exportar dados filtrados
export function exportDadosFiltrados(
  dados: any[], 
  filtros: Record<string, any>, 
  tipo: 'livros' | 'vendas' | 'estoque' | 'relatorio-vendas' | 'clientes',
  options: ExportOptions
) {
  // Aplicar filtros aos dados
  let dadosFiltrados = [...dados];
  
  // Filtros específicos por tipo
  switch (tipo) {
    case 'livros':
      if (filtros.searchTerm) {
        dadosFiltrados = dadosFiltrados.filter(item =>
          item.titulo?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          item.autor?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          item.isbn?.includes(filtros.searchTerm)
        );
      }
      if (filtros.statusFilter && filtros.statusFilter !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(item => item.status === filtros.statusFilter);
      }
      if (filtros.categoriaFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.categoria === filtros.categoriaFilter);
      }
      if (filtros.precoMinFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.preco >= parseFloat(filtros.precoMinFilter));
      }
      if (filtros.precoMaxFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.preco <= parseFloat(filtros.precoMaxFilter));
      }
      break;

    case 'vendas':
      if (filtros.searchTerm) {
        dadosFiltrados = dadosFiltrados.filter(item =>
          item.numero?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          item.cliente?.nome?.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      }
      if (filtros.statusFilter && filtros.statusFilter !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(item => item.status === filtros.statusFilter);
      }
      if (filtros.dateFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => {
          const itemDate = new Date(item.dataPedido);
          const filterDate = new Date(filtros.dateFilter);
          return itemDate.toDateString() === filterDate.toDateString();
        });
      }
      break;

    case 'clientes':
      if (filtros.searchTerm) {
        dadosFiltrados = dadosFiltrados.filter(item =>
          item.nome?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          item.email?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          item.cpf?.includes(filtros.searchTerm) ||
          item.telefone?.includes(filtros.searchTerm)
        );
      }
      if (filtros.statusFilter && filtros.statusFilter !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(item => item.status === filtros.statusFilter);
      }
      if (filtros.dataInicioFilter && filtros.dataFimFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => {
          const itemDate = new Date(item.dataCadastro);
          const inicioDate = new Date(filtros.dataInicioFilter);
          const fimDate = new Date(filtros.dataFimFilter);
          return itemDate >= inicioDate && itemDate <= fimDate;
        });
      }
      if (filtros.valorMinFilter && filtros.valorMaxFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => 
          item.valorTotal >= parseFloat(filtros.valorMinFilter) &&
          item.valorTotal <= parseFloat(filtros.valorMaxFilter)
        );
      }
      break;

    case 'estoque':
      if (filtros.searchTerm) {
        dadosFiltrados = dadosFiltrados.filter(item =>
          item.titulo?.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      }
      break;

    case 'relatorio-vendas':
      if (filtros.searchTerm) {
        dadosFiltrados = dadosFiltrados.filter(item =>
          item.numero?.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      }
      break;
  }

  // Exportar baseado no tipo
  switch (tipo) {
    case 'livros':
      exportLivros(dadosFiltrados, options);
      break;
    case 'vendas':
      exportVendas(dadosFiltrados, options);
      break;
    case 'clientes':
      exportClientes(dadosFiltrados, options);
      break;
    case 'estoque':
      exportRelatorioEstoque(dadosFiltrados, options);
      break;
    case 'relatorio-vendas':
      exportRelatorioVendas(dadosFiltrados, options);
      break;
  }
}

// Exportar relatórios avançados
export function exportRelatorioAvancado(data: any, options: ExportOptions) {
  const relatorioData = {
    metricas: data.metricas,
    vendasMensais: data.vendasMensais,
    vendasPorCategoria: data.vendasPorCategoria,
    clientesPorRegiao: data.clientesPorRegiao,
    produtosMaisVendidos: data.produtosMaisVendidos
  };

  switch (options.format) {
    case 'csv':
      // Exportar cada seção como CSV separado
      exportToCSV(data.vendasMensais, { ...options, filename: 'vendas-mensais' });
      exportToCSV(data.vendasPorCategoria, { ...options, filename: 'vendas-por-categoria' });
      exportToCSV(data.clientesPorRegiao, { ...options, filename: 'clientes-por-regiao' });
      exportToCSV(data.produtosMaisVendidos, { ...options, filename: 'produtos-mais-vendidos' });
      break;
    case 'json':
      exportToJSON(relatorioData, { ...options, filename: 'relatorio-completo' });
      break;
    case 'pdf':
      exportToPDF(relatorioData, { ...options, filename: 'relatorio-completo' });
      break;
  }
}
