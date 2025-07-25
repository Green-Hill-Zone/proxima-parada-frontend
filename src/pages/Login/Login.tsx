// Importações dos componentes necessários
import { Header, Footer } from '../../components';              // Componentes de layout
import { LoginForm, type LoginFormData } from './components';   // Componente e tipo do formulário
import './styles.css'; // Importa os estilos específicos da página Login

// Componente Login - Página principal de autenticação
const Login = () => {
  // Função que será executada quando o usuário submeter o formulário
  const handleLogin = (data: LoginFormData) => {
    console.log('Tentativa de login:', data);
    // Aqui você pode implementar a lógica de autenticação
    // Exemplo: chamar API, validar credenciais, redirecionar usuário
  };

  return (
    <>
      {/* Cabeçalho da aplicação */}
      <Header />
      {/* Conteúdo principal da página */}
      <main>
        {/* Formulário de login com função de callback */}
        <LoginForm onSubmit={handleLogin} />
      </main>
      {/* Rodapé da aplicação */}
      <Footer />
    </>
  );
};

export default Login;
