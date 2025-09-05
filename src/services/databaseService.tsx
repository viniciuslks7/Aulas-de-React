import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './connectionFirebase';

// Interfaces para tipagem
export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'doador' | 'beneficiario';
  endereco?: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  cadUnico?: {
    nis: string;
    renda: number;
    membros: number;
  };
  criadoEm: Date;
  ativo: boolean;
}

export interface Doacao {
  id?: string;
  doadorId: string;
  beneficiarioId: string;
  tipo: 'pix' | 'dinheiro' | 'cesta_basica' | 'agasalho';
  valor?: number;
  descricao: string;
  status: 'pendente' | 'aceita' | 'concluida' | 'cancelada';
  criadoEm: Date;
  atualizadoEm: Date;
}

// Serviços para Usuários
export const usuarioService = {
  // Criar usuário
  async criar(usuario: Omit<Usuario, 'id' | 'criadoEm'>): Promise<string> {
    try {
      const novoUsuario = {
        ...usuario,
        criadoEm: new Date(),
      };
      const docRef = await addDoc(collection(db, 'usuarios'), novoUsuario);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  // Buscar usuário por email
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    try {
      const q = query(
        collection(db, 'usuarios'), 
        where('email', '==', email),
        where('ativo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  // Listar doadores
  async listarDoadores(): Promise<Usuario[]> {
    try {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'doador'),
        where('ativo', '==', true),
        orderBy('criadoEm', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Usuario));
    } catch (error) {
      console.error('Erro ao listar doadores:', error);
      throw error;
    }
  },

  // Listar beneficiários
  async listarBeneficiarios(): Promise<Usuario[]> {
    try {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'beneficiario'),
        where('ativo', '==', true),
        orderBy('criadoEm', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Usuario));
    } catch (error) {
      console.error('Erro ao listar beneficiários:', error);
      throw error;
    }
  },

  // Atualizar usuário
  async atualizar(id: string, dados: Partial<Usuario>): Promise<void> {
    try {
      const userRef = doc(db, 'usuarios', id);
      await updateDoc(userRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  // Desativar usuário (soft delete)
  async desativar(id: string): Promise<void> {
    try {
      await this.atualizar(id, { ativo: false });
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      throw error;
    }
  }
};

// Serviços para Doações
export const doacaoService = {
  // Criar doação
  async criar(doacao: Omit<Doacao, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
    try {
      const novaDoacao = {
        ...doacao,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };
      const docRef = await addDoc(collection(db, 'doacoes'), novaDoacao);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      throw error;
    }
  },

  // Listar doações por doador
  async listarPorDoador(doadorId: string): Promise<Doacao[]> {
    try {
      const q = query(
        collection(db, 'doacoes'),
        where('doadorId', '==', doadorId),
        orderBy('criadoEm', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Doacao));
    } catch (error) {
      console.error('Erro ao listar doações do doador:', error);
      throw error;
    }
  },

  // Listar doações por beneficiário
  async listarPorBeneficiario(beneficiarioId: string): Promise<Doacao[]> {
    try {
      const q = query(
        collection(db, 'doacoes'),
        where('beneficiarioId', '==', beneficiarioId),
        orderBy('criadoEm', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Doacao));
    } catch (error) {
      console.error('Erro ao listar doações do beneficiário:', error);
      throw error;
    }
  },

  // Atualizar status da doação
  async atualizarStatus(id: string, status: Doacao['status']): Promise<void> {
    try {
      const doacaoRef = doc(db, 'doacoes', id);
      await updateDoc(doacaoRef, { 
        status,
        atualizadoEm: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da doação:', error);
      throw error;
    }
  },

  // Deletar doação
  async deletar(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'doacoes', id));
    } catch (error) {
      console.error('Erro ao deletar doação:', error);
      throw error;
    }
  }
};
