# 📦 Módulo Correios

Este módulo organiza todas as funcionalidades relacionadas aos Correios de forma modular e limpa.

## 📁 Estrutura

```
src/correios/
├── types/
│   └── index.ts          # Tipos TypeScript
├── services/
│   ├── api.ts           # Funções principais da API
│   ├── parser.ts        # Parser do XML
│   └── utils.ts         # Utilitários
├── constants/
│   └── index.ts         # Constantes
├── index.ts             # Exportações principais
└── README.md            # Esta documentação
```

## 🚀 Como usar

### Importação básica
```typescript
import { calcularFrete, formatarValorFrete, getNomeServico } from '../correios';
```

### Cálculo de frete
```typescript
const opcoes = await calcularFrete('60348010', 0.5);
```

### Formatação
```typescript
const valorFormatado = formatarValorFrete('15,50'); // "15.50"
const nomeServico = getNomeServico('04510'); // "PAC"
```

## 📋 Funções disponíveis

### API
- `calcularFrete(cep, peso, ...dimensoes)` - Calcula frete
- `calcularFreteCompleto(request)` - Calcula frete com objeto completo

### Utilitários
- `formatarValorFrete(valor)` - Formata valor para exibição
- `getNomeServico(codigo)` - Obtém nome do serviço
- `validarCEP(cep)` - Valida CEP
- `formatarCEP(cep)` - Formata CEP (00000-000)
- `calcularPesoTotal(quantidade, pesoUnitario)` - Calcula peso total

### Parser
- `parseCorreiosXML(xml)` - Parseia XML dos Correios
- `validarRespostaCorreios(respostas)` - Valida resposta

## 🔧 Constantes

- `CORREIOS_SERVICE_CODES` - Códigos dos serviços
- `CORREIOS_SERVICE_NAMES` - Nomes dos serviços
- `CORREIOS_DEFAULT_DIMENSIONS` - Dimensões padrão
- `CORREIOS_CEP_ORIGEM` - CEP de origem

## 📝 Tipos

- `CorreiosRequest` - Dados para cálculo
- `CorreiosResponse` - Resposta dos Correios
- `CorreiosServiceCode` - Código de serviço
