import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import Rive, { RiveRef } from 'rive-react-native'; // Descomente quando tiver arquivo .riv

const { width, height } = Dimensions.get('window');

const SplashScreenWithRive: React.FC = () => {
  const navigation = useNavigation();
  
  // Animações existentes
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const moneyOpacity = useRef(new Animated.Value(0)).current;
  const moneyTranslateX = useRef(new Animated.Value(-50)).current;
  
  // Ref para animação Rive (descomente quando tiver arquivo .riv)
  // const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    const startAnimations = () => {
      // Animação de pulsação do logo
      const pulsate = () => {
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulsate());
      };

      // Animação da barra de progresso
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }).start();

      // Animação do ícone de dinheiro
      Animated.parallel([
        Animated.timing(moneyOpacity, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moneyTranslateX, {
          toValue: 0,
          duration: 800,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      pulsate();

      // Navegação após 3 segundos
      setTimeout(() => {
        // Animação de saída
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          (navigation as any).navigate('Home');
        });
      }, 3000);
    };

    startAnimations();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background com gradiente visual */}
      <View style={styles.backgroundGradient} />
      
      {/* Área principal do logo */}
      <View style={styles.logoSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Área para animação Rive (quando disponível) */}
        <View style={styles.riveContainer}>
          {/* 
          Descomente quando tiver um arquivo .riv:
          
          <Rive
            ref={riveRef}
            resourceName="auxilium_splash.riv"
            autoplay={true}
            style={styles.riveAnimation}
            stateMachineName="SplashStateMachine"
            onPlay={(animationName) => {
              console.log('Rive splash started:', animationName);
            }}
            onLoopEnd={(animationName) => {
              console.log('Rive splash loop ended:', animationName);
            }}
          />
          */}
          
          {/* Placeholder para animação Rive */}
          <View style={styles.rivePlaceholder}>
            <Text style={styles.placeholderText}>
              Animação Rive{'\n'}(Adicione arquivo .riv)
            </Text>
          </View>
        </View>

        <Text style={styles.appName}>AUXILIUM</Text>
        <Text style={styles.tagline}>Conectando corações, transformando vidas</Text>
      </View>

      {/* Barra de progresso com animação de entrega */}
      <View style={styles.progressSection}>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          
          {/* Ícone de dinheiro animado */}
          <Animated.View
            style={[
              styles.moneyIcon,
              {
                opacity: moneyOpacity,
                transform: [
                  { translateX: moneyTranslateX },
                  { 
                    translateX: progressWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width * 0.6],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.moneyEmoji}>💰</Text>
          </Animated.View>
        </View>
        
        <Text style={styles.loadingText}>Preparando sua experiência...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E5E3F',
    opacity: 0.9,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  riveContainer: {
    width: 200,
    height: 150,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riveAnimation: {
    width: '100%',
    height: '100%',
  },
  rivePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  moneyIcon: {
    position: 'absolute',
    top: -15,
    left: -15,
  },
  moneyEmoji: {
    fontSize: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SplashScreenWithRive;
