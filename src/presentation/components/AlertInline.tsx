/**
 * AlertInline Component
 *
 * Displays an inline alert within screen content.
 * Used for contextual messages and form validation errors.
 */

import React from 'react';
import { StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';
import { AtomicText } from '@umituz/react-native-design-system-atoms';
import { Ionicons } from '@expo/vector-icons';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { Alert, AlertType } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { ALERT_SPACING } from '../../application/utils/alertConstants';

interface AlertInlineProps {
  alert: Alert;
  style?: StyleProp<ViewStyle>;
}

export function AlertInline({ alert, style }: AlertInlineProps) {
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const tokens = useAppDesignTokens();

  const handleDismiss = () => {
    if (alert.dismissible) {
      dismissAlert(alert.id);
    }
  };

  const getBackgroundColor = (type: AlertType): string => {
    switch (type) {
      case AlertType.SUCCESS:
        return `${tokens.colors.success}10`;
      case AlertType.ERROR:
        return `${tokens.colors.error}10`;
      case AlertType.WARNING:
        return `${tokens.colors.warning}10`;
      case AlertType.INFO:
        return `${tokens.colors.info}10`;
      default:
        return tokens.colors.backgroundSecondary;
    }
  };

  const getBorderColor = (type: AlertType): string => {
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
        return tokens.colors.border;
    }
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

  const backgroundColor = getBackgroundColor(alert.type);
  const borderColor = getBorderColor(alert.type);
  const iconColor = getIconColor(alert.type);
  const textColor = tokens.colors.textPrimary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          padding: tokens.spacing.sm,
          borderRadius: tokens.spacing.xs,
          borderWidth: 1,
        },
        style,
      ]}
      testID={alert.testID}
    >
      <View style={styles.row}>
        {alert.icon && (
          <View style={[styles.iconContainer, { marginRight: tokens.spacing.sm }]}>
            <Ionicons
              name={alert.icon as any}
              size={20}
              color={iconColor}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <AtomicText
            type="bodySmall"
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
                },
              ]}
            >
              <AtomicText
                type="bodySmall"
                style={[
                  styles.actionText,
                  { color: iconColor },
                ]}
              >
                {action.label}
              </AtomicText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    opacity: 0.8,
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
