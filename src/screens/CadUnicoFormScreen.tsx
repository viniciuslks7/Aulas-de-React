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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CadUnicoFormScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Estados do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [categorias, setCategorias] = useState({
    pix: false,
    dinheiro: false,
    cestaBasica: false,
    agasalhos: false,
  });
  const [relato, setRelato] = useState('');
  
  // Estados de foco dos inputs
  const [nomeCompletoFocused, setNomeCompletoFocused] = useState(false);
  const [enderecoFocused, setEnderecoFocused] = useState(false);
  const [idadeFocused, setIdadeFocused] = useState(false);
  const [relatoFocused, setRelatoFocused] = useState(false);

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

  const handleBack = () => {
    (navigation as any).goBack();
  };

  const handleSeguir = () => {
    // Validação básica - pelo menos uma categoria deve ser selecionada
    const algumaCategoriaSecionada = Object.values(categorias).some(cat => cat);
    
    if (!nomeCompleto || !endereco || !idade || !algumaCategoriaSecionada || !relato) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione ao menos um tipo de doação.');
      return;
    }
    
    // Navegar para próxima tela do formulário
    console.log('Dados coletados:', {
      nomeCompleto,
      endereco,
      idade,
      categorias,
      relato,
    });
    
    // TODO: Navegar para próxima parte do formulário
    alert('Primeira parte do cadastro concluída!');
  };

  const toggleCategory = (categoryKey: keyof typeof categorias) => {
    setCategorias(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Formulário</Text>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEventThrottle={16}
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
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
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
            {/* Título da seção */}
            <Text style={styles.sectionTitle}>Indivíduo</Text>
            <Text style={styles.sectionSubtitle}>Preencha os campos a seguir:</Text>

            {/* Campo Nome Completo */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  nomeCompletoFocused && styles.inputFocused
                ]}
                placeholder="Nome Completo"
                placeholderTextColor="#999"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                autoCapitalize="words"
                onFocus={() => setNomeCompletoFocused(true)}
                onBlur={() => setNomeCompletoFocused(false)}
              />
            </View>

            {/* Campo Endereço */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  enderecoFocused && styles.inputFocused
                ]}
                placeholder="Endereço"
                placeholderTextColor="#999"
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="words"
                onFocus={() => setEnderecoFocused(true)}
                onBlur={() => setEnderecoFocused(false)}
              />
            </View>

            {/* Campo Idade */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  idadeFocused && styles.inputFocused
                ]}
                placeholder="Idade"
                placeholderTextColor="#999"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                maxLength={3}
                onFocus={() => setIdadeFocused(true)}
                onBlur={() => setIdadeFocused(false)}
              />
            </View>

            {/* Categorias de Doação */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesTitle}>Tipos de doação que precisa:</Text>
              
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  categorias.pix && styles.categoryItemSelected
                ]}
                onPress={() => toggleCategory('pix')}
              >
                <Image
                  source={require('../../assets/pix.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>Pix</Text>
                <View style={[styles.checkbox, categorias.pix && styles.checkboxSelected]}>
                  {categorias.pix && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  categorias.dinheiro && styles.categoryItemSelected
                ]}
                onPress={() => toggleCategory('dinheiro')}
              >
                <Image
                  source={require('../../assets/dinheiro.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>Dinheiro</Text>
                <View style={[styles.checkbox, categorias.dinheiro && styles.checkboxSelected]}>
                  {categorias.dinheiro && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  categorias.cestaBasica && styles.categoryItemSelected
                ]}
                onPress={() => toggleCategory('cestaBasica')}
              >
                <Image
                  source={require('../../assets/cestabasica.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>Cesta básica</Text>
                <View style={[styles.checkbox, categorias.cestaBasica && styles.checkboxSelected]}>
                  {categorias.cestaBasica && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  categorias.agasalhos && styles.categoryItemSelected
                ]}
                onPress={() => toggleCategory('agasalhos')}
              >
                <Image
                  source={require('../../assets/agasalho.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>Agasalhos</Text>
                <View style={[styles.checkbox, categorias.agasalhos && styles.checkboxSelected]}>
                  {categorias.agasalhos && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>

            {/* Campo Relato */}
            <View style={styles.inputContainer}>
              <Text style={styles.relatoLabel}>Relato</Text>
              <Text style={styles.relatoSubtitle}>
                Fale um pouco sobre a sua história e suas necessidades.
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  relatoFocused && styles.inputFocused
                ]}
                placeholder="Descreva sua situação..."
                placeholderTextColor="#999"
                value={relato}
                onChangeText={setRelato}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => setRelatoFocused(true)}
                onBlur={() => setRelatoFocused(false)}
              />
            </View>

            {/* Botão Seguir */}
            <TouchableOpacity style={styles.seguirButton} onPress={handleSeguir}>
              <Text style={styles.seguirButtonText}>Seguir</Text>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.1,
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
    flex: 1,
    backgroundColor: '#A8D5BA',
    marginHorizontal: width * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
    minHeight: height * 0.7,
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: '#1E5E3F',
    marginBottom: height * 0.01,
  },
  sectionSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#333',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.018,
    fontSize: Math.min(width * 0.04, 16),
    color: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    borderColor: '#1E5E3F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  halfInputContainer: {
    width: '48%',
  },
  halfInput: {
    width: '100%',
  },
  relatoLabel: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#1E5E3F',
    marginBottom: height * 0.005,
  },
  relatoSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    marginBottom: height * 0.015,
  },
  textArea: {
    height: height * 0.15,
    paddingTop: height * 0.015,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seguirButton: {
    backgroundColor: '#1E5E3F',
    borderRadius: 12,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: height * 0.03,
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  seguirButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default CadUnicoFormScreen;
