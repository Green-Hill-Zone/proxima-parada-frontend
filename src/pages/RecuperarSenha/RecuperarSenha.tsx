// Importações necessárias
import { useState } from 'react';
import { RecuperarSenhaForm } from './components';
import './styles.css';

// Componente RecuperarSenha - Página principal de recuperação de senha
const RecuperarSenha = () => {
  // Estado para controlar se o email foi enviado
  const [emailEnviado, setEmailEnviado] = useState<string | null>(null);

  // Função que será executada quando o usuário submeter o formulário de recuperação
  const handleRecuperarSenha = (email: string) => {
    console.log('Solicitação de recuperação de senha para:', email);
    setEmailEnviado(email);
  };

  return (
    <>
      {/* Conteúdo principal da página */}
      <main>
        {/* Formulário de recuperação de senha com função de callback */}
        <RecuperarSenhaForm onSubmit={handleRecuperarSenha} />
        
        {/* Conteúdo condicional que pode ser exibido após o envio (opcional) */}
        {emailEnviado && (
          <div className="email-enviado-info d-none">
            Email de recuperação enviado para: {emailEnviado}
          </div>
        )}
      </main>
    </>
  );
};

export default RecuperarSenha;
