/**
 * Alert Queue Service
 *
 * Manages the alert queue processing logic.
 * Handles dequeuing, scheduling, and queue state management.
 */

import { Alert } from '../../domain/entities/Alert.entity';
import { useAlertStore } from '../storage/AlertStore';

export class AlertQueueService {
  private static processingInterval: ReturnType<typeof setInterval> | null = null;
  private static isRunning = false;

  /**
   * Starts the queue processor
   */
  static startProcessor(intervalMs: number = 500): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);
  }

  /**
   * Stops the queue processor
   */
  static stopProcessor(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Processes the next item in the queue
   */
  static processQueue(): void {
    const store = useAlertStore.getState();

    if (store.isPaused || store.isProcessing) {
      return;
    }

    const alert = store.dequeueAlert();

    if (!alert) {
      return;
    }

    // Check if alert should be delayed
    if (alert.showAt && alert.showAt > Date.now()) {
      // Re-enqueue for later
      store.enqueueAlert(alert);
      return;
    }

    // Show the alert
    store.setProcessing(true);
    store.addAlert(alert);

    // Reset processing flag after a short delay
    setTimeout(() => {
      store.setProcessing(false);
    }, 100);
  }

  /**
   * Schedules an alert to be shown at a specific time
   */
  static scheduleAlert(alert: Alert, showAt: number): void {
    const store = useAlertStore.getState();
    const scheduledAlert: Alert = {
      ...alert,
      showAt,
    };
    store.enqueueAlert(scheduledAlert);
  }

  /**
   * Gets the current queue size
   */
  static getQueueSize(): number {
    return useAlertStore.getState().queue.length;
  }

  /**
   * Gets the current number of active alerts
   */
  static getActiveAlertsCount(): number {
    return useAlertStore.getState().activeAlerts.length;
  }

  /**
   * Checks if the queue is full
   */
  static isQueueFull(): boolean {
    const state = useAlertStore.getState();
    return state.queue.length >= state.config.maxQueueSize;
  }

  /**
   * Checks if the queue is empty
   */
  static isQueueEmpty(): boolean {
    return useAlertStore.getState().queue.length === 0;
  }
}
