/* ===================================================================== */
/* EXEMPLO DE USO DO COMPONENTE PAYMENT                                 */
/* ===================================================================== */

import React from 'react';
import Payment from '../components/Payment';

// ✅ Exemplo de como usar o componente Payment
const PaymentExample: React.FC = () => {
  
  // ✅ Exemplo de dados do pacote de viagem
  const exampleTravelPackage = {
    id: 123,
    name: "Pacote Rio de Janeiro - 7 dias",
    price: 1500.00,
    date: "2024-07-15T00:00:00.000Z"
  };

  // ✅ Handler para sucesso do pagamento
  const handlePaymentSuccess = (result: any) => {
    console.log('Pagamento realizado com sucesso:', result);
    
    // Aqui você pode:
    // - Redirecionar para página de confirmação
    // - Mostrar modal de sucesso
    // - Enviar analytics
    // - Atualizar estado da aplicação
    
    alert(`Pagamento aprovado! ID: ${result.paymentIntentId}`);
  };

  // ✅ Handler para erro no pagamento
  const handlePaymentError = (error: string) => {
    console.error('Erro no pagamento:', error);
    
    // Aqui você pode:
    // - Mostrar modal de erro
    // - Enviar logs de erro
    // - Oferecer opções alternativas
    
    alert(`Erro no pagamento: ${error}`);
  };

  return (
    <div>
      <Payment
        travelPackage={exampleTravelPackage}
        reservationId={456} // ID da reserva no backend
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default PaymentExample;

/* ===================================================================== */
/* DOCUMENTAÇÃO DE USO                                                  */
/* ===================================================================== */

/*
PROPS DO COMPONENTE PAYMENT:

1. travelPackage (opcional):
   - id: number - ID do pacote no backend
   - name: string - Nome do pacote de viagem
   - price: number - Preço por pessoa
   - date: string - Data da viagem (ISO format)

2. reservationId (opcional, default: 1):
   - number - ID da reserva no backend

3. onPaymentSuccess (opcional):
   - function - Callback executado quando pagamento é aprovado
   - Recebe o resultado do pagamento como parâmetro

4. onPaymentError (opcional):
   - function - Callback executado quando há erro no pagamento
   - Recebe a mensagem de erro como parâmetro

ARQUITETURA IMPLEMENTADA:

✅ Clean Architecture:
   - Separação clara de responsabilidades
   - Use Cases isolados no PaymentService
   - Componente UI independente da lógica de negócio

✅ SOLID Principles:
   - Single Responsibility: Cada função tem uma responsabilidade
   - Open/Closed: Extensível via props e callbacks
   - Interface Segregation: Interfaces específicas para cada necessidade
   - Dependency Inversion: Depende de abstrações (interfaces)

✅ DRY (Don't Repeat Yourself):
   - Funções utilitárias reutilizáveis
   - Validações centralizadas
   - Mapeamentos de tipos unificados

✅ KISS (Keep It Simple, Stupid):
   - Interface intuitiva
   - Fluxo de pagamento direto
   - Código legível e bem documentado

✅ YAGNI (You Aren't Gonna Need It):
   - Apenas funcionalidades necessárias
   - Sem over-engineering
   - Extensível quando necessário

INTEGRAÇÃO COM BACKEND:

O componente está alinhado com:
- CheckoutController.cs
- CreateCheckoutSessionUseCase
- ProcessPaymentUseCase
- DTOs: CheckoutPageRequestDto, ConfirmReservationRequestDto, PaymentStatusResponseDto
- Shadow Properties para dados específicos de pagamento

FLUXO DE PAGAMENTO:

1. Usuário preenche dados do cliente
2. Seleciona método de pagamento
3. Sistema valida formulário
4. Cria sessão de checkout no backend
5. Processa pagamento conforme método escolhido
6. Retorna resultado (sucesso/erro)
7. Executa callbacks apropriados

MÉTODOS DE PAGAMENTO SUPORTADOS:

- Cartão de Crédito (Card = 1)
- PIX (Pix = 2)  
- Boleto Bancário (Boleto = 3)

*/
