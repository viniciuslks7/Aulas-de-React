# Validações Regex - CadUnicoFormScreen

## ✅ **Navigation Props Corrigido**

### **Antes:**
```tsx
const handleBack = () => {
  (navigation as any).goBack(); // ❌ Type casting desnecessário
};

(navigation as any).navigate('Home'); // ❌ Type casting desnecessário
```

### **Depois:**
```tsx
const handleBack = () => {
  navigation.goBack(); // ✅ Tipagem correta
};

navigation.navigate('Home'); // ✅ Tipagem correta
```

## 🔍 **Validações Regex Implementadas**

### **1. Nome Completo**
```typescript
nomeCompleto: (nome: string): boolean => {
  const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,}$/;
  return regex.test(nome.trim()) && nome.trim().split(' ').length >= 2;
}
```
- ✅ Apenas letras, espaços e acentos
- ✅ Mínimo 2 palavras (nome e sobrenome)
- ✅ Suporte a caracteres especiais (ñ, ç, etc.)

### **2. Email**
```typescript
email: (email: string): boolean => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email.trim());
}
```
- ✅ RFC 5322 simplificado
- ✅ Suporte a caracteres especiais válidos
- ✅ Validação de domínio

### **3. Telefone Brasileiro**
```typescript
telefone: (telefone: string): boolean => {
  const regex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
  const somenteNumeros = telefone.replace(/\D/g, '');
  return regex.test(telefone) && (somenteNumeros.length === 10 || somenteNumeros.length === 11);
}
```
- ✅ Formato: (11) 99999-9999
- ✅ Suporte a celular (9 dígitos)
- ✅ Suporte a fixo (8 dígitos)
- ✅ Aceita com/sem parênteses e hífen

### **4. CEP**
```typescript
cep: (cep: string): boolean => {
  const regex = /^[0-9]{5}-?[0-9]{3}$/;
  return regex.test(cep);
}
```
- ✅ Formato: 00000-000
- ✅ Aceita com/sem hífen

### **5. NIS (Número de Identificação Social)**
```typescript
nis: (nis: string): boolean => {
  const regex = /^[0-9]{11}$/;
  const somenteNumeros = nis.replace(/\D/g, '');
  return regex.test(somenteNumeros);
}
```
- ✅ Exatamente 11 dígitos
- ✅ Apenas números

### **6. Renda**
```typescript
renda: (renda: string): boolean => {
  const regex = /^[0-9]+(?:\.[0-9]{1,2})?$/;
  const valor = parseFloat(renda);
  return regex.test(renda) && valor >= 0 && valor <= 999999.99;
}
```
- ✅ Formato: 1500.00
- ✅ Até 2 casas decimais
- ✅ Valor máximo: R$ 999.999,99

### **7. Cidade/Estado**
```typescript
cidade: (cidade: string): boolean => {
  const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-]{2,}$/;
  return regex.test(cidade.trim());
}

estado: (estado: string): boolean => {
  const siglaRegex = /^[A-Z]{2}$/;
  const nomeRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{4,}$/;
  return siglaRegex.test(estado.trim()) || nomeRegex.test(estado.trim());
}
```
- ✅ Cidade: apenas letras, espaços, hífens
- ✅ Estado: aceita sigla (SP) ou nome completo

### **8. Números (Idade/Membros)**
```typescript
idade: (idade: string): boolean => {
  const regex = /^[0-9]{1,3}$/;
  const numero = parseInt(idade);
  return regex.test(idade) && numero >= 0 && numero <= 120;
}

membros: (membros: string): boolean => {
  const regex = /^[1-9][0-9]?$/;
  const numero = parseInt(membros);
  return regex.test(membros) && numero >= 1 && numero <= 20;
}
```
- ✅ Idade: 0-120 anos
- ✅ Membros: 1-20 pessoas

## 🎨 **Formatação Automática**

### **Telefone**
```typescript
telefone: (value: string) => {
  const apenasNumeros = value.replace(/\D/g, '');
  if (apenasNumeros.length <= 10) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
}
```
- ✅ Formata automaticamente: 11999999999 → (11) 99999-9999

### **CEP**
```typescript
cep: (value: string) => {
  const apenasNumeros = value.replace(/\D/g, '');
  if (apenasNumeros.length <= 5) return apenasNumeros;
  return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
}
```
- ✅ Formata automaticamente: 01234567 → 01234-567

### **Renda**
```typescript
renda: (value: string) => {
  let limpo = value.replace(/[^\d.]/g, '');
  // Garante apenas um ponto decimal
  // Limita casas decimais a 2
}
```
- ✅ Aceita apenas números e ponto
- ✅ Máximo 2 casas decimais

## 📝 **Mensagens de Erro Específicas**

```typescript
const validarCampos = (): { valido: boolean; mensagem: string } => {
  if (!validacoes.nomeCompleto(nomeCompleto)) {
    return { valido: false, mensagem: 'Nome completo deve ter pelo menos nome e sobrenome, apenas letras' };
  }
  
  if (!validacoes.email(email)) {
    return { valido: false, mensagem: 'Email deve ter um formato válido (exemplo@dominio.com)' };
  }
  
  if (!validacoes.telefone(telefone)) {
    return { valido: false, mensagem: 'Telefone deve ter formato brasileiro (11) 99999-9999' };
  }
  
  // ... mais validações
}
```

## 🚀 **Benefícios**

1. **🔒 Segurança:** Dados sempre no formato correto
2. **🎨 UX:** Formatação automática em tempo real
3. **📱 Mobile:** Teclados específicos por tipo de campo
4. **🐛 Debug:** Mensagens de erro específicas
5. **🧪 Testabilidade:** Validações isoladas e testáveis
6. **🔧 Manutenção:** Código organizado e reutilizável

## 🧪 **Como Testar**

### **Casos Válidos:**
- Nome: "João Silva Santos"
- Email: "joao@email.com"
- Telefone: "(11) 99999-9999"
- CEP: "01234-567"
- NIS: "12345678901"
- Renda: "1500.50"

### **Casos Inválidos:**
- Nome: "João123" (números)
- Email: "email@" (domínio incompleto)
- Telefone: "123456" (poucos dígitos)
- CEP: "123" (formato inválido)
- NIS: "123" (poucos dígitos)
- Renda: "abc" (não numérico)
