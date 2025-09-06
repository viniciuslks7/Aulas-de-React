import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSpring,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Animações de entrada melhoradas
  const backgroundOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.45); // Começa do tamanho que termina na SplashScreen
  const logoTranslateY = useSharedValue(-height * 0.50); // Começa da posição da SplashScreen
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const taglineOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);

  useEffect(() => {
    // Sequência de animações sincronizada com a SplashScreen
    
    // 1. Fundo aparece suavemente
    backgroundOpacity.value = withTiming(1, { 
      duration: 400, 
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) 
    });
    
    // 2. Logo cresce e se move para a posição final (continuando da SplashScreen)
    logoOpacity.value = withDelay(100, withTiming(1, { 
      duration: 500, 
      easing: Easing.out(Easing.quad) 
    }));
    logoScale.value = withDelay(100, withSpring(1, { 
      damping: 15, 
      stiffness: 120,
      mass: 1.2 
    }));
    logoTranslateY.value = withDelay(100, withSpring(0, { 
      damping: 18, 
      stiffness: 100,
      mass: 1.5 
    }));
    
    // 3. Título aparece
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(500, withSpring(0, { damping: 15, stiffness: 150 }));
    
    // 4. Tagline aparece
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    
    // 5. Botões aparecem
    buttonsOpacity.value = withDelay(1100, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(1100, withSpring(0, { damping: 20, stiffness: 100 }));
  }, []);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value }
    ],
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
    navigation.navigate('UserType');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleDoador = () => {
    navigation.navigate('Login');
  };

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Conteúdo Central */}
          <View style={styles.content}>
          {/* Logo/Ícone */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image 
              source={require('../../assets/logo.png')}
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
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCadastro}
          >
            <Text style={styles.buttonText}>CADASTRE-SE</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleDoador}
          >
            <Text style={styles.buttonText}>SOU UM DOADOR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF5722' }]}
            onPress={() => navigation.navigate('FirebaseTest')}
          >
            <Text style={styles.buttonText}>TESTAR FIREBASE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Indicador Home */}
      <View style={styles.homeIndicator} />
        </ScrollView>
    </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  testButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    borderColor: '#2196F3',
  },
  testButtonText: {
    color: 'white',
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



