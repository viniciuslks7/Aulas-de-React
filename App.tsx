import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { 
  createStackNavigator, 
  TransitionPresets,
  StackCardInterpolationProps 
} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import { Easing } from 'react-native';

const Stack = createStackNavigator();

// Configuração de transição personalizada
const customTransition = {
  gestureEnabled: true,
  gestureDirection: 'vertical' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 600,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 400,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
          {
            scale: current.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 0.95, 1],
            }),
          },
          {
            rotateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['10deg', '0deg'],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.8, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1E5E3F' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            ...TransitionPresets.RevealFromBottomAndroid,
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={customTransition}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
