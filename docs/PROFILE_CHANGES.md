# Alterações no Perfil (ProfileScreen) — Documentação

Data: 2025-09-25

Este documento resume as alterações feitas na tela de Perfil e no contexto de usuário do projeto "Boer". Ele descreve o que foi alterado, como testar localmente, riscos/limitações (segurança) e próximos passos recomendados.

---

## Resumo das principais mudanças

1. `src/screens/ProfileScreen.tsx`
   - Adicionados campos e funcionalidades:
     - Campo editável para `E-mail` (já persistente via `UserContext.updateUser`).
     - Campo editável para `Senha` (fluxo demo local): permite inserir nova senha e confirmação; valida tamanho mínimo (6 caracteres) e que as senhas conferem. Em produção, deve-se trocar essa rotina para usar o provedor de autenticação (ex.: Firebase Auth).
     - Modal de seleção de foto (placeholder): opções "Tirar Foto" e "Galeria" presentes como pontos de partida.
     - Botão vermelho "Deletar Conta" com confirmação: ao confirmar, chama `logout()` (remove `@Boer:userData` do AsyncStorage e limpa contexto) e navega para a tela `Login`.
   - Estilos adicionados para inputs de senha e o botão de deletar conta.

2. `src/contexts/UserContext.tsx`
   - Interface `UserProfile` passou a incluir o campo opcional `senha?: string`.
   - Dados mock (`mockUserData`) receberam um valor `senha` para desenvolvimento.
   - O contexto já provê `user`, `updateUser`, `logout`, `login`, `refreshUser`.

---

## Como testar localmente

Prerequisitos:
- Ter o projeto configurado e dependências instaladas (expo / react-native tooling conforme este repositório).
- Rodar o app em emulador ou dispositivo.

Passos rápidos:
1. Abrir o app e navegar para a tela de Perfil (`ProfileScreen`).
2. Verificar informações carregadas (em desenvolvimento, `mockUserData` aparece se não houver usuário salvo no AsyncStorage).
3. Editar o campo E‑mail: tocar no ícone ✏️ ao lado do e‑mail, alterar o texto e Salvar. Deve aparecer alerta de sucesso e o novo e‑mail deve persistir entre reinícios da aplicação (salvo em `AsyncStorage` como `@Boer:userData`).
4. Editar a Senha:
   - Tocar em ✏️ ao lado de "Senha".
   - Inserir a nova senha e a confirmação (mínimo 6 caracteres) e tocar em "Salvar Senha".
   - Em fluxo demo: a senha é salva localmente no objeto do usuário via `updateUser`.
   - Em produção: substituir por lógica do provedor de autenticação antes do deploy.
5. Deletar Conta:
   - Tocar no botão vermelho "Deletar Conta".
   - Confirmar no modal do sistema.
   - Ao confirmar, o app remove `@Boer:userData` do AsyncStorage, limpa o contexto e redireciona para `Login`.

Checagens adicionais:
- Verifique em `AsyncStorage` (devtools ou logs) se a chave `@Boer:userData` foi removida após a deleção.
- Testar edição de endereço, telefone, relato — estes já estavam implementados e continuam persistindo via `updateUser`.

---

## Riscos, limitações e recomendações de segurança

- Senhas não devem ser armazenadas em texto plano. O atual fluxo de alteração de senha é apenas para demonstração/local (dev). Em produção, você precisa:
  - Usar um provedor de autenticação (ex.: Firebase Auth, Auth0) e chamar `updatePassword` / `updateEmail` nas APIs seguras.
  - Remover qualquer campo `senha` do armazenamento local.

- Deletar conta no fluxo atual apenas remove dados locais (AsyncStorage) e NÃO exclui a conta do provedor de autenticação/back-end. Implementar exclusão real de conta exige:
  - Autenticar novamente o usuário (re-auth) se o provedor exigir.
  - Chamar o endpoint ou SDK do provedor para deletar a conta.
  - Tratar falhas e reverter estados locais se a exclusão remota falhar.

- Upload de foto de perfil ainda não implementado. Existem duas opções:
  1. Salvar localmente (expo-file-system) e referenciar a URI no `user.fotoPerfil` — bom para demo/offline.
  2. Fazer upload para storage remoto (Firebase Storage / S3) e armazenar URL pública no `user.fotoPerfil` — recomendado para sincronização entre dispositivos.

---

## Arquivos alterados (resumo)

- Modified: `src/screens/ProfileScreen.tsx`
  - Acrescentado campo de senha (UI + validação), botão de deletar conta e handlers correspondentes.
- Modified: `src/contexts/UserContext.tsx`
  - Adicionado `senha` ao tipo `UserProfile` e mock.

---

## Próximos passos sugeridos (priorizados)

1. (Alta) Integrar atualização de e‑mail e senha com um provedor de autenticação (Firebase Auth ou outro). Remover o armazenamento local de senhas.
2. (Média) Implementar upload e persistência de foto de perfil (expo-image-picker + expo-file-system ou Firebase Storage).
3. (Média) Substituir Alerts nativos por modais customizados que sigam o design do aplicativo.
4. (Baixa) Adicionar testes unitários/integração para `UserContext.updateUser`, `logout` e fluxos de edição de perfil.

---

## Contatos / notas finais

Se quiser, eu posso seguir e implementar:
- Integração com Firebase Authentication para `updateEmail`, `updatePassword` e `deleteUser` (preciso das credenciais do projeto ou permissões para configurar). 
- Upload de foto de perfil com `expo-image-picker` e armazenamento remoto.

Se preferir, posso também criar testes automatizados para as funções do contexto e um modal customizado para confirmação de exclusão de conta.
