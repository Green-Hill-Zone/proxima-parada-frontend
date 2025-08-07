import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

const PerformanceChart: React.FC = () => {
  // Dados mockados para o gráfico
  const chartData = [
    { month: 'Jan', visits: 85, bookings: 45 },
    { month: 'Fev', visits: 120, bookings: 67 },
    { month: 'Mar', visits: 98, bookings: 52 },
    { month: 'Abr', visits: 156, bookings: 89 },
    { month: 'Mai', visits: 142, bookings: 78 },
    { month: 'Jun', visits: 178, bookings: 95 },
    { month: 'Jul', visits: 195, bookings: 110 },
    { month: 'Ago', visits: 240, bookings: 135 }
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.visits, d.bookings)));

  return (
    <div className="performance-chart">
      <div className="chart-header mb-3">
        <h6 className="mb-2">Performance Mensal</h6>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color visits"></span>
            Visitas
          </span>
          <span className="legend-item">
            <span className="legend-color bookings"></span>
            Reservas
          </span>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-bars">
          {chartData.map((data, index) => (
            <div key={index} className="bar-group">
              <div className="bars">
                <div 
                  className="bar visits-bar" 
                  style={{ height: `${(data.visits / maxValue) * 100}%` }}
                  title={`${data.visits} visitas`}
                ></div>
                <div 
                  className="bar bookings-bar" 
                  style={{ height: `${(data.bookings / maxValue) * 100}%` }}
                  title={`${data.bookings} reservas`}
                ></div>
              </div>
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-metrics mt-3">
        <div className="metric">
          <div className="metric-value">
            <FaArrowUp className="text-success me-1" />
            23.5%
          </div>
          <div className="metric-label">Crescimento</div>
        </div>
        <div className="metric">
          <div className="metric-value">
            <FaArrowUp className="text-success me-1" />
            18.2%
          </div>
          <div className="metric-label">Conversão</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
