import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const UserTypeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showTooltip, setShowTooltip] = useState<'cad' | 'instituicao' | null>(null);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação dos botões com delay
    Animated.timing(buttonScaleAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCadUnico = () => {
    // Navegar para tela de cadastro CAD-Único
    (navigation as any).navigate('CadUnicoForm');
  };

  const handleInstituicao = () => {
    // Navegar para tela de cadastro Instituição
    console.log('Navegando para cadastro Instituição');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const showTooltipInfo = (type: 'cad' | 'instituicao') => {
    setShowTooltip(type);
  };

  const hideTooltip = () => {
    setShowTooltip(null);
  };

  const getTooltipText = () => {
    if (showTooltip === 'cad') {
      return 'CAD-Único: Para pessoas físicas de baixa renda inscritas no Cadastro Único para Programas Sociais do Governo Federal. Destinado a famílias que recebem até meio salário mínimo por pessoa.';
    } else if (showTooltip === 'instituicao') {
      return 'Instituição: Para organizações não-governamentais, entidades beneficentes, instituições de caridade, ONGs e outras organizações que trabalham com assistência social.';
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo da aplicação */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>O que você é?</Text>

        {/* Botões */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              transform: [{ scale: buttonScaleAnim }],
            },
          ]}
        >
          {/* Botão CAD-Único */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCadUnico}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>CAD-ÚNICO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => showTooltipInfo('cad')}
            >
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Instituição */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleInstituicao}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>INSTITUIÇÃO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => showTooltipInfo('instituicao')}
            >
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Indicador Home */}
      <View style={styles.homeIndicator} />

      {/* Modal de Tooltip */}
      <Modal
        visible={showTooltip !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>{getTooltipText()}</Text>
            <TouchableOpacity style={styles.tooltipCloseButton} onPress={hideTooltip}>
              <Text style={styles.tooltipCloseText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  logoContainer: {
    marginBottom: height * 0.06,
    alignItems: 'center',
  },
  logoImage: {
    width: width * 0.25,
    height: width * 0.25,
  },
  title: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: height * 0.08,
  },
  buttonsContainer: {
    width: '100%',
    gap: height * 0.03,
  },
  buttonWrapper: {
    position: 'relative',
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.08,
    paddingRight: width * 0.15, // Espaço para o botão "i"
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    // Gradiente sutil simulado com sombra interna
    overflow: 'hidden',
  },
  buttonText: {
    color: 'white',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  infoButtonText: {
    color: '#1E5E3F',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.06,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: Math.min(width * 0.06, 24),
    color: 'white',
    fontWeight: 'bold',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: height * 0.02,
    left: '50%',
    transform: [{ translateX: -width * 0.175 }],
    width: width * 0.35,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.06,
    maxWidth: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(30, 94, 63, 0.1)',
  },
  tooltipText: {
    fontSize: Math.min(width * 0.042, 16),
    color: '#333',
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: height * 0.025,
    fontWeight: '400',
  },
  tooltipCloseButton: {
    backgroundColor: '#1E5E3F',
    borderRadius: 12,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
    shadowColor: '#1E5E3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tooltipCloseText: {
    color: 'white',
    fontSize: Math.min(width * 0.042, 16),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default UserTypeScreen;
