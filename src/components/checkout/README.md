# Componentes do Checkout

Esta pasta contém todos os componentes relacionados ao processo de checkout da aplicação, organizados de forma modular e reutilizável.

## 📁 Estrutura de Arquivos

```
checkout/
├── index.ts                    # Exportações principais
├── constants.ts                # Constantes e configurações
├── CheckoutForm.tsx            # Componente principal do checkout
├── InputField.tsx              # Campo de input reutilizável
├── ProgressBar.tsx             # Barra de progresso das etapas
├── NavigationButtons.tsx       # Botões de navegação
├── steps/                      # Pasta com as etapas do checkout
│   ├── DadosPessoaisStep.tsx   # Etapa 1: Dados pessoais
│   ├── EnderecoStep.tsx        # Etapa 2: Endereço de entrega
│   ├── PagamentoStep.tsx       # Etapa 4: Método de pagamento
│   └── ConfirmacaoStep.tsx     # Etapa 5: Confirmação do pedido
└── README.md                   # Esta documentação
```

## 🧩 Componentes

### CheckoutForm.tsx
Componente principal que gerencia todo o fluxo do checkout, incluindo:
- Gerenciamento de estado das etapas
- Validações por etapa
- Integração com APIs (Correios, PagSeguro, ViaCEP)
- Navegação entre etapas

### InputField.tsx
Componente reutilizável para campos de input com:
- React.memo para otimização de performance
- Suporte a diferentes tipos de input
- Validação visual
- Responsividade

### ProgressBar.tsx
Barra de progresso visual que mostra:
- Etapa atual
- Etapas completadas
- Etapas pendentes
- Responsividade para mobile

### NavigationButtons.tsx
Botões de navegação com:
- Botão "Voltar" (desabilitado na primeira etapa)
- Botão "Próximo" / "Finalizar Compra"
- Estados de loading
- Validação antes de avançar

## 📋 Etapas do Checkout

### 1. DadosPessoaisStep.tsx
- Nome completo
- E-mail
- CPF
- Telefone

### 2. EnderecoStep.tsx
- CEP (com auto-completar via ViaCEP)
- Logradouro
- Número
- Complemento
- Bairro
- Cidade
- Estado

### 3. FreteStep.tsx
- Integração com FormaEntregaSelector
- Cálculo automático via API dos Correios
- Seleção de opções de entrega

### 4. PagamentoStep.tsx
- Seleção de método de pagamento
- Dados do cartão (quando aplicável)
- Integração com PagSeguro

### 5. ConfirmacaoStep.tsx
- Resumo de todos os dados
- Confirmação antes de finalizar

## 🔧 Constantes

### constants.ts
Contém todas as configurações estáticas:
- Estados do Brasil
- Métodos de pagamento
- Campos do cartão
- Configurações das etapas
- Códigos de serviço dos Correios

## 🚀 Como Usar

```typescript
import { CheckoutForm } from '../components/checkout';

// No seu componente
<CheckoutForm
  onSuccess={(orderId) => {
    console.log('Pedido realizado:', orderId);
  }}
  onFreteChange={(frete) => {
    console.log('Frete selecionado:', frete);
  }}
/>
```

## ✨ Benefícios da Nova Estrutura

1. **Modularidade**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outros contextos
3. **Manutenibilidade**: Código mais fácil de manter e debugar
4. **Performance**: Otimizações com React.memo e useCallback
5. **Organização**: Estrutura clara e intuitiva
6. **Testabilidade**: Componentes isolados são mais fáceis de testar

## 🔄 Fluxo de Dados

```
CheckoutForm (Estado Principal)
├── ProgressBar (Apenas exibição)
├── Steps (Recebem props e callbacks)
│   ├── DadosPessoaisStep
│   ├── EnderecoStep
│   ├── PagamentoStep
│   └── ConfirmacaoStep
└── NavigationButtons (Recebem callbacks)
```

## 🎯 Próximos Passos

- [ ] Adicionar testes unitários
- [ ] Implementar validação de formulário mais robusta
- [ ] Adicionar animações de transição entre etapas
- [ ] Implementar persistência de dados no localStorage
- [ ] Adicionar suporte a múltiplos idiomas
