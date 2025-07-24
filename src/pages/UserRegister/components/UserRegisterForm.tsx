import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface UserRegisterFormData {
  email: string;
  phone: string;
  document: string;
  password: string;
  confirmPassword: string;
}

interface UserRegisterFormProps {
  onSubmit?: (data: UserRegisterFormData) => void;
}

const UserRegisterForm = ({ onSubmit }: UserRegisterFormProps) => {
  const [formData, setFormData] = useState<UserRegisterFormData>({
    email: '',
    phone: '',
    document: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Função para aplicar máscara no CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  // Função para aplicar máscara no telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
    return value;
  };

  // Função para validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof UserRegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const newErrors = { ...errors };

    // Aplicar máscaras e validações específicas
    if (field === 'document') {
      value = formatCPF(value);
      // Validar CPF (deve ter exatamente 11 números)
      const numbers = value.replace(/\D/g, '');
      if (numbers.length > 0 && numbers.length !== 11) {
        newErrors[field] = 'CPF deve ter 11 dígitos';
      } else {
        delete newErrors[field];
      }
    } else if (field === 'phone') {
      value = formatPhone(value);
      // Validar telefone (deve ter exatamente 11 números)
      const numbers = value.replace(/\D/g, '');
      if (numbers.length > 0 && numbers.length !== 11) {
        newErrors[field] = 'Telefone deve ter 11 dígitos';
      } else {
        delete newErrors[field];
      }
    } else if (field === 'email') {
      // Validar email
      if (value && !validateEmail(value)) {
        newErrors[field] = 'Digite um email válido';
      } else {
        delete newErrors[field];
      }
    }
    else if(field === 'password'){
       if(value && value !== formData.confirmPassword){
        newErrors[field] = 'As senhas não coincidem';
       }
       else {
        delete newErrors[field];
      }
    } else if (field === 'confirmPassword') {
      // Validar confirmação de senha
      if (value && value !== formData.password) {
        newErrors[field] = 'As senhas não coincidem';
      } else {
        delete newErrors[field];
      }
    }

    setErrors(newErrors);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações finais
    const newErrors: {[key: string]: string} = {};
    
    // Validar email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }
    
    // Validar CPF
    const cpfNumbers = formData.document.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      newErrors.document = 'CPF deve ter 11 dígitos';
    }
    
    // Validar telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length !== 11) {
      newErrors.phone = 'Telefone deve ter 11 dígitos';
    }
    
    // Validação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Lógica padrão
      console.log('Registration attempt:', formData);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body className="p-3">
              <div className="text-center mb-2">
                <h3 className="text-primary">Criar Conta</h3>
                <p className="text-muted">Preencha os dados para se cadastrar</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    isInvalid={!!errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="(11) 12345-6789"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    isInvalid={!!errors.phone}
                    maxLength={15}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Documento (CPF)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123.456.789-01"
                    value={formData.document}
                    onChange={handleInputChange('document')}
                    isInvalid={!!errors.document}
                    maxLength={14}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.document}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    isInvalid={!!errors.confirmPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Cadastrar
                </Button>
              </Form>

              <div className="text-center">
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
    </Container>
  );
};

export default UserRegisterForm;
export type { UserRegisterFormData };

