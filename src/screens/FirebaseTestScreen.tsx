import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { testAuthOnly, debugCurrentUser } from '../services/firebaseAuthDebug';

const FirebaseTestScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runFirebaseTest = async () => {
    setLoading(true);
    clearResults();
    
    addResult('🚀 Iniciando teste do Firebase Authentication...');
    
    try {
      // Test 1: Debug current user
      addResult('📱 Verificando usuário atual...');
      const currentUser = debugCurrentUser();
      addResult(currentUser ? `✅ Usuário logado: ${currentUser.email}` : '❌ Nenhum usuário logado');
      
      // Test 2: Authentication only test
      addResult('� Executando teste de Authentication...');
      const result = await testAuthOnly();
      
      if (result && result.success) {
        addResult(`✅ Authentication test passou!`);
        addResult(`✅ User ID: ${result.userId}`);
        
        Alert.alert('Sucesso!', 'Firebase Authentication está funcionando corretamente!');
      } else {
        addResult(`❌ Authentication test falhou: ${result?.error?.message || 'Erro desconhecido'}`);
        
        Alert.alert('Erro', `Firebase Authentication failed: ${result?.error?.message || 'Unknown error'}`);
      }
      
    } catch (error: any) {
      addResult(`❌ Erro no teste: ${error.message}`);
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Firebase Authentication Test</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={runFirebaseTest}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Testando...' : 'Testar Authentication'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
          <Text style={styles.clearButtonText}>Limpar Resultados</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Resultados do Teste:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
    color: '#666',
  },
});

export default FirebaseTestScreen;
