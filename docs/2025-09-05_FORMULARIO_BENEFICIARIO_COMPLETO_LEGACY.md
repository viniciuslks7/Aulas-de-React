# Formulário de Cadastro de Beneficiário - Fluxo Completo

## 📋 **Estrutura do Formulário Dividido**

### **🔄 Fluxo de Navegação:**
```
UserType → CadUnicoForm (1.1) → CadUnicoForm2 (1.2) → Home
```

## 📱 **Tela 1.1 - CadUnicoFormScreen**

### **📝 Campos Incluídos:**
- ✅ Nome Completo
- ✅ Endereço  
- ✅ Idade
- ✅ Email
- ✅ Telefone
- ✅ CEP
- ✅ Cidade
- ✅ Estado
- ✅ NIS
- ✅ Renda Familiar
- ✅ Número de Membros
- ✅ Tipos de Doação (PIX, Dinheiro, Cesta Básica, Agasalhos)
- ✅ Relato Pessoal

### **🔧 Validações Regex 1.1:**
```typescript
// Nome completo: pelo menos nome e sobrenome
nomeCompleto: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,}$/

// Email: formato padrão RFC 5322
email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Telefone: formato brasileiro
telefone: /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/

// CEP: formato 00000-000
cep: /^[0-9]{5}-?[0-9]{3}$/

// NIS: 11 dígitos
nis: /^[0-9]{11}$/

// Renda: decimal com até 2 casas
renda: /^[0-9]+(?:\.[0-9]{1,2})?$/
```

## 🆔 **Tela 1.2 - CadUnicoForm2Screen**

### **📝 Campos Incluídos:**
- ✅ RG (com upload frente/verso)
- ✅ CPF (com upload frente/verso)  
- ✅ Chave PIX (com gerador automático)
- ✅ Telefone Pessoal (Opcional)
- ✅ Email (para login)
- ✅ Senha
- ✅ Confirmar Senha

### **🔧 Validações Regex 1.2:**
```typescript
// RG: formato brasileiro
rg: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9X]$/

// CPF: formato brasileiro
cpf: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/

// Chave PIX: múltiplos formatos
chavePix: {
  cpf: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$|^[0-9]{11}$/,
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  telefone: /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/,
  aleatoria: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
}

// Senha: mínimo 6 caracteres
senha: senha.length >= 6
```

## 🎨 **Formatação Automática**

### **Tela 1.1:**
```typescript
telefone: "11999999999" → "(11) 99999-9999"
cep: "01234567" → "01234-567"
renda: "1500.5" → "1500.50"
```

### **Tela 1.2:**
```typescript
rg: "123456789" → "12.345.678-9"
cpf: "12345678901" → "123.456.789-01"
telefone: "11999999999" → "(11) 99999-9999"
```

## 🔄 **Navegação Entre Telas**

### **CadUnicoForm (1.1) → CadUnicoForm2 (1.2):**
```typescript
// Após validação e salvamento da primeira etapa
Alert.alert(
  'Primeira Etapa Concluída!',
  'Agora vamos completar algumas informações adicionais.',
  [
    {
      text: 'Continuar',
      onPress: () => {
        navigation.navigate('CadUnicoForm2');
      }
    }
  ]
);
```

### **CadUnicoForm2 (1.2) → Home:**
```typescript
// Após validação e finalização do cadastro
Alert.alert(
  'Cadastro Concluído!',
  'Seu cadastro foi finalizado com sucesso. Agora você pode receber doações.',
  [
    {
      text: 'OK',
      onPress: () => {
        navigation.navigate('Home');
      }
    }
  ]
);
```

## 🔧 **Funcionalidades Especiais**

### **🔑 Gerador de Chave PIX:**
```typescript
const gerarChavePix = () => {
  const chaveAleatoria = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  setChavePix(chaveAleatoria);
};
```

### **📸 Upload de Documentos:**
- Botões para upload de RG frente/verso
- Botões para upload de CPF frente/verso
- Interface preparada para implementação de camera/galeria

### **🔐 Validação de Senhas:**
```typescript
if (senha !== confirmarSenha) {
  return { valido: false, mensagem: 'Senhas não coincidem' };
}
```

## 🎯 **UX/UI Melhoradas**

### **Layout Responsivo:**
- ✅ Campos RG/CPF lado a lado
- ✅ Botões de documento organizados
- ✅ Chave PIX com botão de geração
- ✅ Indicadores visuais de foco
- ✅ Feedback de loading

### **Teclados Específicos:**
- ✅ `numeric` para RG/CPF
- ✅ `phone-pad` para telefone
- ✅ `email-address` para email
- ✅ `decimal-pad` para renda

### **Acessibilidade:**
- ✅ Placeholders descritivos
- ✅ Mensagens de erro específicas
- ✅ Estados de foco visuais
- ✅ Botões com feedback tátil

## 📱 **Próximos Passos:**

1. **Implementar upload de documentos**
2. **Integrar com Firebase Storage**
3. **Adicionar validação de CPF real**
4. **Implementar autenticação com email/senha**
5. **Criar dashboard do beneficiário**

## 🔒 **Segurança:**

- ✅ Senhas não são logadas
- ✅ Dados sanitizados antes do salvamento
- ✅ Validações tanto no frontend quanto backend
- ✅ Campos obrigatórios claramente marcados
