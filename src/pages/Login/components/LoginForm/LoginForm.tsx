// Importações necessárias do React e React Bootstrap
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Importação das imagens dos logos para login social
import googleLogo from '../../../../assets/google.png';
import facebookLogo from '../../../../assets/facebook.png';
// Importação dos estilos específicos do LoginForm
import './LoginForm.css';
// Importação do hook de autenticação
import { useAuth } from '../../../../hooks/useAuth';

// Interface TypeScript que define a estrutura dos dados do formulário
interface LoginFormData {
  email: string;    // Email do usuário
  password: string; // Senha do usuário
}

// Interface TypeScript que define as propriedades que o componente recebe
interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void; // Função opcional executada ao enviar o formulário
}

// Componente LoginForm - Formulário de autenticação
const LoginForm = ({ onSubmit }: LoginFormProps) => {
  // Hooks de autenticação e navegação
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Estado do React para armazenar os dados do formulário
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',    // Valor inicial vazio para email
    password: ''  // Valor inicial vazio para senha
  });

  // Estado para mensagens de erro
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  // Função que atualiza os campos do formulário quando o usuário digita
  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,                    // Mantém os valores anteriores
      [field]: e.target.value     // Atualiza apenas o campo específico
    }));
  };

  // Função executada quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar página)
    setError(''); // Limpa erros anteriores
    setShowError(false);

    try {
      // Tenta fazer login com as credenciais fornecidas
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Login bem-sucedido - executa callback se fornecido
        if (onSubmit) {
          onSubmit(formData);
        }
        // Redireciona para o dashboard
        navigate('/dashboard');
      } else {
        // Login falhou - mostra mensagem de erro
        setError('Email ou senha incorretos. Tente novamente.');
        setShowError(true);
      }
    } catch (error) {
      // Erro inesperado durante o login
      console.error('Erro durante o login:', error);
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setShowError(true);
    }
  };

  return (
    // Container principal centralizado vertical e horizontalmente
    <Container className="login-form-container">
      <Row className="login-form-row">
        {/* Coluna responsiva: md=6 (metade em tablets), lg=4 (1/3 em desktops), centralizada */}
        <Col md={6} lg={4} className="login-form-col">
          {/* Cartão com sombra para o formulário */}
          <Card className="login-form-card">
            <Card.Body className="login-form-card-body">
              {/* Cabeçalho do formulário */}
              <div className="login-form-header">
                <h3 className="login-form-title">Login</h3>          {/* Título em azul */}
                <p className="login-form-subtitle">Preencha seus dados</p>   {/* Subtítulo em cinza */}
              </div>
              
              {/* Formulário de login */}
              <Form onSubmit={handleSubmit}>
                {/* Alerta de erro */}
                {showError && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {/* Campo de email */}
                <Form.Group className="login-form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"                                    // Tipo email para validação automática
                    placeholder="Digite seu email"                 // Texto de exemplo
                    value={formData.email}                         // Valor controlado pelo estado
                    onChange={handleInputChange('email')}          // Função para atualizar o estado
                    required                                        // Campo obrigatório
                    disabled={isLoading}                           // Desabilita durante carregamento
                  />
                </Form.Group>

                {/* Campo de senha */}
                <Form.Group className="login-form-group">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"                                 // Tipo password para mascarar a entrada
                    placeholder="Digite sua senha"                 // Texto de exemplo
                    value={formData.password}                      // Valor controlado pelo estado
                    onChange={handleInputChange('password')}       // Função para atualizar o estado
                    required                                        // Campo obrigatório
                    disabled={isLoading}                           // Desabilita durante carregamento
                  />
                </Form.Group>

                {/* Botão principal de login */}
                <Button 
                  variant="primary"                                             // Estilo azul do Bootstrap
                  type="submit"                                                 // Tipo submit para enviar o formulário
                  className="login-form-btn-primary"                           // Classe CSS personalizada
                  disabled={isLoading}                                         // Desabilita durante carregamento
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
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {/* Container para botões de login social */}
                <div className="login-form-social">
                  {/* Botão de login com Google */}
                  <Button 
                    variant="outline-secondary"                                 // Estilo com borda cinza
                    className="login-form-social-btn"                          // Classe CSS personalizada
                    onClick={() => console.log('Login com Google')}             // Função executada no clique
                  >
                    <img 
                      src={googleLogo}                  // Caminho da imagem do Google
                      alt="Google"                      // Texto alternativo
                      className="login-form-social-logo" // Classe CSS personalizada para o logo
                    />
                    Entrar com Google
                  </Button>
                  
                  {/* Botão de login com Facebook */}
                  <Button 
                    variant="outline-primary"                                   // Estilo com borda azul
                    className="login-form-social-btn"                          // Classe CSS personalizada
                    onClick={() => console.log('Login com Facebook')}           // Função executada no clique
                  >
                    <img 
                      src={facebookLogo}                // Caminho da imagem do Facebook
                      alt="Facebook"                    // Texto alternativo
                      className="login-form-social-logo" // Classe CSS personalizada para o logo
                    />
                    Entrar com Facebook
                  </Button>
                </div>
              </Form>

              {/* Seção para cadastro de novos usuários */}
              <div className="login-form-signup">
                <p className="login-form-signup-text">
                  Não tem uma conta?{' '}
                  {/* Botão estilizado como link para cadastro */}
                  <Button 
                    variant="link" 
                    className="login-form-signup-link"
                    onClick={() => navigate('/register')}
                  >
                    Cadastre-se
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
export default LoginForm;
// Exporta a interface TypeScript para uso em outros arquivos
export type { LoginFormData };
