# PLANO DE MIGRAÇÃO - CONSOLIDAÇÃO DE PÁGINAS

## 📋 **OBJETIVO**
Consolidar Dashboard e Relatórios em uma única página, mantendo apenas dados REAIS do backend.

## ✅ **BACKUP CRIADO**
- ✅ Página de relatórios salva em: `loja/src/app/admin/relatorios_backup/`

## 🔄 **FUNCIONALIDADES A MIGRAR (DADOS REAIS)**

### **1. Sistema de Seleção de Relatórios**
- **Origem**: `selectedReport` (vendas, clientes, produtos, operacional)
- **Destino**: Dashboard com dropdown de seleção
- **Dados**: Usar APIs reais do backend

### **2. Filtros Avançados**
- **Origem**: `dateRange` (start, end) + `selectedPeriod`
- **Destino**: Dashboard com filtros expandidos
- **Dados**: Integrar com `actions.fetchStats()`

### **3. Layout de Relatórios**
- **Origem**: Estrutura visual dos relatórios
- **Destino**: Dashboard com seções organizadas
- **Dados**: Manter organização visual

### **4. Componentes de Exportação**
- **Origem**: Sistema de exportação dos relatórios
- **Destino**: Dashboard com exportação avançada
- **Dados**: Usar dados reais para exportação

### **5. Gráficos Avançados**
- **Origem**: RadarChart, visualizações específicas
- **Destino**: Dashboard com opções de visualização
- **Dados**: Usar dados reais do backend

## ❌ **FUNCIONALIDADES A REMOVER (DADOS MOCKADOS)**

### **1. Dados Simulados**
- ❌ `relatorioVendas` - Dados fake
- ❌ `relatorioClientes` - Dados fake
- ❌ `relatorioProdutos` - Dados fake
- ❌ `relatorioOperacional` - Dados fake

### **2. Métricas Inventadas**
- ❌ Dados por região geográfica
- ❌ Distribuição de idade dos clientes
- ❌ Comportamento de compra simulado
- ❌ Performance operacional fake

### **3. Análises Mockadas**
- ❌ Problemas frequentes inventados
- ❌ Performance mensal simulada
- ❌ Satisfação e retenção fake

## 📊 **DADOS REAIS DISPONÍVEIS**

### **APIs do Backend:**
- ✅ `stats.vendas` (hoje, semana, mês, crescimento)
- ✅ `stats.pedidos` (hoje, semana, mês, crescimento)
- ✅ `stats.clientes` (total, crescimento)
- ✅ `stats.livros` (total, ativos, inativos)
- ✅ `stats.vendasPorDia` (array com vendas por dia)
- ✅ `stats.vendasPorCategoria` (array com vendas por categoria)

### **Funcionalidades do AdminContext:**
- ✅ `actions.fetchStats(period)` - Buscar estatísticas
- ✅ `actions.fetchProducts()` - Buscar produtos
- ✅ `actions.fetchSales()` - Buscar vendas
- ✅ `actions.fetchClients()` - Buscar clientes

## 🎯 **ESTRATÉGIA DE MIGRAÇÃO**

### **Fase 1: Estrutura**
1. Adicionar sistema de seleção de relatórios no dashboard
2. Implementar filtros avançados
3. Organizar layout em seções

### **Fase 2: Dados**
1. Substituir dados mockados por dados reais
2. Integrar com AdminContext existente
3. Usar APIs já implementadas

### **Fase 3: Visualização**
1. Adicionar gráficos avançados
2. Implementar opções de visualização
3. Melhorar exportação

### **Fase 4: Limpeza ✅ CONCLUÍDA**
1. ✅ Remover página de relatórios
2. ✅ Atualizar navegação
3. ✅ Limpar imports não utilizados
4. ✅ Remover links quebrados

## ⚠️ **RISCOS E CONSIDERAÇÕES**

### **Riscos:**
1. **Sobrecarga do dashboard** - Muitas funcionalidades em uma página
2. **Complexidade de UX** - Usuário pode ficar confuso
3. **Performance** - Mais dados carregados simultaneamente

### **Mitigações:**
1. **Organização por seções** - Separar funcionalidades
2. **Filtros inteligentes** - Carregar dados sob demanda
3. **Loading states** - Feedback visual durante carregamento

## 📝 **NOTAS IMPORTANTES**

- **Manter apenas dados REAIS** do backend
- **Preservar funcionalidades úteis** dos relatórios
- **Manter UX limpa** e organizada
- **Testar cada migração** antes de continuar
- **Backup sempre disponível** para rollback

---

*Criado em: 01/09/2024 - 18:45*
*Status: Em progresso*
