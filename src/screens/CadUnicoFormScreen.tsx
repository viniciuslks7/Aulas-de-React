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
import { CadUnicoFormScreenProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const CadUnicoFormScreen: React.FC<CadUnicoFormScreenProps> = ({ navigation }) => {
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
  const [carregando, setCarregando] = useState(false);

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

  // Função para lidar com botão seguir
  const handleSeguir = () => {
    console.log('🔵 CadUnicoFormScreen - handleSeguir chamado');
    console.log('🔵 Estado atual dos campos:', {
      nomeCompleto,
      endereco,
      idade,
      categorias,
      relato
    });
    
    // Validação básica
    if (!nomeCompleto.trim() || !endereco.trim() || !idade.trim()) {
      console.log('❌ Validação falhou: campos obrigatórios vazios');
      Alert.alert('Campos obrigatórios', 'Por favor, preencha nome, endereço e idade.');
      return;
    }

    // Verificar se pelo menos uma categoria foi selecionada
    const categoriaSelecionada = Object.values(categorias).some(valor => valor);
    if (!categoriaSelecionada) {
      console.log('❌ Validação falhou: nenhuma categoria selecionada');
      Alert.alert('Categoria obrigatória', 'Por favor, selecione pelo menos um tipo de doação.');
      return;
    }

    console.log('✅ Validações passaram, preparando dados...');

    // Dados do formulário para passar para a próxima tela
    const dadosFormulario = {
      nomeCompleto: nomeCompleto.trim(),
      endereco: endereco.trim(),
      idade: idade.trim(),
      categorias,
      relato: relato.trim(),
    };

    console.log('🔵 CadUnicoFormScreen - Dados preparados para navegação:', dadosFormulario);
    console.log('🔵 Navegando para CadUnicoForm2 com dadosFormulario...');

    // Navegar para CadUnicoForm2 passando os dados
    navigation.navigate('CadUnicoForm2', { dadosFormulario });
  };

  return (
    <SafeAreaView style={styles.safeArea}> 
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro Único</Text>
      </View>
      
      <View style={styles.separator} />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEnabled={true}
        >
          <Animated.Image
            source={require('../../assets/logo.png')}
            style={[
              styles.logoImage,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            resizeMode="contain"
          />
          
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
                id="nomeCompleto"
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
                id="endereco"
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
                id="idade"
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
                onPress={() => setCategorias({ ...categorias, pix: !categorias.pix })}
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
                onPress={() => setCategorias({ ...categorias, dinheiro: !categorias.dinheiro })}
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
                onPress={() => setCategorias({ ...categorias, cestaBasica: !categorias.cestaBasica })}
              >
                <Image
                  source={require('../../assets/cestabasica.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>Cesta Básica</Text>
                <View style={[styles.checkbox, categorias.cestaBasica && styles.checkboxSelected]}>
                  {categorias.cestaBasica && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  categorias.agasalhos && styles.categoryItemSelected
                ]}
                onPress={() => setCategorias({ ...categorias, agasalhos: !categorias.agasalhos })}
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
                id="relato"
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
            <TouchableOpacity 
              style={[styles.seguirButton, carregando && styles.seguirButtonDisabled]} 
              onPress={handleSeguir}
              disabled={carregando}
            >
              <Text style={styles.seguirButtonText}>
                {carregando ? 'Salvando...' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layout Principal
  safeArea: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  
  // Header
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
  
  // Containers de Scroll
  keyboardContainer: {
    flex: 1,
    maxHeight: height - 120,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#1E5E3F',
    maxHeight: height - 120,
  },
  scrollContent: {
    paddingBottom: height * 0.1,
  },
  
  // Logo
  logoImage: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    marginVertical: height * 0.02,
  },
  
  // Formulário
  formContainer: {
    backgroundColor: '#A8D5BA',
    marginHorizontal: width * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: '#1E5E3F',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#333',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  
  // Inputs
  inputContainer: {
    marginBottom: height * 0.02,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    borderColor: '#1E5E3F',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  textArea: {
    height: height * 0.15,
    paddingTop: height * 0.015,
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
  
  // Categorias
  categoriesContainer: {
    marginBottom: height * 0.03,
  },
  categoriesTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#1E5E3F',
    marginBottom: height * 0.02,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    marginBottom: height * 0.015,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItemSelected: {
    borderColor: '#1E5E3F',
    backgroundColor: '#F0F8F5',
    shadowColor: '#1E5E3F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.03,
  },
  categoryText: {
    flex: 1,
    fontSize: Math.min(width * 0.04, 16),
    color: '#333',
    fontWeight: '500',
  },
  checkbox: {
    width: width * 0.06,
    height: width * 0.06,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#1E5E3F',
    backgroundColor: '#1E5E3F',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: 'bold',
  },
  
  // Botão
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
  seguirButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
  seguirButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default CadUnicoFormScreen;
