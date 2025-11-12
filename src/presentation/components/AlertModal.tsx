/**
 * AlertModal Component
 *
 * Displays a modal-style alert using React Native's native Alert.alert.
 * Simple, reliable, and works on all platforms without dependencies.
 */

import React, { useEffect } from 'react';
import { Alert as RNAlert } from 'react-native';
import { Alert, AlertType } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';

interface AlertModalProps {
  alert: Alert;
}

export function AlertModal({ alert }: AlertModalProps) {
  const dismissAlert = useAlertStore((state) => state.dismissAlert);

  useEffect(() => {
    // Convert alert actions to React Native Alert buttons
    const buttons: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress: () => void | Promise<void> }> = alert.actions
      ? alert.actions.map((action) => ({
          text: action.label,
          style: action.style === 'destructive' ? 'destructive' : 'default' as 'default' | 'destructive',
          onPress: async () => {
            await action.onPress();
            if (action.closeOnPress ?? true) {
              dismissAlert(alert.id);
            }
          },
        }))
      : alert.dismissible
        ? [{ text: 'OK', onPress: () => dismissAlert(alert.id) }]
        : [];

    // Show native alert
    RNAlert.alert(alert.title, alert.message, buttons);
  }, [alert, dismissAlert]);

  // This component doesn't render anything - it just triggers the native alert
  return null;
}
