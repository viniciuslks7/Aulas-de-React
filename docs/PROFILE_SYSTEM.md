# 👤 Sistema de Perfil de Usuário - CadÚnico

## 📋 Visão Geral
Sistema completo de gerenciamento de perfil de usuário integrado ao Cadastro Único (CadÚnico), permitindo visualização e edição de informações pessoais com validações robustas e persistência de dados.

## 🎯 Funcionalidades Principais

### 🏠 MainScreen Aprimorada
- **Header personalizado** com informações reais do usuário logado
- **Avatar clicável** que navega para a tela de perfil
- **Localização dinâmica** baseada no endereço do usuário
- **Badge de verificação** para usuários verificados pelo CadÚnico
- **Bottom Navigation** com acesso direto ao perfil

### 👤 ProfileScreen Completa
- **Interface intuitiva** dividida em seções organizadas
- **Campos de visualização** para dados do CadÚnico (não editáveis)
- **Campos editáveis** para informações que podem ser atualizadas
- **Sistema de validação** em tempo real
- **Máscaras automáticas** para formatação de dados

## 🏗️ Arquitetura Técnica

### 📁 Estrutura de Arquivos
```
src/
├── contexts/
│   └── UserContext.tsx          # Gerenciamento global do usuário
├── screens/
│   ├── MainScreen.tsx           # Tela principal (atualizada)
│   └── ProfileScreen.tsx        # Tela de perfil completa
├── utils/
│   └── validation.ts            # Validações e máscaras
└── types/
    └── navigation.ts            # Tipos de navegação (atualizado)
```

### 🔧 Dependências Adicionadas
- `@react-native-async-storage/async-storage` - Persistência de dados local

## 📝 Especificações Técnicas

### 📊 Interface UserProfile
```typescript
interface UserProfile {
  id: string;
  nome: string;                  // CadÚnico - Não editável
  rg: string;                    // CadÚnico - Não editável
  cpf: string;                   // CadÚnico - Não editável
  endereco: {                    // Editável
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
  telefone: string;              // Editável
  email: string;                 // Editável
  relato: string;                // Editável
  fotoPerfil?: any;              // Editável
  dataCadastro: string;
  verificado: boolean;
  isLoggedIn: boolean;
}
```

### 🎭 Sistema de Validação e Máscaras

#### Máscaras Implementadas:
- **CPF**: `000.000.000-00`
- **RG**: `00.000.000-0`
- **Telefone**: `(00) 00000-0000`
- **CEP**: `00000-000`

#### Validações Implementadas:
- **CPF**: Algoritmo oficial de validação
- **E-mail**: Regex padrão RFC 5322
- **Telefone**: 10-11 dígitos (fixo/celular)
- **CEP**: 8 dígitos obrigatórios
- **Nome**: Apenas letras e espaços

## 🎨 Design System

### 🌈 Paleta de Cores (Verde Boer)
```typescript
const DESIGN_SYSTEM = {
  colors: {
    primary: '#4CAF50',           // Verde principal
    primaryDark: '#388E3C',       // Verde escuro
    gradient: ['#2E7D32', '#388E3C', '#4CAF50'],
    surface: '#FFFFFF',
    background: '#F1F8E9',
    // ... outras cores
  }
}
```

### 📱 Componentes Reutilizáveis
- **GradientBackground**: Gradiente nativo sem dependências
- **EditableField**: Campo com modo de edição
- **Modal de Foto**: Seleção de fonte da imagem

## 🔄 Fluxo de Dados

### 1. **Inicialização**
```
App.tsx → UserProvider → AsyncStorage → Estado Global
```

### 2. **Navegação**
```
MainScreen (avatar/perfil) → ProfileScreen
```

### 3. **Edição de Dados**
```
Campo editável → Validação → Máscara → Salvamento → AsyncStorage
```

### 4. **Persistência**
```
UserContext → AsyncStorage → Recuperação na próxima sessão
```

## 📋 Funcionalidades por Tela

### 🏠 MainScreen
- [x] Header com nome do usuário
- [x] Localização baseada no endereço
- [x] Avatar com foto de perfil
- [x] Badge de verificação CadÚnico
- [x] Navegação para ProfileScreen

### 👤 ProfileScreen
- [x] Seção de foto de perfil editável
- [x] Informações pessoais (somente leitura)
- [x] Informações de contato (editáveis)
- [x] Endereço completo (editável)
- [x] Campo de relato/história (editável)
- [x] Informações da conta

## 🎯 Estados dos Campos

### 📖 Somente Leitura (CadÚnico)
- **Nome Completo**: Dados oficiais
- **CPF**: Validado e formatado
- **RG**: Documento oficial
- **Status**: Verificação CadÚnico

### ✏️ Editáveis (Usuário)
- **Telefone**: Com máscara e validação
- **E-mail**: Com validação de formato
- **Endereço**: Formulário completo
- **Relato**: Texto livre (história pessoal)
- **Foto**: Modal para câmera/galeria

## 🔒 Validações e Segurança

### ✅ Validações Implementadas
- **Campos obrigatórios**: Não podem ficar vazios
- **Formato CPF**: Algoritmo oficial brasileiro
- **E-mail válido**: Regex RFC 5322
- **Telefone**: 10-11 dígitos
- **CEP**: Exatos 8 dígitos

### 🛡️ Tratamento de Erros
- **Alertas visuais** para erros de validação
- **Mensagens específicas** para cada tipo de erro
- **Rollback automático** em caso de falha

## 📱 Experiência do Usuário

### 🎨 Interface
- **Design consistente** com identidade Boer
- **Animações suaves** (fade/slide)
- **Feedback visual** imediato
- **Hierarquia clara** de informações

### 🔄 Interações
1. **Toque no avatar** → Abre perfil
2. **Toque no ✏️** → Modo de edição
3. **Digite** → Máscara aplicada automaticamente
4. **Salvar** → Validação + confirmação
5. **Cancelar** → Descarta alterações

## 🚀 Como Usar

### 1. **Acessar Perfil**
```
MainScreen → Toque no avatar/botão perfil → ProfileScreen
```

### 2. **Editar Campo**
```
ProfileScreen → Toque no ✏️ → Digite → ✅ Salvar
```

### 3. **Editar Endereço**
```
Seção Endereço → ✏️ → Preencher formulário → ✅ Salvar Endereço
```

### 4. **Alterar Foto**
```
Foto de perfil → Toque → Modal → Câmera/Galeria
```

## 🧪 Dados de Teste

### 👤 Usuário Mock (CadÚnico)
```typescript
const mockUserData = {
  nome: 'Maria Santos da Silva',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  endereco: {
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Vila Esperança',
    cidade: 'São Paulo',
    cep: '08120-000',
    estado: 'SP'
  },
  telefone: '(11) 98765-4321',
  email: 'maria.santos@email.com',
  relato: 'Sou mãe de 3 filhos...',
  verificado: true
}
```

## 🎁 Benefícios da Implementação

### 👥 Para o Usuário
- **Controle total** sobre dados editáveis
- **Segurança** com dados CadÚnico protegidos
- **Interface intuitiva** e responsiva
- **Validação em tempo real**

### 👨‍💻 Para o Desenvolvimento
- **Código modular** e reutilizável
- **TypeScript** com tipagem completa
- **Contexto global** para estado do usuário
- **Validações centralizadas**

### 🏢 Para o Negócio
- **Conformidade** com padrões CadÚnico
- **Experiência premium** para usuários
- **Dados consistentes** e validados
- **Expansibilidade** para futuras funcionalidades

## 🔮 Próximos Passos Sugeridos

### 📸 Funcionalidade de Foto
- [ ] Integração com ImagePicker
- [ ] Upload para cloud storage
- [ ] Redimensionamento automático

### 🌐 Integração com APIs
- [ ] Consulta CEP (ViaCEP)
- [ ] Validação CPF em tempo real
- [ ] Sincronização com backend

### 🔔 Notificações
- [ ] Confirmação de alterações
- [ ] Lembretes de atualização
- [ ] Status de verificação

---

## 📞 Suporte Técnico
Para dúvidas sobre implementação ou uso das funcionalidades, consulte:
- **Código fonte**: `src/screens/ProfileScreen.tsx`
- **Contexto**: `src/contexts/UserContext.tsx`
- **Validações**: `src/utils/validation.ts`