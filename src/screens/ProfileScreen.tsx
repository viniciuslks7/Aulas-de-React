import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Animated,
  StatusBar,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { ProfileScreenProps } from '../types/navigation';
import { useUser } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { storage, auth } from '../services/connectionFirebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateEmail as firebaseUpdateEmail, updatePassword as firebaseUpdatePassword, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { 
  maskCPF, 
  maskRG, 
  maskPhone, 
  maskCEP, 
  validateField, 
  applyMask,
  cleanMask 
} from '../utils/validation';

const { width, height } = Dimensions.get('window');

// 🌈 Native Gradient Component 
const GradientBackground = ({ colors, style, children }: { 
  colors: string[], 
  style?: any, 
  children?: React.ReactNode 
}) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      <View style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colors[1], 
          opacity: 0.7 
        }
      ]} />
      <View style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colors[2] || colors[1], 
          opacity: 0.4 
        }
      ]} />
      {children}
    </View>
  );
};

// 🎨 DESIGN SYSTEM - Consistente com MainScreen
const DESIGN_SYSTEM = {
  colors: {
    primary: '#4CAF50',
    primaryLight: '#66BB6A',
    primaryDark: '#388E3C',
    secondary: '#8BC34A',
    accent: '#81C784',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    outline: '#E8F5E8',
    onSurface: '#1B5E20',
    onSurfaceVariant: '#4A6741',
    background: '#F1F8E9',
    shadow: 'rgba(76, 175, 80, 0.08)',
    shadowMedium: 'rgba(76, 175, 80, 0.12)',
    shadowHeavy: 'rgba(76, 175, 80, 0.16)',
    glassmorphism: 'rgba(255, 255, 255, 0.95)',
    gradient: ['#2E7D32', '#388E3C', '#4CAF50'],
    gradientGreen: ['#1B5E20', '#2E7D32', '#388E3C'],
    gradientLight: ['#81C784', '#A5D6A7', '#C8E6C9'],
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 14, fontWeight: '600', lineHeight: 20 }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6
    }
  }
};

// 📝 Interface do Usuário CadÚnico
interface UserProfile {
  id: string;
  nome: string;
  rg: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
  telefone: string;
  email: string;
  relato: string;
  fotoPerfil?: any;
  dataCadastro: string;
  verificado: boolean;
}

// 📊 Dados Mock do Usuário (simulando CadÚnico)
const mockUserData: UserProfile = {
  id: '1',
  nome: 'Maria Santos da Silva',
  rg: '12.345.678-9',
  cpf: '123.456.789-00',
  endereco: {
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Vila Esperança',
    cidade: 'São Paulo',
    cep: '08120-000',
    estado: 'SP'
  },
  telefone: '(11) 98765-4321',
  email: 'maria.santos@email.com',
  relato: 'Sou mãe de 3 filhos e trabalho como diarista. Estou passando por dificuldades financeiras e preciso de ajuda para comprar alimentos básicos para minha família.',
  fotoPerfil: require('../../assets/logo.png'),
  dataCadastro: '2025-01-15',
  verificado: true
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, updateUser, isLoading, logout } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<any>({});
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  // Usar dados do contexto ou fallback para mock
  const userData = user || mockUserData;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // 📝 Função para aplicar máscaras de formatação na exibição
  const formatForDisplay = (field: string, value: string): string => {
    switch (field) {
      case 'cpf':
        return maskCPF(value);
      case 'rg':
        return maskRG(value);
      case 'telefone':
        return maskPhone(value);
      case 'cep':
        return maskCEP(value);
      default:
        return value;
    }
  };

  // 📝 Função para salvar alterações
  const handleSave = async (field: string, value: string) => {
    try {
      // Validar campo antes de salvar
      const validation = validateField(field, value);
      if (!validation.isValid) {
        Alert.alert('❌ Erro de Validação', validation.message);
        return;
      }

      // Limpar máscara para campos que precisam ser salvos sem formatação
      const cleanValue = ['telefone', 'cpf', 'cep'].includes(field) 
        ? cleanMask(field, value) 
        : value;

      await updateUser({ [field]: cleanValue });
      setEditingField(null);
      setTempValues({});
      Alert.alert('✅ Sucesso', 'Informação atualizada com sucesso!');
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível salvar as alterações');
    }
  };

  // � Seleção de imagem e upload para Firebase Storage
  const pickImageAndUpload = async (fromCamera = false) => {
    try {
      // pedir permissão
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });


      if ((result as any).canceled || !(result as any).assets?.length) return;

      const localUri = (result as any).assets[0].uri;

      // Ler como base64 e enviar para Firebase Storage
      const fileInfo = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
      // converter base64 para blob
      const binary = atob(fileInfo);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = bytes.buffer;

      const filename = `profile_${userData.id || 'unknown'}_${Date.now()}.jpg`;
      const sRef = storageRef(storage, `profile_photos/${filename}`);

  await uploadBytes(sRef, bytes);
      const downloadUrl = await getDownloadURL(sRef);

      // Persistir a URL no usuário
      await updateUser({ fotoPerfil: downloadUrl });
      Alert.alert('✅ Sucesso', 'Foto de perfil atualizada.');
    } catch (error) {
      console.error('Erro upload foto:', error);
      Alert.alert('❌ Erro', 'Não foi possível enviar a foto.');
    }
  };

  // �📝 Função para cancelar edição
  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  // 🏠 Função para salvar endereço
  const handleSaveAddress = async () => {
    try {
      if (tempValues.endereco && userData.endereco) {
        const updatedAddress = { ...userData.endereco, ...tempValues.endereco };
        await updateUser({ endereco: updatedAddress });
        setEditingField(null);
        setTempValues({});
        Alert.alert('✅ Sucesso', 'Endereço atualizado com sucesso!');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível salvar o endereço');
    }
  };

  // � Salvar alteração de senha (fluxo demo local)
  const handleChangePassword = async (newPassword: string, confirmPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('❌ Senha inválida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('❌ Senhas não conferem', 'As senhas informadas são diferentes.');
      return;
    }

    try {
      // Se houver usuário autenticado no Firebase, atualiza via SDK
      const currentUser = auth.currentUser;
      if (currentUser) {
        await firebaseUpdatePassword(currentUser, newPassword);
        // NÃO salvar senha localmente em produção
        setEditingField(null);
        setTempValues({});
        Alert.alert('✅ Sucesso', 'Senha atualizada no provedor de autenticação.');
        return;
      }

      // Fallback demo local
      await updateUser({ senha: newPassword });
      setEditingField(null);
      setTempValues({});
      Alert.alert('✅ Sucesso', 'Senha atualizada com sucesso (fluxo demo).');
    } catch (error: any) {
      console.error('Erro mudar senha:', error);
      Alert.alert('❌ Erro', error?.message || 'Não foi possível atualizar a senha.');
    }
  };

  // 🗑️ Deletar conta (demo local): confirmação e remoção dos dados locais
  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar conta',
      'Tem certeza que deseja deletar sua conta? Esta ação removerá TODOS os dados locais e não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                // Em produção: re-auth se necessário e apagar via Firebase Auth
                await firebaseDeleteUser(currentUser);
              }

              // Limpar local
              await logout();
              Alert.alert('Conta deletada', 'Sua conta foi removida.');
              navigation.replace('Login');
            } catch (error: any) {
              console.error('Erro deletar conta:', error);
              Alert.alert('❌ Erro', error?.message || 'Não foi possível deletar a conta.');
            }
          }
        }
      ]
    );
  };

  // �📝 Campo Editável Component
  const EditableField = ({ 
    label, 
    value, 
    field, 
    editable = true, 
    multiline = false,
    keyboardType = 'default',
    icon = '📝'
  }: {
    label: string;
    value: string;
    field: string;
    editable?: boolean;
    multiline?: boolean;
    keyboardType?: any;
    icon?: string;
  }) => {
    const isEditing = editingField === field;
    const currentValue = tempValues[field as keyof UserProfile] as string || value;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{icon} {label}</Text>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.editInput, multiline && styles.multilineInput]}
              value={currentValue}
              onChangeText={(text) => {
                const maskedText = ['telefone', 'cpf', 'cep'].includes(field) 
                  ? applyMask(field, text) 
                  : text;
                setTempValues((prev: any) => ({ ...prev, [field]: maskedText }));
              }}
              multiline={multiline}
              keyboardType={keyboardType}
              placeholder={`Digite ${label.toLowerCase()}`}
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => handleSave(field, currentValue)}
              >
                <Text style={styles.saveButtonText}>✅ Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.fieldValueContainer}>
            <Text style={[
              styles.fieldValue, 
              !editable && styles.readOnlyValue,
              multiline && styles.multilineValue
            ]}>
              {value}
            </Text>
            {editable && (
              <TouchableOpacity 
                style={styles.editIcon}
                onPress={() => {
                  setEditingField(field);
                  setTempValues({ [field]: value });
                }}
              >
                <Text style={styles.editIconText}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {!editable && (
          <Text style={styles.readOnlyHint}>📍 Informação do CadÚnico - Não editável</Text>
        )}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN_SYSTEM.colors.primary} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <GradientBackground 
          colors={DESIGN_SYSTEM.colors.gradient}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <View style={styles.headerRight} />
          </View>
        </GradientBackground>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            style={[
              styles.profileContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <TouchableOpacity 
                style={styles.photoContainer}
                onPress={() => setShowPhotoModal(true)}
              >
                <Image 
                  source={userData.fotoPerfil || require('../../assets/logo.png')}
                  style={styles.profilePhoto}
                />
                <View style={styles.photoEditOverlay}>
                  <Text style={styles.photoEditText}>📷</Text>
                </View>
                {userData.verificado && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.profileName}>{userData.nome}</Text>
              <Text style={styles.profileSubtitle}>Cadastro Único - Verificado</Text>
            </View>

            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Informações Pessoais</Text>
              
              <EditableField
                label="Nome Completo"
                value={userData.nome}
                field="nome"
                editable={false}
                icon="👤"
              />
              
              <EditableField
                label="CPF"
                value={formatForDisplay('cpf', userData.cpf)}
                field="cpf"
                editable={false}
                icon="🆔"
              />
              
              <EditableField
                label="RG"
                value={formatForDisplay('rg', userData.rg)}
                field="rg"
                editable={false}
                icon="📄"
              />
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📞 Informações de Contato</Text>
              
              <EditableField
                label="Telefone"
                value={formatForDisplay('telefone', userData.telefone)}
                field="telefone"
                editable={true}
                keyboardType="phone-pad"
                icon="📱"
              />
              
              <EditableField
                label="E-mail"
                value={userData.email}
                field="email"
                editable={true}
                keyboardType="email-address"
                icon="📧"
              />

              {/* Password field (editable) */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>🔒 Senha</Text>
                {editingField === 'senha' ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={tempValues.senha || ''}
                      onChangeText={(text) => setTempValues((prev: any) => ({ ...prev, senha: text }))}
                      placeholder="Nova senha"
                      secureTextEntry
                      autoFocus
                    />
                    <TextInput
                      style={styles.editInput}
                      value={tempValues.senhaConfirm || ''}
                      onChangeText={(text) => setTempValues((prev: any) => ({ ...prev, senhaConfirm: text }))}
                      placeholder="Confirme a nova senha"
                      secureTextEntry
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => handleChangePassword(tempValues.senha, tempValues.senhaConfirm)}
                      >
                        <Text style={styles.saveButtonText}>✅ Salvar Senha</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                      >
                        <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.fieldValueContainer}>
                    <Text style={[styles.fieldValue, styles.readOnlyValue]}>••••••••</Text>
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => {
                        setEditingField('senha');
                        setTempValues({ senha: '', senhaConfirm: '' });
                      }}
                    >
                      <Text style={styles.editIconText}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏠 Endereço</Text>
              
              {editingField === 'endereco' ? (
                <View style={styles.addressEditContainer}>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Rua"
                    value={tempValues.endereco?.rua || userData.endereco.rua}
                    onChangeText={(text) => setTempValues((prev: any) => ({
                      ...prev,
                      endereco: { ...prev.endereco, rua: text }
                    }))}
                  />
                  <View style={styles.addressRow}>
                    <TextInput
                      style={[styles.addressInput, styles.addressNumber]}
                      placeholder="Número"
                      value={tempValues.endereco?.numero || userData.endereco.numero}
                      onChangeText={(text) => setTempValues((prev: any) => ({
                        ...prev,
                        endereco: { ...prev.endereco, numero: text }
                      }))}
                    />
                    <TextInput
                      style={[styles.addressInput, styles.addressBairro]}
                      placeholder="Bairro"
                      value={tempValues.endereco?.bairro || userData.endereco.bairro}
                      onChangeText={(text) => setTempValues((prev: any) => ({
                        ...prev,
                        endereco: { ...prev.endereco, bairro: text }
                      }))}
                    />
                  </View>
                  <View style={styles.addressRow}>
                    <TextInput
                      style={[styles.addressInput, styles.addressCep]}
                      placeholder="CEP"
                      value={tempValues.endereco?.cep || userData.endereco.cep}
                      onChangeText={(text) => setTempValues((prev: any) => ({
                        ...prev,
                        endereco: { ...prev.endereco, cep: text }
                      }))}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.addressInput, styles.addressCidade]}
                      placeholder="Cidade"
                      value={tempValues.endereco?.cidade || userData.endereco.cidade}
                      onChangeText={(text) => setTempValues((prev: any) => ({
                        ...prev,
                        endereco: { ...prev.endereco, cidade: text }
                      }))}
                    />
                  </View>
                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveAddress}
                    >
                      <Text style={styles.saveButtonText}>✅ Salvar Endereço</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleCancel}
                    >
                      <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.addressContainer}>
                  <Text style={styles.addressText}>
                    {userData.endereco.rua}, {userData.endereco.numero}{'\n'}
                    {userData.endereco.bairro} - {formatForDisplay('cep', userData.endereco.cep)}{'\n'}
                    {userData.endereco.cidade}, {userData.endereco.estado}
                  </Text>
                  <TouchableOpacity 
                    style={styles.editIcon}
                    onPress={() => setEditingField('endereco')}
                  >
                    <Text style={styles.editIconText}>✏️</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Story Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💬 Meu Relato</Text>
              
              <EditableField
                label="Conte sua história"
                value={userData.relato}
                field="relato"
                editable={true}
                multiline={true}
                icon="📖"
              />
            </View>

            {/* Account Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ℹ️ Informações da Conta</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.accountInfoText}>
                  📅 Cadastrado em: {new Date(userData.dataCadastro).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.accountInfoText}>
                  ✅ Status: {userData.verificado ? 'Verificado pelo CadÚnico' : 'Pendente de verificação'}
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Delete account button (demo) */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Deletar Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Modal */}
        <Modal
          visible={showPhotoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPhotoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.photoModal}>
              <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>
              <View style={styles.photoOptions}>
                <TouchableOpacity style={styles.photoOption}>
                  <Text style={styles.photoOptionIcon}>📷</Text>
                  <Text style={styles.photoOptionText}>Tirar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoOption}>
                  <Text style={styles.photoOptionIcon}>🖼️</Text>
                  <Text style={styles.photoOptionText}>Galeria</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowPhotoModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background,
  },

  // Header
  header: {
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...DESIGN_SYSTEM.shadows.medium,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingTop: DESIGN_SYSTEM.spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: DESIGN_SYSTEM.typography.h2.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  headerRight: {
    width: 40,
  },

  // Scroll
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: DESIGN_SYSTEM.spacing.xl,
  },

  profileContent: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },

  // Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    marginTop: DESIGN_SYSTEM.spacing.lg,
  },

  photoContainer: {
    position: 'relative',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },

  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: DESIGN_SYSTEM.colors.primary,
  },

  photoEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  photoEditText: {
    fontSize: 16,
  },

  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  verifiedIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  profileName: {
    fontSize: DESIGN_SYSTEM.typography.h2.fontSize,
    fontWeight: '700',
    color: DESIGN_SYSTEM.colors.onSurface,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },

  profileSubtitle: {
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
    color: DESIGN_SYSTEM.colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Sections
  section: {
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    ...DESIGN_SYSTEM.shadows.soft,
  },

  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.h3.fontSize,
    fontWeight: '700',
    color: DESIGN_SYSTEM.colors.onSurface,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },

  // Fields
  fieldContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },

  fieldLabel: {
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },

  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  fieldValue: {
    flex: 1,
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.outline,
  },

  multilineValue: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  readOnlyValue: {
    backgroundColor: '#F5F5F5',
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
  },

  readOnlyHint: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },

  editIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: DESIGN_SYSTEM.spacing.sm,
  },

  editIconText: {
    fontSize: 16,
  },

  // Edit Mode
  editContainer: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },

  editInput: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },

  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  editActions: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.sm,
  },

  saveButton: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '600',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.outline,
  },

  cancelButtonText: {
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '600',
  },

  // Delete account button
  deleteButtonContainer: {
    marginTop: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center'
  },

  deleteButton: {
    backgroundColor: DESIGN_SYSTEM.colors.error,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '700',
  },

  // Address
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  addressText: {
    flex: 1,
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.outline,
    lineHeight: 22,
  },

  addressEditContainer: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },

  addressInput: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },

  addressRow: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.sm,
  },

  addressNumber: {
    flex: 1,
  },

  addressBairro: {
    flex: 2,
  },

  addressCep: {
    flex: 1,
  },

  addressCidade: {
    flex: 2,
  },

  // Account Info
  accountInfo: {
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: DESIGN_SYSTEM.colors.primary,
  },

  accountInfoText: {
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },

  // Photo Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoModal: {
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.xl,
    width: width * 0.85,
    ...DESIGN_SYSTEM.shadows.medium,
  },

  modalTitle: {
    fontSize: DESIGN_SYSTEM.typography.h3.fontSize,
    fontWeight: '700',
    color: DESIGN_SYSTEM.colors.onSurface,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },

  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DESIGN_SYSTEM.spacing.xl,
  },

  photoOption: {
    alignItems: 'center',
    padding: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    minWidth: 100,
  },

  photoOptionIcon: {
    fontSize: 32,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },

  photoOptionText: {
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    fontWeight: '600',
  },

  modalCloseButton: {
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.outline,
  },

  modalCloseText: {
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    fontWeight: '600',
  },
});

export default ProfileScreen;