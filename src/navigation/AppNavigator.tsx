import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { 
  createStackNavigator, 
  TransitionPresets,
  StackCardInterpolationProps 
} from '@react-navigation/stack';
import { Platform, Easing } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import CadUnicoFormScreen from '../screens/CadUnicoFormScreen';
import SplashScreen from '../screens/SplashScreen';

// Conditional Rive imports (only for mobile platforms)
let RiveTestScreen: any = null;
if (Platform.OS !== 'web') {
  try {
    RiveTestScreen = require('../screens/RiveTestScreen').default;
  } catch (error) {
    console.log('Rive components not available on this platform');
  }
}

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
          // Adiciona uma leve escala para profundidade
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
        // Diminui a opacidade conforme sobe
        opacity: progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.7, 1],
          extrapolate: 'clamp',
        }),
      },
      overlayStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
          extrapolate: 'clamp',
        }),
      },
    };
  },
};

// Transição de fade mais suave
const fadeTransition = {
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 400,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current }: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
};

const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
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
        <Stack.Screen 
          name="UserType" 
          component={UserTypeScreen}
          options={{
            ...fadeTransition,
            cardStyle: { backgroundColor: '#1E5E3F' },
          }}
        />
        <Stack.Screen 
          name="CadUnicoForm" 
          component={CadUnicoFormScreen}
          options={{
            ...fadeTransition,
            cardStyle: { backgroundColor: '#1E5E3F' },
          }}
        />
        
        {/* Conditional Rive Screen - Only on mobile */}
        {RiveTestScreen && Platform.OS !== 'web' && (
          <Stack.Screen 
            name="RiveTest" 
            component={RiveTestScreen}
            options={{
              ...fadeTransition,
              cardStyle: { backgroundColor: '#f5f5f5' },
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
