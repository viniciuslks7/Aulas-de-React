import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

// Conditional Rive import - only for mobile platforms
let Rive: any = null;
let RiveRef: any = null;

if (Platform.OS !== 'web') {
  try {
    const riveModule = require('rive-react-native');
    Rive = riveModule.default;
    RiveRef = riveModule.RiveRef;
  } catch (error) {
    console.log('Rive not available on this platform');
  }
}

const { width, height } = Dimensions.get('window');

interface RiveTestScreenProps {
  navigation?: any;
}

const RiveTestScreen: React.FC<RiveTestScreenProps> = ({ navigation }) => {
  const riveRef = useRef<any>(null);
  
  // Check if Rive is available
  if (Platform.OS === 'web' || !Rive) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Teste de Animações Rive</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.notAvailableContainer}>
            <Text style={styles.notAvailableTitle}>🚫 Rive não disponível</Text>
            <Text style={styles.notAvailableText}>
              As animações Rive só funcionam em dispositivos móveis (iOS/Android).
            </Text>
            <Text style={styles.notAvailableText}>
              Execute o app em um simulador ou dispositivo mobile para testar.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  // Estados para configuração dinâmica
  const [currentAnimation, setCurrentAnimation] = useState('auxilium_logo.riv');
  const [currentStateMachine, setCurrentStateMachine] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSize, setAnimationSize] = useState(200);

  // Lista de animações para testar (você vai adicionando conforme cria no Rive)
  const animations = [
    { name: 'Logo Principal', file: 'auxilium_logo.riv', stateMachine: '' },
    { name: 'Logo Splash', file: 'auxilium_logo_splash.riv', stateMachine: 'LogoController' },
    { name: 'Logo Botão', file: 'auxilium_logo_button.riv', stateMachine: 'ButtonStates' },
    { name: 'Logo Simples', file: 'auxilium_logo_simple.riv', stateMachine: '' },
    // Adicione mais conforme criar no Rive
  ];

  // Tamanhos pré-definidos para testar
  const sizes = [100, 150, 200, 250, 300];

  // Funções de controle
  const playAnimation = () => {
    riveRef.current?.play();
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    riveRef.current?.pause();
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    riveRef.current?.reset();
    setIsPlaying(true);
  };

  // Funções para triggerar inputs de State Machine
  const triggerInput = (inputName: string, value: any = true) => {
    if (currentStateMachine) {
      try {
        riveRef.current?.setInputState(currentStateMachine, inputName, value);
        Alert.alert('Input Triggered', `${inputName}: ${value}`);
      } catch (error) {
        Alert.alert('Erro', `Input '${inputName}' não encontrado na State Machine '${currentStateMachine}'`);
      }
    } else {
      Alert.alert('Aviso', 'Nenhuma State Machine configurada para esta animação');
    }
  };

  const changeAnimation = (animationData: typeof animations[0]) => {
    setCurrentAnimation(animationData.file);
    setCurrentStateMachine(animationData.stateMachine);
    // Reset para nova animação
    setTimeout(() => {
      riveRef.current?.reset();
      setIsPlaying(true);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teste de Animações Rive</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Área de Preview da Animação */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={[styles.animationContainer, { width: animationSize, height: animationSize }]}>
            <Rive
              ref={riveRef}
              resourceName={currentAnimation}
              autoplay={isPlaying}
              style={{ width: animationSize, height: animationSize }}
              stateMachineName={currentStateMachine || undefined}
              onPlay={(animationName: string) => {
                console.log('▶️ Animation started:', animationName);
              }}
              onPause={(animationName: string) => {
                console.log('⏸️ Animation paused:', animationName);
              }}
              onStop={(animationName: string) => {
                console.log('⏹️ Animation stopped:', animationName);
              }}
              onLoopEnd={(animationName: string) => {
                console.log('🔄 Animation loop ended:', animationName);
              }}
            />
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Arquivo: {currentAnimation}</Text>
            <Text style={styles.infoText}>
              State Machine: {currentStateMachine || 'Nenhuma'}
            </Text>
            <Text style={styles.infoText}>Tamanho: {animationSize}px</Text>
            <Text style={styles.infoText}>Status: {isPlaying ? '▶️ Playing' : '⏸️ Paused'}</Text>
          </View>
        </View>

        {/* Controles de Reprodução */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controles</Text>
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={playAnimation}>
              <Text style={styles.controlButtonText}>▶️ Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={pauseAnimation}>
              <Text style={styles.controlButtonText}>⏸️ Pause</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={resetAnimation}>
              <Text style={styles.controlButtonText}>🔄 Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seleção de Animação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolher Animação</Text>
          {animations.map((anim, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.animationOption,
                currentAnimation === anim.file && styles.animationOptionSelected
              ]}
              onPress={() => changeAnimation(anim)}
            >
              <Text style={[
                styles.animationOptionText,
                currentAnimation === anim.file && styles.animationOptionTextSelected
              ]}>
                {anim.name}
              </Text>
              <Text style={styles.animationOptionFile}>{anim.file}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Controle de Tamanho */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamanho</Text>
          <View style={styles.sizesRow}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  animationSize === size && styles.sizeButtonSelected
                ]}
                onPress={() => setAnimationSize(size)}
              >
                <Text style={[
                  styles.sizeButtonText,
                  animationSize === size && styles.sizeButtonTextSelected
                ]}>
                  {size}px
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Inputs de State Machine */}
        {currentStateMachine && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inputs da State Machine</Text>
            <Text style={styles.subtitle}>State Machine: {currentStateMachine}</Text>
            
            <View style={styles.inputsGrid}>
              {/* Inputs comuns para logos */}
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('start')}
              >
                <Text style={styles.inputButtonText}>🚀 Start</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('hover', true)}
              >
                <Text style={styles.inputButtonText}>👆 Hover ON</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('hover', false)}
              >
                <Text style={styles.inputButtonText}>👆 Hover OFF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('click')}
              >
                <Text style={styles.inputButtonText}>👆 Click</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('finish')}
              >
                <Text style={styles.inputButtonText}>🏁 Finish</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => triggerInput('reset')}
              >
                <Text style={styles.inputButtonText}>🔄 Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Instruções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Usar</Text>
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionText}>
              1. 📁 Coloque seus arquivos .riv em: assets/animations/
            </Text>
            <Text style={styles.instructionText}>
              2. 🎨 Adicione o nome do arquivo na lista 'animations' acima
            </Text>
            <Text style={styles.instructionText}>
              3. 🎮 Configure o nome da State Machine (se houver)
            </Text>
            <Text style={styles.instructionText}>
              4. 🧪 Teste diferentes tamanhos e controles
            </Text>
            <Text style={styles.instructionText}>
              5. ✨ Ajuste as animações no Rive e recarregue o app
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1E5E3F',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E5E3F',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  animationContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#1E5E3F',
    marginBottom: 2,
  },
  section: {
    marginBottom: 25,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: '#1E5E3F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  animationOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  animationOptionSelected: {
    borderColor: '#1E5E3F',
    backgroundColor: '#e8f5e8',
  },
  animationOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  animationOptionTextSelected: {
    color: '#1E5E3F',
  },
  animationOptionFile: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  sizesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  sizeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sizeButtonSelected: {
    backgroundColor: '#1E5E3F',
    borderColor: '#1E5E3F',
  },
  sizeButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sizeButtonTextSelected: {
    color: 'white',
  },
  inputsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  inputButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  instructionsBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  instructionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
    lineHeight: 20,
  },
  notAvailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notAvailableTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  notAvailableText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default RiveTestScreen;
