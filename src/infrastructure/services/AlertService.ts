/**
 * Alert Service
 *
 * Core service for creating and managing alerts.
 * Handles alert creation, ID generation, and default values.
 */

import * as Haptics from 'expo-haptics';
import { Alert, AlertType, AlertMode, AlertPosition, AlertAnimation, AlertOptions, CreateAlertInput } from '../../domain/entities/Alert.entity';
import { ALERT_ICONS, ALERT_DURATIONS } from '../../application/utils/alertConstants';

export class AlertService {
  /**
   * Creates a new alert with default values
   */
  static createAlert(input: CreateAlertInput): Alert {
    const { title, message, type = AlertType.INFO, mode = AlertMode.TOAST, options = {} } = input;

    const alert: Alert = {
      id: this.generateId(),
      type,
      mode,
      title,
      message,
      icon: options.icon ?? ALERT_ICONS[type],
      actions: options.actions,
      position: options.position ?? this.getDefaultPosition(mode),
      animation: options.animation ?? AlertAnimation.SLIDE,
      duration: options.duration ?? ALERT_DURATIONS.MEDIUM,
      dismissible: options.dismissible ?? true,
      hapticFeedback: options.hapticFeedback ?? true,
      testID: options.testID,
      metadata: options.metadata,
      createdAt: Date.now(),
      showAt: options.showAt,
      priority: options.priority ?? 0,
    };

    // Trigger haptic feedback
    if (alert.hapticFeedback) {
      this.triggerHaptic(type);
    }

    return alert;
  }

  /**
   * Creates a success alert
   */
  static createSuccessAlert(title: string, message?: string, options?: AlertOptions): Alert {
    return this.createAlert({
      title,
      message,
      type: AlertType.SUCCESS,
      options,
    });
  }

  /**
   * Creates an error alert
   */
  static createErrorAlert(title: string, message?: string, options?: AlertOptions): Alert {
    return this.createAlert({
      title,
      message,
      type: AlertType.ERROR,
      options: {
        ...options,
        duration: options?.duration ?? ALERT_DURATIONS.LONG,
      },
    });
  }

  /**
   * Creates a warning alert
   */
  static createWarningAlert(title: string, message?: string, options?: AlertOptions): Alert {
    return this.createAlert({
      title,
      message,
      type: AlertType.WARNING,
      options,
    });
  }

  /**
   * Creates an info alert
   */
  static createInfoAlert(title: string, message?: string, options?: AlertOptions): Alert {
    return this.createAlert({
      title,
      message,
      type: AlertType.INFO,
      options,
    });
  }

  /**
   * Generates a unique alert ID
   */
  private static generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Gets the default position based on alert mode
   */
  private static getDefaultPosition(mode: AlertMode): AlertPosition {
    switch (mode) {
      case AlertMode.TOAST:
        return AlertPosition.TOP;
      case AlertMode.BANNER:
        return AlertPosition.TOP;
      case AlertMode.MODAL:
        return AlertPosition.CENTER;
      case AlertMode.INLINE:
        return AlertPosition.TOP;
      default:
        return AlertPosition.TOP;
    }
  }

  /**
   * Triggers haptic feedback based on alert type
   */
  private static triggerHaptic(type: AlertType): void {
    try {
      switch (type) {
        case AlertType.SUCCESS:
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case AlertType.ERROR:
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case AlertType.WARNING:
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case AlertType.INFO:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
      }
    } catch (error) {
      // Silent error handling - haptics not supported on all platforms
    }
  }
}
