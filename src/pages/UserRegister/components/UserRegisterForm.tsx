import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FormField from '../../../components/FormField';
import type { UserRegisterFormData } from '../../../hooks/useUserRegistration';
import { useUserRegistration } from '../../../hooks/useUserRegistration';
import { createUser } from '../../../services/UserService';
import { FIELD_LIMITS } from '../../../utils/validationConstants';
interface UserRegisterFormProps {
  onSubmit?: (data: UserRegisterFormData) => void;
}

const UserRegisterForm = ({ onSubmit }: UserRegisterFormProps) => {
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
      // Use a função register do serviço atualizado
      const user = await createUser(formData);

      if (onSubmit) {
        onSubmit(formData);
      }

      console.log('User registered successfully:', user);

      // Opcional: adicionar notificação de sucesso ou redirecionamento
      // Ex: toast.success('Cadastro realizado com sucesso!');
      // Ex: navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);

      // Opcional: adicionar notificação de erro
      // Ex: toast.error('Erro ao realizar cadastro. Tente novamente.');
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
                <FormField
                  label="Nome Completo"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={errors.name}
                />
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

