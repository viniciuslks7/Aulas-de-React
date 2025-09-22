import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 📝 Interface do Usuário CadÚnico
export interface UserProfile {
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
  isLoggedIn: boolean;
}

// 🎯 Interface do Contexto
interface UserContextData {
  user: UserProfile | null;
  isLoading: boolean;
  login: (userData: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
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
  fotoPerfil: null,
  dataCadastro: '2025-01-15',
  verificado: true,
  isLoggedIn: true
};

// 🎯 Criação do Contexto
const UserContext = createContext<UserContextData>({} as UserContextData);

// 🎯 Provider do Contexto
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Carregar dados do usuário ao inicializar
  useEffect(() => {
    loadUserData();
  }, []);

  // 📱 Carregar dados do AsyncStorage
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('@Boer:userData');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        // Para desenvolvimento, usar dados mock
        // Em produção, isso seria null até o login
        setUser(mockUserData);
        await AsyncStorage.setItem('@Boer:userData', JSON.stringify(mockUserData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Fallback para dados mock em caso de erro
      setUser(mockUserData);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Fazer login
  const login = async (userData: UserProfile) => {
    try {
      setIsLoading(true);
      const userWithLoginStatus = { ...userData, isLoggedIn: true };
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@Boer:userData', JSON.stringify(userWithLoginStatus));
      
      // Atualizar estado
      setUser(userWithLoginStatus);
      
      console.log('✅ Login realizado com sucesso:', userWithLoginStatus.nome);
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Fazer logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remover do AsyncStorage
      await AsyncStorage.removeItem('@Boer:userData');
      
      // Limpar estado
      setUser(null);
      
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✏️ Atualizar dados do usuário
  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      setIsLoading(true);
      
      // Mesclar dados atuais com atualizações
      const updatedUser = { ...user, ...updates };
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@Boer:userData', JSON.stringify(updatedUser));
      
      // Atualizar estado
      setUser(updatedUser);
      
      console.log('✅ Dados do usuário atualizados:', Object.keys(updates));
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Atualizar dados do usuário
  const refreshUser = async () => {
    await loadUserData();
  };

  // 🎯 Valores do contexto
  const contextValue: UserContextData = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// 🎯 Hook para usar o contexto
export const useUser = (): UserContextData => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  
  return context;
};

// 🎯 Hook para verificar se está logado
export const useAuth = () => {
  const { user, isLoading } = useUser();
  
  const isLoggedIn = user?.isLoggedIn ?? false;
  const isAuthenticated = !isLoading && isLoggedIn;
  
  return {
    isLoggedIn,
    isAuthenticated,
    isLoading,
    user
  };
};

export default UserContext;