// Importações necessárias
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NovaSenhaForm from './components/NovaSenhaForm/NovaSenhaForm';
import { resetPassword } from '../../services/UserService';
import './styles.css';

// Interface para os dados da nova senha
interface NovaSenhaData {
  password: string;
  confirmPassword: string;
}

// Interface para as mensagens
interface Message {
  type: 'success' | 'error';
  text: string;
}

// Componente NovaSenha - Página para definir nova senha
const NovaSenha = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  
  // Obter o token da URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  useEffect(() => {
    console.log('URL completa:', window.location.href);
    console.log('Parâmetros de query:', location.search);
    console.log('Token extraído:', token);
    
    // Verifica se o token está presente
    if (!token) {
      setIsValidToken(false);
      setMessage({
        type: 'error',
        text: 'Link inválido ou expirado. O token de recuperação não foi encontrado.'
      });
    } else {
      // Se o token existe, consideramos inicialmente como válido
      // (a validação real ocorrerá quando tentar usar o token)
      setIsValidToken(true);
    }
  }, [token]);
  
  // Função que será executada quando o usuário submeter o formulário
  const handleNovaSenha = async (data: NovaSenhaData) => {
    try {
      if (!token) {
        setMessage({
          type: 'error',
          text: 'Token de recuperação ausente.'
        });
        return;
      }
      
      // Verifica se as senhas coincidem
      if (data.password !== data.confirmPassword) {
        setMessage({
          type: 'error',
          text: 'As senhas não coincidem.'
        });
        return;
      }
      
      // Email não é usado na requisição, então podemos deixar em branco ou usar um placeholder
      const success = await resetPassword('', data.password, token);
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'Senha redefinida com sucesso!'
        });
        
        // Redirecionar após alguns segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: 'Não foi possível redefinir sua senha. O link pode ter expirado.'
        });
        setIsValidToken(false);
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro ao processar sua solicitação.'
      });
    }
  };
  
  // Renderizar mensagem de erro se o token for inválido
  if (isValidToken === false) {
    return (
      <div className="nova-senha-invalid-container">
        <div className="nova-senha-invalid-card">
          <h2 className="nova-senha-invalid-title">Link Inválido</h2>
          <p className="nova-senha-invalid-message">
            O link de recuperação de senha é inválido ou expirou.
          </p>
          <p className="nova-senha-invalid-message">
            Para redefinir sua senha, você precisa solicitar um novo link de recuperação.
          </p>
          <div className="nova-senha-invalid-actions">
            <button 
              className="nova-senha-btn-primary"
              onClick={() => navigate('/recuperar-senha')}
            >
              Solicitar Novo Link
            </button>
          </div>
          <div className="mt-3 text-center">
            <a href="/login" className="nova-senha-back-link">
              Voltar para o Login
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="nova-senha-main">
      {/* Formulário para definir nova senha */}
      <NovaSenhaForm onSubmit={handleNovaSenha} />
      
      {/* Exibir mensagem de sucesso ou erro */}
      {message && (
        <div className={`nova-senha-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </main>
  );
};

export default NovaSenha;
