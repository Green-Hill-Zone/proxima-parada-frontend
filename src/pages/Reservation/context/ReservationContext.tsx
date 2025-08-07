import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeReservation, type ReservationData } from '../../../services/ReservationService';

interface ReservationContextType {
  reservationData: ReservationData | null;
  setReservationData: (data: ReservationData | null) => void;
  isLoading: boolean;
  error: string | null;
  loadReservation: (travelPackageId: number) => Promise<void>;
}

export const ReservationContext = createContext<ReservationContextType>({
  reservationData: null,
  setReservationData: () => {},
  isLoading: false,
  error: null,
  loadReservation: async () => {},
});

export const useReservation = () => useContext(ReservationContext);

interface Props {
  children: ReactNode;
}

export const ReservationProvider = ({ children }: Props) => {
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const loadReservation = async (travelPackageId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🎫 Carregando reserva para pacote ${travelPackageId}...`);
      const data = await initializeReservation(travelPackageId);
      
      if (data) {
        setReservationData(data);
        console.log('✅ Reserva carregada com sucesso');
      } else {
        setError('Erro ao carregar dados da reserva');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar reserva:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Detectar ID do pacote da URL ou estado de navegação
  useEffect(() => {
    // Primeiro, tentar pegar do estado de navegação (quando vem de um clique)
    const packageIdFromState = location.state?.packageId;
    
    // Se não há ID no estado, usar ID padrão para teste
    const packageId = packageIdFromState || 1;
    
    console.log('🎫 ID do pacote detectado:', packageId);
    
    // Se já temos dados carregados, não recarregar
    if (reservationData) {
      console.log('✅ Já existem dados de reserva carregados, mantendo estado atual');
      return;
    }
    
    loadReservation(packageId);
  }, [location.state, reservationData]);

  return (
    <ReservationContext.Provider value={{ 
      reservationData, 
      setReservationData,
      isLoading, 
      error, 
      loadReservation 
    }}>
      {children}
    </ReservationContext.Provider>
  );
};
