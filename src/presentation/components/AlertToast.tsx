/**
 * AlertToast Component
 *
 * Displays a toast-style alert with animations.
 * Floats on top of content with smooth enter/exit animations.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { AtomicText } from '@umituz/react-native-design-system-atoms';
import { Ionicons } from '@expo/vector-icons';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { Alert, AlertType } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { useAlertAnimation } from '../hooks/useAlertAnimation';
import { ALERT_SIZES, ALERT_SPACING } from '../../application/utils/alertConstants';

interface AlertToastProps {
  alert: Alert;
}

export function AlertToast({ alert }: AlertToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const { animatedStyle } = useAlertAnimation({
    animation: alert.animation ?? 'slide' as any,
    position: alert.position ?? 'top' as any,
    isVisible,
  });
  const tokens = useAppDesignTokens();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    if (alert.dismissible) {
      setIsVisible(false);
      setTimeout(() => {
        dismissAlert(alert.id);
      }, 300);
    }
  };

  const getBackgroundColor = (type: AlertType): string => {
    switch (type) {
      case AlertType.SUCCESS:
        return tokens.colors.success;
      case AlertType.ERROR:
        return tokens.colors.error;
      case AlertType.WARNING:
        return tokens.colors.warning;
      case AlertType.INFO:
        return tokens.colors.info;
      default:
        return tokens.colors.backgroundSecondary;
    }
  };

  const getTextColor = (type: AlertType): string => {
    return tokens.colors.textInverse;
  };

  const getActionButtonStyle = (style: 'primary' | 'secondary' | 'destructive'): StyleProp<ViewStyle> => {
    switch (style) {
      case 'primary':
        return { backgroundColor: tokens.colors.backgroundPrimary };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tokens.colors.textInverse,
        };
      case 'destructive':
        return { backgroundColor: tokens.colors.error };
      default:
        return { backgroundColor: tokens.colors.backgroundSecondary };
    }
  };

  const getActionTextColor = (style: 'primary' | 'secondary' | 'destructive'): string => {
    switch (style) {
      case 'primary':
        return tokens.colors.textPrimary;
      case 'secondary':
        return tokens.colors.textInverse;
      case 'destructive':
        return tokens.colors.textInverse;
      default:
        return tokens.colors.textPrimary;
    }
  };

  const backgroundColor = getBackgroundColor(alert.type);
  const textColor = getTextColor(alert.type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          padding: tokens.spacing.md,
          borderRadius: tokens.spacing.xs,
          maxWidth: ALERT_SIZES.TOAST_MAX_WIDTH,
        },
        animatedStyle,
      ]}
      testID={alert.testID}
    >
      <Pressable onPress={handleDismiss} style={styles.content}>
        <View style={styles.row}>
          {alert.icon && (
            <View style={[styles.iconContainer, { marginRight: tokens.spacing.sm }]}>
              <Ionicons
                name={alert.icon as any}
                size={20}
                color={textColor}
              />
            </View>
          )}

          <View style={styles.textContainer}>
            <AtomicText
              type="bodyMedium"
              style={[styles.title, { color: textColor }]}
              numberOfLines={2}
            >
              {alert.title}
            </AtomicText>

            {alert.message && (
              <AtomicText
                type="bodySmall"
                style={[
                  styles.message,
                  { color: textColor, marginTop: tokens.spacing.xs },
                ]}
                numberOfLines={3}
              >
                {alert.message}
              </AtomicText>
            )}
          </View>

          {alert.dismissible && (
            <Pressable
              onPress={handleDismiss}
              style={[styles.closeButton, { marginLeft: tokens.spacing.sm }]}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={textColor} />
            </Pressable>
          )}
        </View>

        {alert.actions && alert.actions.length > 0 && (
          <View style={[styles.actionsContainer, { marginTop: tokens.spacing.sm }]}>
            {alert.actions.map((action) => (
              <Pressable
                key={action.id}
                onPress={async () => {
                  await action.onPress();
                  if (action.closeOnPress ?? true) {
                    handleDismiss();
                  }
                }}
                style={[
                  styles.actionButton,
                  {
                    paddingVertical: tokens.spacing.xs,
                    paddingHorizontal: tokens.spacing.sm,
                    marginRight: tokens.spacing.xs,
                    borderRadius: tokens.spacing.xs,
                  },
                  getActionButtonStyle(action.style),
                ]}
              >
                <AtomicText
                  type="bodySmall"
                  style={[
                    styles.actionText,
                    { color: getActionTextColor(action.style) },
                  ]}
                >
                  {action.label}
                </AtomicText>
              </Pressable>
            ))}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: ALERT_SIZES.TOAST_MIN_HEIGHT,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  message: {
    opacity: 0.9,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '600',
  },
});
