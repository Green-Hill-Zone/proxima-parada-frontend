import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Lógica padrão
      console.log('Login attempt:', formData);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h3 className="text-primary">Fazer Login</h3>
                <p className="text-muted">Entre em sua conta</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Entrar
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted">
                  Não tem uma conta? 
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

export default LoginForm;
export type { LoginFormData };
