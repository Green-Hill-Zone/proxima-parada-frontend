# 📝 Documentação do Fluxo de Reserva e Viajantes

> Guia técnico para o fluxo de reserva e integração dos viajantes entre frontend e backend

## 🔄 Fluxo Completo da Reserva

O fluxo de reserva segue as seguintes etapas:

1. **Seleção do Pacote de Viagem**
   - Usuário seleciona um pacote na tela principal
   - O sistema inicializa uma reserva no contexto (`ReservationContext`)

2. **Dados dos Viajantes**
   - Usuário preenche os dados de todos os viajantes
   - Os dados são armazenados temporariamente no localStorage (`pendingTravelers`)
   - Nenhum dado é enviado para o backend neste momento

3. **Pagamento**
   - Os dados do viajante principal são usados para o pagamento
   - O sistema cria uma sessão de pagamento no Stripe
   - Usuário é redirecionado para o checkout do Stripe

4. **Confirmação do Pagamento**
   - Após o pagamento, o Stripe redireciona para a página de confirmação
   - Se o pagamento for bem-sucedido, **só então** os viajantes são criados no backend
   - Os viajantes são associados à reserva recém-criada
   - A reserva é confirmada e os dados temporários são limpos

## 🔌 Integração Backend

### 📊 Modelos e DTOs

Os principais modelos utilizados na integração são:

#### Frontend
```typescript
// Interface para solicitação de criação de viajante
interface TravelerCreateRequest {
  name: string;
  document: string;
  birthDate: string;
  isMainBuyer: boolean;
  documentType: string;
  issuingCountryName: string;
  issuingStateName?: string;
  documentIssuedAt: string;
}

// Interface para resposta da API com viajante
interface TravelerResponse {
  id: number;
  name: string;
  document: string;
  birthDate: string;
  isMainBuyer: boolean;
  documentType: string;
  issuingCountryName: string;
  issuingStateName?: string;
  documentIssuedAt: string;
  reservationNumber?: string;
  hasReservation: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

#### Backend
```csharp
// TravelerDto.cs
public class TravelerDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Document { get; set; }
    public DateTime BirthDate { get; set; }
    public bool IsMainBuyer { get; set; }
    public string DocumentType { get; set; }
    public string IssuingCountryName { get; set; }
    public string IssuingStateName { get; set; }
    public DateTime DocumentIssuedAt { get; set; }
    public string ReservationNumber { get; set; }
    public bool HasReservation { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### 🌐 Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/Traveler` | Cria um novo viajante |
| PATCH | `/api/Traveler/{id}/reservation/{reservationId}` | Associa um viajante a uma reserva |
| GET | `/api/Traveler/reservation/{reservationId}` | Obtém todos os viajantes de uma reserva |
| POST | `/api/Payment` | Cria uma nova sessão de pagamento |
| POST | `/api/Payment/stripe/create-session` | Cria uma sessão de checkout no Stripe |

## 🧩 Componentes Principais

### 1. TravelerData.tsx

Este componente gerencia a entrada de dados dos viajantes:

- Permite adicionar múltiplos viajantes
- Preenche automaticamente dados do usuário logado
- Valida informações dos documentos
- Integra com o backend para salvar os dados

```tsx
// Exemplo simplificado
const handleContinue = async () => {
  // Verificar dados necessários
  if (!reservationData || travelers.length === 0) return;
  
  try {
    setIsLoading(true);
    
    // Converter dados para o formato da API
    const travelerRequests = travelers.map(t => ({...}));
    
    // Enviar para a API
    const savedTravelers = await createAndAssociateTravelers(
      travelerRequests, 
      reservationData.travelPackage.id
    );
    
    // Salvar no localStorage para a tela de pagamento
    localStorage.setItem('travelersData', JSON.stringify(paymentTravelers));
    
    // Navegar para pagamento
    navigate('/payment');
  } catch (error) {
    // Tratamento de erro
  } finally {
    setIsLoading(false);
  }
};
```

### 2. TravelerService.ts

Serviço que gerencia a comunicação com a API:

```typescript
/**
 * Cria múltiplos viajantes e os associa a uma reserva
 */
export const createAndAssociateTravelers = async (
  travelers: TravelerCreateRequest[], 
  reservationId: number
): Promise<TravelerResponse[]> => {
  try {
    // Criar os viajantes em sequência
    const createdTravelers: TravelerResponse[] = [];
    
    for (const travelerData of travelers) {
      // 1. Criar o viajante
      const traveler = await createTraveler(travelerData);
      
      // 2. Associar à reserva
      const associatedTraveler = await associateTravelerToReservation(
        traveler.id, 
        reservationId
      );
      
      createdTravelers.push(associatedTraveler);
    }
    
    return createdTravelers;
  } catch (error) {
    console.error('❌ Erro ao criar e associar viajantes:', error);
    throw new Error('Falha ao criar e associar viajantes à reserva');
  }
};
```

## 🔒 Dados Sensíveis e Segurança

- Documentos como CPF e RG são transmitidos com segurança
- Dados são validados tanto no frontend quanto no backend
- Informações pessoais são tratadas conforme LGPD

## 🧪 Testes e Validação

Para testar o fluxo completo:

1. Inicie o backend .NET
2. Inicie o frontend React
3. Crie uma conta ou faça login
4. Selecione um pacote e inicie uma reserva
5. Adicione viajantes na tela de viajantes
6. Prossiga para o pagamento

## 🐛 Depuração e Solução de Problemas

Caso encontre problemas na integração:

1. Verifique as mensagens de erro no console do navegador
2. Confirme se o backend está rodando e acessível
3. Verifique se a URL da API está correta nos serviços
4. Confirme se os formatos de data estão corretos (ISO 8601)

---

Documentação criada em: **Julho 2023**  
Última atualização: **Julho 2023**
