/**
 * AlertModal Component
 *
 * Displays a modal-style alert using BottomSheet.
 * Used for confirmations, important messages, and actions requiring user interaction.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal, useBottomSheetModal } from '@umituz/react-native-bottom-sheet';
import { AtomicText, AtomicIcon, AtomicButton, useAppDesignTokens } from '@umituz/react-native-design-system';
import { Alert, AlertType } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';

interface AlertModalProps {
  alert: Alert;
}

export function AlertModal({ alert }: AlertModalProps) {
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const tokens = useAppDesignTokens();
  const { modalRef, present, dismiss } = useBottomSheetModal();
  const [isRendered, setIsRendered] = useState(false);
  const [hasPresented, setHasPresented] = useState(false);

  // Lazy rendering: Only render BottomSheetModal when we're ready to show it
  // This prevents Reanimated initialization errors
  useEffect(() => {
    // Set rendered state first
    setIsRendered(true);
  }, []);

  // Present modal after it's rendered and mounted
  useEffect(() => {
    if (isRendered && !hasPresented) {
      // Wait for BottomSheetModal to mount (500ms delay + animation frames)
      const timer = setTimeout(() => {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            present();
            setHasPresented(true);
          });
        });
      }, 700); // Wait longer than BottomSheetModal's 500ms mount delay

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isRendered, hasPresented, present]);

  const handleDismiss = () => {
    dismiss();
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

  // Lazy rendering: Only render BottomSheetModal when ready
  // This prevents Reanimated initialization errors on app startup
  if (!isRendered) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      preset="medium"
      enableBackdrop
      enablePanDownToClose={alert.dismissible ?? true}
      onDismiss={handleDismiss}
      onChange={(index) => {
        // Track when modal is actually mounted and ready
        if (index >= 0 && !hasPresented) {
          setHasPresented(true);
        }
      }}
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
              <AtomicIcon
                name={alert.icon as any}
                color={iconColor as any}
                size="lg"
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
                style={
                  action.style === 'destructive'
                    ? { borderColor: tokens.colors.error }
                    : undefined
                }
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
    </BottomSheetModal>
  );
}

function getButtonVariant(style: 'primary' | 'secondary' | 'destructive'): 'primary' | 'secondary' | 'outline' {
  switch (style) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'destructive':
      return 'outline';
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
