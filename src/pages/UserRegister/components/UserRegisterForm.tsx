import { Button, Card, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import FormField from '../../../components/FormField';
import type { UserRegisterFormData } from '../../../hooks/useUserRegistration';
import { useUserRegistration } from '../../../hooks/useUserRegistration';
import { createUser } from '../../../services/UserService';
import { FIELD_LIMITS } from '../../../utils/validationConstants';
import '../UserRegister.css';
interface UserRegisterFormProps {
  onSubmit?: (data: UserRegisterFormData) => void;
}

const UserRegisterForm = ({ onSubmit }: UserRegisterFormProps) => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formData,
    errors,
    handleInputChange,
    validateAllFields,
  } = useUserRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Criar objeto compatível com CreateUserRequest
      const createUserData = {
        name: formData.email.split('@')[0], // Usar parte do email como nome temporário
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        document: formData.document,
        role: 'client' // Definir role padrão
      };
      
      // Use a função register do serviço atualizado
      const user = await createUser(createUserData);

      if (onSubmit) {
        onSubmit(formData);
      }

      console.log('User registered successfully:', user);

      // Mostra o modal de sucesso
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Registration error:', error);

      // Opcional: adicionar notificação de erro
      // Ex: toast.error('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fechar o modal e redirecionar para login
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <Container className="user-register-container">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
          <Card className="user-register-card">
            <Card.Body>
              <div className="user-register-header text-center mb-2">
                <h3 className="text-primary">Criar Conta</h3>
                <p className="text-muted">Preencha os dados para se cadastrar</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={errors.email}
                />

                <FormField
                  label="Telefone"
                  type="tel"
                  placeholder="(11) 12345-6789"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  error={errors.phone}
                  maxLength={FIELD_LIMITS.PHONE_MAX_LENGTH}
                />

                <FormField
                  label="Documento (CPF)"
                  type="text"
                  placeholder="123.456.789-01"
                  value={formData.document}
                  onChange={handleInputChange('document')}
                  error={errors.document}
                  maxLength={FIELD_LIMITS.CPF_MAX_LENGTH}
                />

                <FormField
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                />

                <FormField
                  label="Confirmar Senha"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                />

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="user-register-btn w-100 mb-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </Form>

              <div className="user-register-footer text-center">
                <p className="text-muted">
                  Já tem uma conta?
                  <Link to="/login" className="text-decoration-none ms-1">
                    Fazer login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Sucesso */}
      <Modal 
        show={showSuccessModal} 
        onHide={handleCloseSuccessModal}
        centered
        backdrop="static"
        keyboard={false}
        className="user-register-success-modal"
      >
        <Modal.Header>
          <Modal.Title className="text-success">
            <FaCheckCircle className="success-icon" /> Conta Criada com Sucesso!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <div className="success-icon" style={{ fontSize: '4rem' }}>🎉</div>
            </div>
            <p className="mb-3">
              Sua conta foi criada com sucesso! Agora você pode fazer login e começar a explorar nossos destinos incríveis.
            </p>
            <p className="text-muted">
              Você será redirecionado para a página de login.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="primary" 
            onClick={handleCloseSuccessModal}
            size="lg"
            className="user-register-btn"
          >
            Ir para Login
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserRegisterForm;

