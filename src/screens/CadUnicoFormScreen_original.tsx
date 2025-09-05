import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type CadUnicoFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CadUnicoForm'>;

type Props = {
  navigation: CadUnicoFormScreenNavigationProp;
};

const CadUnicoFormScreen: React.FC<Props> = ({ navigation }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [renda, setRenda] = useState('');

  const handleContinuar = () => {
    // Validação simples - apenas campos obrigatórios
    if (!nomeCompleto.trim()) {
      Alert.alert('Erro', 'Nome completo é obrigatório');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }
    
    if (!telefone.trim()) {
      Alert.alert('Erro', 'Telefone é obrigatório');
      return;
    }
    
    if (!endereco.trim()) {
      Alert.alert('Erro', 'Endereço é obrigatório');
      return;
    }
    
    if (!renda.trim()) {
      Alert.alert('Erro', 'Renda é obrigatória');
      return;
    }

    // Dados básicos para passar para a próxima tela
    const dadosBasicos = {
      nomeCompleto,
      email,
      telefone,
      endereco,
      renda
    };

    // Navegar para a segunda parte do formulário
    navigation.navigate('CadUnicoForm2', { dadosBasicos });
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Cadastro Único - Dados Básicos (1/2)</Text>
        <Text style={styles.subtitle}>Preencha os dados básicos para continuar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            placeholder="Digite seu nome completo"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Digite seu endereço completo"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Renda Familiar</Text>
          <TextInput
            style={styles.input}
            value={renda}
            onChangeText={setRenda}
            placeholder="Digite a renda familiar"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinuar}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CadUnicoFormScreen;
