/**
 * useAlertAnimation Hook
 *
 * Manages alert animations using Reanimated.
 * Provides entering, exiting, and layout animations.
 */

import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { AlertAnimation, AlertPosition } from '../../domain/entities/Alert.entity';
import { ANIMATION_CONFIG } from '../../application/utils/alertConstants';

export interface UseAlertAnimationProps {
  animation: AlertAnimation;
  position: AlertPosition;
  isVisible: boolean;
}

export function useAlertAnimation({ animation, position, isVisible }: UseAlertAnimationProps) {
  const translateY = useSharedValue(getInitialTranslateY(animation, position));
  const opacity = useSharedValue(0);
  const scale = useSharedValue(animation === AlertAnimation.SCALE ? 0.8 : 1);

  useEffect(() => {
    if (isVisible) {
      // Enter animation
      switch (animation) {
        case AlertAnimation.SLIDE:
          translateY.value = withSpring(0, ANIMATION_CONFIG.SPRING_CONFIG);
          opacity.value = withTiming(1, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.FADE:
          opacity.value = withTiming(1, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.SCALE:
          scale.value = withSpring(1, ANIMATION_CONFIG.SPRING_CONFIG);
          opacity.value = withTiming(1, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.BOUNCE:
          translateY.value = withSpring(0, {
            damping: 10,
            stiffness: 200,
          });
          opacity.value = withTiming(1, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
      }
    } else {
      // Exit animation
      switch (animation) {
        case AlertAnimation.SLIDE:
          translateY.value = withTiming(
            getInitialTranslateY(animation, position),
            ANIMATION_CONFIG.TIMING_CONFIG
          );
          opacity.value = withTiming(0, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.FADE:
          opacity.value = withTiming(0, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.SCALE:
          scale.value = withTiming(0.8, ANIMATION_CONFIG.TIMING_CONFIG);
          opacity.value = withTiming(0, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
        case AlertAnimation.BOUNCE:
          translateY.value = withTiming(
            getInitialTranslateY(animation, position),
            ANIMATION_CONFIG.TIMING_CONFIG
          );
          opacity.value = withTiming(0, ANIMATION_CONFIG.TIMING_CONFIG);
          break;
      }
    }
  }, [isVisible, animation, position, translateY, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return { animatedStyle };
}

function getInitialTranslateY(animation: AlertAnimation, position: AlertPosition): number {
  if (animation === AlertAnimation.FADE || animation === AlertAnimation.SCALE) {
    return 0;
  }

  if (position === AlertPosition.TOP) {
    return -ANIMATION_CONFIG.SLIDE_DISTANCE;
  }

  if (position === AlertPosition.BOTTOM) {
    return ANIMATION_CONFIG.SLIDE_DISTANCE;
  }

  return 0;
}
