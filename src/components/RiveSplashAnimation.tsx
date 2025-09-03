import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

const { width, height } = Dimensions.get('window');

interface RiveSplashAnimationProps {
  onAnimationComplete?: () => void;
  animationFile: string;
  duration?: number;
}

const RiveSplashAnimation: React.FC<RiveSplashAnimationProps> = ({
  onAnimationComplete,
  animationFile,
  duration = 3000,
}) => {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    // Iniciar a animação automaticamente
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Rive
          ref={riveRef}
          resourceName={animationFile}
          autoplay={true}
          style={styles.animation}
          onPlay={(animationName) => {
            console.log('Rive splash animation started:', animationName);
          }}
          onLoopEnd={(animationName) => {
            console.log('Rive splash animation loop ended:', animationName);
            // Opcional: chamar onAnimationComplete quando a animação terminar
            // if (onAnimationComplete) {
            //   onAnimationComplete();
            // }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E5E3F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: width * 0.8,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default RiveSplashAnimation;
