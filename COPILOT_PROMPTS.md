# 🤖 PROMPT PARA GITHUB COPILOT - MainScreen Improvements

## 🎯 Contexto
Estamos desenvolvendo um app React Native de ajuda social baseado em um design do Figma. A MainScreen atual já tem a estrutura básica, mas precisa de melhorias modernas.

## 📋 PROMPT PARA COPILOT CHAT

```
@workspace 

Analyze the MainScreen.tsx file and suggest comprehensive improvements for a React Native social help app. The screen should display cards of events, institutions, and individuals who need help.

Current requirements:
1. **Performance**: Optimize FlatList for large datasets
2. **Animations**: Add smooth micro-interactions and transitions
3. **Accessibility**: Improve screen reader support and navigation
4. **Search**: Implement real-time search functionality
5. **Filters**: Add category and location filters
6. **Loading States**: Add skeleton screens and loading indicators
7. **Error Handling**: Implement proper error boundaries and retry mechanisms
8. **Pull-to-Refresh**: Add refresh functionality
9. **TypeScript**: Improve type safety and interfaces
10. **Modern Patterns**: Use latest React Native and React hooks patterns

Focus on:
- Reusable components
- Clean code architecture
- Responsive design
- Modern React Native best practices
- Firebase integration improvements
- Better state management

Please provide specific code improvements and suggestions.
```

## 🔧 Como usar:

1. **Abra o Copilot Chat** (Ctrl+Shift+I)
2. **Cole o prompt acima**
3. **Pressione Enter**
4. **Analise as sugestões**
5. **Aplique as melhorias uma por vez**

## 📱 Melhorias Específicas Esperadas:

### 🎨 **UI/UX Improvements:**
- Animações de entrada dos cards
- Efeitos de hover/press
- Skeleton loading screens
- Empty states customizados
- Better error messages

### ⚡ **Performance:**
- React.memo para cards
- useMemo para dados filtrados
- useCallback para handlers
- VirtualizedList para grandes listas
- Image caching

### 🔍 **Search & Filters:**
- SearchBar component
- Filter chips
- Category selection
- Location-based filtering
- Sort options

### 🌐 **Accessibility:**
- Screen reader labels
- Focus management
- High contrast support
- Font scaling
- Voice over navigation

## 🎯 Próximos Passos:

1. Use o prompt no Copilot Chat
2. Implemente as sugestões gradualmente
3. Teste cada melhoria
4. Documente as mudanças
5. Commit as melhorias

## 💡 Dicas para melhores resultados:

- **Seja específico** sobre o que quer melhorar
- **Mencione o contexto** do app (ajuda social)
- **Peça exemplos** de código específicos
- **Solicite explicações** das sugestões
- **Teste incrementalmente** cada melhoria
