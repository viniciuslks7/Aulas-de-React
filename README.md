# 💝 AUXILIUM - App de Doações

Um aplicativo móvel desenvolvido com **React Native** e **Expo** para conectar doadores e pessoas que precisam de ajuda, promovendo a solidariedade e o bem-estar social.

## ✨ Características

- 💝 **Foco em Doações**: Conecta pessoas que querem ajudar com quem precisa
- 🎨 **Interface Intuitiva**: Design limpo e fácil de usar
- 📱 **Multiplataforma**: Funciona em iOS, Android e Web
- 🔒 **TypeScript**: Código tipado e bem estruturado
- 🚀 **React Native**: Desenvolvimento nativo e performático

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

### 🏠 **Tela Inicial**
- Logo representativo com coração e caixa
- Título "AUXILIUM" em destaque
- Tagline inspiradora sobre doação
- Três botões principais de ação

### 🔐 **Sistema de Autenticação**
- **CADASTRE-SE**: Para novos usuários
- **LOGIN**: Para usuários existentes
- **SOU UM DOADOR**: Acesso direto para doadores

## 🎨 Estrutura do Projeto

```
AUXILIUM-App/
├── App.tsx              # Componente principal da aplicação
├── index.tsx            # Ponto de entrada da aplicação
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

## 🎯 Conceitos React Demonstrados

### **Componentes Funcionais:**
- `App`: Componente principal da aplicação
- Uso de `React.FC` com TypeScript

### **Estilos e Layout:**
- `StyleSheet.create()` para estilos organizados
- Flexbox para layout responsivo
- Cores e tipografia consistentes

### **Eventos e Interação:**
- `TouchableOpacity` para botões interativos
- Funções de callback para eventos
- Console.log para debugging

### **Estrutura de Arquivos:**
- Separação clara entre `index.tsx` e `App.tsx`
- Organização de estilos e componentes

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

- [ ] Implementar sistema de cadastro
- [ ] Adicionar tela de login
- [ ] Criar perfil de doador
- [ ] Sistema de categorias de doação
- [ ] Chat entre doadores e beneficiários
- [ ] Sistema de notificações
- [ ] Integração com APIs de pagamento
- [ ] Modo offline

## 💡 Sobre o Projeto

**AUXILIUM** é mais que um app - é uma plataforma que promove a solidariedade e conecta pessoas através da doação. O nome vem do latim e significa "ajuda" ou "auxílio", refletindo nossa missão de facilitar o ato de doar.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para problemas ou dúvidas, por favor:

1. Verifique se todas as dependências estão instaladas
2. Execute `npm run type-check` para verificar tipos
3. Certifique-se de que está usando as versões corretas do Node.js e npm
4. Abra uma issue no repositório do projeto

---

**Desenvolvido com ❤️ para promover a solidariedade e conectar pessoas através da doação**
