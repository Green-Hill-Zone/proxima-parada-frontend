import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../../../components/FormField";
import type { UserRegisterFormData } from "../../../hooks/useUserRegistration";
import { useUserRegistration } from "../../../hooks/useUserRegistration";
import { createUser } from "../../../services/UserService";
import { FIELD_LIMITS } from "../../../utils/validationConstants";
interface UserRegisterFormProps {
  onSubmit?: (data: UserRegisterFormData) => void;
}

const UserRegisterForm = ({ onSubmit }: UserRegisterFormProps) => {
  const { formData, errors, handleInputChange, validateAllFields } =
    useUserRegistration();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    try {
      setErrorMessage("");
      const user = await createUser(formData);
      if (onSubmit) {
        onSubmit(formData);
      }
      setSuccessMessage("Cadastro concluído com sucesso!");
      console.log("User registered successfully:", user);
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error: any) {
      console.error("Registration error:", error);

      const backendMsg = error?.response?.data?.message || error?.message || "";
      const status = error?.response?.status;

      console.log("Status:", status);
      console.log("Backend message:", backendMsg);

      if (
        status === 409 ||
        status === 400 ||
        (backendMsg.toLowerCase().includes("cpf") &&
          backendMsg.toLowerCase().includes("exist")) ||
        (backendMsg.toLowerCase().includes("email") &&
          backendMsg.toLowerCase().includes("exist")) ||
        backendMsg.toLowerCase().includes("usuário já cadastrado") ||
        backendMsg.toLowerCase().includes("already exists")
      ) {
        setErrorMessage("Usuário já cadastrado.");
      } else {
        setErrorMessage("Erro inesperado.");
      }
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body className="p-3">
              <div className="text-center mb-2">
                <h3 className="text-primary">Criar Conta</h3>
                <p className="text-muted">
                  Preencha os dados para se cadastrar
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <FormField
                  label="Nome Completo"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={errors.name}
                />
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={errors.email}
                />

                <FormField
                  label="Telefone"
                  type="tel"
                  placeholder="(11) 12345-6789"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  error={errors.phone}
                  maxLength={FIELD_LIMITS.PHONE_MAX_LENGTH}
                />

                <FormField
                  label="Documento (CPF)"
                  type="text"
                  placeholder="123.456.789-01"
                  value={formData.document}
                  onChange={handleInputChange("document")}
                  error={errors.document}
                  maxLength={FIELD_LIMITS.CPF_MAX_LENGTH}
                />

                <FormField
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={errors.password}
                />

                <FormField
                  label="Confirmar Senha"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  error={errors.confirmPassword}
                />

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Cadastrar
                </Button>
                {errorMessage && (
                  <div className="alert alert-danger text-center py-2 mb-2">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success text-center py-2 mb-2">
                    {successMessage}
                  </div>
                )}
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
