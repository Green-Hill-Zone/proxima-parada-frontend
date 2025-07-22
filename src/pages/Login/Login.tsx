import { Header } from '../../components';
import { LoginForm, type LoginFormData } from './components';

const Login = () => {
  const handleLogin = (data: LoginFormData) => {
    console.log('Login attempt:', data);
    // Aqui você pode implementar a lógica de autenticação
  };

  return (
    <>
      <Header />
      <main>
        <LoginForm onSubmit={handleLogin} />
      </main>
    </>
  );
};

export default Login;
