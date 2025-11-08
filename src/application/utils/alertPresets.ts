/**
 * Alert Presets
 *
 * Common alert configurations for quick use.
 * Provides pre-configured alerts for common scenarios.
 */

import { AlertType, AlertMode, Alert, AlertOptions } from '../../domain/entities/Alert.entity';
import { ALERT_DURATIONS } from './alertConstants';

export type AlertPresetName =
  | 'saved'
  | 'deleted'
  | 'updated'
  | 'created'
  | 'error'
  | 'networkError'
  | 'validationError'
  | 'permissionDenied'
  | 'deleteConfirmation'
  | 'unsavedChanges'
  | 'comingSoon'
  | 'copied'
  | 'loading'
  | 'offline';

export interface AlertPreset {
  type: AlertType;
  mode: AlertMode;
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
  dismissible?: boolean;
}

export const ALERT_PRESETS: Record<AlertPresetName, AlertPreset> = {
  // Success presets
  saved: {
    type: AlertType.SUCCESS,
    mode: AlertMode.TOAST,
    title: 'Saved',
    message: 'Your changes have been saved successfully',
    icon: 'Check',
    duration: ALERT_DURATIONS.SHORT,
  },

  deleted: {
    type: AlertType.SUCCESS,
    mode: AlertMode.TOAST,
    title: 'Deleted',
    message: 'Item deleted successfully',
    icon: 'Trash2',
    duration: ALERT_DURATIONS.SHORT,
  },

  updated: {
    type: AlertType.SUCCESS,
    mode: AlertMode.TOAST,
    title: 'Updated',
    message: 'Changes updated successfully',
    icon: 'Check',
    duration: ALERT_DURATIONS.SHORT,
  },

  created: {
    type: AlertType.SUCCESS,
    mode: AlertMode.TOAST,
    title: 'Created',
    message: 'Item created successfully',
    icon: 'Plus',
    duration: ALERT_DURATIONS.SHORT,
  },

  copied: {
    type: AlertType.SUCCESS,
    mode: AlertMode.TOAST,
    title: 'Copied',
    message: 'Copied to clipboard',
    icon: 'Copy',
    duration: ALERT_DURATIONS.SHORT,
  },

  // Error presets
  error: {
    type: AlertType.ERROR,
    mode: AlertMode.TOAST,
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    icon: 'CircleX',
    duration: ALERT_DURATIONS.LONG,
  },

  networkError: {
    type: AlertType.ERROR,
    mode: AlertMode.BANNER,
    title: 'Connection Error',
    message: 'Please check your internet connection',
    icon: 'WifiOff',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: true,
  },

  validationError: {
    type: AlertType.ERROR,
    mode: AlertMode.INLINE,
    title: 'Validation Error',
    message: 'Please check your input and try again',
    icon: 'Info',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: true,
  },

  permissionDenied: {
    type: AlertType.ERROR,
    mode: AlertMode.TOAST,
    title: 'Permission Denied',
    message: 'You do not have permission to perform this action',
    icon: 'ShieldOff',
    duration: ALERT_DURATIONS.LONG,
  },

  // Warning presets
  deleteConfirmation: {
    type: AlertType.WARNING,
    mode: AlertMode.MODAL,
    title: 'Confirm Delete',
    message: 'This action cannot be undone. Are you sure you want to delete this item?',
    icon: 'TriangleAlert',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: true,
  },

  unsavedChanges: {
    type: AlertType.WARNING,
    mode: AlertMode.MODAL,
    title: 'Unsaved Changes',
    message: 'You have unsaved changes. Do you want to discard them?',
    icon: 'TriangleAlert',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: true,
  },

  // Info presets
  comingSoon: {
    type: AlertType.INFO,
    mode: AlertMode.TOAST,
    title: 'Coming Soon',
    message: 'This feature is coming soon!',
    icon: 'Info',
    duration: ALERT_DURATIONS.MEDIUM,
  },

  loading: {
    type: AlertType.INFO,
    mode: AlertMode.BANNER,
    title: 'Loading',
    message: 'Please wait...',
    icon: 'Loader',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: false,
  },

  offline: {
    type: AlertType.WARNING,
    mode: AlertMode.BANNER,
    title: 'Offline Mode',
    message: 'You are currently offline',
    icon: 'WifiOff',
    duration: ALERT_DURATIONS.PERSISTENT,
    dismissible: false,
  },
};

/**
 * Gets a preset alert configuration
 */
export function getPreset(name: AlertPresetName): AlertPreset {
  return ALERT_PRESETS[name];
}

/**
 * Gets a preset with custom overrides
 */
export function getPresetWithOverrides(
  name: AlertPresetName,
  overrides: Partial<AlertPreset>
): AlertPreset {
  return {
    ...ALERT_PRESETS[name],
    ...overrides,
  };
}
