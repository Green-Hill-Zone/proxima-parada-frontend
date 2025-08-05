import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Flight } from '../../services/FlightService';
import { calculateFlightDuration, formatDateTime, formatPrice } from '../../services/FlightService';

interface FixedColumnsTableProps {
  flights: Flight[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FixedColumnsTable: React.FC<FixedColumnsTableProps> = ({ flights, onEdit, onDelete }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          .fixed-table-container {
            position: relative;
            overflow-x: auto;
          }

          .fixed-left-column, .fixed-right-column {
            position: sticky;
            z-index: 2;
            background-color: #f8f9fa;
          }

          .fixed-left-column {
            left: 0;
            box-shadow: 2px 0px 5px rgba(0,0,0,0.1);
          }

          .fixed-right-column {
            right: 0;
            box-shadow: -2px 0px 5px rgba(0,0,0,0.1);
          }

          .flight-table th, .flight-table td {
            white-space: nowrap;
            padding: 0.75rem;
          }

          /* Para garantir que as colunas sejam alinhadas */
          .flight-table th.fixed-left-column, 
          .flight-table td.fixed-left-column,
          .flight-table th.fixed-right-column,
          .flight-table td.fixed-right-column {
            position: sticky;
            background-color: #f8f9fa;
            z-index: 1;
          }

          .flight-table th.fixed-left-column {
            left: 0;
            z-index: 2;
          }

          .flight-table td.fixed-left-column {
            left: 0;
            z-index: 1;
          }

          .flight-table th.fixed-right-column {
            right: 0;
            z-index: 2;
          }

          .flight-table td.fixed-right-column {
            right: 0;
            z-index: 1;
          }
          
          /* Para preservar as listras em linhas alternadas */
          .flight-table tbody tr:nth-of-type(odd) td.fixed-left-column,
          .flight-table tbody tr:nth-of-type(odd) td.fixed-right-column {
            background-color: #f2f2f2;
          }
          
          /* Ajustes para dispositivos móveis */
          @media (max-width: 768px) {
            .action-buttons {
              flex-direction: column;
              gap: 0.25rem;
            }
          }
        `}
      </style>
      <div className="fixed-table-container">
        <Table striped hover className="flight-table">
          <thead>
            <tr>
              <th className="fixed-left-column" style={{ minWidth: '150px' }}>Companhia</th>
              <th className="fixed-left-column" style={{ left: '150px', minWidth: '100px' }}>Voo</th>
              <th style={{ minWidth: '150px' }}>Origem</th>
              <th style={{ minWidth: '150px' }}>Destino</th>
              <th style={{ minWidth: '120px' }}>Partida</th>
              <th style={{ minWidth: '120px' }}>Chegada</th>
              <th style={{ minWidth: '100px' }}>Duração</th>
              <th style={{ minWidth: '100px' }}>Preço</th>
              <th style={{ minWidth: '120px' }}>Assentos</th>
              <th className="fixed-right-column" style={{ minWidth: '100px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td className="fixed-left-column">
                  {flight.airline.name} ({flight.airline.iataCode})
                </td>
                <td className="fixed-left-column" style={{ left: '150px' }}>
                  <strong>{flight.flightNumber}</strong>
                </td>
                <td>{flight.originDestination.name}</td>
                <td>{flight.finalDestination.name}</td>
                <td>{formatDateTime(flight.departureDateTime)}</td>
                <td>{formatDateTime(flight.arrivalDateTime)}</td>
                <td>{calculateFlightDuration(flight.departureDateTime, flight.arrivalDateTime)}</td>
                <td>{formatPrice(flight.price)}</td>
                <td>
                  {flight.availableSeats > 0 ? (
                    <span className="badge bg-success">{flight.availableSeats} disponíveis</span>
                  ) : (
                    <span className="badge bg-danger">Esgotado</span>
                  )}
                </td>
                <td className="fixed-right-column">
                  <div className="d-flex gap-1 action-buttons">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(flight.id)}
                      title="Editar"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(flight.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default FixedColumnsTable;
