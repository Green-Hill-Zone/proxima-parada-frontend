import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useReservation } from './Reservation/context/ReservationContext';
import { useAuth } from '../hooks/useAuth'; // Importando o hook de autenticação
import { FaCheck, FaPlus, FaArrowRight } from 'react-icons/fa'; // Importando ícones
import { 
  type TravelerCreateRequest,
} from '../services/TravelerService';

// Interface baseada no modelo Traveler.cs do backend
interface Traveler {
  id?: number;
  name: string;
  document: string;
  birthDate: string;
  isMainBuyer: boolean;
  documentType: string;
  issuingCountryName: string;
  issuingStateName: string;
  documentIssuedAt: string;
}

// Interface para adaptar ao formato esperado pelo ReservationContext
interface ReservationTraveler {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
}

// Componente principal
const TravelerData: React.FC = () => {
  const navigate = useNavigate();
  const { reservationData, setReservationData } = useReservation();
  const { user } = useAuth(); // Obtendo dados do usuário logado
  
  // Estado para a lista de viajantes
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  
  // Estado para o formulário atual
  const [currentTraveler, setCurrentTraveler] = useState<Traveler>({
    name: '',
    document: '',
    birthDate: '',
    isMainBuyer: false,
    documentType: 'RG',
    issuingCountryName: 'Brasil',
    issuingStateName: '',
    documentIssuedAt: ''
  });

  // Estados para controle de UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // DEBUG: Mostrar estado do contexto no console
  useEffect(() => {
    console.log('⚠️ DEBUG: Estado do contexto de reserva:', reservationData);
  }, [reservationData]);
  
  // Detecta se é o primeiro viajante (comprador principal)
  const isFirstTraveler = travelers.length === 0;

  // Efeito para inicializar com pelo menos um viajante (comprador principal)
  useEffect(() => {
    if (isFirstTraveler) {
      // Se temos um usuário logado, usar seus dados para preencher o formulário
      if (user) {
        // Converter data de nascimento de DD/MM/AAAA para AAAA-MM-DD (formato input date)
        let birthDate = '';
        if (user.birthDate) {
          const parts = user.birthDate.split('/');
          if (parts.length === 3) {
            birthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }

        // Determinar o tipo de documento com base no formato do CPF/documento
        // Assumimos que está no formato de CPF por padrão
        const documentType = user.cpf && user.cpf.includes('.') ? 'CPF' : 'RG';
        
        setCurrentTraveler({
          name: user.name || '',
          document: user.cpf || '',
          birthDate: birthDate || '',
          isMainBuyer: true,
          documentType: documentType,
          issuingCountryName: user.country || 'Brasil',
          issuingStateName: user.state || '',
          documentIssuedAt: '' // Não temos essa informação no contexto de usuário
        });
        
        setMessage({ 
          type: 'info', 
          text: 'Dados do usuário preenchidos automaticamente! Verifique e complete se necessário.'
        });
      } else {
        // Se não temos usuário logado, apenas marcar como comprador principal
        setCurrentTraveler(prev => ({ ...prev, isMainBuyer: true }));
      }
    }
  }, [isFirstTraveler, user]);

  // Opções para tipo de documento
  const documentTypes = [
    { value: 'RG', label: 'RG' },
    { value: 'CPF', label: 'CPF' },
    { value: 'CNH', label: 'CNH' },
    { value: 'Passaporte', label: 'Passaporte' }
  ];

  // Lista de países para seleção
  const countries = [
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Uruguai', label: 'Uruguai' },
    { value: 'Paraguai', label: 'Paraguai' },
    { value: 'Outro', label: 'Outro' }
  ];

  // Lista de estados brasileiros
  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  // Função para validar os dados do viajante
  const validateTraveler = (traveler: Traveler): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!traveler.name.trim()) errors.name = 'Nome é obrigatório';
    if (!traveler.document.trim()) errors.document = 'Documento é obrigatório';
    if (!traveler.birthDate) errors.birthDate = 'Data de nascimento é obrigatória';
    if (!traveler.documentType) errors.documentType = 'Tipo de documento é obrigatório';
    if (!traveler.issuingCountryName) errors.issuingCountryName = 'País emissor é obrigatório';
    
    // Validar se é brasileiro, o estado é obrigatório
    if (traveler.issuingCountryName === 'Brasil' && !traveler.issuingStateName) {
      errors.issuingStateName = 'Estado emissor é obrigatório para documentos brasileiros';
    }
    
    // Validar data de emissão do documento
    if (!traveler.documentIssuedAt) errors.documentIssuedAt = 'Data de emissão é obrigatória';
    
    return errors;
  };

  // Manipulador para mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Tratamento especial para checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentTraveler(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentTraveler(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro específico quando o campo é editado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Função para adicionar um novo viajante
  const handleAddTraveler = () => {
    // Validar dados do viajante atual
    const validationErrors = validateTraveler(currentTraveler);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'danger', text: 'Por favor, corrija os erros antes de continuar.' });
      return;
    }
    
    // Adicionar o viajante à lista
    setTravelers(prev => [...prev, { ...currentTraveler }]);
    
    // Limpar o formulário para o próximo viajante
    setCurrentTraveler({
      name: '',
      document: '',
      birthDate: '',
      isMainBuyer: false,
      documentType: 'RG',
      issuingCountryName: 'Brasil',
      issuingStateName: '',
      documentIssuedAt: ''
    });
    
    // Mostrar mensagem de sucesso
    setMessage({ type: 'success', text: 'Viajante adicionado com sucesso!' });
    
    // Limpar a mensagem após 3 segundos
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Função para remover um viajante
  const handleRemoveTraveler = (index: number) => {
    // Não permitir remover o comprador principal
    if (travelers[index].isMainBuyer) {
      setMessage({ type: 'danger', text: 'Não é possível remover o comprador principal.' });
      return;
    }
    
    // Remover o viajante da lista
    setTravelers(prev => prev.filter((_, i) => i !== index));
    setMessage({ type: 'success', text: 'Viajante removido com sucesso!' });
    
    // Limpar a mensagem após 3 segundos
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Função para continuar para o pagamento
  const handleContinue = async () => {
    // Verificar se há pelo menos um viajante
    if (travelers.length === 0) {
      setMessage({ type: 'danger', text: 'Adicione pelo menos um viajante antes de continuar.' });
      return;
    }
    
    try {
      setIsLoading(true);
      setApiError(null);
      
      // 1. Atualizar o contexto de reserva com os viajantes (sem salvar no backend ainda)
      if (reservationData) {
        // Converter do formato Traveler para o formato ReservationTraveler esperado pelo contexto
        const reservationTravelers = travelers.map(t => ({
          id: t.id,
          name: t.name,
          email: t.isMainBuyer ? "usuario@exemplo.com" : "", // Campo obrigatório para o principal
          phone: t.isMainBuyer ? "11999999999" : "", // Campo obrigatório para o principal
          documentType: t.documentType,
          documentNumber: t.document, // Mapeando para o nome correto do campo
          birthDate: t.birthDate
        }));
        
        setReservationData({
          ...reservationData,
          travelers: reservationTravelers
        });
      }
      
      // 2. Preparar dados dos viajantes para enviar após o pagamento
      // Criamos um objeto reserva temporário se não existe um no contexto
      const mockReservationId = 999; // ID temporário apenas para referência
      const reservationId = reservationData?.travelPackage?.id || mockReservationId;
      
      // Armazenar no localStorage para recuperar depois que o pagamento for concluído
      const travelerRequests: TravelerCreateRequest[] = travelers.map(t => ({
        name: t.name,
        document: t.document,
        birthDate: t.birthDate,
        isMainBuyer: t.isMainBuyer,
        documentType: t.documentType,
        issuingCountryName: t.issuingCountryName,
        issuingStateName: t.issuingStateName || '',
        documentIssuedAt: t.documentIssuedAt
      }));
      
      // Armazenar os dados para uso após o pagamento com o ID da reserva
      localStorage.setItem('pendingTravelers', JSON.stringify({
        travelers: travelerRequests,
        reservationId: reservationId
      }));
      
      // 3. Salvar dados no formato esperado pela página de pagamento
      const paymentTravelers = travelers.map((t, index) => ({
        id: String(t.id || index + 1),
        fullName: t.name,
        cpf: t.documentType === 'CPF' ? t.document : '',
        birthDate: t.birthDate,
        email: t.isMainBuyer ? "usuario@exemplo.com" : "",
        phone: t.isMainBuyer ? "11999999999" : "",
        gender: "" as 'M' | 'F' | 'O' | '',
        passportNumber: t.documentType === 'Passaporte' ? t.document : undefined,
        isMainTraveler: t.isMainBuyer
      }));
      
      localStorage.setItem('travelersData', JSON.stringify(paymentTravelers));
      
      // Mostrar mensagem de sucesso antes de navegar
      setMessage({ type: 'success', text: `Prosseguindo com ${travelers.length} viajante${travelers.length !== 1 ? 's' : ''}! Redirecionando para pagamento...` });
      
      // Esperar um momento para mostrar a mensagem
      setTimeout(() => {
        // Navegar para a página de pagamento
        navigate('/payment');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro ao preparar dados dos viajantes:', error);
      setApiError('Falha ao processar dados dos viajantes. Por favor, tente novamente.');
      setMessage({ type: 'danger', text: 'Erro ao processar dados dos viajantes. Por favor, tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para voltar para a página anterior
  const handleBack = () => {
    navigate('/reservation');
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">
        <span className="border-bottom border-primary pb-2">Dados dos Viajantes</span>
      </h2>
      
      <Alert variant="light" className="mb-4 border-start border-info border-3">
        <div className="d-flex">
          <div className="ms-2">
            <p className="mb-1 text-muted">
              <small>
                Adicione os viajantes que participarão desta viagem.
                O primeiro viajante é sempre o comprador principal.
                Quando concluir, clique em "Continuar para Pagamento".
              </small>
            </p>
          </div>
        </div>
      </Alert>
      
      {message.text && (
        <Alert variant={message.type}>
          {message.text}
        </Alert>
      )}
      
      {/* Lista de viajantes já adicionados */}
      {travelers.length > 0 && (
        <div className="mb-4">
          <h4>Viajantes Adicionados</h4>
          {travelers.map((traveler, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Row>
                  <Col>
                    <p><strong>Nome:</strong> {traveler.name}</p>
                    <p><strong>Documento:</strong> {traveler.documentType}: {traveler.document}</p>
                    <p><strong>Data de Nascimento:</strong> {new Date(traveler.birthDate).toLocaleDateString('pt-BR')}</p>
                  </Col>
                  <Col>
                    <p><strong>País Emissor:</strong> {traveler.issuingCountryName}</p>
                    {traveler.issuingStateName && (
                      <p><strong>Estado Emissor:</strong> {traveler.issuingStateName}</p>
                    )}
                    <p><strong>Data de Emissão:</strong> {new Date(traveler.documentIssuedAt).toLocaleDateString('pt-BR')}</p>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center">
                    {traveler.isMainBuyer && <Badge bg="primary">Comprador Principal</Badge>}
                    {!traveler.isMainBuyer && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleRemoveTraveler(index)}
                      >
                        Remover
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      
      {/* Formulário para adicionar novo viajante */}
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">{isFirstTraveler ? 'Dados do Comprador Principal' : 'Adicionar Novo Viajante'}</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentTraveler.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento*</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={currentTraveler.birthDate}
                    onChange={handleInputChange}
                    isInvalid={!!errors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Documento*</Form.Label>
                  <Form.Select
                    name="documentType"
                    value={currentTraveler.documentType}
                    onChange={handleInputChange}
                    isInvalid={!!errors.documentType}
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.documentType}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Número do Documento*</Form.Label>
                  <Form.Control
                    type="text"
                    name="document"
                    value={currentTraveler.document}
                    onChange={handleInputChange}
                    isInvalid={!!errors.document}
                  />
                  <Form.Control.Feedback type="invalid">{errors.document}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>País Emissor*</Form.Label>
                  <Form.Select
                    name="issuingCountryName"
                    value={currentTraveler.issuingCountryName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.issuingCountryName}
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.issuingCountryName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado Emissor{currentTraveler.issuingCountryName === 'Brasil' ? '*' : ''}</Form.Label>
                  <Form.Select
                    name="issuingStateName"
                    value={currentTraveler.issuingStateName}
                    onChange={handleInputChange}
                    disabled={currentTraveler.issuingCountryName !== 'Brasil'}
                    isInvalid={!!errors.issuingStateName}
                  >
                    <option value="">Selecione um estado</option>
                    {brazilianStates.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.issuingStateName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Emissão do Documento*</Form.Label>
                  <Form.Control
                    type="date"
                    name="documentIssuedAt"
                    value={currentTraveler.documentIssuedAt}
                    onChange={handleInputChange}
                    isInvalid={!!errors.documentIssuedAt}
                  />
                  <Form.Control.Feedback type="invalid">{errors.documentIssuedAt}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            {!isFirstTraveler && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isMainBuyer"
                  label="Este é o comprador principal"
                  checked={currentTraveler.isMainBuyer}
                  onChange={handleInputChange}
                  disabled={travelers.some(t => t.isMainBuyer)}
                />
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="outline-success" 
                onClick={handleContinue}
                disabled={travelers.length === 0 || isLoading}
                className="px-4"
              >
                <FaCheck className="me-2" />
                Prosseguir com {travelers.length} viajante{travelers.length !== 1 ? 's' : ''}
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddTraveler}
              >
                <FaPlus className="me-2" />
                Adicionar Viajante
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between align-items-start mt-4">
        <Button 
          variant="outline-secondary" 
          onClick={handleBack}
          className="px-4 py-2 d-flex align-items-center shadow-sm"
          size="lg"
        >
          <FaArrowRight className="me-2" style={{ transform: 'rotate(180deg)' }} />
          Voltar para Reserva
        </Button>
        
        <div className="text-center">
          <p className="text-muted mb-2">
            <small>{travelers.length} viajante{travelers.length !== 1 ? 's' : ''} adicionado{travelers.length !== 1 ? 's' : ''}</small>
          </p>
          <Button 
            variant="success" 
            size="lg"
            onClick={handleContinue}
            disabled={travelers.length === 0 || isLoading}
            className="px-4 py-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processando...
              </>
            ) : (
              <>
                Continuar para Pagamento <FaArrowRight className="ms-2" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {apiError && (
        <Alert variant="danger" className="mt-3">
          <h5>Erro na comunicação com o servidor</h5>
          <p>{apiError}</p>
          <p>Por favor, tente novamente ou entre em contato com o suporte.</p>
        </Alert>
      )}
    </Container>
  );
};

export default TravelerData;
