# Arquivos de Animação Rive

## 📁 Como adicionar seus arquivos .riv

1. **Exporte do Rive.app**:
   - Vá em Export → Rive Runtime
   - Escolha formato `.riv`
   - Salve com um nome descritivo

2. **Copie para esta pasta**:
   ```
   assets/animations/auxilium_logo.riv
   assets/animations/auxilium_logo_splash.riv
   assets/animations/auxilium_logo_button.riv
   assets/animations/auxilium_logo_simple.riv
   ```

3. **Atualize a lista no RiveTestScreen.tsx**:
   - Abra o arquivo `RiveTestScreen.tsx`
   - Encontre o array `animations`
   - Adicione seus novos arquivos

## 🎨 Arquivos Recomendados

### auxilium_logo.riv
- **Função**: Logo principal com animação simples
- **State Machine**: Nenhuma
- **Uso**: Exibição geral da logo

### auxilium_logo_splash.riv
- **Função**: Animação para splash screen
- **State Machine**: "LogoController"
- **Inputs**: start, finish
- **Uso**: SplashScreen inicial

### auxilium_logo_button.riv
- **Função**: Logo interativa para botões
- **State Machine**: "ButtonStates"
- **Inputs**: hover, click, pressed
- **Uso**: Botões e elementos clicáveis

### auxilium_logo_simple.riv
- **Função**: Versão leve para uso geral
- **State Machine**: Nenhuma
- **Uso**: Quando precisa de performance

## 🚀 Testando

1. Adicione seus arquivos .riv nesta pasta
2. Abra o app e vá em "🎨 TESTE RIVE"
3. Selecione a animação
4. Teste controles e inputs
5. Ajuste tamanhos
6. Quando estiver satisfeito, integre nas telas principais

## 📝 Notas

- Arquivos .riv devem estar nesta pasta exata
- Nomes devem corresponder aos listados no código
- Metro bundler precisa ser reiniciado após adicionar novos arquivos
- Use `npm start -- --reset-cache` se tiver problemas

Placeholder criado - adicione seus arquivos .riv aqui!
