import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import { MainScreenProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

// Dados mockados para cada categoria
const eventosData = [
  {
    id: '1',
    nome: 'Arrecadação de Alimentos',
    descricao: 'Campanha para famílias carentes',
    categoria: 'Alimentação',
    imagem: require('../../assets/cestabasica.png')
  },
  {
    id: '2',
    nome: 'Doação de Roupas',
    descricao: 'Inverno solidário 2025',
    categoria: 'Vestuário',
    imagem: require('../../assets/agasalho.png')
  }
];

const instituicoesData = [
  {
    id: '1',
    nome: 'Caritas',
    descricao: 'Ajudamos a todos!',
    categoria: 'Assistência Social',
    imagem: require('../../assets/logo.png')
  },
  {
    id: '2',
    nome: 'Casa do Idoso',
    descricao: 'Cuidando de quem cuidou',
    categoria: 'Terceira Idade',
    imagem: require('../../assets/logo.png')
  }
];

const individuosData = [
  {
    id: '1',
    nome: 'Maria Silva',
    descricao: 'Mãe de 3 filhos',
    categoria: 'Família',
    imagem: require('../../assets/logo.png')
  },
  {
    id: '2',
    nome: 'João Santos',
    descricao: 'Estudante universitário',
    categoria: 'Educação',
    imagem: require('../../assets/logo.png')
  }
];

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const tabs = ['Eventos', 'Instituições', 'Indivíduos'];
  const tabData = [eventosData, instituicoesData, individuosData];

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / width);
    if (currentIndex !== activeTab) {
      setActiveTab(currentIndex);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Image source={item.imagem} style={styles.cardImage} />
      </View>
      <View style={styles.cardCenter}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardDescription}>{item.descricao}</Text>
      </View>
      <TouchableOpacity style={styles.cardButton}>
        <Text style={styles.cardButtonText}>VER</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com logo e busca */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.headerLogo} />
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </View>
          <Text style={styles.searchPlaceholder}>#SOS Mendigos</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filtro</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs de navegação */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && styles.activeTab
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text style={[
              styles.tabText,
              activeTab === index && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo das abas com scroll horizontal */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.contentContainer}
      >
        {tabData.map((data, index) => (
          <View key={index} style={styles.tabContent}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E5E3F',
  },
  headerLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchIconText: {
    fontSize: 16,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
  },
  filterText: {
    color: 'white',
    fontSize: 12,
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E5E3F',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1E5E3F',
    fontWeight: 'bold',
  },
  // Content styles
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    width: width,
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  // Card styles
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  cardButton: {
    backgroundColor: '#1E5E3F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Bottom navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E5E3F',
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  bottomNavIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default MainScreen;
