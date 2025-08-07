/* ===================================================================== */
/* COMPONENTE DE CÁLCULO DE PREÇO - VERSÃO INTEGRADA                    */
/* ===================================================================== */
/*
 * Este componente exibe a comparação entre o preço original e o novo preço 
 * após mudanças em voos, hotéis ou ambos. Versão compacta para integração.
 */

import React from 'react';
import { FaCalculator, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

/* ===================================================================== */
/* INTERFACES                                                           */
/* ===================================================================== */

interface PriceCalculatorProps {
  originalPrice: number;
  newPrice: number;
  changeType: 'flight' | 'hotel' | 'both';
  flightPriceDiff?: number;
  hotelPriceDiff?: number;
}

/* ===================================================================== */
/* COMPONENTE PRINCIPAL                                                 */
/* ===================================================================== */

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  originalPrice,
  newPrice,
  changeType,
  flightPriceDiff = 0,
  hotelPriceDiff = 0
}) => {
  const totalDifference = newPrice - originalPrice;
  const percentageChange = ((totalDifference / originalPrice) * 100);
  
  const getDifferenceIcon = (diff: number) => {
    if (diff > 0) return <FaArrowUp className="text-danger" />;
    if (diff < 0) return <FaArrowDown className="text-success" />;
    return <FaMinus className="text-muted" />;
  };

  const getDifferenceClass = (diff: number) => {
    if (diff > 0) return "text-danger";
    if (diff < 0) return "text-success";
    return "text-muted";
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDifference = (diff: number): string => {
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${formatPrice(diff)}`;
  };

  return (
    <div className="price-calculator-integrated border rounded p-3 bg-light">
      <div className="d-flex align-items-center gap-2 mb-2">
        <FaCalculator className="text-primary" />
        <span className="fw-bold small">Comparação de Preços</span>
      </div>
      
      {/* Preços Principais - Versão Compacta */}
      <div className="d-flex justify-content-between mb-2">
        <div className="text-center">
          <small className="text-muted d-block">Preço Original</small>
          <span className="fw-semibold">{formatPrice(originalPrice)}</span>
        </div>
        <div className="text-center">
          <small className="text-muted d-block">Novo Preço</small>
          <span className={`fw-semibold ${getDifferenceClass(totalDifference)}`}>
            {formatPrice(newPrice)}
          </span>
        </div>
      </div>

      {/* Diferença Total - Versão Compacta */}
      <div className="text-center p-2 bg-white rounded">
        <div className="d-flex align-items-center justify-content-center gap-2">
          {getDifferenceIcon(totalDifference)}
          <span className={`fw-bold ${getDifferenceClass(totalDifference)}`}>
            {formatDifference(totalDifference)}
          </span>
          <small className="text-muted">
            ({percentageChange.toFixed(1)}%)
          </small>
        </div>
        {totalDifference === 0 && (
          <small className="text-primary d-block mt-1">
            <FaMinus className="me-1" />
            MESMO PREÇO
          </small>
        )}
      </div>

      {/* Detalhamento Simples */}
      {changeType === 'flight' && (
        <small className="text-muted d-block text-center mt-2">
          ✈️ Alteração no voo
        </small>
      )}
      {changeType === 'hotel' && (
        <small className="text-muted d-block text-center mt-2">
          🏨 Alteração no hotel
        </small>
      )}
      {changeType === 'both' && (
        <small className="text-muted d-block text-center mt-2">
          ✈️🏨 Alterações no voo e hotel
        </small>
      )}
    </div>
  );
};

export default PriceCalculator;