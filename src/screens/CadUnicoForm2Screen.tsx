import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { CadUnicoForm2ScreenProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const CadUnicoForm2Screen: React.FC<CadUnicoForm2ScreenProps> = ({ navigation }) => {
  
  // Estados do formulário
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // Estados de foco dos inputs
  const [rgFocused, setRgFocused] = useState(false);
  const [cpfFocused, setCpfFocused] = useState(false);
  const [chavePixFocused, setChavePixFocused] = useState(false);
  const [telefoneFocused, setTelefoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);
  const [confirmarSenhaFocused, setConfirmarSenhaFocused] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Funções de validação com regex
  const validacoes = {
    // RG: formato brasileiro
    rg: (rg: string): boolean => {
      const regex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9X]$/;
      const somenteNumeros = rg.replace(/\D/g, '');
      return regex.test(rg) || (somenteNumeros.length >= 7 && somenteNumeros.length <= 9);
    },

    // CPF: formato brasileiro com validação básica
    cpf: (cpf: string): boolean => {
      const regex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
      const somenteNumeros = cpf.replace(/\D/g, '');
      return regex.test(cpf) && somenteNumeros.length === 11;
    },

    // Chave PIX: CPF, email, telefone ou chave aleatória
    chavePix: (chave: string): boolean => {
      const cpfRegex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$|^[0-9]{11}$/;
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      const telefoneRegex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
      const chaveAleatoria = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
      
      return cpfRegex.test(chave) || emailRegex.test(chave) || telefoneRegex.test(chave) || chaveAleatoria.test(chave);
    },

    // Telefone: formato brasileiro
    telefone: (telefone: string): boolean => {
      const regex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
      const somenteNumeros = telefone.replace(/\D/g, '');
      return regex.test(telefone) && (somenteNumeros.length === 10 || somenteNumeros.length === 11);
    },

    // Email: formato padrão
    email: (email: string): boolean => {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return regex.test(email.trim());
    },

    // Senha: mínimo 6 caracteres
    senha: (senha: string): boolean => {
      return senha.length >= 6;
    }
  };

  // Funções de formatação automática
  const formatadores = {
    rg: (value: string) => {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 2) return apenasNumeros;
      if (apenasNumeros.length <= 5) return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2)}`;
      if (apenasNumeros.length <= 8) return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2, 5)}.${apenasNumeros.slice(5)}`;
      return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2, 5)}.${apenasNumeros.slice(5, 8)}-${apenasNumeros.slice(8, 9)}`;
    },

    cpf: (value: string) => {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 3) return apenasNumeros;
      if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
      if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
    },

    telefone: (value: string) => {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 2) return apenasNumeros;
      if (apenasNumeros.length <= 6) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
      if (apenasNumeros.length <= 10) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }
  };

  // Função para validar todos os campos
  const validarCampos = (): { valido: boolean; mensagem: string } => {
    if (!rg.trim()) {
      return { valido: false, mensagem: 'RG é obrigatório' };
    }
    if (!validacoes.rg(rg)) {
      return { valido: false, mensagem: 'RG deve ter formato válido (00.000.000-0)' };
    }

    if (!cpf.trim()) {
      return { valido: false, mensagem: 'CPF é obrigatório' };
    }
    if (!validacoes.cpf(cpf)) {
      return { valido: false, mensagem: 'CPF deve ter formato válido (000.000.000-00)' };
    }

    if (!chavePix.trim()) {
      return { valido: false, mensagem: 'Chave PIX é obrigatória' };
    }
    if (!validacoes.chavePix(chavePix)) {
      return { valido: false, mensagem: 'Chave PIX deve ser um CPF, email, telefone ou chave aleatória válida' };
    }

    if (telefone.trim() && !validacoes.telefone(telefone)) {
      return { valido: false, mensagem: 'Telefone deve ter formato brasileiro (11) 99999-9999' };
    }

    if (!email.trim()) {
      return { valido: false, mensagem: 'Email é obrigatório' };
    }
    if (!validacoes.email(email)) {
      return { valido: false, mensagem: 'Email deve ter um formato válido' };
    }

    if (!senha.trim()) {
      return { valido: false, mensagem: 'Senha é obrigatória' };
    }
    if (!validacoes.senha(senha)) {
      return { valido: false, mensagem: 'Senha deve ter pelo menos 6 caracteres' };
    }

    if (senha !== confirmarSenha) {
      return { valido: false, mensagem: 'Senhas não coincidem' };
    }

    return { valido: true, mensagem: '' };
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConcluir = async () => {
    // Validação com regex
    const { valido, mensagem } = validarCampos();
    
    if (!valido) {
      Alert.alert('Erro de Validação', mensagem);
      return;
    }

    setCarregando(true);

    try {
      // Aqui você pode salvar os dados adicionais ou finalizar o cadastro
      console.log('✅ Formulário 1.2 concluído!', {
        rg: rg.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        chavePix,
        telefone: telefone.replace(/\D/g, ''),
        email: email.toLowerCase().trim(),
        senha // Em produção, nunca logue a senha
      });
      
      Alert.alert(
        'Cadastro Concluído!',
        'Seu cadastro foi finalizado com sucesso. Agora você pode receber doações.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Erro ao finalizar cadastro:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao finalizar seu cadastro. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  const gerarChavePix = () => {
    // Gerar chave PIX aleatória
    const chaveAleatoria = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setChavePix(chaveAleatoria);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formulário</Text>
      </View>

      {/* Separador */}
      <View style={styles.separator} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEnabled={true}
        >
          {/* Logo da aplicação */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <View style={styles.box}>
                <View style={styles.boxFront} />
                <View style={styles.boxSide} />
                <View style={styles.heart} />
              </View>
            </View>
          </Animated.View>

          {/* Conteúdo do formulário */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Campos RG e CPF lado a lado */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <TextInput
                  style={[
                    styles.input,
                    rgFocused && styles.inputFocused
                  ]}
                  placeholder="RG: 00.000.000-0"
                  placeholderTextColor="#999"
                  value={rg}
                  onChangeText={(text) => setRg(formatadores.rg(text))}
                  maxLength={12}
                  onFocus={() => setRgFocused(true)}
                  onBlur={() => setRgFocused(false)}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <TextInput
                  style={[
                    styles.input,
                    cpfFocused && styles.inputFocused
                  ]}
                  placeholder="CPF: 000.000.000-00"
                  placeholderTextColor="#999"
                  value={cpf}
                  onChangeText={(text) => setCpf(formatadores.cpf(text))}
                  keyboardType="numeric"
                  maxLength={14}
                  onFocus={() => setCpfFocused(true)}
                  onBlur={() => setCpfFocused(false)}
                />
              </View>
            </View>

            {/* Botões Frente/Verso para RG e CPF */}
            <View style={styles.documentsRow}>
              <View style={styles.documentButtons}>
                <TouchableOpacity style={styles.docButton}>
                  <Text style={styles.docButtonText}>📄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.docButton}>
                  <Text style={styles.docButtonText}>📄</Text>
                </TouchableOpacity>
                <Text style={styles.docLabel}>Frente Verso</Text>
              </View>

              <View style={styles.documentButtons}>
                <TouchableOpacity style={styles.docButton}>
                  <Text style={styles.docButtonText}>📄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.docButton}>
                  <Text style={styles.docButtonText}>📄</Text>
                </TouchableOpacity>
                <Text style={styles.docLabel}>Frente Verso</Text>
              </View>
            </View>

            {/* Campo Chave Pix */}
            <View style={styles.inputContainer}>
              <View style={styles.pixContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.pixInput,
                    chavePixFocused && styles.inputFocused
                  ]}
                  placeholder="Chave Pix"
                  placeholderTextColor="#999"
                  value={chavePix}
                  onChangeText={setChavePix}
                  onFocus={() => setChavePixFocused(true)}
                  onBlur={() => setChavePixFocused(false)}
                />
                <TouchableOpacity style={styles.gerarPixButton} onPress={gerarChavePix}>
                  <Text style={styles.gerarPixText}>Criar chave pix?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Campo Telefone */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  telefoneFocused && styles.inputFocused
                ]}
                placeholder="Telefone Pessoal (Opcional)"
                placeholderTextColor="#999"
                value={telefone}
                onChangeText={(text) => setTelefone(formatadores.telefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
                onFocus={() => setTelefoneFocused(true)}
                onBlur={() => setTelefoneFocused(false)}
              />
            </View>

            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputFocused
                ]}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  senhaFocused && styles.inputFocused
                ]}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => setSenhaFocused(true)}
                onBlur={() => setSenhaFocused(false)}
              />
            </View>

            {/* Campo Repetir Senha */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  confirmarSenhaFocused && styles.inputFocused
                ]}
                placeholder="Repita a senha"
                placeholderTextColor="#999"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => setConfirmarSenhaFocused(true)}
                onBlur={() => setConfirmarSenhaFocused(false)}
              />
            </View>

            {/* Botão Concluído */}
            <TouchableOpacity 
              style={[styles.concluirButton, carregando && styles.concluirButtonDisabled]} 
              onPress={handleConcluir}
              disabled={carregando}
            >
              <Text style={styles.concluirButtonText}>
                {carregando ? 'Finalizando...' : 'Concluído'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    paddingTop: height * 0.04,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.04,
  },
  backButtonText: {
    fontSize: Math.min(width * 0.05, 20),
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Math.min(width * 0.05, 20),
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: width * 0.05,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.15,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  box: {
    position: 'relative',
    width: width * 0.15,
    height: width * 0.15,
  },
  boxFront: {
    position: 'absolute',
    bottom: 0,
    left: '12.5%',
    width: '75%',
    height: '60%',
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
  },
  boxSide: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '25%',
    height: '60%',
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  heart: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: [{ translateX: -width * 0.03 }],
    width: width * 0.06,
    height: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.03,
  },
  formContainer: {
    backgroundColor: '#A8D5BA',
    marginHorizontal: width * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    backgroundColor: '#FFFFFF',
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
  documentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  documentButtons: {
    alignItems: 'center',
    width: '48%',
  },
  docButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1E5E3F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  docButtonText: {
    fontSize: 20,
    color: 'white',
  },
  docLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  pixContainer: {
    position: 'relative',
  },
  pixInput: {
    paddingRight: width * 0.25,
  },
  gerarPixButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  gerarPixText: {
    color: '#1E5E3F',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  concluirButton: {
    backgroundColor: '#1E5E3F',
    borderRadius: 15,
    paddingVertical: height * 0.022,
    alignItems: 'center',
    marginTop: height * 0.03,
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  concluirButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  concluirButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default CadUnicoForm2Screen;
