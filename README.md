# 🚀 Boer App - Aplicativo React Native com Expo + TypeScript

Um aplicativo moderno e responsivo desenvolvido com **React Native**, **Expo** e **TypeScript**, otimizado para funcionar em múltiplas plataformas: **iOS**, **Android** e **Web**.

## ✨ Características

- 🎨 **Interface Moderna**: Design limpo e responsivo com Material Design
- 📱 **Multiplataforma**: Funciona perfeitamente em dispositivos móveis e navegadores web
- ⚡ **Performance**: Desenvolvido com React Native para máxima eficiência
- 🔒 **TypeScript**: Tipagem estática para código mais seguro e manutenível
- 🔄 **Navegação por Abas**: Sistema de navegação intuitivo com três seções principais
- 🎯 **Componentes Reutilizáveis**: Arquitetura modular e escalável

## 🛠️ Tecnologias Utilizadas

- **React Native** 0.79.5
- **Expo** ~53.0.20
- **TypeScript** 5.0+
- **React** 19.0.0
- **Node.js** (para desenvolvimento)

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente)

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Verificar Tipos TypeScript
```bash
npm run type-check
```

### 3. Executar no Web
```bash
npm run web
```

### 4. Executar no Android
```bash
npm run android
```

### 5. Executar no iOS
```bash
npm run ios
```

### 6. Modo de Desenvolvimento
```bash
npm start
```

## 📱 Funcionalidades

### 🏠 **Página Inicial**
- Mensagem de boas-vindas personalizada
- Cards informativos sobre as funcionalidades do app
- Botão de ação interativo
- Design responsivo e atrativo

### 👤 **Perfil do Usuário**
- Informações básicas do usuário
- Status da conta
- Botão para editar perfil
- Modal de edição com validação

### ⚙️ **Configurações**
- Toggle para notificações
- Toggle para modo escuro
- Configurações de idioma
- Botão para resetar configurações

## 🎨 Estrutura do Projeto

```
Boer/
├── App.tsx              # Componente principal da aplicação (TypeScript)
├── index.tsx            # Ponto de entrada da aplicação (TypeScript)
├── tsconfig.json        # Configuração TypeScript
├── app.json             # Configurações do Expo
├── package.json         # Dependências e scripts
├── metro.config.js      # Configuração do Metro bundler
├── babel.config.js      # Configuração do Babel
├── assets/              # Imagens e recursos
├── node_modules/        # Dependências instaladas
├── README.md            # Documentação principal
└── INSTRUCOES.md        # Instruções rápidas
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run web` - Executa a aplicação no navegador web
- `npm run android` - Executa no emulador/dispositivo Android
- `npm run ios` - Executa no simulador/dispositivo iOS
- `npm run type-check` - Verifica tipos TypeScript
- `npm run build` - Constrói a aplicação para produção
- `npm run lint` - Executa o linter do Expo

## 🔒 Benefícios do TypeScript

- **Segurança de Tipos**: Detecta erros em tempo de compilação
- **IntelliSense**: Autocompletar e documentação inline
- **Refatoração Segura**: Mudanças de código mais confiáveis
- **Manutenibilidade**: Código mais legível e organizado
- **Documentação**: Tipos servem como documentação viva

## 🌐 Desenvolvimento Web

O aplicativo é totalmente compatível com navegadores web modernos, oferecendo:

- Interface responsiva para diferentes tamanhos de tela
- Navegação por mouse e teclado
- Performance otimizada para web
- Compatibilidade com todos os navegadores principais

## 📱 Desenvolvimento Mobile

Para desenvolvimento mobile, o app oferece:

- Interface nativa para iOS e Android
- Componentes otimizados para touch
- Navegação por gestos
- Integração com recursos nativos do dispositivo

## 🚀 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar persistência de dados local
- [ ] Integrar com APIs externas
- [ ] Implementar temas escuro/claro
- [ ] Adicionar testes automatizados com Jest
- [ ] Configurar CI/CD
- [ ] Adicionar mais validações TypeScript

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

1. Verifique se todas as dependências estão instaladas
2. Execute `npm run type-check` para verificar tipos
3. Certifique-se de que está usando as versões corretas do Node.js e npm
4. Abra uma issue no repositório do projeto

---

**Desenvolvido com ❤️ usando React Native, Expo e TypeScript**
