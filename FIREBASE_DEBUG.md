# Documentação de Debug Firebase

## Problema Atual

### Descrição
O sistema de cadastro está enfrentando um erro 400 Bad Request ao tentar salvar dados no Firestore, mesmo com o Firebase Authentication funcionando corretamente.

### Status
- ✅ Firebase Authentication: **Funcionando**
- ❌ Firestore Database: **Erro 400 Bad Request**

## Ferramentas de Debug Implementadas

### 1. FirebaseTestScreen (`src/screens/FirebaseTestScreen.tsx`)
Tela dedicada para testes isolados do Firebase com:
- Interface visual para executar testes
- Display em tempo real dos resultados
- Logs categorizados por tipo de operação
- Botões para limpar logs e executar novos testes

### 2. FirebaseDebug Service (`src/services/firebaseDebug.tsx`)
Serviço completo de debug com funções:

#### `testFirebaseConnection()`
- Testa conectividade geral do Firebase
- Verifica configuração do projeto
- Valida inicialização dos serviços

#### `debugCurrentUser()`
- Verifica estado do usuário autenticado
- Lista propriedades do usuário atual
- Diagnóstica problemas de sessão

#### `checkFirestoreRules()`
- Tenta operações básicas no Firestore
- Identifica problemas de permissão
- Testa regras de segurança

### 3. Logs Integrados
Sistema de logging implementado em:
- `CadUnicoForm2Screen`: Logs durante o processo de registro
- Categorização por tipo: INFO, ERROR, SUCCESS
- Console logs detalhados para desenvolvimento

## Como Usar as Ferramentas de Debug

### Acesso Rápido
1. Abrir a aplicação
2. Na HomeScreen, clicar no botão vermelho "TESTAR FIREBASE"
3. Executar testes na FirebaseTestScreen

### Processo de Debugging
1. **Teste Geral**: Clique em "Testar Firebase" para verificação completa
2. **Análise de Logs**: Observe os logs em tempo real
3. **Identificação**: Identifique onde exatamente o erro ocorre
4. **Correção**: Baseado nos logs, aplicar correções específicas

### Interpretação dos Logs
- **🟢 SUCCESS**: Operação executada com sucesso
- **🔵 INFO**: Informações de debug
- **🔴 ERROR**: Erro encontrado - requer atenção

## Possíveis Causas do Erro 400

### 1. Configuração do Projeto Firebase
- Projeto não inicializado corretamente
- Credenciais inválidas ou expiradas
- Configuração incorreta no `.env`

### 2. Firestore Database
- Banco não criado no Firebase Console
- Regras de segurança muito restritivas
- Coleção não inicializada

### 3. Estrutura de Dados
- Formato de dados incompatível
- Campos obrigatórios ausentes
- Tipos de dados incorretos

## Próximos Passos para Resolução

### 1. Verificação no Firebase Console
- [ ] Confirmar que o Firestore Database está criado
- [ ] Verificar regras de segurança
- [ ] Validar configuração do projeto

### 2. Teste com Dados Mínimos
- [ ] Tentar salvar documento simples
- [ ] Verificar se é problema de estrutura de dados
- [ ] Testar diferentes coleções

### 3. Configuração Local
- [ ] Verificar variáveis de ambiente
- [ ] Validar inicialização do Firebase
- [ ] Confirmar versões das dependências

## Comandos Úteis para Debug

```bash
# Verificar logs em tempo real
npx expo start --dev-client

# Limpar cache se necessário
npx expo start --clear

# Verificar variáveis de ambiente
echo $EXPO_PUBLIC_FIREBASE_API_KEY
```

## Estrutura do Erro Atual

```
Error Type: 400 Bad Request
Context: Firestore addDoc operation
Location: CadUnicoForm2Screen.handleConcluir()
Firebase Auth: ✅ Working (user created successfully)
Firestore Save: ❌ Failing with 400 error
```

---

**Data da Documentação**: 05/09/2025
**Autor**: Sistema de Debug Automatizado
**Versão**: 1.0
