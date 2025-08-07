# 🛫 Documentação: Pesquisa Avançada de Voos

## 📋 Novas Funcionalidades Implementadas

### 🔍 **Pesquisa por Categoria de Voo**

#### 1. **Classes de Cabine**
- **Economy/Econômica**: Classe econômica
- **Business/Executiva**: Classe executiva 
- **First/Primeira**: Primeira classe
- **Premium**: Classe premium

#### 2. **Classes de Assento**
- **Standard**: Assento padrão
- **Premium**: Assento premium
- **Business**: Assento business

#### 3. **Tipo de Voo**
- **Nacional/Domestic**: Voos dentro do mesmo país
- **Internacional/International**: Voos entre países diferentes

#### 4. **Filtros de Preço**
- **Preço Mínimo**: Valor mínimo em R$
- **Preço Máximo**: Valor máximo em R$

---

## 🎯 **Como Usar**

### **Busca Rápida (Barra de Pesquisa)**
Digite qualquer um dos termos abaixo na barra de pesquisa:

#### Classes:
- `economy`, `economica`, `eco`
- `business`, `executiva`, `biz`
- `first`, `primeira`, `primeira classe`
- `premium`, `premium economy`
- `standard`, `padrao`, `basico`

#### Tipo de Voo:
- `nacional`, `domestic`, `domestico`
- `internacional`, `international`, `inter`

#### Exemplos de Busca:
```
economy          → Encontra voos classe econômica
business         → Encontra voos classe executiva  
internacional    → Encontra voos internacionais
premium          → Encontra voos/assentos premium
nacional         → Encontra voos nacionais
```

### **Filtros Avançados**
Use os dropdowns e campos específicos:

1. **Classe da Cabine**: Dropdown com opções predefinidas
2. **Classe do Assento**: Dropdown com opções predefinidas  
3. **Tipo de Voo**: Nacional ou Internacional
4. **Preço Min/Max**: Campos numéricos em R$

---

## 🔧 **Funcionalidades Técnicas**

### **Detecção Automática de Voo Internacional**
```typescript
// Compara países de origem e destino
const isInternational = originCountry !== destinationCountry;
```

### **Normalização de Classes**
```typescript
// Mapeia variações de nomes de classes
const classMap = {
  'economy': ['economy', 'economica', 'economico', 'eco', 'tourist'],
  'business': ['business', 'executiva', 'executivo', 'biz'],
  'first': ['first', 'primeira', 'first class', 'primeira classe'],
  'premium': ['premium', 'premium economy', 'premium eco'],
  'standard': ['standard', 'padrao', 'basico', 'normal']
};
```

### **Busca Inteligente**
- **Ignora acentos**: `economica` = `econômica`
- **Case-insensitive**: `BUSINESS` = `business`
- **Múltiplas variações**: `executiva` = `business`
- **Busca parcial**: `eco` encontra `economy`

---

## 🎨 **Interface Melhorada**

### **Badges de Filtros Ativos**
- 🔵 **Azul**: Termo de busca
- ⚫ **Cinza**: Origem/Destino/Data
- 🔵 **Azul Claro**: Classes (Cabine/Assento)
- 🟢 **Verde**: Tipo de voo
- 🟡 **Amarelo**: Preços

### **Layout Responsivo**
- **Desktop**: 2 linhas de filtros
- **Tablet**: Ajuste automático de colunas
- **Mobile**: Layout vertical otimizado

### **Contador de Filtros**
Mostra quantos filtros estão ativos na parte inferior dos filtros avançados.

---

## 📊 **Exemplos Práticos**

### **Cenário 1: Busca por Classe**
```
Busca: "business"
Resultado: Todos os voos com cabinClass="Business" ou seatClass="Business"
```

### **Cenário 2: Voo Internacional Economy**
```
Filtros:
- Tipo: Internacional
- Classe Cabine: Economy
Resultado: Voos econômicos entre países diferentes
```

### **Cenário 3: Busca por Preço**
```
Filtros:
- Preço Min: R$ 500
- Preço Max: R$ 1500
Resultado: Voos na faixa de preço especificada
```

### **Cenário 4: Busca Combinada**
```
Busca Rápida: "premium"
+ Filtro Tipo: Nacional
+ Preço Max: R$ 800
Resultado: Voos premium nacionais até R$ 800
```

---

## 🚀 **Performance**

### **Otimizações Implementadas**
- **useMemo**: Recalcula filtros apenas quando necessário
- **Normalização única**: Cache de texto normalizado
- **Filtros reativos**: Aplicação em tempo real
- **Reset inteligente**: Página volta ao início ao filtrar

### **Compatibilidade**
- ✅ Todos os navegadores modernos
- ✅ Suporte a acentos (NFD normalization)
- ✅ Dispositivos móveis
- ✅ Leitores de tela (acessibilidade)

---

## 🎯 **Casos de Uso Comuns**

1. **"Quero voos econômicos para o exterior"**
   - Tipo: Internacional + Classe: Economy

2. **"Preciso de voos business nacionais"**
   - Tipo: Nacional + Classe: Business

3. **"Voos baratos até R$ 500"**
   - Preço Max: 500

4. **"Assentos premium em qualquer voo"**
   - Busca: "premium" ou Classe Assento: Premium

5. **"Voos internacionais de primeira classe"**
   - Tipo: Internacional + Classe: First

Esta implementação torna a busca de voos muito mais poderosa e intuitiva! 🎉
