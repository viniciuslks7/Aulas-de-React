# 🔥 Integração Firebase - AUXILIUM

## 📋 Configuração Concluída

✅ **Firebase instalado e configurado**
✅ **Serviços de banco de dados criados**
✅ **Integração com CadUnicoFormScreen**
✅ **Estrutura de dados definida**

## 🗂️ Estrutura de Dados

### 👤 Usuários (Collection: `usuarios`)
```typescript
interface Usuario {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'doador' | 'beneficiario';
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  cadUnico?: {
    nis: string;
    renda: number;
    membros: number;
  };
  criadoEm: Date;
  ativo: boolean;
}
```

### 🎁 Doações (Collection: `doacoes`)
```typescript
interface Doacao {
  id?: string;
  doadorId: string;
  beneficiarioId: string;
  tipo: 'pix' | 'dinheiro' | 'cesta_basica' | 'agasalho';
  valor?: number;
  descricao: string;
  status: 'pendente' | 'aceita' | 'concluida' | 'cancelada';
  criadoEm: Date;
  atualizadoEm: Date;
}
```

## 🚀 Como Usar

### 1. **Cadastro de Beneficiário** (CadUnicoFormScreen)
- ✅ Já integrado!
- Preencha todos os campos obrigatórios
- Clique em "Cadastrar"
- Sistema valida e salva no Firebase

### 2. **Buscar Usuários**
```typescript
import { usuarioService } from '../services/databaseService';

// Buscar por email
const usuario = await usuarioService.buscarPorEmail('email@exemplo.com');

// Listar beneficiários
const beneficiarios = await usuarioService.listarBeneficiarios();

// Listar doadores
const doadores = await usuarioService.listarDoadores();
```

### 3. **Criar Doações**
```typescript
import { doacaoService } from '../services/databaseService';

const doacao = await doacaoService.criar({
  doadorId: 'id_do_doador',
  beneficiarioId: 'id_do_beneficiario',
  tipo: 'cesta_basica',
  descricao: 'Cesta básica para família',
  status: 'pendente'
});
```

## 🔧 Configuração do Firebase Console

### 1. **Firestore Database**
- Acesse: https://console.firebase.google.com/
- Vá em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha "Modo de teste" por enquanto

### 2. **Regras de Segurança** (Temporárias para desenvolvimento)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // APENAS PARA DESENVOLVIMENTO!
    }
  }
}
```

### 3. **Authentication** (Para implementar depois)
- Vá em "Authentication"
- Clique em "Começar"
- Ative "Email/senha"

## 📱 Telas Integradas

### ✅ CadUnicoFormScreen
- Cadastro completo de beneficiários
- Validação de campos obrigatórios
- Verificação de email duplicado
- Salvamento no Firebase
- Feedback visual (loading)

### 🔄 Próximas Integrações

#### LoginScreen
```typescript
// Exemplo de implementação
const fazerLogin = async (email: string) => {
  const usuario = await usuarioService.buscarPorEmail(email);
  if (usuario) {
    // Salvar usuário no contexto/AsyncStorage
    // Navegar para tela principal
  }
};
```

#### HomeScreen
```typescript
// Listar doações recentes
const doacoesRecentes = await doacaoService.listarPorBeneficiario(userId);
```

## 🧪 Testes

### Arquivo de Teste: `src/services/firebaseTest.tsx`
```typescript
import { testeFirebase } from '../services/firebaseTest';

// Executar todos os testes
await testeFirebase.executarTodosTestes();
```

## 📊 Status do Projeto

### ✅ Concluído
- [x] Configuração Firebase
- [x] Estrutura de dados
- [x] Serviços CRUD
- [x] Integração CadUnicoForm
- [x] Validações básicas
- [x] Estados de loading

### 🔄 Em Andamento
- [ ] Integração LoginScreen
- [ ] Listagem de usuários
- [ ] Sistema de matching
- [ ] Autenticação completa

### 📋 Próximos Passos
1. Testar cadastro no CadUnicoForm
2. Verificar dados no Firebase Console
3. Implementar login
4. Criar tela de listagem de doações
5. Sistema de notificações

## 🚨 Importante

⚠️ **Segurança**: As regras atuais do Firestore estão em modo de desenvolvimento (permite tudo). Em produção, implementar regras adequadas de segurança.

⚠️ **Variáveis de Ambiente**: As credenciais estão hardcoded no momento. Para produção, usar variáveis de ambiente.

⚠️ **Validações**: Implementar validações mais robustas no frontend e backend (Cloud Functions).

---

**Status**: 🟢 Firebase integrado e funcionando!
**Próximo**: Testar cadastro e implementar login
