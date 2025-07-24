// Importações necessárias do React e React Bootstrap
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// Importação das imagens dos logos para login social
import googleLogo from '../../../../assets/google.png';
import facebookLogo from '../../../../assets/facebook.png';

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
  // Estado do React para armazenar os dados do formulário
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',    // Valor inicial vazio para email
    password: ''  // Valor inicial vazio para senha
  });

  // Função que atualiza os campos do formulário quando o usuário digita
  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,                    // Mantém os valores anteriores
      [field]: e.target.value     // Atualiza apenas o campo específico
    }));
  };

  // Função executada quando o formulário é enviado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar página)
    if (onSubmit) {
      onSubmit(formData); // Executa a função passada como prop
    } else {
      // Lógica padrão caso nenhuma função seja fornecida
      console.log('Tentativa de login:', formData);
    }
  };

  return (
    // Container principal centralizado vertical e horizontalmente
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        {/* Coluna responsiva: md=6 (metade em tablets), lg=4 (1/3 em desktops), centralizada */}
        <Col md={6} lg={4} className="mx-auto">
          {/* Cartão com sombra para o formulário */}
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              {/* Cabeçalho do formulário */}
              <div className="text-center mb-4">
                <h3 className="text-primary">Fazer Login</h3>          {/* Título em azul */}
                <p className="text-muted">Entre em sua conta</p>        {/* Subtítulo em cinza */}
              </div>
              
              {/* Formulário de login */}
              <Form onSubmit={handleSubmit}>
                {/* Campo de email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"                                    // Tipo email para validação automática
                    placeholder="Digite seu email"                 // Texto de exemplo
                    value={formData.email}                         // Valor controlado pelo estado
                    onChange={handleInputChange('email')}          // Função para atualizar o estado
                    required                                        // Campo obrigatório
                  />
                </Form.Group>

                {/* Campo de senha */}
                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"                                 // Tipo password para mascarar a entrada
                    placeholder="Digite sua senha"                 // Texto de exemplo
                    value={formData.password}                      // Valor controlado pelo estado
                    onChange={handleInputChange('password')}       // Função para atualizar o estado
                    required                                        // Campo obrigatório
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  style={{ backgroundColor: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}
                >
                  Entrar
                </Button>

                <div className="d-grid gap-2 mb-3">
                  <Button 
                    variant="outline-secondary" 
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => console.log('Login com Google')}
                  >
                    <img 
                      src={googleLogo} 
                      alt="Google" 
                      width="20" 
                      height="20" 
                      className="me-2"
                    />
                    Entrar com Google
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => console.log('Login com Facebook')}
                  >
                    <img 
                      src={facebookLogo} 
                      alt="Facebook" 
                      width="20" 
                      height="20" 
                      className="me-2"
                    />
                    Entrar com Facebook
                  </Button>
                </div>
              </Form>

              {/* Seção para cadastro de novos usuários */}
              <div className="text-center">
                <p className="text-muted">
                  Não tem uma conta?{' '}
                  {/* Botão estilizado como link para cadastro */}
                  <Button variant="link" className="p-0 ms-1">
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
