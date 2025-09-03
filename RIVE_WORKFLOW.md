# 🎨 Guia Rápido: Sistema de Teste Rive

## ✅ O que foi criado:

### 1. **RiveTestScreen** - Tela de Teste Interativa
- 🎮 Controles: Play, Pause, Reset
- 📏 Diferentes tamanhos: 100px até 300px
- 🎯 Inputs de State Machine
- 📋 Informações em tempo real

### 2. **Navegação Integrada**
- ➕ Adicionado ao App.tsx
- 🔘 Botão "🎨 TESTE RIVE" na HomeScreen
- 🔄 Navegação suave

### 3. **Estrutura Preparada**
- 📁 Pasta `assets/animations/` criada
- ⚙️ Metro.config.js configurado para .riv
- 📚 Documentação completa

## 🚀 Como usar AGORA:

### Passo 1: Criar no Rive.app
1. Vá para [rive.app](https://rive.app)
2. Crie sua animação da logo
3. Exporte como `.riv`

### Passo 2: Adicionar ao Projeto
```bash
# Copie o arquivo para:
assets/animations/auxilium_logo.riv
```

### Passo 3: Atualizar Lista de Animações
Edite `RiveTestScreen.tsx`, linha ~21:
```typescript
const animations = [
  { name: 'Logo Principal', file: 'auxilium_logo.riv', stateMachine: '' },
  { name: 'Sua Nova Animação', file: 'seu_arquivo.riv', stateMachine: 'NomeDaStateMachine' },
  // Adicione mais aqui...
];
```

### Passo 4: Testar
1. Abra o app
2. Clique em "🎨 TESTE RIVE"
3. Selecione sua animação
4. Teste todos os controles

### Passo 5: Ajustar e Repetir
1. Volte ao Rive.app
2. Faça ajustes
3. Re-exporte
4. Substitua o arquivo
5. Recarregue o app (Metro fará hot reload)

## 🎯 Dicas de State Machine para Logo:

### Para Splash Screen:
```
States: Idle → Enter → Loop → Exit
Inputs: 
- start (trigger): Idle → Enter
- finish (trigger): Loop → Exit
```

### Para Logo Interativa:
```
States: Normal → Hover → Pressed
Inputs:
- hover (boolean): Normal ↔ Hover
- click (trigger): Hover → Pressed → Hover
```

## 🔄 Workflow Recomendado:

1. **Prototipe rápido** no Rive
2. **Teste básico** no RiveTestScreen
3. **Ajuste** no Rive baseado no teste
4. **Teste avançado** com State Machines
5. **Integre** na tela real quando satisfeito

## 🎨 Ideias para sua Logo AUXILIUM:

### Animação de Entrada:
- Logo surge do centro
- Escala de 0.5 → 1.2 → 1.0
- Fade in suave
- Breathing sutil no final

### Efeitos Especiais:
- Brilho passando pela logo
- Partículas de "esperança"
- Coração pulsante sutil
- Cores que evocam solidariedade

### Interatividade:
- Hover: Brilho sutil
- Click: Pulse + feedback
- Loading: Rotação suave

## 🚨 Troubleshooting:

### Arquivo não aparece:
```bash
# Reinicie o Metro com cache limpo:
npm start -- --reset-cache
```

### Erro de State Machine:
- Verifique se o nome está exato
- Confirme se exportou com State Machines
- Teste sem State Machine primeiro

### Performance:
- Mantenha animações simples
- Evite muitos elementos animados simultaneamente
- Use tamanhos menores para testes

Agora você pode iterar rapidamente entre Rive ↔ App! 🎉
