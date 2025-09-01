import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { 
  createStackNavigator, 
  TransitionPresets,
  StackCardInterpolationProps 
} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SplashScreen from './SplashScreen';
import { Easing } from 'react-native';

const Stack = createStackNavigator();

// Transição estilo "Arrastar para cima" - Bottom Sheet
const bottomSheetTransition = {
  gestureEnabled: true,
  gestureDirection: 'vertical' as const,
  gestureResponseDistance: 300,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 500,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Curva mais suave
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 1, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: StackCardInterpolationProps) => {
    const progress = current.progress;
    
    return {
      cardStyle: {
        transform: [
          // Desliza de baixo para cima com efeito mais suave
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
              extrapolate: 'clamp',
            }),
          },
          // Leve escala para dar profundidade
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
        // Shadow mais forte para simular profundidade
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -8,
        },
        shadowOpacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
        shadowRadius: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 15],
        }),
        elevation: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 15],
        }),
      },
      // Overlay escuro mais sutil
      overlayStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    };
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
};

// Transição para a Home (entrada suave com logo sincronizada)
const fadeTransition = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 500, // Aumentei para sincronizar melhor
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Curva mais suave
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.quad),
      },
    },
  },
  cardStyleInterpolator: ({ current }: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.5, 1], // Entrada muito gradual e suave
        }),
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1.02, 1], // Muito sutil
            }),
          },
        ],
      },
    };
  },
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          presentation: 'modal', // Importante para o efeito de modal
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            ...fadeTransition,
            cardStyle: { backgroundColor: '#1E5E3F' },
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            ...bottomSheetTransition,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
