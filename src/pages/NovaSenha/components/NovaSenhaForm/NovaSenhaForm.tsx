// Importações necessárias do React e React Bootstrap
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// Importação dos estilos específicos do NovaSenhaForm
import './NovaSenhaForm.css';

// Interface para as propriedades do componente
interface NovaSenhaFormProps {
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  message: { type: 'success' | 'error', text: string } | null;
}

// Componente NovaSenhaForm - Formulário para definir nova senha
const NovaSenhaForm = ({ onSubmit, message }: NovaSenhaFormProps) => {
  // Estados para os campos do formulário
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para validação
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'good' | 'strong' | ''>('');
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  // Critérios de senha
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,        // Pelo menos 8 caracteres
    lowercase: false,     // Pelo menos 1 letra minúscula
    uppercase: false,     // Pelo menos 1 letra maiúscula
    number: false,        // Pelo menos 1 número
    specialChar: false    // Pelo menos 1 caractere especial
  });

  // Efeito para validar a senha sempre que ela mudar
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // Função para validar a senha
  const validatePassword = (pass: string) => {
    const criteria = {
      length: pass.length >= 8,
      lowercase: /[a-z]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)
    };
    
    setPasswordCriteria(criteria);
    
    // Calcular força da senha
    const criteriaCount = Object.values(criteria).filter(Boolean).length;
    
    if (criteriaCount <= 2) {
      setPasswordStrength('weak');
    } else if (criteriaCount === 3) {
      setPasswordStrength('medium');
    } else if (criteriaCount === 4) {
      setPasswordStrength('good');
    } else if (criteriaCount === 5) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('');
    }
  };

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para alternar visibilidade da confirmação de senha
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Função para validar o formulário
  const validateForm = () => {
    let isValid = true;
    const errors = {
      password: '',
      confirmPassword: ''
    };

    // Validar senha
    if (!password) {
      errors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (passwordStrength === 'weak') {
      errors.password = 'A senha é muito fraca. Atenda a pelo menos 3 critérios.';
      isValid = false;
    }

    // Validar confirmação de senha
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha.';
      isValid = false;
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'As senhas não coincidem.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Função executada quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSubmit({ password, confirmPassword });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="nova-senha-form-container">
      <Row className="nova-senha-form-row">
        <Col md={6} lg={4} className="nova-senha-form-col">
          <Card className="nova-senha-form-card">
            <Card.Body className="nova-senha-form-card-body">
              {/* Cabeçalho do formulário */}
              <div className="nova-senha-form-header">
                <h3 className="nova-senha-form-title">Definir Nova Senha</h3>
                <p className="nova-senha-form-subtitle">
                  Crie uma senha forte para sua conta
                </p>
              </div>
              
              {/* Mensagem de sucesso ou erro */}
              {message && (
                <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="mb-3">
                  {message.text}
                </Alert>
              )}
              
              {/* Formulário de definição de nova senha */}
              <Form onSubmit={handleSubmit}>
                {/* Campo de senha */}
                <Form.Group className="nova-senha-form-group">
                  <Form.Label>Nova Senha</Form.Label>
                  <div className="password-field-container">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!validationErrors.password}
                      disabled={isLoading}
                    />
                    <Button 
                      className="password-toggle-btn" 
                      onClick={togglePasswordVisibility} 
                      tabIndex={-1}
                      type="button"
                    >
                      {showPassword ? "🔒" : "👁️"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </div>

                  {/* Indicador de força da senha */}
                  {password && (
                    <>
                      <div className="password-strength-meter">
                        <div className={`strength-${passwordStrength}`}></div>
                      </div>
                      <div className={`password-strength-text text-${passwordStrength}`}>
                        {passwordStrength === 'weak' && 'Fraca'}
                        {passwordStrength === 'medium' && 'Média'}
                        {passwordStrength === 'good' && 'Boa'}
                        {passwordStrength === 'strong' && 'Forte'}
                      </div>
                    </>
                  )}

                  {/* Critérios de senha */}
                  <div className="password-criteria">
                    <div className={`criteria-item ${passwordCriteria.length ? 'criteria-met' : 'criteria-not-met'}`}>
                      <span className="criteria-icon">{passwordCriteria.length ? '✓' : '○'}</span>
                      <span>Pelo menos 8 caracteres</span>
                    </div>
                    <div className={`criteria-item ${passwordCriteria.lowercase ? 'criteria-met' : 'criteria-not-met'}`}>
                      <span className="criteria-icon">{passwordCriteria.lowercase ? '✓' : '○'}</span>
                      <span>Pelo menos 1 letra minúscula</span>
                    </div>
                    <div className={`criteria-item ${passwordCriteria.uppercase ? 'criteria-met' : 'criteria-not-met'}`}>
                      <span className="criteria-icon">{passwordCriteria.uppercase ? '✓' : '○'}</span>
                      <span>Pelo menos 1 letra maiúscula</span>
                    </div>
                    <div className={`criteria-item ${passwordCriteria.number ? 'criteria-met' : 'criteria-not-met'}`}>
                      <span className="criteria-icon">{passwordCriteria.number ? '✓' : '○'}</span>
                      <span>Pelo menos 1 número</span>
                    </div>
                    <div className={`criteria-item ${passwordCriteria.specialChar ? 'criteria-met' : 'criteria-not-met'}`}>
                      <span className="criteria-icon">{passwordCriteria.specialChar ? '✓' : '○'}</span>
                      <span>Pelo menos 1 caractere especial</span>
                    </div>
                  </div>
                </Form.Group>

                {/* Campo de confirmação de senha */}
                <Form.Group className="nova-senha-form-group">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <div className="password-field-container">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!validationErrors.confirmPassword}
                      disabled={isLoading}
                    />
                    <Button 
                      className="password-toggle-btn" 
                      onClick={toggleConfirmPasswordVisibility} 
                      tabIndex={-1}
                      type="button"
                    >
                      {showConfirmPassword ? "🔒" : "👁️"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.confirmPassword}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                {/* Botão de envio */}
                <Button 
                  variant="primary"
                  type="submit"
                  className="nova-senha-form-btn-primary"
                  disabled={isLoading}
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
                    "Definir Nova Senha"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Exporta o componente como padrão
export default NovaSenhaForm;
