# Sistema de Busca e Filtros - Livraria Movase

## 📋 **Visão Geral**

O sistema de busca e filtros foi implementado para proporcionar uma experiência de compra profissional e intuitiva. Ele permite aos usuários encontrar rapidamente os livros que desejam através de múltiplos critérios de busca.

## 🏗️ **Arquitetura**

### **1. API Route (`/api/livros`)**
- **Localização:** `src/app/api/livros/route.ts`
- **Função:** Endpoint para buscar e filtrar livros
- **Métodos:** GET (buscar), POST (criar - futuro)

### **2. Hook Personalizado (`useLivros`)**
- **Localização:** `src/hooks/useLivros.ts`
- **Função:** Gerenciar estado e lógica de busca/filtros
- **Recursos:** Estado, loading, paginação, filtros

### **3. Componentes**
- **BuscaFiltros:** Interface de busca e filtros
- **LivroCard:** Card individual do livro
- **Paginacao:** Navegação entre páginas

## 🔍 **Funcionalidades**

### **Busca por Texto**
- Busca em título, autor, sinopse e tags
- Busca em tempo real
- Suporte a Enter para buscar

### **Filtros Avançados**
- **Categoria:** Filtrar por categoria do livro
- **Preço:** Faixa de preço (mín/máx)
- **Status:** Disponível, indisponível, esgotado
- **Ordenação:** Preço, título, avaliações, vendas, novidade

### **Filtros Especiais**
- **Destaques:** Livros em destaque
- **Novidades:** Lançamentos recentes
- **Promoções:** Livros com desconto

### **Paginação**
- Navegação entre páginas
- Indicador de página atual
- Botões anterior/próxima

## 📊 **Estrutura de Dados**

### **Livro Interface**
```typescript
interface Livro {
  id: number;
  titulo: string;
  autor: string;
  editora: string;
  preco: number;
  precoOriginal: number;
  categoria: string;
  subcategoria: string;
  isbn: string;
  paginas: number;
  ano: number;
  sinopse: string;
  descricao: string;
  estoque: number;
  status: 'disponivel' | 'indisponivel' | 'esgotado';
  destaque: boolean;
  novidade: boolean;
  promocao: boolean;
  imagemFront: string;
  imagemBack: string;
  tags: string[];
  avaliacoes: number;
  totalAvaliacoes: number;
  vendas: number;
  createdAt: string;
  updatedAt: string;
}
```

### **Parâmetros de Busca**
```typescript
interface FiltrosLivros {
  q?: string;              // Termo de busca
  categoria?: string;      // Categoria
  subcategoria?: string;   // Subcategoria
  precoMin?: string;       // Preço mínimo
  precoMax?: string;       // Preço máximo
  status?: string;         // Status do produto
  ordenar?: string;        // Ordenação
  destaque?: string;       // Filtro destaque
  novidade?: string;       // Filtro novidade
  promocao?: string;       // Filtro promoção
  limit?: string;          // Itens por página
  page?: string;           // Página atual
}
```

## 🚀 **Como Usar**

### **1. Na Página Principal**
```tsx
import { useLivros } from '@/hooks/useLivros';
import BuscaFiltros from '@/components/livros/BuscaFiltros';
import LivroCard from '@/components/livros/LivroCard';

export default function MinhaPagina() {
  const {
    livros,
    loading,
    buscarPorTexto,
    filtrarPorCategoria,
    // ... outros métodos
  } = useLivros();

  return (
    <div>
      <BuscaFiltros
        onBuscar={buscarPorTexto}
        onFiltrarCategoria={filtrarPorCategoria}
        // ... outras props
      />
      
      {livros.map(livro => (
        <LivroCard key={livro.id} livro={livro} />
      ))}
    </div>
  );
}
```

### **2. Busca Programática**
```tsx
const { buscarPorTexto, filtrarPorPreco } = useLivros();

// Buscar por texto
buscarPorTexto('fé');

// Filtrar por preço
filtrarPorPreco('20', '50');

// Limpar filtros
limparFiltros();
```

## 🔧 **Configuração**

### **API Route**
A API route está configurada com dados mock. Para conectar ao backend real:

1. **Substitua o mock de dados:**
```typescript
// Em src/app/api/livros/route.ts
// Substitua mockLivros por consulta ao banco
const livros = await prisma.livro.findMany({
  where: {
    // Aplicar filtros aqui
  },
  orderBy: {
    // Aplicar ordenação aqui
  }
});
```

2. **Adicione validação de entrada:**
```typescript
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().optional(),
  categoria: z.string().optional(),
  // ... outros campos
});
```

### **Hook Personalizado**
O hook está configurado para fazer requisições para `/api/livros`. Para usar uma API externa:

```typescript
// Em src/hooks/useLivros.ts
const url = `${process.env.NEXT_PUBLIC_API_URL}/livros?${params.toString()}`;
```

## 📱 **Responsividade**

O sistema é totalmente responsivo:

- **Mobile:** 1 coluna de cards
- **Tablet:** 2 colunas de cards  
- **Desktop:** 3-4 colunas de cards
- **Filtros:** Colapsam em mobile

## 🎨 **Personalização**

### **Cores**
As cores podem ser personalizadas editando as classes Tailwind:

```css
/* Cores principais */
.text-red-600    /* Cor principal */
.bg-red-100      /* Background de destaque */
.border-red-300  /* Bordas */
```

### **Layout**
O layout pode ser ajustado modificando as classes de grid:

```tsx
// Grid responsivo
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
```

## 🔄 **Estados**

### **Loading**
- Spinner durante carregamento
- Skeleton loading (futuro)

### **Error**
- Mensagem de erro amigável
- Botão para tentar novamente

### **Empty State**
- Mensagem quando não há resultados
- Sugestões de busca

## 📈 **Performance**

### **Otimizações Implementadas**
- Debounce na busca (futuro)
- Paginação para grandes volumes
- Lazy loading de imagens
- Cache de resultados (futuro)

### **Otimizações Futuras**
- Virtualização para listas grandes
- Infinite scroll
- Cache com React Query
- Otimização de imagens

## 🧪 **Testes**

### **Testes Manuais**
1. **Busca por texto:** Digite termos e verifique resultados
2. **Filtros:** Aplique diferentes filtros
3. **Paginação:** Navegue entre páginas
4. **Responsividade:** Teste em diferentes tamanhos

### **Testes Automatizados (Futuro)**
```typescript
// Exemplo de teste
describe('Sistema de Busca', () => {
  it('deve filtrar livros por categoria', () => {
    // Teste aqui
  });
});
```

## 🚀 **Próximos Passos**

1. **Backend Real:** Conectar ao banco de dados
2. **Cache:** Implementar cache de resultados
3. **Busca Avançada:** Filtros por autor, editora
4. **Wishlist:** Sistema de favoritos
5. **Comparação:** Comparar livros
6. **Recomendações:** Sistema de sugestões
7. **Analytics:** Rastrear buscas populares

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique a documentação
2. Teste com dados mock
3. Verifique o console do navegador
4. Consulte os logs da API
