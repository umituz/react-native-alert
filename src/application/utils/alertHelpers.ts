/**
 * Alert Helper Functions
 *
 * Utility functions for working with alerts.
 */

import { Alert, AlertType, AlertMode } from '../../domain/entities/Alert.entity';
import { ALERT_DURATIONS } from './alertConstants';

/**
 * Checks if an alert is persistent (never auto-dismisses)
 */
export function isPersistent(alert: Alert): boolean {
  return alert.duration === ALERT_DURATIONS.PERSISTENT || alert.duration === 0;
}

/**
 * Checks if an alert is dismissible
 */
export function isDismissible(alert: Alert): boolean {
  return alert.dismissible ?? true;
}

/**
 * Checks if an alert has actions
 */
export function hasActions(alert: Alert): boolean {
  return !!alert.actions && alert.actions.length > 0;
}

/**
 * Gets the remaining time for an alert
 */
export function getRemainingTime(alert: Alert): number {
  if (isPersistent(alert)) {
    return Infinity;
  }

  const elapsed = Date.now() - alert.createdAt;
  const remaining = (alert.duration ?? ALERT_DURATIONS.MEDIUM) - elapsed;

  return Math.max(0, remaining);
}

/**
 * Checks if an alert has expired
 */
export function isExpired(alert: Alert): boolean {
  if (isPersistent(alert)) {
    return false;
  }

  return getRemainingTime(alert) === 0;
}

/**
 * Checks if an alert should be delayed
 */
export function isDelayed(alert: Alert): boolean {
  return !!alert.showAt && alert.showAt > Date.now();
}

/**
 * Gets the delay time for an alert
 */
export function getDelayTime(alert: Alert): number {
  if (!isDelayed(alert)) {
    return 0;
  }

  return (alert.showAt ?? 0) - Date.now();
}

/**
 * Checks if an alert is high priority
 */
export function isHighPriority(alert: Alert): boolean {
  return (alert.priority ?? 0) > 5;
}

/**
 * Sorts alerts by priority (highest first)
 */
export function sortByPriority(alerts: Alert[]): Alert[] {
  return [...alerts].sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    return priorityB - priorityA;
  });
}

/**
 * Filters alerts by type
 */
export function filterByType(alerts: Alert[], type: AlertType): Alert[] {
  return alerts.filter((alert) => alert.type === type);
}

/**
 * Filters alerts by mode
 */
export function filterByMode(alerts: Alert[], mode: AlertMode): Alert[] {
  return alerts.filter((alert) => alert.mode === mode);
}

/**
 * Gets the most recent alert
 */
export function getMostRecent(alerts: Alert[]): Alert | null {
  if (alerts.length === 0) {
    return null;
  }

  return alerts.reduce((latest, current) => {
    return current.createdAt > latest.createdAt ? current : latest;
  });
}

/**
 * Gets the oldest alert
 */
export function getOldest(alerts: Alert[]): Alert | null {
  if (alerts.length === 0) {
    return null;
  }

  return alerts.reduce((oldest, current) => {
    return current.createdAt < oldest.createdAt ? current : oldest;
  });
}

/**
 * Creates a custom alert message from error
 */
export function errorToAlertMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}
