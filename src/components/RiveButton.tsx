import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

interface RiveButtonProps {
  animationFile: string;
  onPress?: () => void;
  style?: ViewStyle;
  width?: number;
  height?: number;
  stateMachine?: string;
  disabled?: boolean;
}

const RiveButton: React.FC<RiveButtonProps> = ({
  animationFile,
  onPress,
  style,
  width = 120,
  height = 50,
  stateMachine = 'Button',
  disabled = false,
}) => {
  const riveRef = useRef<RiveRef>(null);

  const handlePressIn = () => {
    if (!disabled && stateMachine) {
      // Triggerar estado de hover/pressed
      riveRef.current?.setInputState(stateMachine, 'hover', true);
      riveRef.current?.setInputState(stateMachine, 'pressed', true);
    }
  };

  const handlePressOut = () => {
    if (!disabled && stateMachine) {
      // Remover estado de pressed
      riveRef.current?.setInputState(stateMachine, 'pressed', false);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      if (stateMachine) {
        // Triggerar animação de clique
        riveRef.current?.setInputState(stateMachine, 'click', true);
      }
      
      if (onPress) {
        onPress();
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, { width, height }]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Rive
        ref={riveRef}
        resourceName={animationFile}
        autoplay={true}
        style={{ width, height }}
        stateMachineName={stateMachine}
        onPlay={(animationName) => {
          console.log('Button animation started:', animationName);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default RiveButton;
