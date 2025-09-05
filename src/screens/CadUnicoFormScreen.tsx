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
import { usuarioService, Usuario } from '../services/databaseService';

const { width, height } = Dimensions.get('window');

const CadUnicoFormScreen: React.FC<CadUnicoFormScreenProps> = ({ navigation }) => {
  
  // Estados do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [nis, setNis] = useState('');
  const [renda, setRenda] = useState('');
  const [membros, setMembros] = useState('');
  const [idade, setIdade] = useState('');
  const [categorias, setCategorias] = useState({
    pix: false,
    dinheiro: false,
    cestaBasica: false,
    agasalhos: false,
  });
  const [relato, setRelato] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Funções de validação com regex
  const validacoes = {
    // Nome completo: apenas letras, espaços, acentos
    nomeCompleto: (nome: string): boolean => {
      const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,}$/;
      return regex.test(nome.trim()) && nome.trim().split(' ').length >= 2;
    },

    // Email: formato padrão RFC 5322 simplificado
    email: (email: string): boolean => {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return regex.test(email.trim());
    },

    // Telefone: formato brasileiro (11) 99999-9999 ou variações
    telefone: (telefone: string): boolean => {
      const regex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
      const somenteNumeros = telefone.replace(/\D/g, '');
      return regex.test(telefone) && (somenteNumeros.length === 10 || somenteNumeros.length === 11);
    },

    // CEP: formato brasileiro 00000-000
    cep: (cep: string): boolean => {
      const regex = /^[0-9]{5}-?[0-9]{3}$/;
      return regex.test(cep);
    },

    // Cidade: apenas letras, espaços, acentos, hífens
    cidade: (cidade: string): boolean => {
      const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-]{2,}$/;
      return regex.test(cidade.trim());
    },

    // Estado: apenas letras, 2 caracteres (sigla) ou nome completo
    estado: (estado: string): boolean => {
      const siglaRegex = /^[A-Z]{2}$/;
      const nomeRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{4,}$/;
      return siglaRegex.test(estado.trim()) || nomeRegex.test(estado.trim());
    },

    // NIS: 11 dígitos numéricos
    nis: (nis: string): boolean => {
      const regex = /^[0-9]{11}$/;
      const somenteNumeros = nis.replace(/\D/g, '');
      return regex.test(somenteNumeros);
    },

    // Renda: números decimais com até 2 casas
    renda: (renda: string): boolean => {
      const regex = /^[0-9]+(?:\.[0-9]{1,2})?$/;
      const valor = parseFloat(renda);
      return regex.test(renda) && valor >= 0 && valor <= 999999.99;
    },

    // Membros: número inteiro de 1 a 20
    membros: (membros: string): boolean => {
      const regex = /^[1-9][0-9]?$/;
      const numero = parseInt(membros);
      return regex.test(membros) && numero >= 1 && numero <= 20;
    },

    // Idade: número inteiro de 0 a 120
    idade: (idade: string): boolean => {
      const regex = /^[0-9]{1,3}$/;
      const numero = parseInt(idade);
      return regex.test(idade) && numero >= 0 && numero <= 120;
    },

    // Endereço: letras, números, espaços, vírgulas, pontos, hífens
    endereco: (endereco: string): boolean => {
      const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9,.\-\/]{5,}$/;
      return regex.test(endereco.trim());
    }
  };

  // Função para validar todos os campos
  const validarCampos = (): { valido: boolean; mensagem: string } => {
    // Verificar se alguma categoria foi selecionada
    const algumaCategoriaSecionada = Object.values(categorias).some(cat => cat);
    
    // Validações obrigatórias
    if (!nomeCompleto.trim()) {
      return { valido: false, mensagem: 'Nome completo é obrigatório' };
    }
    if (!validacoes.nomeCompleto(nomeCompleto)) {
      return { valido: false, mensagem: 'Nome completo deve ter pelo menos nome e sobrenome, apenas letras' };
    }

    if (!email.trim()) {
      return { valido: false, mensagem: 'Email é obrigatório' };
    }
    if (!validacoes.email(email)) {
      return { valido: false, mensagem: 'Email deve ter um formato válido (exemplo@dominio.com)' };
    }

    if (!telefone.trim()) {
      return { valido: false, mensagem: 'Telefone é obrigatório' };
    }
    if (!validacoes.telefone(telefone)) {
      return { valido: false, mensagem: 'Telefone deve ter formato brasileiro (11) 99999-9999' };
    }

    if (!endereco.trim()) {
      return { valido: false, mensagem: 'Endereço é obrigatório' };
    }
    if (!validacoes.endereco(endereco)) {
      return { valido: false, mensagem: 'Endereço deve ter pelo menos 5 caracteres válidos' };
    }

    if (!cep.trim()) {
      return { valido: false, mensagem: 'CEP é obrigatório' };
    }
    if (!validacoes.cep(cep)) {
      return { valido: false, mensagem: 'CEP deve ter formato 00000-000' };
    }

    if (!cidade.trim()) {
      return { valido: false, mensagem: 'Cidade é obrigatória' };
    }
    if (!validacoes.cidade(cidade)) {
      return { valido: false, mensagem: 'Cidade deve conter apenas letras' };
    }

    if (!estado.trim()) {
      return { valido: false, mensagem: 'Estado é obrigatório' };
    }
    if (!validacoes.estado(estado)) {
      return { valido: false, mensagem: 'Estado deve ser uma sigla (SP) ou nome completo' };
    }

    if (!nis.trim()) {
      return { valido: false, mensagem: 'NIS é obrigatório' };
    }
    if (!validacoes.nis(nis)) {
      return { valido: false, mensagem: 'NIS deve ter exatamente 11 dígitos' };
    }

    if (!renda.trim()) {
      return { valido: false, mensagem: 'Renda é obrigatória' };
    }
    if (!validacoes.renda(renda)) {
      return { valido: false, mensagem: 'Renda deve ser um valor válido (exemplo: 1500.00)' };
    }

    if (!membros.trim()) {
      return { valido: false, mensagem: 'Número de membros é obrigatório' };
    }
    if (!validacoes.membros(membros)) {
      return { valido: false, mensagem: 'Número de membros deve ser entre 1 e 20' };
    }

    if (idade.trim() && !validacoes.idade(idade)) {
      return { valido: false, mensagem: 'Idade deve ser um número entre 0 e 120' };
    }

    if (!algumaCategoriaSecionada) {
      return { valido: false, mensagem: 'Selecione pelo menos um tipo de doação' };
    }

    return { valido: true, mensagem: '' };
  };
  
  // Estados de foco dos inputs
  const [nomeCompletoFocused, setNomeCompletoFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [telefoneFocused, setTelefoneFocused] = useState(false);
  const [enderecoFocused, setEnderecoFocused] = useState(false);
  const [cepFocused, setCepFocused] = useState(false);
  const [cidadeFocused, setCidadeFocused] = useState(false);
  const [estadoFocused, setEstadoFocused] = useState(false);
  const [nisFocused, setNisFocused] = useState(false);
  const [rendaFocused, setRendaFocused] = useState(false);
  const [membrosFocused, setMembrosFocused] = useState(false);
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
    navigation.goBack();
  };

  const handleSeguir = async () => {
    // Validação com regex
    const { valido, mensagem } = validarCampos();
    
    if (!valido) {
      Alert.alert('Erro de Validação', mensagem);
      return;
    }

    setCarregando(true);

    try {
      // Preparar dados para o Firebase
      const dadosUsuario: Omit<Usuario, 'id' | 'criadoEm'> = {
        nome: nomeCompleto.trim(),
        email: email.toLowerCase().trim(),
        telefone: telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
        tipo: 'beneficiario',
        endereco: {
          cep: cep.replace(/\D/g, ''), // Remove caracteres não numéricos
          rua: endereco.trim(),
          numero: '0', // Campo pode ser adicionado depois
          bairro: 'Centro', // Campo pode ser adicionado depois  
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase()
        },
        cadUnico: {
          nis: nis.replace(/\D/g, ''), // Remove caracteres não numéricos
          renda: parseFloat(renda) || 0,
          membros: parseInt(membros) || 1
        },
        ativo: true
      };

      // Verificar se usuário já existe
      const usuarioExistente = await usuarioService.buscarPorEmail(email.toLowerCase().trim());
      if (usuarioExistente) {
        Alert.alert(
          'Email já cadastrado',
          'Este email já está cadastrado no sistema.'
        );
        setCarregando(false);
        return;
      }

      // Criar usuário no Firebase
      const userId = await usuarioService.criar(dadosUsuario);
      
      console.log('✅ Usuário cadastrado com sucesso! ID:', userId);
      
      Alert.alert(
        'Primeira Etapa Concluída!',
        'Agora vamos completar algumas informações adicionais.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              // Navegar para a segunda parte do formulário
              navigation.navigate('CadUnicoForm2');
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Erro ao cadastrar usuário:', error);
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao salvar seus dados. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  // Funções de formatação automática
  const formatadores = {
    telefone: (value: string) => {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 2) return apenasNumeros;
      if (apenasNumeros.length <= 6) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
      if (apenasNumeros.length <= 10) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    },

    cep: (value: string) => {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 5) return apenasNumeros;
      return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
    },

    nis: (value: string) => {
      return value.replace(/\D/g, '').slice(0, 11);
    },

    renda: (value: string) => {
      // Remove caracteres não numéricos exceto ponto
      let limpo = value.replace(/[^\d.]/g, '');
      // Garante apenas um ponto decimal
      const partes = limpo.split('.');
      if (partes.length > 2) {
        limpo = partes[0] + '.' + partes.slice(1).join('');
      }
      // Limita casas decimais a 2
      if (partes[1] && partes[1].length > 2) {
        limpo = partes[0] + '.' + partes[1].slice(0, 2);
      }
      return limpo;
    },

    membros: (value: string) => {
      return value.replace(/\D/g, '').slice(0, 2);
    },

    idade: (value: string) => {
      return value.replace(/\D/g, '').slice(0, 3);
    }
  };

  const toggleCategory = (categoryKey: keyof typeof categorias) => {
    setCategorias(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios'}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          alwaysBounceVertical={true}
          indicatorStyle="white"
          scrollEnabled={true}
          removeClippedSubviews={false}
          overScrollMode="always"
          contentInsetAdjustmentBehavior="automatic"
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
                onChangeText={(text) => setIdade(formatadores.idade(text))}
                keyboardType="numeric"
                maxLength={3}
                onFocus={() => setIdadeFocused(true)}
                onBlur={() => setIdadeFocused(false)}
              />
            </View>

            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputFocused
                ]}
                placeholder="Email"
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

            {/* Campo Telefone */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  telefoneFocused && styles.inputFocused
                ]}
                placeholder="Telefone (11) 99999-9999"
                placeholderTextColor="#999"
                value={telefone}
                onChangeText={(text) => setTelefone(formatadores.telefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
                onFocus={() => setTelefoneFocused(true)}
                onBlur={() => setTelefoneFocused(false)}
              />
            </View>

            {/* Campo CEP */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  cepFocused && styles.inputFocused
                ]}
                placeholder="CEP 00000-000"
                placeholderTextColor="#999"
                value={cep}
                onChangeText={(text) => setCep(formatadores.cep(text))}
                keyboardType="numeric"
                maxLength={9}
                onFocus={() => setCepFocused(true)}
                onBlur={() => setCepFocused(false)}
              />
            </View>

            {/* Campo Cidade */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  cidadeFocused && styles.inputFocused
                ]}
                placeholder="Cidade"
                placeholderTextColor="#999"
                value={cidade}
                onChangeText={setCidade}
                autoCapitalize="words"
                onFocus={() => setCidadeFocused(true)}
                onBlur={() => setCidadeFocused(false)}
              />
            </View>

            {/* Campo Estado */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  estadoFocused && styles.inputFocused
                ]}
                placeholder="Estado (SP ou São Paulo)"
                placeholderTextColor="#999"
                value={estado}
                onChangeText={setEstado}
                autoCapitalize="characters"
                onFocus={() => setEstadoFocused(true)}
                onBlur={() => setEstadoFocused(false)}
              />
            </View>

            {/* Campo NIS */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  nisFocused && styles.inputFocused
                ]}
                placeholder="NIS (11 dígitos)"
                placeholderTextColor="#999"
                value={nis}
                onChangeText={(text) => setNis(formatadores.nis(text))}
                keyboardType="numeric"
                maxLength={11}
                onFocus={() => setNisFocused(true)}
                onBlur={() => setNisFocused(false)}
              />
            </View>

            {/* Campo Renda */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  rendaFocused && styles.inputFocused
                ]}
                placeholder="Renda Familiar (R$ 0000.00)"
                placeholderTextColor="#999"
                value={renda}
                onChangeText={(text) => setRenda(formatadores.renda(text))}
                keyboardType="decimal-pad"
                onFocus={() => setRendaFocused(true)}
                onBlur={() => setRendaFocused(false)}
              />
            </View>

            {/* Campo Membros */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  membrosFocused && styles.inputFocused
                ]}
                placeholder="Número de Membros da Família"
                placeholderTextColor="#999"
                value={membros}
                onChangeText={(text) => setMembros(formatadores.membros(text))}
                keyboardType="numeric"
                maxLength={2}
                onFocus={() => setMembrosFocused(true)}
                onBlur={() => setMembrosFocused(false)}
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
            <TouchableOpacity 
              style={[styles.seguirButton, carregando && styles.seguirButtonDisabled]} 
              onPress={handleSeguir}
              disabled={carregando}
            >
              <Text style={styles.seguirButtonText}>
                {carregando ? 'Salvando...' : 'Cadastrar'}
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
    ...(Platform.OS === 'web' && {
      overflow: 'auto' as any,
      WebkitOverflowScrolling: 'touch' as any,
      cursor: 'grab' as any,
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.15,
    minHeight: height * 1.5,
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
  seguirButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
  },
});

export default CadUnicoFormScreen;
