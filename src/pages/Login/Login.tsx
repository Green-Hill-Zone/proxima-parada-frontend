import { LoginForm, type LoginFormData } from './components';
const Login = () => {
  const handleLogin = (data: LoginFormData) => {
    console.log('Login attempt:', data);
    // Aqui você pode implementar a lógica de autenticação
  };

  return (
    <>
      <main>
        <LoginForm onSubmit={handleLogin} />
      </main>
    </>
  );
};

export default Login;
