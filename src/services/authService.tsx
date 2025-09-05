import { auth, database } from './connectionFirebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

// Interface para dados do usuário
interface UserData {
  email: string;
  uid: string;
  createdAt: string;
  lastLogin: string;
  displayName?: string;
  profileCompleted?: boolean;
}

// Serviço de autenticação
export const authService = {
  // Cadastrar usuário com email e senha
  async registerUser(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar dados do usuário no Realtime Database usando ref e set
      const userRef = ref(database, `users/${user.uid}`);
      const userData: UserData = {
        email: user.email!,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profileCompleted: false
      };

      await set(userRef, userData);
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login do usuário
  async loginUser(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar último login no database
      const userRef = ref(database, `users/${user.uid}/lastLogin`);
      await set(userRef, new Date().toISOString());

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Logout do usuário
  async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Buscar dados do usuário no database
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as UserData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar dados do usuário
  async updateUserData(uid: string, data: Partial<UserData>): Promise<void> {
    try {
      const userRef = ref(database, `users/${uid}`);
      await update(userRef, data);
    } catch (error) {
      throw error;
    }
  },

  // Completar perfil do usuário
  async completeUserProfile(uid: string, profileData: any): Promise<void> {
    try {
      const userRef = ref(database, `users/${uid}`);
      await update(userRef, {
        ...profileData,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  }
};

// Funções de validação
export const authValidation = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  },

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está em uso';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet';
      default:
        return 'Erro de autenticação';
    }
  }
};
