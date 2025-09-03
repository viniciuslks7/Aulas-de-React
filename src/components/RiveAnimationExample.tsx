import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

interface RiveAnimationExampleProps {
  animationFile: string; // Caminho para o arquivo .riv
  width?: number;
  height?: number;
  autoplay?: boolean;
  stateMachine?: string;
  artboard?: string;
}

const RiveAnimationExample: React.FC<RiveAnimationExampleProps> = ({
  animationFile,
  width = 200,
  height = 200,
  autoplay = true,
  stateMachine,
  artboard,
}) => {
  const riveRef = useRef<RiveRef>(null);

  const playAnimation = () => {
    riveRef.current?.play();
  };

  const pauseAnimation = () => {
    riveRef.current?.pause();
  };

  const resetAnimation = () => {
    riveRef.current?.reset();
  };

  // Função para triggerar inputs de state machine
  const triggerInput = (inputName: string, value?: number | boolean) => {
    if (stateMachine) {
      riveRef.current?.setInputState(stateMachine, inputName, value ?? true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.animationContainer, { width, height }]}>
        <Rive
          ref={riveRef}
          resourceName={animationFile}
          autoplay={autoplay}
          style={{ ...styles.animation, width, height }}
          artboardName={artboard}
          stateMachineName={stateMachine}
          onPlay={(animationName) => {
            console.log('Animation started:', animationName);
          }}
          onPause={(animationName) => {
            console.log('Animation paused:', animationName);
          }}
          onStop={(animationName) => {
            console.log('Animation stopped:', animationName);
          }}
          onLoopEnd={(animationName) => {
            console.log('Animation loop ended:', animationName);
          }}
        />
      </View>

      {/* Controles de exemplo */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={playAnimation}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pauseAnimation}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={resetAnimation}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Exemplo de como triggerar inputs de state machine */}
      {stateMachine && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, styles.triggerButton]} 
            onPress={() => triggerInput('hover', true)}
          >
            <Text style={styles.buttonText}>Trigger Hover</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.triggerButton]} 
            onPress={() => triggerInput('click')}
          >
            <Text style={styles.buttonText}>Trigger Click</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  animation: {
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1E5E3F',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  triggerButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default RiveAnimationExample;
