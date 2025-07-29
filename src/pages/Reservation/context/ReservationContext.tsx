import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import mockReservation from '../../../data/mockReservation';

type Reservation = typeof mockReservation;

interface ReservationContextType {
  reservation: Reservation;
}

export const ReservationContext = createContext<ReservationContextType>({
  reservation: mockReservation,
});

export const useReservation = () => useContext(ReservationContext);

interface Props {
  children: ReactNode;
}

export const ReservationProvider = ({ children }: Props) => {
  return (
    <ReservationContext.Provider value={{ reservation: mockReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};
