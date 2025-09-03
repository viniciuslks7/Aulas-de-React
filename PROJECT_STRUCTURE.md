# 🎯 AUXILIUM - Estrutura do Projeto Reorganizada

## 📁 Nova Estrutura de Pastas

```
src/
├── screens/           # Todas as telas do app
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SplashScreen.tsx
│   ├── UserTypeScreen.tsx
│   ├── CadUnicoFormScreen.tsx
│   ├── RiveTestScreen.tsx (mobile only)
│   └── SplashScreenWithRive.tsx
├── components/        # Componentes reutilizáveis
│   ├── RiveAnimationExample.tsx
│   ├── RiveButton.tsx
│   └── RiveSplashAnimation.tsx
└── navigation/        # Configuração de navegação
    └── AppNavigator.tsx

assets/
├── animations/        # Arquivos .riv
├── *.png             # Imagens e ícones
└── README.md

App.tsx               # Ponto de entrada principal
```

## ✅ Problemas Resolvidos

### 🔧 **Erro do Rive no Web**
- ✅ Imports condicionais para Rive (apenas mobile)
- ✅ Verificação de plataforma nos componentes
- ✅ Fallback para web com mensagem explicativa

### 📂 **Organização do Projeto**
- ✅ Separação clara entre screens, components e navigation
- ✅ Imports corrigidos para nova estrutura de pastas
- ✅ Navegação centralizada no AppNavigator

### 🎨 **Avisos de Estilo**
- ✅ Shadow props são warnings do React Native Web (não afetam funcionamento)
- ✅ Funciona perfeitamente em dispositivos móveis

## 🚀 Como Usar Agora

### **1. Desenvolvimento Web**
```bash
npm start
# Escolha 'w' para web
# Rive não estará disponível, mas resto funciona
```

### **2. Desenvolvimento Mobile**
```bash
npm start
# Escolha 'i' para iOS ou 'a' para Android
# Rive funcionará perfeitamente
```

### **3. Teste de Animações Rive**
- No dispositivo mobile: Botão "🎨 TESTE RIVE" aparece
- No web: Botão não aparece (Rive não suportado)

## 📱 Fluxo de Navegação

```
SplashScreen (3s)
    ↓
HomeScreen
    ├── "CADASTRE-SE" → UserTypeScreen
    ├── "LOGIN" → LoginScreen
    ├── "SOU UM DOADOR" → (futuro)
    └── "🎨 TESTE RIVE" → RiveTestScreen (mobile only)

UserTypeScreen
    ├── "CAD-Único" → CadUnicoFormScreen
    └── "Instituição" → (futuro)

LoginScreen
    └── "Cadastre-se" → UserTypeScreen
```

## 🎨 Sistema Rive (Mobile Only)

### **Arquivos Suportados:**
- `assets/animations/*.riv`

### **Componentes Disponíveis:**
- `RiveTestScreen`: Tela de teste interativa
- `RiveButton`: Botão animado
- `RiveSplashAnimation`: Animação para splash
- `RiveAnimationExample`: Componente com controles

### **Como Adicionar Animação:**
1. Crie no [rive.app](https://rive.app)
2. Exporte como `.riv`
3. Coloque em `assets/animations/`
4. Adicione na lista do `RiveTestScreen`
5. Teste no dispositivo mobile

## 🔧 Scripts Disponíveis

```bash
# Iniciar desenvolvimento
npm start

# iOS (requer Mac + Xcode)
npm run ios

# Android (requer Android Studio)
npm run android

# Web (sem Rive)
npm run web

# Reset cache (se houver problemas)
npm start -- --reset-cache
```

## 📝 Próximos Passos

### **Funcionalidades Pendentes:**
1. **Tela de Instituições** (UserTypeScreen)
2. **Sistema de Doadores** (HomeScreen)
3. **Autenticação Real** (LoginScreen)
4. **API Backend** (formulários)
5. **Navegação por Tabs** (quando tiver mais telas)

### **Melhorias Rive:**
1. Criar animações personalizadas no Rive
2. Integrar na SplashScreen
3. Botões interativos
4. Feedback visual nos formulários

## 🚨 Notas Importantes

### **Warnings Normais:**
- Shadow props no web são apenas warnings (não erros)
- Rive não funciona no web (comportamento esperado)

### **Arquivos Movidos:**
- Todas as telas agora estão em `src/screens/`
- Componentes em `src/components/`
- Navegação em `src/navigation/`
- Assets continuam na raiz

### **Compatibilidade:**
- ✅ iOS: Funciona completamente (incluindo Rive)
- ✅ Android: Funciona completamente (incluindo Rive)  
- ⚠️ Web: Funciona sem Rive (normal)

A estrutura agora está muito mais organizada e escalável! 🎉
