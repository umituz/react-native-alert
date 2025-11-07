/**
 * Alert Queue Entity
 *
 * Defines types for alert queue management.
 */

import { Alert } from './Alert.entity';

export interface AlertQueueItem {
  alert: Alert;
  enqueueAt: number;
}

export interface AlertQueueState {
  items: AlertQueueItem[];
  isPaused: boolean;
  isProcessing: boolean;
}

export type QueueMode = 'fifo' | 'lifo' | 'priority';
