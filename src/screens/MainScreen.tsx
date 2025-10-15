import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
  Animated,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Platform,
  ImageBackground
} from 'react-native';
import { MainScreenProps } from '../types/navigation';
import { useUser } from '../contexts/UserContext';

const { width, height } = Dimensions.get('window');

// 🌈 Native Gradient Component (sem dependências externas)
const GradientBackground = ({ colors, style, children }: { 
  colors: string[], 
  style?: any, 
  children?: React.ReactNode 
}) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      <View style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colors[1], 
          opacity: 0.7 
        }
      ]} />
      <View style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colors[2] || colors[1], 
          opacity: 0.4 
        }
      ]} />
      {children}
    </View>
  );
};

// 🎨 DESIGN SYSTEM - Boer Green Premium Style
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
    glassmorphism: 'rgba(255, 255, 255, 0.95)',
    gradient: ['#2E7D32', '#388E3C', '#4CAF50'],
    gradientGreen: ['#1B5E20', '#2E7D32', '#388E3C'],
    gradientLight: ['#81C784', '#A5D6A7', '#C8E6C9'],
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
    orange: '#FF7043',
    yellow: '#FFC107',
    purple: '#9C27B0',
    blue: '#2196F3'
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
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 12
    }
  }
};

// Enhanced Data Structure with Premium Features
interface DataItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  imagem: any;
  rating: number;
  reviews: number;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  verified: boolean;
  tags: string[];
}

const eventosData: DataItem[] = [
  {
    id: '1',
    nome: 'Arrecadação de Alimentos',
    descricao: 'Campanha para famílias carentes da região metropolitana',
    categoria: 'Alimentação',
    imagem: require('../../assets/cestabasica.png'),
    rating: 4.8,
    reviews: 124,
    location: 'São Paulo, SP',
    urgency: 'high',
    verified: true,
    tags: ['Alimentação', 'Família', 'Urgente']
  },
  {
    id: '2',
    nome: 'Doação de Roupas',
    descricao: 'Inverno solidário 2025 - Agasalhos para população em situação de rua',
    categoria: 'Vestuário',
    imagem: require('../../assets/agasalho.png'),
    rating: 4.6,
    reviews: 89,
    location: 'Rio de Janeiro, RJ',
    urgency: 'medium',
    verified: true,
    tags: ['Vestuário', 'Inverno', 'Agasalho']
  },
  {
    id: '3',
    nome: 'Doação em Dinheiro',
    descricao: 'Ajuda financeira para famílias necessitadas via PIX',
    categoria: 'Financeiro',
    imagem: require('../../assets/dinheiro.png'),
    rating: 4.9,
    reviews: 256,
    location: 'Belo Horizonte, MG',
    urgency: 'low',
    verified: true,
    tags: ['Dinheiro', 'PIX', 'Financeiro']
  }
];

const instituicoesData: DataItem[] = [
  {
    id: '1',
    nome: 'Centro de Acolhimento',
    descricao: 'Instituição dedicada ao acolhimento de pessoas em situação de vulnerabilidade',
    categoria: 'Acolhimento',
    imagem: require('../../assets/acolhimento-icon.png'),
    rating: 4.9,
    reviews: 340,
    location: 'São Paulo, SP',
    urgency: 'medium',
    verified: true,
    tags: ['Acolhimento', 'Proteção', 'Cuidado']
  },
  {
    id: '2',
    nome: 'Casa do Idoso',
    descricao: 'Cuidando de quem cuidou de nós com amor e dedicação',
    categoria: 'Terceira Idade',
    imagem: require('../../assets/logo.png'),
    rating: 4.7,
    reviews: 178,
    location: 'Curitiba, PR',
    urgency: 'medium',
    verified: true,
    tags: ['Idosos', 'Cuidado', 'Respeito']
  },
  {
    id: '3',
    nome: 'Instituto Esperança',
    descricao: 'Transformando vidas através da educação e capacitação',
    categoria: 'Educação',
    imagem: require('../../assets/logo.png'),
    rating: 4.8,
    reviews: 92,
    location: 'Salvador, BA',
    urgency: 'low',
    verified: true,
    tags: ['Educação', 'Capacitação', 'Futuro']
  }
];

const individuosData: DataItem[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    descricao: 'Mãe de 3 filhos buscando oportunidades para recomeçar',
    categoria: 'Família',
    imagem: require('../../assets/logo.png'),
    rating: 4.5,
    reviews: 23,
    location: 'Porto Alegre, RS',
    urgency: 'high',
    verified: true,
    tags: ['Mãe', 'Família', 'Oportunidade']
  },
  {
    id: '2',
    nome: 'João Santos',
    descricao: 'Estudante universitário em busca de apoio para continuar os estudos',
    categoria: 'Educação',
    imagem: require('../../assets/logo.png'),
    rating: 4.3,
    reviews: 15,
    location: 'Fortaleza, CE',
    urgency: 'medium',
    verified: false,
    tags: ['Estudante', 'Universidade', 'Sonhos']
  },
  {
    id: '3',
    nome: 'Ana Costa',
    descricao: 'Empreendedora buscando microcrédito para pequeno negócio',
    categoria: 'Empreendedorismo',
    imagem: require('../../assets/iconmoney.png'),
    rating: 4.7,
    reviews: 31,
    location: 'Recife, PE',
    urgency: 'low',
    verified: true,
    tags: ['Empreendedora', 'Negócio', 'Independência']
  }
];

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  // User context
  const { user, isLoading: userLoading } = useUser();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // State management
  // Por padrão abrir na aba 'Instituições' conforme layout Figma
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Removido scrollViewRef que não estava sendo usado corretamente
  const searchInputRef = useRef<TextInput>(null);
  
  const tabs = ['Eventos', 'Instituições', 'Indivíduos'];
  const tabData = [eventosData, instituicoesData, individuosData];

  // Filtered data based on search and filters
  const filteredData = useMemo(() => {
    const currentData = tabData[activeTab];
    return currentData.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 ||
        selectedFilters.some(filter => item.tags.includes(filter));
        
      return matchesSearch && matchesFilters;
    });
  }, [activeTab, searchQuery, selectedFilters, tabData]);

  // Get unique categories for filter chips
  const availableCategories = useMemo(() => {
    const currentData = tabData[activeTab];
    const categories = currentData.flatMap(item => item.tags);
    return [...new Set(categories)];
  }, [activeTab, tabData]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Optimized handlers - Corrigindo bugs de rolagem
  const handleTabPress = useCallback((index: number) => {
    const tabAnimation = Animated.spring(slideAnim, {
      toValue: index * 10,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    });
    
    setActiveTab(index);
    setSearchQuery('');
    setSelectedFilters([]);
    
    // Removendo rolagem horizontal que estava causando problemas
    // scrollViewRef.current?.scrollTo({
    //   x: index * width,
    //   animated: true,
    // });
    
    tabAnimation.start();
  }, [slideAnim]);

  // Removendo handler de scroll horizontal problemático
  // const handleScroll = useCallback((event: any) => {
  //   const scrollX = event.nativeEvent.contentOffset.x;
  //   const currentIndex = Math.round(scrollX / width);
  //   if (currentIndex !== activeTab) {
  //     setActiveTab(currentIndex);
  //   }
  // }, [activeTab]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const toggleFilter = useCallback((filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const getUrgencyColor = useCallback((urgency: string) => {
    switch (urgency) {
      case 'high': return DESIGN_SYSTEM.colors.error;
      case 'medium': return DESIGN_SYSTEM.colors.warning;
      case 'low': return DESIGN_SYSTEM.colors.success;
      default: return DESIGN_SYSTEM.colors.onSurfaceVariant;
    }
  }, []);

  // Premium Card Component with Animations - Otimizado para rolagem
  const PremiumCard = React.memo(({ item, index }: { item: DataItem; index: number }) => {
    const cardScale = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      // Animação mais suave para não interferir com rolagem
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200 + (index * 50), // Reduzido para melhor performance
        useNativeDriver: true,
      }).start();
    }, [index]);

    const handlePressIn = useCallback(() => {
      Animated.spring(cardScale, {
        toValue: 0.98, // Reduzido para menos interferência
        tension: 400, // Aumentado para resposta mais rápida
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [cardScale]);

    const handlePressOut = useCallback(() => {
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 400,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [cardScale]);

    const renderStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      
      for (let i = 0; i < fullStars; i++) {
        stars.push(<Text key={i} style={styles.star}>★</Text>);
      }
      if (hasHalfStar) {
        stars.push(<Text key="half" style={styles.starHalf}>★</Text>);
      }
      for (let i = stars.length; i < 5; i++) {
        stars.push(<Text key={i} style={styles.starEmpty}>☆</Text>);
      }
      return stars;
    };

    return (
      <Animated.View 
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }]
          }
        ]}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}
        >
          {/* iFood-Style Hero Image */}
          <View style={styles.cardImageContainer}>
            <ImageBackground 
              source={item.imagem} 
              style={styles.cardHeroImage}
              imageStyle={styles.heroImageStyle}
            >
              <GradientBackground 
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
              >
                {/* Top badges */}
                <View style={styles.cardTopBadges}>
                  {item.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedIcon}>✓</Text>
                      <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                  )}
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
                    <Text style={styles.urgencyText}>
                      {item.urgency === 'high' ? '🔥 Urgente' : 
                       item.urgency === 'medium' ? '⚡ Moderado' : '🌱 Baixa'}
                    </Text>
                  </View>
                </View>

                {/* Bottom info */}
                <View style={styles.imageBottomInfo}>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {renderStars(item.rating)}
                    </View>
                    <Text style={styles.ratingText}>({item.reviews})</Text>
                  </View>
                  <Text style={styles.locationBadge}>📍 {item.location}</Text>
                </View>
              </GradientBackground>
            </ImageBackground>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.nome}</Text>
            <Text style={styles.cardDescription} numberOfLines={3}>
              {item.descricao}
            </Text>

            {/* Tags Row - Rolagem horizontal otimizada */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollContainer}
              // Otimizações para rolagem suave
              decelerationRate="fast"
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              bounces={false}
              overScrollMode="never"
            >
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, tagIndex) => (
                  <View key={tagIndex} style={[
                    styles.tag, 
                    { backgroundColor: DESIGN_SYSTEM.colors.gradientLight[tagIndex % 3] + '40' }
                  ]}>
                    <Text style={[styles.tagText, { color: DESIGN_SYSTEM.colors.gradientGreen[tagIndex % 3] }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>💚 Ajudar Agora</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  const renderItem = ({ item, index }: { item: DataItem; index: number }) => (
    <PremiumCard item={item} index={index} />
  );

  // Novo layout inspirado no Figma - simplificado e responsivo
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#2C9E67" />

      {/* Top Bar (barra verde) */}
      <View style={styles.figmaTopBar}>
  <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.figmaSearchBar}>
          <Image source={require('../../assets/icon-lupa-naoselecionado.png')} style={styles.searchIconLarge} />
          <TextInput
            ref={searchInputRef}
            placeholder="#SOS Mendigos"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.searchInputFigma}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ItemCrudScreen')} style={styles.crudButton}>
            <Text style={styles.crudButtonText}>🗂️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* abrir filtros */ }}>
            <Image source={require('../../assets/Funil-icon.png')} style={styles.funnelIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area com fundo branco translúcido */}
      <View style={styles.figmaContent}>
        {/* Tabs (Eventos | Instituições | Indivíduos) */}
        <View style={styles.tabsRowFigma}>
          <TouchableOpacity onPress={() => handleTabPress(0)}>
            <Text style={[styles.tabLabelFigma, activeTab === 0 && styles.tabInactiveFigma]}>Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress(1)}>
            <Text style={[styles.tabLabelFigma, activeTab === 1 && styles.tabActiveFigma]}>Instituições</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress(2)}>
            <Text style={[styles.tabLabelFigma, activeTab === 2 && styles.tabInactiveFigma]}>Indivíduos</Text>
          </TouchableOpacity>
        </View>

        {/* Lista similar ao Figma: itens fixos com botão VER */}
        <FlatList
          data={tabData[activeTab]}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <View style={styles.figmaItem}>
              <Image source={item.imagem} style={styles.figmaAvatar} />
              <View style={styles.figmaTextContainer}>
                <Text style={styles.figmaName}>{item.nome}</Text>
                <Text style={styles.figmaMessage} numberOfLines={1}>{item.descricao}</Text>
              </View>
              <TouchableOpacity 
                style={styles.verButton} 
                onPress={() => navigation.navigate('ItemDetailScreen', { item: {
                  id: item.id,
                  titulo: item.nome,
                  categoria: item.categoria || 'Alimentação',
                  descricao: item.descricao,
                  urgencia: item.urgency === 'high' ? 'Alta' : item.urgency === 'medium' ? 'Média' : 'Baixa',
                  dataPostagem: '10/10/2025',
                  status: 'Ativo',
                  localizacao: item.location || 'São Paulo, SP',
                  foto: item.imagem,
                  beneficiario: {
                    nome: item.nome,
                    verificado: item.verified
                  }
                }})}
              >
                <Text style={styles.verText}>Ver</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={[{ paddingBottom: 120 }, styles.contentPaddingForBottomBar]}
        />
      </View>

      {/* Bottom selection bar similar ao Figma */}
      <View style={styles.figmaBottomBar}>
        <TouchableOpacity style={styles.bottomIconArea} onPress={() => searchInputRef.current?.focus()}>
          <Image source={ searchQuery.length > 0 ? require('../../assets/icon-lupa-selecionado.png') : require('../../assets/icon-lupa-naoselecionado.png')} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIconArea} onPress={() => navigation.navigate('ProfileScreen')}>
          {/* Mostrar foto do usuário se existir, caso contrário usar padrao-foto */}
          <Image source={ user?.fotoPerfil ? { uri: user.fotoPerfil } : require('../../assets/padrao-foto.png')} style={[styles.bottomIcon, { borderRadius: 15 }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background,
  },

  // Premium Main Content
  mainContent: {
    flex: 1,
  },

  // Boer-Style Header Styles
  headerContainer: {
    paddingBottom: DESIGN_SYSTEM.spacing.xl,
    paddingTop: DESIGN_SYSTEM.spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingTop: DESIGN_SYSTEM.spacing.md,
    paddingBottom: DESIGN_SYSTEM.spacing.sm,
  },

  profileButton: {
    position: 'relative',
  },

  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarText: {
    fontSize: 24,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  verifiedBadgeSmall: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  verifiedIconSmall: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  headerCenter: {
    flex: 1,
    marginLeft: DESIGN_SYSTEM.spacing.md,
  },

  greetingText: {
    fontSize: DESIGN_SYSTEM.typography.h4.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  locationText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FDCB6E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  searchSection: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingBottom: DESIGN_SYSTEM.spacing.md,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  searchIcon: {
    fontSize: 18,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    marginRight: DESIGN_SYSTEM.spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    fontWeight: '400',
  },

  clearSearchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearIcon: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
  },

  // Premium Filter Chips - Rolagem otimizada
  filtersContainer: {
    maxHeight: 52,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    flexGrow: 0, // Evita conflitos com rolagem principal
  },

  filtersContent: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    alignItems: 'center', // Centraliza verticalmente
  },

  filterChip: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    marginRight: DESIGN_SYSTEM.spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.outline,
  },

  filterChipActive: {
    backgroundColor: DESIGN_SYSTEM.colors.accent,
    borderColor: DESIGN_SYSTEM.colors.primary,
  },

  filterChipText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
  },

  filterChipTextActive: {
    color: DESIGN_SYSTEM.colors.surface,
    fontWeight: '600',
  },

  // Premium Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.outline,
  },

  tab: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    alignItems: 'center',
    position: 'relative',
  },

  activeTab: {
    // Active state handled by indicator
  },

  tabText: {
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    fontWeight: '500',
  },

  activeTabText: {
    color: DESIGN_SYSTEM.colors.primary,
    fontWeight: '700',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    borderRadius: 2,
  },

  // iFood-Style Card Styles
  card: {
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },

  cardImageContainer: {
    height: 200,
    position: 'relative',
  },

  cardHeroImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  heroImageStyle: {
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.lg,
  },

  imageOverlay: {
    flex: 1,
    padding: DESIGN_SYSTEM.spacing.md,
    justifyContent: 'space-between',
  },

  cardTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  urgencyBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageBottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  locationBadge: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    overflow: 'hidden',
  },

  cardContent: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },

  cardTitle: {
    fontSize: DESIGN_SYSTEM.typography.h3.fontSize,
    fontWeight: '700',
    color: DESIGN_SYSTEM.colors.onSurface,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    lineHeight: 28,
  },

  cardDescription: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },

  tagsScrollContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.md,
    flexGrow: 0, // Evita conflitos com rolagem principal
    maxHeight: 40, // Altura fixa para melhor performance
  },

  tagsContainer: {
    flexDirection: 'row',
    paddingRight: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center', // Centraliza verticalmente
  },

  tag: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    marginRight: DESIGN_SYSTEM.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  tagText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    fontWeight: '600',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  primaryButton: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    marginRight: DESIGN_SYSTEM.spacing.sm,
    shadowColor: DESIGN_SYSTEM.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    fontSize: DESIGN_SYSTEM.typography.button.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  secondaryButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: DESIGN_SYSTEM.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.outline,
  },

  // Shared Styles - Melhorados para rolagem
  listContainer: {
    padding: DESIGN_SYSTEM.spacing.lg,
    paddingBottom: DESIGN_SYSTEM.spacing.xl * 2,
    flexGrow: 1, // Garante que a lista ocupe o espaço necessário
  },

  itemSeparator: {
    height: DESIGN_SYSTEM.spacing.md,
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },

  starHalf: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },

  starEmpty: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 2,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    marginLeft: DESIGN_SYSTEM.spacing.xs,
    fontWeight: '600',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
  },

  verifiedIcon: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  verifiedText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },

  urgencyText: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  secondaryButtonText: {
    fontSize: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xl * 2,
  },

  emptyStateIcon: {
    fontSize: 48,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    opacity: 0.6,
  },

  emptyStateTitle: {
    fontSize: DESIGN_SYSTEM.typography.h3.fontSize,
    color: DESIGN_SYSTEM.colors.onSurface,
    fontWeight: '600',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    textAlign: 'center',
  },

  emptyStateDescription: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    lineHeight: 20,
  },

  // Premium Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.outline,
    shadowColor: DESIGN_SYSTEM.shadows.heavy.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: DESIGN_SYSTEM.shadows.heavy.shadowOpacity,
    shadowRadius: DESIGN_SYSTEM.shadows.heavy.shadowRadius,
    elevation: DESIGN_SYSTEM.shadows.heavy.elevation,
  },

  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
  },

  bottomNavIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  bottomNavLabel: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: DESIGN_SYSTEM.colors.onSurfaceVariant,
    fontWeight: '500',
  },

  // Legacy styles (to be removed)
  headerLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconText: {
    fontSize: 16,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  filterText: {
    color: 'white',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    width: width,
    flex: 1,
  },
  cardLeft: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardCenter: {
    flex: 1,
  },
  // --- Estilos inspirados no Figma ---
  figmaTopBar: {
    height: 92,
    backgroundColor: '#2C9E67',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 12) : 12,
  },
  logo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  figmaSearchBar: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginLeft: 14,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconLarge: {
    width: 24,
    height: 24,
    tintColor: 'rgba(0,0,0,0.5)',
    marginRight: 8,
    resizeMode: 'contain',
  },
  searchInputFigma: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)'
  },
  funnelIcon: {
    width: 20,
    height: 20,
    marginLeft: 6,
    resizeMode: 'contain',
    tintColor: 'rgba(0,0,0,0.5)'
  },
  figmaContent: {
    flex: 1,
    marginHorizontal: 5.5,
    marginTop: 12,
    backgroundColor: 'transparent'
  },
  tabsRowFigma: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  tabLabelFigma: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center'
  },
  tabActiveFigma: {
    color: '#00A3FF',
    opacity: 1,
  },
  tabInactiveFigma: {
    color: '#00A455',
    opacity: 0.5,
  },
  figmaItem: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14.5,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 6,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  figmaAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    resizeMode: 'cover'
  },
  figmaTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  figmaName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000'
  },
  figmaMessage: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.6)'
  },
  verButton: {
    width: 84,
    height: 32,
    backgroundColor: '#2C9E67',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  verText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  divider: {
    height: 1.5,
    backgroundColor: '#CDC8C8',
    marginHorizontal: 9
  },
  figmaBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: '#1E5E3F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 8
  },
  bottomIconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain'
  },
  // ensure content isn't hidden behind bottom bar
  contentPaddingForBottomBar: {
    paddingBottom: 180
  },
  
  // CRUD Button Styles
  crudButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  crudButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default MainScreen;
