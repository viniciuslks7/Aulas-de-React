import { usuarioService, doacaoService, Usuario, Doacao } from './databaseService';

// Funções de teste para o Firebase
export const testeFirebase = {
  // Teste de criação de usuário
  async criarUsuarioTeste(): Promise<void> {
    try {
      const usuarioTeste: Omit<Usuario, 'id' | 'criadoEm'> = {
        nome: 'João da Silva',
        email: 'joao.teste@email.com',
        telefone: '(11) 99999-9999',
        tipo: 'beneficiario',
        endereco: {
          cep: '01234-567',
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        cadUnico: {
          nis: '12345678901',
          renda: 800,
          membros: 4
        },
        ativo: true
      };

      const id = await usuarioService.criar(usuarioTeste);
      console.log('✅ Usuário criado com sucesso! ID:', id);
      return;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
    }
  },

  // Teste de busca de usuário
  async buscarUsuarioTeste(): Promise<void> {
    try {
      const usuario = await usuarioService.buscarPorEmail('joao.teste@email.com');
      if (usuario) {
        console.log('✅ Usuário encontrado:', usuario.nome);
      } else {
        console.log('❌ Usuário não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
    }
  },

  // Teste de listagem de beneficiários
  async listarBeneficiariosTeste(): Promise<void> {
    try {
      const beneficiarios = await usuarioService.listarBeneficiarios();
      console.log('✅ Beneficiários encontrados:', beneficiarios.length);
      beneficiarios.forEach(b => console.log(`- ${b.nome} (${b.email})`));
    } catch (error) {
      console.error('❌ Erro ao listar beneficiários:', error);
    }
  },

  // Teste completo
  async executarTodosTestes(): Promise<void> {
    console.log('🔥 Iniciando testes do Firebase...\n');
    
    console.log('1. Testando criação de usuário...');
    await this.criarUsuarioTeste();
    
    console.log('\n2. Testando busca de usuário...');
    await this.buscarUsuarioTeste();
    
    console.log('\n3. Testando listagem de beneficiários...');
    await this.listarBeneficiariosTeste();
    
    console.log('\n🎉 Testes concluídos!');
  }
};

// Exemplo de uso nas telas
export const exemploUsoNasTelas = {
  // Como usar no CadUnicoFormScreen
  async cadastrarBeneficiario(dadosFormulario: any): Promise<boolean> {
    try {
      const novoUsuario: Omit<Usuario, 'id' | 'criadoEm'> = {
        nome: dadosFormulario.nome,
        email: dadosFormulario.email,
        telefone: dadosFormulario.telefone,
        tipo: 'beneficiario',
        endereco: {
          cep: dadosFormulario.cep,
          rua: dadosFormulario.rua,
          numero: dadosFormulario.numero,
          bairro: dadosFormulario.bairro,
          cidade: dadosFormulario.cidade,
          estado: dadosFormulario.estado
        },
        cadUnico: {
          nis: dadosFormulario.nis,
          renda: dadosFormulario.renda,
          membros: dadosFormulario.membros
        },
        ativo: true
      };

      const id = await usuarioService.criar(novoUsuario);
      console.log('Usuário cadastrado com ID:', id);
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
    }
  },

  // Como usar no LoginScreen
  async fazerLogin(email: string): Promise<Usuario | null> {
    try {
      const usuario = await usuarioService.buscarPorEmail(email);
      if (usuario) {
        console.log('Login realizado para:', usuario.nome);
        return usuario;
      } else {
        console.log('Usuário não encontrado');
        return null;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  },

  // Como criar uma doação
  async criarDoacao(doadorId: string, beneficiarioId: string): Promise<boolean> {
    try {
      const novaDoacao: Omit<Doacao, 'id' | 'criadoEm' | 'atualizadoEm'> = {
        doadorId,
        beneficiarioId,
        tipo: 'cesta_basica',
        descricao: 'Cesta básica para família de 4 pessoas',
        status: 'pendente'
      };

      const id = await doacaoService.criar(novaDoacao);
      console.log('Doação criada com ID:', id);
      return true;
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      return false;
    }
  }
};
