// Importações necessárias
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import { updateUser } from '../../services/UserService';
import './Profile.css';

// Interface para os dados do formulário
interface ProfileFormData {
  name: string;
  email: string;
  birthDate: string;
  cpf: string;
  gender: string;
  phone: string;
  phone2: string;
  // Campos de endereço
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

// Componente Profile - Página de edição de perfil do usuário
const Profile = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.PROFILE);
  
  const { user, updateUser: updateUserInContext } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  // Estado do formulário inicializado com dados do usuário
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    birthDate: '',
    cpf: '',
    gender: '',
    phone: '',
    phone2: '',
    // Campos de endereço
    cep: '',
    street: '',
    streetNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: ''
  });

  // Carrega dados do usuário no formulário quando componente monta
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthDate: user.birthDate || '',
        cpf: user.cpf || '',
        gender: user.gender || '',
        phone: user.phone || '',
        phone2: user.phone2 || '',
        // Campos de endereço
        cep: user.cep || '',
        street: user.street || '',
        streetNumber: user.streetNumber || '',
        complement: user.complement || '',
        neighborhood: user.neighborhood || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || 'Brasil'
      });
    }
  }, [user]);

  // Função para atualizar campos do formulário
  const handleInputChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpa mensagens de erro/sucesso quando usuário digita
    setShowError(false);
    setShowSuccess(false);
  };

  // Validação dos campos obrigatórios
  const validateForm = (): boolean => {
    const requiredFields = ['name', 'email', 'birthDate', 'cpf', 'phone', 'cep', 'street', 'streetNumber', 'neighborhood', 'city', 'state', 'country'];

    for (const field of requiredFields) {
      if (!formData[field as keyof ProfileFormData].trim()) {
        setError(`O campo ${getFieldLabel(field)} é obrigatório.`);
        setShowError(true);
        return false;
      }
    }

    // Validação específica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido.');
      setShowError(true);
      return false;
    }

    // Validação específica de CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      setError('CPF deve estar no formato: 000.000.000-00');
      setShowError(true);
      return false;
    }

    // Validação específica de telefone
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Telefone deve estar no formato: (00) 00000-0000');
      setShowError(true);
      return false;
    }

    // Validação específica de telefone 2 (opcional, mas se preenchido deve estar no formato correto)
    if (formData.phone2.trim() && !phoneRegex.test(formData.phone2)) {
      setError('Telefone 2 deve estar no formato: (00) 00000-0000');
      setShowError(true);
      return false;
    }

    // Validação específica de CEP
    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(formData.cep)) {
      setError('CEP deve estar no formato: 00000-000');
      setShowError(true);
      return false;
    }

    return true;
  };

  // Retorna o label amigável do campo
  const getFieldLabel = (field: string): string => {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      email: 'Email',
      birthDate: 'Data de Nascimento',
      cpf: 'CPF',
      phone: 'Telefone',
      phone2: 'Telefone 2',
      cep: 'CEP',
      street: 'Logradouro',
      streetNumber: 'Número',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      country: 'País'
    };
    return labels[field] || field;
  };

  // Função para salvar alterações do perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowError(false);
    setShowSuccess(false);

    // Verifica se usuário está logado
    if (!user || !user.id) {
      setError('Usuário não identificado. Faça login novamente.');
      setShowError(true);
      return;
    }

    // Valida formulário antes de prosseguir
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepara dados para atualização (apenas campos que podem ser editados)
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        // Nota: O backend atual suporta name, email, phone, role, document, companyId
        // Outros campos do formulário (endereço, CPF, etc.) precisariam ser adicionados ao backend
      };

      console.log('🔄 Enviando dados para atualização:', updateData);

      // Chama a API real para atualizar usuário
      const updatedUser = await updateUser(parseInt(user.id), updateData);

      console.log('✅ Usuário atualizado com sucesso:', updatedUser);

      // Cria dados completos do usuário mesclando dados do backend com dados do formulário
      const completeUserData = {
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: `https://via.placeholder.com/150/007bff/fff?text=${updatedUser.name.charAt(0).toUpperCase()}`,
        // Informações do formulário
        birthDate: formData.birthDate,
        cpf: formData.cpf,
        gender: formData.gender,
        phone: updatedUser.phone || formData.phone,
        phone2: formData.phone2,
        memberSince: user?.memberSince || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        // Informações de endereço do formulário
        cep: formData.cep,
        street: formData.street,
        streetNumber: formData.streetNumber,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        country: formData.country
      };

      // Atualiza o contexto com dados completos
      updateUserInContext(completeUserData);

      // Mostra mensagem de sucesso
      setShowSuccess(true);

      // Auto-hide da mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error);
      
      // Trata diferentes tipos de erro
      if (error.message.includes('não encontrado')) {
        setError('Usuário não encontrado. Faça login novamente.');
      } else if (error.message.includes('Dados inválidos')) {
        setError('Dados fornecidos são inválidos. Verifique as informações.');
      } else if (error.message.includes('Email já está em uso')) {
        setError('Este email já está sendo usado por outro usuário.');
      } else {
        setError(error.message || 'Erro ao atualizar perfil. Tente novamente.');
      }
      
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para voltar ao dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <>

      {/* Conteúdo principal do perfil */}
      <main className="profile-main">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>

              {/* Título da página */}
              <div className="profile-header">
                <h1>Meu Perfil</h1>
                <p className="lead">Atualize suas informações pessoais</p>
              </div>

              {/* Card do formulário */}
              <Card className="profile-card">
                <Card.Header>
                  <h5 className="mb-0">Dados Pessoais</h5>
                </Card.Header>
                <Card.Body>

                  {/* Alertas de feedback */}
                  {showSuccess && (
                    <Alert variant="success" className="mb-3">
                      ✅ Perfil atualizado com sucesso!
                    </Alert>
                  )}

                  {showError && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  {/* Formulário de perfil */}
                  <Form onSubmit={handleSubmit}>

                    {/* Primeira linha - Nome e Email */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Nome Completo <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Digite seu nome completo"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Email <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Segunda linha - Data de Nascimento e CPF */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Data de Nascimento <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.birthDate.split('/').reverse().join('-')} // Converte DD/MM/YYYY para YYYY-MM-DD
                            onChange={(e) => {
                              // Converte YYYY-MM-DD para DD/MM/YYYY
                              const [year, month, day] = e.target.value.split('-');
                              const formattedDate = `${day}/${month}/${year}`;
                              setFormData(prev => ({ ...prev, birthDate: formattedDate }));
                            }}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            CPF <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleInputChange('cpf')}
                            maxLength={14}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Terceira linha - Gênero e Telefone */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Gênero</Form.Label>
                          <Form.Select
                            value={formData.gender}
                            onChange={handleInputChange('gender')}
                            disabled={isLoading}
                          >
                            <option value="">Selecione...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                            <option value="Prefiro não informar">Prefiro não informar</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Telefone <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={handleInputChange('phone')}
                            maxLength={15}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Quarta linha - Telefone 2 */}
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Telefone 2</Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="(00) 00000-0000 (opcional)"
                            value={formData.phone2}
                            onChange={handleInputChange('phone2')}
                            maxLength={15}
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Seção de Endereço */}
                    <div className="profile-section-divider">
                      <h6 className="text-primary mb-3">Endereço</h6>
                    </div>

                    {/* Primeira linha de endereço - CEP e Logradouro */}
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            CEP <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="00000-000"
                            value={formData.cep}
                            onChange={handleInputChange('cep')}
                            maxLength={9}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label>
                            Logradouro <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Rua, Avenida, etc."
                            value={formData.street}
                            onChange={handleInputChange('street')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Segunda linha de endereço - Número e Complemento */}
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Número <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="123"
                            value={formData.streetNumber}
                            onChange={handleInputChange('streetNumber')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label>Complemento</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Apto, Bloco, Sala... (opcional)"
                            value={formData.complement}
                            onChange={handleInputChange('complement')}
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Terceira linha de endereço - Bairro e Cidade */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Bairro <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Centro, Vila..."
                            value={formData.neighborhood}
                            onChange={handleInputChange('neighborhood')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Cidade <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="São Paulo, Rio de Janeiro..."
                            value={formData.city}
                            onChange={handleInputChange('city')}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Quarta linha de endereço - País e UF */}
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            País <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={formData.country}
                            onChange={handleInputChange('country')}
                            required
                            disabled={isLoading}
                          >
                            <option value="">Selecione...</option>
                            <option value="Brasil">Brasil</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Chile">Chile</option>
                            <option value="Uruguai">Uruguai</option>
                            <option value="Paraguai">Paraguai</option>
                            <option value="Bolívia">Bolívia</option>
                            <option value="Peru">Peru</option>
                            <option value="Equador">Equador</option>
                            <option value="Colômbia">Colômbia</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Estados Unidos">Estados Unidos</option>
                            <option value="Canadá">Canadá</option>
                            <option value="México">México</option>
                            <option value="França">França</option>
                            <option value="Espanha">Espanha</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Itália">Itália</option>
                            <option value="Reino Unido">Reino Unido</option>
                            <option value="Alemanha">Alemanha</option>
                            <option value="Holanda">Holanda</option>
                            <option value="Suíça">Suíça</option>
                            <option value="Áustria">Áustria</option>
                            <option value="Bélgica">Bélgica</option>
                            <option value="Dinamarca">Dinamarca</option>
                            <option value="Suécia">Suécia</option>
                            <option value="Noruega">Noruega</option>
                            <option value="Finlândia">Finlândia</option>
                            <option value="Japão">Japão</option>
                            <option value="China">China</option>
                            <option value="Coreia do Sul">Coreia do Sul</option>
                            <option value="Austrália">Austrália</option>
                            <option value="Nova Zelândia">Nova Zelândia</option>
                            <option value="África do Sul">África do Sul</option>
                            <option value="Outros">Outros</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            UF <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={formData.state}
                            onChange={handleInputChange('state')}
                            required
                            disabled={isLoading}
                          >
                            <option value="">Selecione...</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Nota sobre campos obrigatórios */}
                    <div className="profile-required-note mb-4">
                      <small className="text-muted">
                        <span className="text-danger">*</span> Campos obrigatórios
                      </small>
                    </div>

                    {/* Botões de ação */}
                    <div className="profile-actions d-flex justify-content-between">
                      <Button
                        variant="outline-secondary"
                        onClick={handleBackToDashboard}
                        disabled={isLoading}
                        className="profile-back-button"
                      >
                        ← Voltar ao Dashboard
                      </Button>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="profile-save-button btn-standard"
                      >
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </div>

                  </Form>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </main>


    </>
  );
};

export default Profile;
