/**
 * useAlert Hook
 *
 * Main hook for interacting with the alert system.
 * Provides methods for showing, dismissing, and managing alerts.
 */

import { useCallback, useMemo } from 'react';
import { Alert, AlertOptions } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { AlertService } from '../../infrastructure/services/AlertService';
import { AlertQueueService } from '../../infrastructure/services/AlertQueueService';

export interface UseAlertReturn {
  // Quick show methods
  showSuccess: (title: string, message?: string, options?: AlertOptions) => string;
  showError: (title: string, message?: string, options?: AlertOptions) => string;
  showWarning: (title: string, message?: string, options?: AlertOptions) => string;
  showInfo: (title: string, message?: string, options?: AlertOptions) => string;

  // Advanced show
  show: (alert: Partial<Alert>) => string;

  // Dismissal
  dismiss: (id: string) => void;
  dismissAll: () => void;

  // Queue management
  queue: {
    size: number;
    clear: () => void;
    pause: () => void;
    resume: () => void;
    isEmpty: boolean;
    isFull: boolean;
  };

  // State
  activeAlerts: Alert[];
  isShowing: boolean;
}

export function useAlert(): UseAlertReturn {
  const activeAlerts = useAlertStore((state) => state.activeAlerts);
  const queueState = useAlertStore((state) => state.queue);
  const addAlert = useAlertStore((state) => state.addAlert);
  const enqueueAlert = useAlertStore((state) => state.enqueueAlert);
  const removeAlert = useAlertStore((state) => state.removeAlert);
  const dismissAllAlerts = useAlertStore((state) => state.dismissAllAlerts);
  const clearQueue = useAlertStore((state) => state.clearQueue);
  const pauseQueue = useAlertStore((state) => state.pauseQueue);
  const resumeQueue = useAlertStore((state) => state.resumeQueue);

  // Quick show methods
  const showSuccess = useCallback(
    (title: string, message?: string, options?: AlertOptions): string => {
      const alert = AlertService.createSuccessAlert(title, message, options);
      addAlert(alert);
      return alert.id;
    },
    [addAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, options?: AlertOptions): string => {
      const alert = AlertService.createErrorAlert(title, message, options);
      addAlert(alert);
      return alert.id;
    },
    [addAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, options?: AlertOptions): string => {
      const alert = AlertService.createWarningAlert(title, message, options);
      addAlert(alert);
      return alert.id;
    },
    [addAlert]
  );

  const showInfo = useCallback(
    (title: string, message?: string, options?: AlertOptions): string => {
      const alert = AlertService.createInfoAlert(title, message, options);
      addAlert(alert);
      return alert.id;
    },
    [addAlert]
  );

  // Advanced show
  const show = useCallback(
    (alertInput: Partial<Alert>): string => {
      const alert = AlertService.createAlert({
        title: alertInput.title ?? '',
        message: alertInput.message,
        type: alertInput.type,
        mode: alertInput.mode,
        options: {
          icon: alertInput.icon,
          actions: alertInput.actions,
          position: alertInput.position,
          animation: alertInput.animation,
          duration: alertInput.duration,
          dismissible: alertInput.dismissible,
          hapticFeedback: alertInput.hapticFeedback,
          testID: alertInput.testID,
          metadata: alertInput.metadata,
          showAt: alertInput.showAt,
          priority: alertInput.priority,
        },
      });
      addAlert(alert);
      return alert.id;
    },
    [addAlert]
  );

  // Dismissal
  const dismiss = useCallback(
    (id: string) => {
      removeAlert(id);
    },
    [removeAlert]
  );

  const dismissAll = useCallback(() => {
    dismissAllAlerts();
  }, [dismissAllAlerts]);

  // Queue management
  const queue = useMemo(
    () => ({
      size: queueState.length,
      clear: clearQueue,
      pause: pauseQueue,
      resume: resumeQueue,
      isEmpty: AlertQueueService.isQueueEmpty(),
      isFull: AlertQueueService.isQueueFull(),
    }),
    [queueState.length, clearQueue, pauseQueue, resumeQueue]
  );

  // State
  const isShowing = activeAlerts.length > 0;

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    show,
    dismiss,
    dismissAll,
    queue,
    activeAlerts,
    isShowing,
  };
}
