// Importações necessárias do React e React Bootstrap
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Importação dos estilos específicos do RecuperarSenhaForm
import './RecuperarSenhaForm.css';
// Importação do serviço de usuário
import { requestPasswordReset } from '../../../../services/UserService';

// Interface TypeScript que define as propriedades que o componente recebe
interface RecuperarSenhaFormProps {
  onSubmit?: (email: string) => void; // Função opcional executada ao enviar o formulário
}

// Componente RecuperarSenhaForm - Formulário de recuperação de senha
const RecuperarSenhaForm = ({ onSubmit }: RecuperarSenhaFormProps) => {
  // Hook de navegação
  const navigate = useNavigate();
  
  // Estado do React para armazenar o email
  const [email, setEmail] = useState<string>('');
  
  // Estados para controlar o carregamento e mensagens
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Função que atualiza o campo de email quando o usuário digita
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Função executada quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar página)
    
    // Limpa mensagens anteriores
    setError('');
    setSuccess('');
    setShowError(false);
    setShowSuccess(false);
    
    // Validação básica do email
    if (!email || !email.includes('@')) {
      setError('Por favor, informe um email válido.');
      setShowError(true);
      return;
    }

    setIsLoading(true);

    try {
      // Chamada ao backend para verificar o email e enviar o link de recuperação
      const result = await requestPasswordReset(email);
      
      if (result) {
        // Solicitação bem-sucedida
        setSuccess('Um link para recuperação de senha foi enviado para o seu email.');
        setShowSuccess(true);
        
        // Mensagem informativa sobre o que o usuário deve fazer a seguir
        setTimeout(() => {
          setSuccess('Verifique sua caixa de entrada e siga as instruções enviadas por email para redefinir sua senha.');
        }, 3000);
        
        // Chama a função de callback se fornecida
        if (onSubmit) {
          onSubmit(email);
        }
      } else {
        // Solicitação falhou
        setError('Não foi possível processar sua solicitação. Verifique se o email está correto ou tente novamente mais tarde.');
        setShowError(true);
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container principal centralizado vertical e horizontalmente
    <Container className="recuperar-senha-form-container">
      <Row className="recuperar-senha-form-row">
        {/* Coluna responsiva: md=6 (metade em tablets), lg=4 (1/3 em desktops), centralizada */}
        <Col md={6} lg={4} className="recuperar-senha-form-col">
          {/* Cartão com sombra para o formulário */}
          <Card className="recuperar-senha-form-card">
            <Card.Body className="recuperar-senha-form-card-body">
              {/* Cabeçalho do formulário */}
              <div className="recuperar-senha-form-header">
                <h3 className="recuperar-senha-form-title">Recuperar Senha</h3>
                <p className="recuperar-senha-form-subtitle">
                  Informe seu email para recuperar sua senha
                </p>
              </div>
              
              {/* Formulário de recuperação de senha */}
              <Form onSubmit={handleSubmit}>
                {/* Alerta de erro */}
                {showError && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                
                {/* Alerta de sucesso */}
                {showSuccess && (
                  <Alert variant="success" className="mb-3">
                    {success}
                  </Alert>
                )}

                {/* Campo de email */}
                <Form.Group className="recuperar-senha-form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email cadastrado"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    disabled={isLoading || showSuccess}
                  />
                  <Form.Text className="text-muted">
                    Enviaremos um link para recuperação de senha para este email.
                  </Form.Text>
                </Form.Group>

                {/* Botão principal de recuperação */}
                <Button 
                  variant="primary"
                  type="submit"
                  className="recuperar-senha-form-btn-primary"
                  disabled={isLoading || showSuccess}
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
                      Verificando...
                    </>
                  ) : showSuccess ? (
                    "Email Enviado"
                  ) : (
                    "Recuperar Senha"
                  )}
                </Button>
              </Form>

              {/* Link para retornar à página de login */}
              <div className="recuperar-senha-form-back">
                <p className="recuperar-senha-form-back-text">
                  Lembrou sua senha?{' '}
                  {/* Botão estilizado como link para voltar ao login */}
                  <Button 
                    variant="link" 
                    className="recuperar-senha-form-back-link"
                    onClick={() => navigate('/login')}
                  >
                    Voltar para o Login
                  </Button>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Exporta o componente como padrão
export default RecuperarSenhaForm;
