# Guia de Implementação do Rive no AUXILIUM

## 📦 Instalação Concluída
✅ `rive-react-native` instalado com sucesso
✅ Pasta `assets/animations` criada para arquivos .riv

## 🎨 Componentes Criados

### 1. RiveAnimationExample
Componente completo com controles para demonstrar funcionalidades do Rive:
- Play/Pause/Reset
- Trigger de inputs para State Machines
- Callbacks de eventos

### 2. RiveSplashAnimation
Componente específico para splash screens:
- Animação automática
- Callback de conclusão
- Dimensões responsivas

### 3. RiveButton
Botão interativo com animações Rive:
- Estados hover/pressed/click
- Integração com TouchableOpacity
- Suporte a State Machines

## 🚀 Como Usar

### 1. Adicionar Arquivos .riv
Coloque seus arquivos .riv na pasta `assets/animations/`

### 2. Registrar no metro.config.js
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicionar extensão .riv
config.resolver.assetExts.push('riv');

module.exports = config;
```

### 3. Exemplos de Uso

#### SplashScreen com Rive:
```typescript
import RiveSplashAnimation from './components/RiveSplashAnimation';

// No SplashScreen.tsx
<RiveSplashAnimation
  animationFile="splash_animation.riv"
  duration={3000}
  onAnimationComplete={() => navigation.navigate('Home')}
/>
```

#### Botão Animado:
```typescript
import RiveButton from './components/RiveButton';

<RiveButton
  animationFile="button_animation.riv"
  stateMachine="Button"
  onPress={() => console.log('Clicked!')}
  width={200}
  height={60}
/>
```

#### Animação Customizada:
```typescript
import RiveAnimationExample from './components/RiveAnimationExample';

<RiveAnimationExample
  animationFile="custom_animation.riv"
  width={300}
  height={200}
  stateMachine="MainStateMachine"
  autoplay={true}
/>
```

## 🎯 Integrações Recomendadas para AUXILIUM

### 1. SplashScreen
- Substituir animação atual por Rive
- Logo animado com efeitos mais sofisticados
- Transição suave para HomeScreen

### 2. Loading States
- Animações de carregamento durante submissão de formulários
- Feedback visual durante navegação

### 3. Botões Interativos
- Botões "Seguir" com animações de feedback
- Estados hover para melhor UX

### 4. Ícones Animados
- Ícones de categorias com micro-animações
- Feedback visual ao selecionar categorias

### 5. Onboarding
- Animações explicativas para UserTypeScreen
- Tutoriais interativos

## 📱 State Machines Recomendadas

### Para Botões:
- Estados: idle, hover, pressed, disabled
- Inputs: hover (boolean), click (trigger), disabled (boolean)

### Para Ícones:
- Estados: normal, selected, highlighted
- Inputs: selected (boolean), highlight (trigger)

### Para Loading:
- Estados: idle, loading, success, error
- Inputs: start (trigger), success (trigger), error (trigger)

## 🔧 Configuração Avançada

### Otimização de Performance:
```typescript
// Para animações complexas, use shouldComponentUpdate
const RiveComponent = React.memo(({ animationFile }) => {
  return <Rive resourceName={animationFile} />;
});
```

### Controle de Estado Global:
```typescript
// Context para controlar animações globalmente
const AnimationContext = createContext();

const useAnimation = () => {
  const context = useContext(AnimationContext);
  return context;
};
```

## 📚 Recursos Úteis

- [Rive Community](https://rive.app/community)
- [State Machine Tutorial](https://help.rive.app/runtimes/state-machines)
- [React Native Rive Docs](https://help.rive.app/runtimes/react-native)

## 🎨 Próximos Passos

1. Criar animações no Rive Editor
2. Exportar como .riv
3. Integrar nos componentes existentes
4. Testar performance em dispositivos
5. Otimizar baseado no feedback
