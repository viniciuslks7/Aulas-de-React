import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSpring,
  Easing 
} from 'react-native-reanimated';
import { useButtonPressAnimation } from './AnimatedTransition';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const cadastroAnimation = useButtonPressAnimation();
  const loginAnimation = useButtonPressAnimation();
  const doadorAnimation = useButtonPressAnimation();

  // Animações de entrada
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const taglineOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);

  useEffect(() => {
    // Sequência de animações de entrada
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 150 }));
    
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    
    buttonsOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(900, withSpring(0, { damping: 20, stiffness: 100 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const handleCadastro = () => {
    navigation.navigate('Login');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleDoador = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Conteúdo Central */}
      <View style={styles.content}>
        {/* Logo/Ícone */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image 
            source={require('./assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Título */}
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          AUXILIUM
        </Animated.Text>
        
        {/* Tagline */}
        <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
          Coragem para se doar, num mundo em que só se pensa em receber...
        </Animated.Text>

        {/* Botões */}
        <Animated.View style={[styles.buttonContainer, buttonsAnimatedStyle]}>
          <Animated.View style={cadastroAnimation.animatedStyle}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleCadastro}
              onPressIn={cadastroAnimation.onPressIn}
              onPressOut={cadastroAnimation.onPressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>CADASTRE-SE</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={loginAnimation.animatedStyle}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleLogin}
              onPressIn={loginAnimation.onPressIn}
              onPressOut={loginAnimation.onPressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={doadorAnimation.animatedStyle}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleDoador}
              onPressIn={doadorAnimation.onPressIn}
              onPressOut={doadorAnimation.onPressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>SOU UM DOADOR</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Indicador Home */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1, // 10% da largura da tela
  },
  logoContainer: {
    marginBottom: height * 0.05, // 5% da altura da tela
    alignItems: 'center',
    // Sombra sutil para o logo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoImage: {
    width: width * 0.3, // 30% da largura da tela
    height: width * 0.3, // Mantém proporção quadrada
    maxWidth: 120,
    maxHeight: 120,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32), // Responsivo com máximo de 32
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.025, // 2.5% da altura
    textAlign: 'center',
  },
  tagline: {
    fontSize: Math.min(width * 0.04, 16), // Responsivo com máximo de 16
    color: 'white',
    textAlign: 'center',
    marginBottom: height * 0.075, // 7.5% da altura
    lineHeight: Math.min(width * 0.06, 24), // Responsivo
    paddingHorizontal: width * 0.05, // 5% da largura
  },
  buttonContainer: {
    width: '100%',
    gap: height * 0.025, // 2.5% da altura entre botões
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: Math.min(width * 0.03, 12), // Responsivo
    paddingVertical: height * 0.022, // 2.2% da altura
    paddingHorizontal: width * 0.075, // 7.5% da largura
    alignItems: 'center',
    // Sombra mais sutil e elegante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#1E5E3F',
    fontSize: Math.min(width * 0.04, 16), // Responsivo
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  homeIndicator: {
    width: width * 0.35, // 35% da largura
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: height * 0.025, // 2.5% da altura
  },
});

export default HomeScreen;



