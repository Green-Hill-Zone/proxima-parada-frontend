import { Form } from 'react-bootstrap';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

const FormField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  required = true,
  className = "mb-2"
}: FormFieldProps) => {
  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        maxLength={maxLength}
        required={required}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormField;
