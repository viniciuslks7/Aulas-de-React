import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AnimatedTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  animationType: 'slideUp' | 'morphCircle' | 'liquidSlide' | 'elasticZoom';
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  isVisible,
  animationType = 'liquidSlide',
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      progress.value = withSequence(
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        })
      );
    } else {
      progress.value = withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
      });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case 'liquidSlide':
        const translateY = interpolate(
          progress.value,
          [0, 0.3, 0.7, 1],
          [screenHeight, screenHeight * 0.1, -screenHeight * 0.05, 0],
          Extrapolate.CLAMP
        );
        
        const scale = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0.3, 1.1, 1],
          Extrapolate.CLAMP
        );

        const rotateZ = interpolate(
          progress.value,
          [0, 0.5, 1],
          [15, -5, 0],
          Extrapolate.CLAMP
        );

        const opacity = interpolate(
          progress.value,
          [0, 0.4, 1],
          [0, 0.8, 1],
          Extrapolate.CLAMP
        );

        return {
          transform: [
            { translateY },
            { scale },
            { rotateZ: `${rotateZ}deg` },
          ],
          opacity,
        };

      case 'morphCircle':
        const circleScale = interpolate(
          progress.value,
          [0, 0.6, 1],
          [0, 2.5, 1],
          Extrapolate.CLAMP
        );

        const borderRadius = interpolate(
          progress.value,
          [0, 0.6, 1],
          [screenWidth, screenWidth * 0.3, 0],
          Extrapolate.CLAMP
        );

        return {
          transform: [{ scale: circleScale }],
          borderRadius,
          opacity: progress.value,
        };

      case 'elasticZoom':
        const elasticScale = interpolate(
          progress.value,
          [0, 0.3, 0.7, 1],
          [0, 1.3, 0.9, 1],
          Extrapolate.CLAMP
        );

        const elasticOpacity = interpolate(
          progress.value,
          [0, 0.3, 1],
          [0, 0.7, 1],
          Extrapolate.CLAMP
        );

        return {
          transform: [{ scale: elasticScale }],
          opacity: elasticOpacity,
        };

      default: // slideUp
        return {
          transform: [
            {
              translateY: interpolate(
                progress.value,
                [0, 1],
                [screenHeight, 0],
                Extrapolate.CLAMP
              ),
            },
          ],
          opacity: progress.value,
        };
    }
  });

  if (!isVisible && progress.value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Hook personalizado para animações de botão
export const useButtonPressAnimation = () => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` },
    ],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    rotation.value = withSpring(2, {
      damping: 15,
      stiffness: 300,
    });
  };

  const onPressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, {
        damping: 15,
        stiffness: 300,
      }),
      withSpring(1, {
        damping: 15,
        stiffness: 300,
      })
    );
    rotation.value = withSpring(0, {
      damping: 15,
      stiffness: 300,
    });
  };

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
};
