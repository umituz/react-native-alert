/**
 * AlertProvider Component
 *
 * Provider component that initializes the alert system.
 * Should wrap the entire app at the root level.
 */

import React, { useEffect, ReactNode } from 'react';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { AlertQueueService } from '../../infrastructure/services/AlertQueueService';

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const config = useAlertStore((state) => state.config);
  const loadPersistedAlerts = useAlertStore((state) => state.loadPersistedAlerts);

  useEffect(() => {
    // Load persisted alerts on mount
    if (config.persistAlerts) {
      loadPersistedAlerts();
    }

    // Start queue processor
    AlertQueueService.startProcessor();

    // Cleanup on unmount
    return () => {
      AlertQueueService.stopProcessor();
    };
  }, [config.persistAlerts, loadPersistedAlerts]);

  return <>{children}</>;
}
