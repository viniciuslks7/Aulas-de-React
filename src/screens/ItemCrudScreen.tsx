import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 📱 Interface do Item com 5 atributos principais
interface ItemData {
  id: string;
  titulo: string;           // Atributo 1: Título
  categoria: string;        // Atributo 2: Categoria
  urgencia: 'Alta' | 'Média' | 'Baixa';  // Atributo 3: Urgência
  dataPostagem: string;     // Atributo 4: Data
  localizacao: string;      // Atributo 5: Localização
  descricao?: string;       // Campo adicional
}

// 🎨 Design System baseado no projeto
const DESIGN_SYSTEM = {
  colors: {
    primary: '#4CAF50',
    primaryLight: '#66BB6A',
    primaryDark: '#388E3C',
    surface: '#FFFFFF',
    background: '#F1F8E9',
    error: '#F44336',
    warning: '#FF9800',
    text: '#1B5E20',
    textSecondary: '#4A6741',
    border: '#E8F5E8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

export default function ItemCrudScreen() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 📝 Estados do formulário para os 5 atributos
  const [formData, setFormData] = useState<Partial<ItemData>>({
    titulo: '',
    categoria: '',
    urgencia: 'Média',
    dataPostagem: new Date().toLocaleDateString('pt-BR'),
    localizacao: '',
    descricao: '',
  });

  // 📱 Carregar itens do AsyncStorage
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const savedItems = await AsyncStorage.getItem('@ItemCrud:items');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        // Dados de exemplo se não houver itens salvos
        const exampleItems: ItemData[] = [
          {
            id: '1',
            titulo: 'Preciso de Cesta Básica',
            categoria: 'Alimentação',
            urgencia: 'Alta',
            dataPostagem: '10/10/2025',
            localizacao: 'São Paulo - SP',
            descricao: 'Família passando por dificuldades financeiras'
          },
          {
            id: '2',
            titulo: 'Doação de Roupas',
            categoria: 'Vestuário',
            urgencia: 'Baixa',
            dataPostagem: '09/10/2025',
            localizacao: 'Rio de Janeiro - RJ',
            descricao: 'Roupas infantis em bom estado'
          }
        ];
        setItems(exampleItems);
        await AsyncStorage.setItem('@ItemCrud:items', JSON.stringify(exampleItems));
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      Alert.alert('Erro', 'Não foi possível carregar os itens');
    } finally {
      setIsLoading(false);
    }
  };

  const saveItems = async (newItems: ItemData[]) => {
    try {
      await AsyncStorage.setItem('@ItemCrud:items', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
      Alert.alert('Erro', 'Não foi possível salvar os itens');
    }
  };

  // ➕ CREATE - Criar novo item
  const createItem = async () => {
    if (!formData.titulo || !formData.categoria || !formData.localizacao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const newItem: ItemData = {
      id: Date.now().toString(),
      titulo: formData.titulo!,
      categoria: formData.categoria!,
      urgencia: formData.urgencia!,
      dataPostagem: formData.dataPostagem!,
      localizacao: formData.localizacao!,
      descricao: formData.descricao || '',
    };

    const updatedItems = [...items, newItem];
    await saveItems(updatedItems);
    resetForm();
    setIsModalVisible(false);
    Alert.alert('Sucesso', 'Item criado com sucesso!');
  };

  // ✏️ UPDATE - Atualizar item existente
  const updateItem = async () => {
    if (!editingItem || !formData.titulo || !formData.categoria || !formData.localizacao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const updatedItem: ItemData = {
      ...editingItem,
      titulo: formData.titulo!,
      categoria: formData.categoria!,
      urgencia: formData.urgencia!,
      dataPostagem: formData.dataPostagem!,
      localizacao: formData.localizacao!,
      descricao: formData.descricao || '',
    };

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? updatedItem : item
    );
    
    await saveItems(updatedItems);
    resetForm();
    setIsModalVisible(false);
    setEditingItem(null);
    Alert.alert('Sucesso', 'Item atualizado com sucesso!');
  };

  // 🗑️ DELETE - Deletar item
  const deleteItem = (item: ItemData) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${item.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = items.filter(i => i.id !== item.id);
            await saveItems(updatedItems);
            Alert.alert('Sucesso', 'Item excluído com sucesso!');
          }
        }
      ]
    );
  };

  // 📝 Funções do formulário
  const openCreateModal = () => {
    resetForm();
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const openEditModal = (item: ItemData) => {
    setFormData({
      titulo: item.titulo,
      categoria: item.categoria,
      urgencia: item.urgencia,
      dataPostagem: item.dataPostagem,
      localizacao: item.localizacao,
      descricao: item.descricao || '',
    });
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      categoria: '',
      urgencia: 'Média',
      dataPostagem: new Date().toLocaleDateString('pt-BR'),
      localizacao: '',
      descricao: '',
    });
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Alta': return DESIGN_SYSTEM.colors.error;
      case 'Média': return DESIGN_SYSTEM.colors.warning;
      case 'Baixa': return DESIGN_SYSTEM.colors.primary;
      default: return DESIGN_SYSTEM.colors.textSecondary;
    }
  };

  // 🎨 Renderizar item da lista (READ)
  const renderItem = ({ item }: { item: ItemData }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.titulo}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color={DESIGN_SYSTEM.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteItem(item)}
          >
            <Ionicons name="trash-outline" size={20} color={DESIGN_SYSTEM.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.attributesGrid}>
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>📂 Categoria</Text>
          <Text style={styles.attributeValue}>{item.categoria}</Text>
        </View>
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>⚠️ Urgência</Text>
          <Text style={[styles.attributeValue, { color: getUrgenciaColor(item.urgencia) }]}>
            {item.urgencia}
          </Text>
        </View>
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>📅 Data</Text>
          <Text style={styles.attributeValue}>{item.dataPostagem}</Text>
        </View>
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>📍 Local</Text>
          <Text style={styles.attributeValue}>{item.localizacao}</Text>
        </View>
      </View>

      {item.descricao && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.descricao}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗂️ Gerenciar Itens (CRUD)</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de Itens (READ) */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadItems}
      />

      {/* Modal de Formulário (CREATE/UPDATE) */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color={DESIGN_SYSTEM.colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Atributo 1: Título */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>📝 Título *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.titulo}
                onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                placeholder="Digite o título do item"
                maxLength={100}
              />
            </View>

            {/* Atributo 2: Categoria */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>📂 Categoria *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.categoria}
                onChangeText={(text) => setFormData({ ...formData, categoria: text })}
                placeholder="Ex: Alimentação, Vestuário, Educação"
                maxLength={50}
              />
            </View>

            {/* Atributo 3: Urgência */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>⚠️ Urgência *</Text>
              <View style={styles.urgencyContainer}>
                {(['Baixa', 'Média', 'Alta'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.urgencyButton,
                      formData.urgencia === level && styles.urgencyButtonSelected,
                      { borderColor: getUrgenciaColor(level) }
                    ]}
                    onPress={() => setFormData({ ...formData, urgencia: level })}
                  >
                    <Text style={[
                      styles.urgencyButtonText,
                      formData.urgencia === level && { color: '#fff' },
                      { color: getUrgenciaColor(level) }
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Atributo 4: Data */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>📅 Data *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.dataPostagem}
                onChangeText={(text) => setFormData({ ...formData, dataPostagem: text })}
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
            </View>

            {/* Atributo 5: Localização */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>📍 Localização *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                placeholder="Cidade - Estado"
                maxLength={100}
              />
            </View>

            {/* Campo adicional: Descrição */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>📖 Descrição</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.descricao}
                onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                placeholder="Descrição detalhada (opcional)"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            {/* Botões de Ação */}
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={editingItem ? updateItem : createItem}
              >
                <Text style={styles.saveButtonText}>
                  {editingItem ? 'Atualizar' : 'Criar'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_SYSTEM.colors.text,
  },
  addButton: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: DESIGN_SYSTEM.spacing.md,
  },
  itemCard: {
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.text,
    marginRight: DESIGN_SYSTEM.spacing.sm,
  },
  itemActions: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.sm,
  },
  editButton: {
    padding: DESIGN_SYSTEM.spacing.sm,
  },
  deleteButton: {
    padding: DESIGN_SYSTEM.spacing.sm,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  attributeItem: {
    flex: 1,
    minWidth: '45%',
  },
  attributeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: DESIGN_SYSTEM.colors.textSecondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: DESIGN_SYSTEM.colors.text,
  },
  itemDescription: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.textSecondary,
    lineHeight: 20,
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.text,
  },
  modalContent: {
    flex: 1,
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  formGroup: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.text,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  formInput: {
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
    fontSize: 16,
    color: DESIGN_SYSTEM.colors.text,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.sm,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    borderWidth: 2,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
  },
  urgencyButtonSelected: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.md,
    marginTop: DESIGN_SYSTEM.spacing.xl,
    marginBottom: DESIGN_SYSTEM.spacing.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.textSecondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});