import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Dimensions,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    if (isLogin) {
      // Se está no modo login e clica em "Cadastre-se", vai para UserTypeScreen
      navigation.navigate('UserType');
    } else {
      // Se está no modo cadastro e clica em "Faça login", volta para o modo login
      setIsLogin(true);
      setEmail('');
      setPassword('');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Indicador de handle para arrastar */}
      <View style={styles.handle} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header com logo elegante */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image 
                source={require('./assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>AUXILIUM</Text>
            </View>
          </View>

          {/* Card do formulário */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </Text>
            <Text style={styles.subtitleText}>
              {isLogin 
                ? 'Entre com seus dados para continuar' 
                : 'Junte-se à nossa comunidade solidária'
              }
            </Text>

            {/* Campos de entrada modernos */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CPF/CNPJ do Usuário</Text>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputFocused
                ]}
                placeholder="000.000.000-00"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="numeric"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  passwordFocused && styles.inputFocused
                ]}
                placeholder="Digite sua senha"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>

            {/* Botão principal elegante */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Link para recuperar senha */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            )}

            {/* Toggle dentro do card */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleQuestion}>
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleLink}>
                  {isLogin ? 'Cadastre-se.' : 'Faça login.'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer com indicador */}
          <View style={styles.footer}>
            {/* Indicador home elegante */}
            <View style={styles.homeIndicator} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  handle: {
    width: 60,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.03,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: Math.min(width * 0.06, 24),
    color: 'white',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.06,
  },
  logoImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: height * 0.015,
  },
  logoText: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },
  formCard: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: height * 0.04,
    marginHorizontal: width * 0.05,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  welcomeText: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: '#1E5E3F',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitleText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.04,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    marginBottom: height * 0.008,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.018,
    fontSize: Math.min(width * 0.04, 16),
    color: '#333',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  inputFocused: {
    borderColor: '#1E5E3F',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#1E5E3F',
    borderRadius: 15,
    paddingVertical: height * 0.022,
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.025,
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    color: '#1E5E3F',
    fontSize: Math.min(width * 0.035, 14),
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02, // Espaçamento superior
    paddingTop: height * 0.02, // Padding superior
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0', // Linha sutil de separação
  },
  toggleQuestion: {
    color: '#666',
    fontSize: Math.min(width * 0.035, 14),
    marginRight: 5,
  },
  toggleLink: {
    color: '#1E5E3F',
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: height * 0.02, // Reduzi o padding
  },
  homeIndicator: {
    width: width * 0.35,
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
  },
});

export default LoginScreen;



