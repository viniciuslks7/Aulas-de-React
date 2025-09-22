// 🎭 Utilitários de Máscaras e Validações para CadÚnico

// 📱 Máscaras de formatação
export const maskCPF = (cpf: string): string => {
  return cpf
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
};

export const maskRG = (rg: string): string => {
  return rg
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})/, '$1-$2')
    .replace(/(-\d{1})\d+?$/, '$1');
};

export const maskPhone = (phone: string): string => {
  return phone
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const maskCEP = (cep: string): string => {
  return cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// 🧼 Limpeza de máscaras (remove formatação)
export const cleanCPF = (cpf: string): string => cpf.replace(/\D/g, '');
export const cleanRG = (rg: string): string => rg.replace(/\D/g, '');
export const cleanPhone = (phone: string): string => phone.replace(/\D/g, '');
export const cleanCEP = (cep: string): string => cep.replace(/\D/g, '');

// ✅ Validações
export const validateCPF = (cpf: string): boolean => {
  const cleanedCPF = cleanCPF(cpf);
  
  // Verifica se tem 11 dígitos
  if (cleanedCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanedCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanedCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanedCPF.charAt(10))) return false;
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleanedPhone = cleanPhone(phone);
  // Aceita celular (11 dígitos) ou fixo (10 dígitos)
  return cleanedPhone.length === 10 || cleanedPhone.length === 11;
};

export const validateCEP = (cep: string): boolean => {
  const cleanedCEP = cleanCEP(cep);
  return cleanedCEP.length === 8;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// 🎯 Validação combinada para campos específicos
export const validateField = (field: string, value: string): { isValid: boolean; message: string } => {
  switch (field) {
    case 'cpf':
      if (!validateRequired(value)) {
        return { isValid: false, message: 'CPF é obrigatório' };
      }
      if (!validateCPF(value)) {
        return { isValid: false, message: 'CPF inválido' };
      }
      return { isValid: true, message: '' };
      
    case 'email':
      if (!validateRequired(value)) {
        return { isValid: false, message: 'E-mail é obrigatório' };
      }
      if (!validateEmail(value)) {
        return { isValid: false, message: 'E-mail inválido' };
      }
      return { isValid: true, message: '' };
      
    case 'telefone':
      if (!validateRequired(value)) {
        return { isValid: false, message: 'Telefone é obrigatório' };
      }
      if (!validatePhone(value)) {
        return { isValid: false, message: 'Telefone inválido' };
      }
      return { isValid: true, message: '' };
      
    case 'nome':
      if (!validateRequired(value)) {
        return { isValid: false, message: 'Nome é obrigatório' };
      }
      if (!validateName(value)) {
        return { isValid: false, message: 'Nome deve conter apenas letras' };
      }
      return { isValid: true, message: '' };
      
    case 'cep':
      if (!validateRequired(value)) {
        return { isValid: false, message: 'CEP é obrigatório' };
      }
      if (!validateCEP(value)) {
        return { isValid: false, message: 'CEP deve ter 8 dígitos' };
      }
      return { isValid: true, message: '' };
      
    default:
      return { isValid: true, message: '' };
  }
};

// 🎨 Aplicar máscara baseada no tipo de campo
export const applyMask = (field: string, value: string): string => {
  switch (field) {
    case 'cpf':
      return maskCPF(value);
    case 'rg':
      return maskRG(value);
    case 'telefone':
      return maskPhone(value);
    case 'cep':
      return maskCEP(value);
    default:
      return value;
  }
};

// 🧹 Limpar máscara baseada no tipo de campo
export const cleanMask = (field: string, value: string): string => {
  switch (field) {
    case 'cpf':
      return cleanCPF(value);
    case 'rg':
      return cleanRG(value);
    case 'telefone':
      return cleanPhone(value);
    case 'cep':
      return cleanCEP(value);
    default:
      return value;
  }
};

// 📋 Validar todos os campos obrigatórios de uma vez
export const validateUserProfile = (profile: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validar campos obrigatórios
  const requiredFields = ['nome', 'cpf', 'email', 'telefone'];
  
  requiredFields.forEach(field => {
    const value = profile[field] || '';
    const validation = validateField(field, value);
    if (!validation.isValid) {
      errors[field] = validation.message;
    }
  });
  
  // Validar endereço se presente
  if (profile.endereco) {
    const address = profile.endereco;
    if (address.cep) {
      const cepValidation = validateField('cep', address.cep);
      if (!cepValidation.isValid) {
        errors['endereco.cep'] = cepValidation.message;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};