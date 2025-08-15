import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Interfaces TypeScript
interface UserData {
  name: string;
  email: string;
  status: string;
  lastLogin: string;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'settings'>('home');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Usuário');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Simula dados do usuário
  const [userData, setUserData] = useState<UserData>({
    name: 'Usuário',
    email: 'usuario@exemplo.com',
    status: 'Ativo',
    lastLogin: 'Hoje às 14:30'
  });

  const showAlert = (title: string, message: string): void => {
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  const handleProfileUpdate = (): void => {
    setUserData(prev => ({ ...prev, name: userName }));
    setModalVisible(false);
    showAlert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const renderHomeContent = (): JSX.Element => (
    <View style={styles.content}>
      <Text style={styles.welcomeText}>Bem-vindo ao Boer! 🚀</Text>
      <Text style={styles.subtitleText}>Seu app React Native com Expo + TypeScript</Text>
      
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => showAlert('React Native', 'Componente nativo funcionando!')}
        >
          <Text style={styles.cardTitle}>📱 React Native</Text>
          <Text style={styles.cardText}>Componentes nativos otimizados</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => showAlert('Expo', 'Desenvolvimento simplificado!')}
        >
          <Text style={styles.cardTitle}>⚡ Expo</Text>
          <Text style={styles.cardText}>Ferramentas de desenvolvimento</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => showAlert('TypeScript', 'Tipagem estática e segura!')}
        >
          <Text style={styles.cardTitle}>🔒 TypeScript</Text>
          <Text style={styles.cardText}>Código mais seguro e manutenível</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => showAlert('Ação', 'Botão nativo funcionando!')}
      >
        <Text style={styles.actionButtonText}>Clique Aqui!</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileContent = (): JSX.Element => (
    <View style={styles.content}>
      <Text style={styles.welcomeText}>👤 Perfil</Text>
      
      <View style={styles.profileCard}>
        <Text style={styles.profileText}>Nome: {userData.name}</Text>
        <Text style={styles.profileText}>Email: {userData.email}</Text>
        <Text style={styles.profileText}>Status: {userData.status}</Text>
        <Text style={styles.profileText}>Último login: {userData.lastLogin}</Text>
      </View>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsContent = (): JSX.Element => (
    <View style={styles.content}>
      <Text style={styles.welcomeText}>⚙️ Configurações</Text>
      
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#6366f1' }}
            thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Modo Escuro</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#6366f1' }}
            thumbColor={darkMode ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Idioma: Português</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => showAlert('Reset', 'Configurações resetadas!')}
      >
        <Text style={styles.resetButtonText}>Resetar Configurações</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'profile':
        return renderProfileContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* Header */}
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <Text style={styles.headerTitle}>Boer App</Text>
        <Text style={styles.headerSubtitle}>React Native + Expo + TypeScript</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, darkMode && styles.darkBottomNav]}>
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'home' && styles.activeNavButton]} 
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Início</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'profile' && styles.activeNavButton]} 
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>👤</Text>
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'settings' && styles.activeNavButton]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.navText, activeTab === 'settings' && styles.activeNavText]}>⚙️</Text>
          <Text style={[styles.navText, activeTab === 'settings' && styles.activeNavText]}>Config</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para editar perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>Editar Perfil</Text>
            
            <TextInput
              style={[styles.textInput, darkMode && styles.darkTextInput]}
              placeholder="Nome do usuário"
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
              value={userName}
              onChangeText={setUserName}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleProfileUpdate}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1f2937',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkHeader: {
    backgroundColor: '#4f46e5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    minHeight: 100,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  editButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkBottomNav: {
    backgroundColor: '#374151',
    borderTopColor: '#4b5563',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  activeNavText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#f9fafb',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  darkTextInput: {
    borderColor: '#6b7280',
    backgroundColor: '#4b5563',
    color: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
