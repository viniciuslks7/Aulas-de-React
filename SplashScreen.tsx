import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const exitScaleAnim = useRef(new Animated.Value(1)).current;
  const exitOpacityAnim = useRef(new Animated.Value(1)).current;
  const exitTranslateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada do logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Inicia a pulsação após a entrada
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2, // Aumentei de 1.1 para 1.2 (20% maior)
            duration: 800, // Diminuí de 1000 para 800ms (mais rápido)
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800, // Diminuí de 1000 para 800ms (mais rápido)
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Animação do loading sincronizada com o movimento do dinheiro
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2500, // Tempo total para completar o carregamento
      useNativeDriver: false,
    }).start();

    // Animação de saída da logo após 2.7 segundos
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(exitScaleAnim, {
          toValue: 0.4, // Reduz para o tamanho da HomeScreen (30% vs 25% da tela)
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(exitOpacityAnim, {
          toValue: 0, // Esmaece
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(exitTranslateYAnim, {
          toValue: -height * 0.45, // Move para cima, posição da HomeScreen
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish(); // Chama após a animação de saída
      });
    }, 2700);

    return () => clearTimeout(exitTimer);
  }, [fadeAnim, scaleAnim, loadingAnim, pulseAnim, exitScaleAnim, exitOpacityAnim, exitTranslateYAnim, onFinish]);

  const loadingWidth = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // O dinheiro agora acompanha exatamente a barra de carregamento
  const moneyIconPosition = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.5], // Sincronizado com a barra
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E5E3F" barStyle="light-content" />
      
      {/* Logo real da aplicação com pulsação */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: Animated.multiply(fadeAnim, exitOpacityAnim),
            transform: [
              { 
                scale: Animated.multiply(
                  Animated.multiply(scaleAnim, pulseAnim), 
                  exitScaleAnim
                ) 
              },
              { translateY: exitTranslateYAnim },
            ],
          },
        ]}
      >
        <Image
          source={require('./assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Indicador de carregamento com animação de entrega */}
      <View style={styles.loadingContainer}>
        {/* Ícone de acolhimento fixo no final */}
        <View style={styles.acolhimentoContainer}>
          <Image
            source={require('./assets/acolhimento-icon.png')}
            style={styles.acolhimentoIcon}
            resizeMode="contain"
          />
        </View>

        {/* Barra de carregamento */}
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              { width: loadingWidth },
            ]}
          />
        </View>

        {/* Ícone de dinheiro animado */}
        <Animated.View
          style={[
            styles.moneyIconContainer,
            {
              transform: [{ translateX: moneyIconPosition }],
            },
          ]}
        >
          <Image
            source={require('./assets/iconmoney.png')}
            style={styles.moneyIcon}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.15,
  },
  logoImage: {
    width: width * 0.50,
    height: width * 0.50,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 10,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  acolhimentoContainer: {
    position: 'absolute',
    right: -20,
    top: -25,
    zIndex: 10,
  },
  acolhimentoIcon: {
    width: 35,
    height: 35,
    tintColor: '#FFFFFF',
  },
  moneyIconContainer: {
    position: 'absolute',
    left: -20,
    top: -25,
    zIndex: 10,
  },
  moneyIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFD700', // Cor dourada para o dinheiro
  },
});

export default SplashScreen;
