/**
 * Core Alert Entity Definitions
 *
 * Defines all types, interfaces, and enums for the alert system.
 * These types are used across the entire alert domain.
 */

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum AlertMode {
  TOAST = 'toast',
  BANNER = 'banner',
  MODAL = 'modal',
  INLINE = 'inline',
}

export enum AlertPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center',
}

export enum AlertAnimation {
  SLIDE = 'slide',
  FADE = 'fade',
  SCALE = 'scale',
  BOUNCE = 'bounce',
}

export interface AlertAction {
  id: string;
  label: string;
  style: 'primary' | 'secondary' | 'destructive';
  onPress: () => void | Promise<void>;
  closeOnPress?: boolean;
}

export interface Alert {
  id: string;
  type: AlertType;
  mode: AlertMode;
  title: string;
  message?: string;
  icon?: string;
  actions?: AlertAction[];
  position?: AlertPosition;
  animation?: AlertAnimation;
  duration?: number;
  dismissible?: boolean;
  hapticFeedback?: boolean;
  testID?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  showAt?: number;
  priority?: number;
}

export interface AlertOptions {
  type?: AlertType;
  mode?: AlertMode;
  icon?: string;
  actions?: AlertAction[];
  position?: AlertPosition;
  animation?: AlertAnimation;
  duration?: number;
  dismissible?: boolean;
  hapticFeedback?: boolean;
  testID?: string;
  metadata?: Record<string, unknown>;
  showAt?: number;
  priority?: number;
}

export interface CreateAlertInput {
  title: string;
  message?: string;
  type?: AlertType;
  mode?: AlertMode;
  options?: AlertOptions;
}
