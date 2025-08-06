import React from 'react';
import { Form } from 'react-bootstrap';

interface MultiSelectItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
}

interface MultiSelectProps {
  title: string;
  items: MultiSelectItem[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  renderItem?: (item: MultiSelectItem) => React.ReactNode;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  title,
  items,
  selectedIds,
  onSelectionChange,
  loading = false,
  emptyMessage = "Nenhum item disponível",
  renderItem
}) => {
  const handleItemToggle = (itemId: number) => {
    if (selectedIds.includes(itemId)) {
      // Remove o item se já estiver selecionado
      onSelectionChange(selectedIds.filter(id => id !== itemId));
    } else {
      // Adiciona o item se não estiver selecionado
      onSelectionChange([...selectedIds, itemId]);
    }
  };

  const defaultRenderItem = (item: MultiSelectItem) => (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <strong>{item.name}</strong>
        {item.description && <div className="text-muted small">{item.description}</div>}
      </div>
      {item.price && (
        <div className="text-success fw-bold">
          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="mb-3">
        <label className="form-label">{title}</label>
        <div className="d-flex align-items-center text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label className="form-label">{title}</label>
      {items.length === 0 ? (
        <div className="text-muted fst-italic">{emptyMessage}</div>
      ) : (
        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {items.map((item) => (
            <Form.Check
              key={item.id}
              type="checkbox"
              id={`${title.toLowerCase().replace(/\s+/g, '-')}-${item.id}`}
              checked={selectedIds.includes(item.id)}
              onChange={() => handleItemToggle(item.id)}
              label={
                <div className="w-100">
                  {renderItem ? renderItem(item) : defaultRenderItem(item)}
                </div>
              }
              className="mb-2"
            />
          ))}
        </div>
      )}
      {selectedIds.length > 0 && (
        <div className="text-success small mt-2">
          ✅ {selectedIds.length} item(ns) selecionado(s)
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
