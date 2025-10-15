import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { ItemDetailScreenProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

// 🎨 DESIGN SYSTEM - Consistente com o projeto
const DESIGN_SYSTEM = {
  colors: {
    primary: '#4CAF50',
    primaryLight: '#66BB6A',
    primaryDark: '#388E3C',
    secondary: '#8BC34A',
    accent: '#81C784',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    outline: '#E8F5E8',
    onSurface: '#1B5E20',
    onSurfaceVariant: '#4A6741',
    background: '#F1F8E9',
    shadow: 'rgba(76, 175, 80, 0.08)',
    shadowMedium: 'rgba(76, 175, 80, 0.12)',
    shadowHeavy: 'rgba(76, 175, 80, 0.16)',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 14, fontWeight: '600', lineHeight: 20 }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6
    }
  }
};

// 📊 Interface do Item
interface ItemDetail {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  urgencia: 'Alta' | 'Média' | 'Baixa';
  dataPostagem: string;
  status: 'Ativo' | 'Em Andamento' | 'Concluído';
  localizacao: string;
  foto: string;
  beneficiario: {
    nome: string;
    verificado: boolean;
  };
}

// 📝 Dados Mock do Item
const mockItem: ItemDetail = {
  id: '001',
  titulo: 'Preciso de Cesta Básica para Família',
  categoria: 'Alimentação',
  descricao: 'Sou mãe de 3 filhos e estou passando por dificuldades financeiras após perder meu emprego. Qualquer ajuda com alimentos básicos será muito bem-vinda. Tenho cadastro no CadÚnico atualizado.',
  urgencia: 'Alta',
  dataPostagem: '10/10/2025',
  status: 'Ativo',
  localizacao: 'Vila Esperança - São Paulo, SP',
  foto: require('../../assets/logo.png'), // Usando logo do projeto como placeholder
  beneficiario: {
    nome: 'Maria Santos da Silva',
    verificado: true
  }
};

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ navigation, route }) => {
  const item = route.params?.item || mockItem;

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Alta': return DESIGN_SYSTEM.colors.error;
      case 'Média': return DESIGN_SYSTEM.colors.warning;
      case 'Baixa': return DESIGN_SYSTEM.colors.success;
      default: return DESIGN_SYSTEM.colors.onSurfaceVariant;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return DESIGN_SYSTEM.colors.success;
      case 'Em Andamento': return DESIGN_SYSTEM.colors.warning;
      case 'Concluído': return DESIGN_SYSTEM.colors.onSurfaceVariant;
      default: return DESIGN_SYSTEM.colors.onSurfaceVariant;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN_SYSTEM.colors.primary} />
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Solicitação</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Header com Foto */}
          <View style={styles.imageContainer}>
            <Image 
              source={typeof item.foto === 'string' ? { uri: item.foto } : item.foto}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
            {item.beneficiario.verificado && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            )}
          </View>

          {/* Conteúdo Principal */}
          <View style={styles.content}>
            
            {/* ATRIBUTO 1: Título */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>📄</Text>
                </View>
                <Text style={styles.attributeLabel}>Título da Solicitação</Text>
              </View>
              <Text style={styles.attributeValue}>{item.titulo}</Text>
            </View>

            {/* ATRIBUTO 2: Categoria */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>🏷️</Text>
                </View>
                <Text style={styles.attributeLabel}>Categoria</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.categoria}</Text>
              </View>
            </View>

            {/* ATRIBUTO 3: Urgência */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>⚠️</Text>
                </View>
                <Text style={styles.attributeLabel}>Nível de Urgência</Text>
              </View>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgenciaColor(item.urgencia) }]}>
                <Text style={styles.urgencyText}>{item.urgencia}</Text>
              </View>
            </View>

            {/* ATRIBUTO 4: Data de Postagem */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>📅</Text>
                </View>
                <Text style={styles.attributeLabel}>Data da Postagem</Text>
              </View>
              <Text style={styles.attributeValue}>{item.dataPostagem}</Text>
            </View>

            {/* ATRIBUTO 5: Localização */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>📍</Text>
                </View>
                <Text style={styles.attributeLabel}>Localização</Text>
              </View>
              <Text style={styles.attributeValue}>{item.localizacao}</Text>
            </View>

            {/* Beneficiário */}
            <View style={styles.attributeContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>👤</Text>
                </View>
                <Text style={styles.attributeLabel}>Solicitante</Text>
              </View>
              <View style={styles.beneficiarioContainer}>
                <Text style={styles.attributeValue}>{item.beneficiario.nome}</Text>
                {item.beneficiario.verificado && (
                  <View style={styles.verifiedSmallBadge}>
                    <Text style={styles.verifiedSmallText}>✓ CadÚnico</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Descrição Completa */}
            <View style={styles.descriptionContainer}>
              <View style={styles.attributeHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.attributeIcon}>📖</Text>
                </View>
                <Text style={styles.attributeLabel}>Descrição Detalhada</Text>
              </View>
              <Text style={styles.descriptionText}>{item.descricao}</Text>
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonIcon}>❤️</Text>
                <Text style={styles.buttonText}>Oferecer Ajuda</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonIcon}>📤</Text>
                <Text style={styles.shareButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    ...DESIGN_SYSTEM.shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: DESIGN_SYSTEM.typography.h3.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: DESIGN_SYSTEM.spacing.xxl,
  },

  // Image Container
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: DESIGN_SYSTEM.spacing.md,
    right: DESIGN_SYSTEM.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.soft,
  },
  statusText: {
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    top: DESIGN_SYSTEM.spacing.md,
    left: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.soft,
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: DESIGN_SYSTEM.spacing.xs,
  },
  verifiedText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Content
  content: {
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    marginTop: -20,
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.xl,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.xl,
    ...DESIGN_SYSTEM.shadows.soft,
  },

  // Attributes
  attributeContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.xl,
  },
  attributeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    backgroundColor: DESIGN_SYSTEM.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_SYSTEM.spacing.md,
  },
  attributeIcon: {
    fontSize: 16,
  },
  attributeLabel: {
    fontSize: DESIGN_SYSTEM.typography.h4.fontSize,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.onSurface,
  },
  attributeValue: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    marginLeft: 48,
    lineHeight: 24,
  },

  // Category Badge
  categoryBadge: {
    backgroundColor: DESIGN_SYSTEM.colors.outline,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignSelf: 'flex-start',
    marginLeft: 48,
  },
  categoryText: {
    color: DESIGN_SYSTEM.colors.primary,
    fontWeight: '600',
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
  },

  // Urgency Badge
  urgencyBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    alignSelf: 'flex-start',
    marginLeft: 48,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: DESIGN_SYSTEM.typography.body2.fontSize,
  },

  // Beneficiário
  beneficiarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 48,
  },
  verifiedSmallBadge: {
    backgroundColor: DESIGN_SYSTEM.colors.success,
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 2,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    marginLeft: DESIGN_SYSTEM.spacing.md,
  },
  verifiedSmallText: {
    color: '#FFFFFF',
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    fontWeight: '600',
  },

  // Description
  descriptionContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
  },
  descriptionText: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    lineHeight: 26,
    marginLeft: 48,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.md,
  },
  helpButton: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    gap: DESIGN_SYSTEM.spacing.sm,
    ...DESIGN_SYSTEM.shadows.soft,
  },
  helpButtonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    gap: DESIGN_SYSTEM.spacing.sm,
  },
  shareButtonIcon: {
    fontSize: 18,
  },
  shareButtonText: {
    color: DESIGN_SYSTEM.colors.primary,
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '600',
  },
});

export default ItemDetailScreen;