/**
 * AlertModal Component
 *
 * Displays a modal-style alert using BottomSheet.
 * Used for confirmations, important messages, and actions requiring user interaction.
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { AtomicText, Icon, AtomicButton, useAppDesignTokens } from '@umituz/react-native-design-system';
import { Alert, AlertType } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';

interface AlertModalProps {
  alert: Alert;
}

export function AlertModal({ alert }: AlertModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const tokens = useAppDesignTokens();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissAlert(alert.id);
    }, 300);
  };

  const getIconColor = (type: AlertType): string => {
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
        return tokens.colors.textPrimary;
    }
  };

  const getIconBackgroundColor = (type: AlertType): string => {
    switch (type) {
      case AlertType.SUCCESS:
        return `${tokens.colors.success}20`;
      case AlertType.ERROR:
        return `${tokens.colors.error}20`;
      case AlertType.WARNING:
        return `${tokens.colors.warning}20`;
      case AlertType.INFO:
        return `${tokens.colors.info}20`;
      default:
        return tokens.colors.backgroundSecondary;
    }
  };

  const iconColor = getIconColor(alert.type);

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={['50%']}
      enablePanDownToClose={alert.dismissible ?? true}
      onClose={handleDismiss}
    >
      <View style={[styles.container, { padding: tokens.spacing.lg }]}>
        {alert.icon && (
          <View style={[styles.iconContainer, { marginBottom: tokens.spacing.md }]}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: getIconBackgroundColor(alert.type),
                  padding: tokens.spacing.md,
                  borderRadius: 100,
                },
              ]}
            >
              <Icon
                name={alert.icon as any}
                color="success"
              />
            </View>
          </View>
        )}

        <AtomicText
          type="headlineSmall"
          style={[
            styles.title,
            {
              color: tokens.colors.textPrimary,
              marginBottom: alert.message ? tokens.spacing.sm : tokens.spacing.lg,
            },
          ]}
        >
          {alert.title}
        </AtomicText>

        {alert.message && (
          <AtomicText
            type="bodyMedium"
            style={[
              styles.message,
              {
                color: tokens.colors.textSecondary,
                marginBottom: tokens.spacing.lg,
              },
            ]}
          >
            {alert.message}
          </AtomicText>
        )}

        {alert.actions && alert.actions.length > 0 ? (
          <View style={[styles.actionsContainer, { gap: tokens.spacing.sm }]}>
            {alert.actions.map((action) => (
              <AtomicButton
                key={action.id}
                variant={getButtonVariant(action.style)}
                onPress={async () => {
                  await action.onPress();
                  if (action.closeOnPress ?? true) {
                    handleDismiss();
                  }
                }}
                fullWidth
              >
                {action.label}
              </AtomicButton>
            ))}
          </View>
        ) : (
          alert.dismissible && (
            <AtomicButton
              variant="primary"
              onPress={handleDismiss}
              fullWidth
            >
              OK
            </AtomicButton>
          )
        )}
      </View>
    </BottomSheet>
  );
}

function getButtonVariant(style: 'primary' | 'secondary' | 'destructive'): 'primary' | 'secondary' | 'outline' {
  switch (style) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'destructive':
      return 'primary';
    default:
      return 'primary';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
  },
});
