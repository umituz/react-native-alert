/**
 * Alert Constants
 *
 * Centralized constants for the alert system.
 */

import { AlertType } from '../../domain/entities/Alert.entity';

export const ALERT_ICONS = {
  [AlertType.SUCCESS]: 'CheckCircle',
  [AlertType.ERROR]: 'XCircle',
  [AlertType.WARNING]: 'AlertTriangle',
  [AlertType.INFO]: 'Info',
} as const;

export const ALERT_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
  PERSISTENT: 0,
} as const;

export const ALERT_Z_INDEX = {
  INLINE: 1,
  BANNER: 1000,
  TOAST: 2000,
  MODAL: 3000,
} as const;

export const ALERT_SPACING = {
  TOAST_VERTICAL: 12,
  TOAST_HORIZONTAL: 16,
  BANNER_PADDING: 16,
  MODAL_PADDING: 24,
  INLINE_PADDING: 12,
} as const;

export const ALERT_SIZES = {
  TOAST_MIN_HEIGHT: 60,
  TOAST_MAX_WIDTH: 400,
  BANNER_HEIGHT: 60,
  MODAL_MIN_HEIGHT: 200,
} as const;

export const ANIMATION_CONFIG = {
  SLIDE_DISTANCE: 100,
  SPRING_CONFIG: {
    damping: 20,
    stiffness: 300,
  },
  TIMING_CONFIG: {
    duration: 300,
  },
} as const;
