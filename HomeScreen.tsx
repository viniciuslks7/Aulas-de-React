import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>AUXILIUM</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Coragem para se doar, num mundo em que só se pensa em receber...
        </Text>

        {/* Botões */}
        <View style={styles.buttonContainer}>
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
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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



