import { useState } from 'react';
import logotipo from '../../assets/logotipo.png';
import './AdminRegister.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    // Dados da empresa
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Contato
    telefone: '',
    email: '',
    site: '',
    
    // Dados bancários
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar campos obrigatórios
    if (!formData.razaoSocial.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.logradouro.trim()) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.banco.trim()) newErrors.banco = 'Banco é obrigatório';
    if (!formData.agencia.trim()) newErrors.agencia = 'Agência é obrigatória';
    if (!formData.conta.trim()) newErrors.conta = 'Conta é obrigatória';

    // Validar formato do email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail deve ter um formato válido';
    }

    // Validar CNPJ (formato básico)
    if (formData.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'))) {
      newErrors.cnpj = 'CNPJ deve ter formato válido (00.000.000/0000-00)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Por favor, corrija os erros do formulário antes de continuar.');
      return;
    }
    
    console.log('Dados do cadastro:', formData);
    alert('Cadastro realizado com sucesso!');
  };

  const estados = [
    { value: '', label: 'Selecione...' },
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  return (
    <div className="admin-container">
      <div className="admin-form-wrapper">
        <div className="admin-header">
          <img src={logotipo} alt="Próxima Parada" className="admin-logo" />
          <h2>Cadastro CNPJ</h2>
          <p>Registre sua Empresa</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Dados da Empresa */}
          <h3>Dados da Empresa</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Razão Social *</label>
              <input
                type="text"
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={handleChange}
                className={errors.razaoSocial ? 'error' : ''}
              />
              {errors.razaoSocial && <span className="error-message">{errors.razaoSocial}</span>}
            </div>

            <div className="form-group">
              <label>Nome Fantasia</label>
              <input
                type="text"
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CNPJ *</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? 'error' : ''}
              />
              {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
            </div>

            <div className="form-group">
              <label>Inscrição Estadual</label>
              <input
                type="text"
                name="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Inscrição Municipal</label>
              <input
                type="text"
                name="inscricaoMunicipal"
                value={formData.inscricaoMunicipal}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Endereço */}
          <h3>Endereço</h3>
          <div className="form-row">
            <div className="form-group">
              <label>CEP *</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
                className={errors.cep ? 'error' : ''}
              />
              {errors.cep && <span className="error-message">{errors.cep}</span>}
            </div>

            <div className="form-group flex-2">
              <label>Logradouro *</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                className={errors.logradouro ? 'error' : ''}
              />
              {errors.logradouro && <span className="error-message">{errors.logradouro}</span>}
            </div>

            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={errors.numero ? 'error' : ''}
              />
              {errors.numero && <span className="error-message">{errors.numero}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Bairro *</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className={errors.bairro ? 'error' : ''}
              />
              {errors.bairro && <span className="error-message">{errors.bairro}</span>}
            </div>

            <div className="form-group">
              <label>Cidade *</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={errors.cidade ? 'error' : ''}
              />
              {errors.cidade && <span className="error-message">{errors.cidade}</span>}
            </div>

            <div className="form-group">
              <label>Estado *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={errors.estado ? 'error' : ''}
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>
          </div>

          {/* Contato */}
          <h3>Contato</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className={errors.telefone ? 'error' : ''}
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>

            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Site</label>
              <input
                type="url"
                name="site"
                value={formData.site}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
          </div>

          {/* Dados Bancários */}
          <h3>Dados Bancários</h3>
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Banco *</label>
              <input
                type="text"
                name="banco"
                value={formData.banco}
                onChange={handleChange}
                placeholder="Ex: Banco do Brasil"
                className={errors.banco ? 'error' : ''}
              />
              {errors.banco && <span className="error-message">{errors.banco}</span>}
            </div>

            <div className="form-group">
              <label>Agência *</label>
              <input
                type="text"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
                className={errors.agencia ? 'error' : ''}
              />
              {errors.agencia && <span className="error-message">{errors.agencia}</span>}
            </div>

            <div className="form-group">
              <label>Conta *</label>
              <input
                type="text"
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                className={errors.conta ? 'error' : ''}
              />
              {errors.conta && <span className="error-message">{errors.conta}</span>}
            </div>

            <div className="form-group">
              <label>Tipo de Conta</label>
              <select
                name="tipoConta"
                value={formData.tipoConta}
                onChange={handleChange}
              >
                <option value="corrente">Corrente</option>
                <option value="poupanca">Poupança</option>
              </select>
            </div>
          </div>

          <div className="form-submit">
            <button type="submit">
              Cadastrar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
