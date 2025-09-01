import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Dimensions,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    if (isLogin) {
      if (email && password) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        // Aqui você pode adicionar a lógica de autenticação
      } else {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
      }
    } else {
      if (email && password) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        // Aqui você pode adicionar a lógica de cadastro
      } else {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isLogin ? 'LOGIN' : 'CADASTRO'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>AUXILIUM</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isLogin ? 'ENTRAR' : 'CADASTRAR'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleButtonText}>
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: Math.min(width * 0.06, 24),
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Math.min(width * 0.05, 20),
    color: 'white',
    fontWeight: 'bold',
  },
  placeholder: {
    width: width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  logoContainer: {
    marginBottom: height * 0.08,
  },
  logoText: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: Math.min(width * 0.03, 12),
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.025,
    fontSize: Math.min(width * 0.04, 16),
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: Math.min(width * 0.03, 12),
    paddingVertical: height * 0.025,
    alignItems: 'center',
    marginBottom: height * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#1E5E3F',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.035, 14),
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;



