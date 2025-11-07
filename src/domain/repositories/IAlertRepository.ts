/**
 * Alert Repository Interface
 *
 * Defines the contract for alert storage operations.
 */

import { Alert } from '../entities/Alert.entity';

export interface IAlertRepository {
  saveAlert(alert: Alert): Promise<void>;
  getAlerts(): Promise<Alert[]>;
  deleteAlert(id: string): Promise<void>;
  clearAlerts(): Promise<void>;
}
