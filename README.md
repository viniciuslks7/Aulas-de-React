# AUXILIUM 🤝

> "Coragem para se doar, num mundo em que só se pensa em receber..."

## 📱 Sobre o Projeto

**AUXILIUM** é um aplicativo React Native desenvolvido para conectar pessoas que precisam de ajuda com aquelas dispostas a doar. O app facilita a distribuição de recursos como:

- 💰 **PIX** - Transferências diretas
- 💵 **Dinheiro** - Doações em espécie  
- 🧺 **Cesta Básica** - Alimentação essencial
- 🧥 **Agasalhos** - Roupas e cobertores

## 🚀 Tecnologias

- **React Native** 0.79.5
- **Expo** 53.0.20
- **TypeScript** para tipagem
- **React Navigation** 7.x para navegação
- **React Native Reanimated** 3.x para animações
- **Metro** bundler customizado

## 📁 Estrutura do Projeto

```
AUXILIUM/
├── 📁 src/
│   ├── 📁 screens/          # Telas do aplicativo
│   │   ├── HomeScreen.tsx   # Tela inicial
│   │   ├── LoginScreen.tsx  # Tela de login
│   │   ├── UserTypeScreen.tsx # Seleção de tipo de usuário
│   │   ├── CadUnicoFormScreen.tsx # Formulário CadÚnico
│   │   └── SplashScreen.tsx # Tela de carregamento
│   └── 📁 navigation/       # Configuração de navegação
│       └── AppNavigator.tsx
├── 📁 assets/              # Recursos visuais
├── 📁 docs/               # Documentação técnica
├── App.tsx               # Componente principal
└── package.json         # Dependências
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (Android) / Xcode (iOS)

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Navegue para o diretório
cd Boer

# Instale as dependências
npm install --legacy-peer-deps

# Inicie o projeto
npx expo start
```

## 📱 Como Usar

1. **Início**: A tela inicial apresenta as opções principais
2. **Cadastro**: Escolha entre "Preciso de Ajuda" ou "Quero Ajudar"
3. **Login**: Acesse sua conta existente
4. **Formulário**: Preencha o CadÚnico (para quem precisa de ajuda)
5. **Conectar**: O app conecta doadores com beneficiários

## 🎨 Funcionalidades

### ✅ Implementadas
- [x] Splash screen animada
- [x] Navegação fluida entre telas
- [x] Formulários responsivos
- [x] Design adaptável (mobile/web)
- [x] Animações suaves
- [x] Teclado responsivo
- [x] Validação de formulários
- [x] ScrollView otimizado

### 📋 Melhorias Recentes
- [x] Remoção completa do Rive (por problemas de compatibilidade)
- [x] Correção de warnings de estilos deprecated
- [x] Melhoria na rolagem de todas as telas
- [x] Otimização de performance
- [x] Estrutura de projeto limpa e organizada

## 🐛 Correções Implementadas

### Problemas de Rolagem ✅
- Adicionado `ScrollView` com configurações otimizadas
- `contentContainerStyle` para controle adequado de layout
- `keyboardShouldPersistTaps="handled"` para melhor UX
- `bounces` e `scrollEventThrottle` configurados

### Warnings de Estilo ✅
- Migração de `shadowColor/shadowOffset/shadowOpacity/shadowRadius` para `boxShadow` (web)
- Correção de `textShadow` deprecated
- Implementação condicional por plataforma (iOS/Android/Web)

### Limpeza de Código ✅
- Remoção total de dependências Rive
- Eliminação de arquivos duplicados
- Estrutura de pastas organizada
- Imports otimizados

## 🎯 Próximos Passos

- [ ] Implementar backend para autenticação
- [ ] Adicionar sistema de matching doador/beneficiário
- [ ] Integração com APIs de pagamento
- [ ] Sistema de notificações push
- [ ] Chat interno entre usuários
- [ ] Geolocalização para doações próximas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ para conectar pessoas e promover a solidariedade.

---

**"Em um mundo onde você pode ser qualquer coisa, seja gentil." 💚**
