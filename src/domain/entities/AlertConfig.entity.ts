/**
 * Alert Configuration Entity
 *
 * Defines configuration options for the global alert system.
 */

import { AlertPosition, AlertAnimation } from './Alert.entity';

export interface AlertConfig {
  maxQueueSize: number;
  defaultDuration: number;
  defaultPosition: AlertPosition;
  defaultAnimation: AlertAnimation;
  enableHaptics: boolean;
  enableAccessibility: boolean;
  persistAlerts: boolean;
  queueMode: 'fifo' | 'lifo' | 'priority';
  maxVisibleToasts: number;
  maxVisibleBanners: number;
  animationDuration: number;
}

export const DEFAULT_ALERT_CONFIG: AlertConfig = {
  maxQueueSize: 50,
  defaultDuration: 3000,
  defaultPosition: AlertPosition.TOP,
  defaultAnimation: AlertAnimation.SLIDE,
  enableHaptics: true,
  enableAccessibility: true,
  persistAlerts: false,
  queueMode: 'fifo',
  maxVisibleToasts: 3,
  maxVisibleBanners: 1,
  animationDuration: 300,
};
