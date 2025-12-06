/**
 * AlertBanner Component
 *
 * Displays a banner-style alert at the top or bottom of the screen.
 * Full-width notification bar for important messages.
 */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AtomicText } from '@umituz/react-native-design-system-atoms';
import { Ionicons } from '@expo/vector-icons';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { Alert, AlertType, AlertPosition } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { ALERT_SIZES } from '../../application/utils/alertConstants';

interface AlertBannerProps {
  alert: Alert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const insets = useSafeAreaInsets();
  const tokens = useAppDesignTokens();

  const handleDismiss = () => {
    if (alert.dismissible) {
      dismissAlert(alert.id);
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

  const backgroundColor = getBackgroundColor(alert.type);
  const textColor = getTextColor(alert.type);
  const isTop = alert.position === AlertPosition.TOP;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: isTop ? insets.top + tokens.spacing.sm : tokens.spacing.sm,
          paddingBottom: isTop ? tokens.spacing.sm : insets.bottom + tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.md,
          minHeight: ALERT_SIZES.BANNER_HEIGHT,
        },
      ]}
      testID={alert.testID}
    >
      <View style={styles.content}>
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
              numberOfLines={1}
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
                numberOfLines={2}
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
                  },
                ]}
              >
                <AtomicText
                  type="bodySmall"
                  style={[
                    styles.actionText,
                    { color: textColor },
                  ]}
                >
                  {action.label}
                </AtomicText>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    textDecorationLine: 'underline',
  },
});
