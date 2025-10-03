# Profile & Storage Changes

Data: 2025-10-03

Resumo das alterações realizadas no projeto "Boer":

## Objetivo
Garantir que a `ProfileScreen` mostre os dados reais do usuário cadastrado, permitir edição limitada (email, telefone, relato, senha, endereço), corrigir problemas de scroll, e implementar upload/armazenamento de foto de perfil localmente (sem uso do Firebase Storage) usando AsyncStorage.

## Arquivos modificados

- `src/screens/ProfileScreen.tsx`
  - Tornou a tela de perfil interativa.
  - Implementou `pickImageAndUpload` que agora salva a foto localmente em formato Data URI (base64) e persiste via `updateUser` para AsyncStorage.
  - Tratamento para web/mobile: usa `base64` quando o `expo-image-picker` retorna base64 (salvamento local). Removeu dependência do Firebase Storage.
  - Correções de scroll: mudança do container do `ScrollView` para usar height fixo (height - 120) para evitar comportamento de rolagem inexistente.
  - Muitos pequenos ajustes visuais e mensagens de erro/feedback ao usuário.

- `src/screens/CadUnicoForm2Screen.tsx`
  - Ao concluir o cadastro, os dados do formulário são salvos temporariamente em AsyncStorage (`@Boer:tempUserData`).
  - Redireciona automaticamente para a tela `Login` (fluxo restaurado para comportamento original).
  - Removido salvamento direto no contexto após cadastro; agora o login processará `tempUserData` e gravará no contexto.

- `src/screens/LoginScreen.tsx`
  - Após login, o app procura por `@Boer:tempUserData` no AsyncStorage. Se existir, ele carrega esses dados para o `UserContext` e remove o item temporário.
  - Caso contrário, chama `refreshUser()` do `UserContext` para carregar dados já salvos.

- `src/contexts/UserContext.tsx`
  - Removido fallback para `mockUserData`. Agora `loadUserData()` retorna `null` se nenhum usuário estiver salvo.
  - Implementado `login`, `logout`, `updateUser`, `refreshUser` para manipular AsyncStorage e manter o estado do usuário.

- `src/screens/HomeScreen.tsx`
  - Ajuste para suprimir warnings de `shadow*` em web (sugestão para `boxShadow` foi verificada).

## Decisões técnicas

- Por decisão do usuário, não usar Firebase Storage: fotos agora são salvas localmente no AsyncStorage como Data URI (base64). Essa solução é simples e rápida para desenvolvimento local, porém possui limitações e riscos:
  - AsyncStorage não é recomendado para arquivos grandes (ex.: imagens de alta resolução). Geralmente tem limites (≈6MB total por domínio em alguns ambientes).
  - Não sincroniza entre dispositivos; não é escalável para produção.

- Para a web, o `expo-file-system` não funciona. A solução foi usar `base64` do `ImagePicker` quando disponível ou `fetch(...).blob()` quando necessário.

## Como testar

1. Iniciar a aplicação (Expo web):

```powershell
npm start -- --web
```

2. Testar cadastro:
  - Preencher `CadUnicoFormScreen` e `CadUnicoForm2Screen`, clicar em "Concluir". O app deverá redirecionar automaticamente para a tela de `Login`.
  - Fazer login com as credenciais criadas. O app deverá carregar os dados do AsyncStorage e o `ProfileScreen` deverá mostrar os campos reais (nome, cpf, rg, email, telefone, relato etc.).

3. Testar upload de foto:
  - Abrir `ProfileScreen`, clicar na foto, escolher uma imagem. A foto será salva localmente (Data URI) e mostrada imediatamente.

## Notas e próximos passos sugeridos

- Remover logs de debug antes de subir para produção.
- Para produção, voltar a usar um serviço de storage (Firebase Storage ou S3) e configurar CORS e regras adequadas.
- Considerar compressão adicional de imagens (p. ex. imagem webp) antes de salvar.

---

Se quiser que eu também faça o commit e push agora, posso executar os comandos; observe que o push pode requerer credenciais locais do git (SSH/token).