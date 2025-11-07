/**
 * Alert Zustand Store
 *
 * Global state management for the alert system using Zustand.
 * Manages active alerts, queue, and configuration.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AlertType, AlertMode, AlertOptions } from '../../domain/entities/Alert.entity';
import { AlertConfig, DEFAULT_ALERT_CONFIG } from '../../domain/entities/AlertConfig.entity';
import { AlertQueueItem } from '../../domain/entities/AlertQueue.entity';

const STORAGE_KEY = '@alert_store';

interface AlertStore {
  // State
  activeAlerts: Alert[];
  queue: AlertQueueItem[];
  config: AlertConfig;
  isProcessing: boolean;
  isPaused: boolean;

  // Core Actions
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  dismissAllAlerts: () => void;

  // Queue Management
  enqueueAlert: (alert: Alert) => void;
  dequeueAlert: () => Alert | null;
  clearQueue: () => void;
  pauseQueue: () => void;
  resumeQueue: () => void;

  // Configuration
  updateConfig: (config: Partial<AlertConfig>) => void;
  resetConfig: () => void;

  // Persistence
  loadPersistedAlerts: () => Promise<void>;
  persistAlerts: () => Promise<void>;

  // Internal
  setProcessing: (isProcessing: boolean) => void;
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  // Initial State
  activeAlerts: [],
  queue: [],
  config: DEFAULT_ALERT_CONFIG,
  isProcessing: false,
  isPaused: false,

  // Core Actions
  addAlert: (alert: Alert) => {
    set((state) => {
      const newActiveAlerts = [...state.activeAlerts, alert];

      // Limit visible alerts based on mode
      const filteredAlerts = limitVisibleAlerts(newActiveAlerts, state.config);

      return { activeAlerts: filteredAlerts };
    });

    // Auto-dismiss if duration is set
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        get().removeAlert(alert.id);
      }, alert.duration);
    }

    // Persist if enabled
    if (get().config.persistAlerts) {
      get().persistAlerts();
    }
  },

  removeAlert: (id: string) => {
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((alert) => alert.id !== id),
    }));

    // Persist if enabled
    if (get().config.persistAlerts) {
      get().persistAlerts();
    }
  },

  dismissAlert: (id: string) => {
    get().removeAlert(id);
  },

  dismissAllAlerts: () => {
    set({ activeAlerts: [] });

    if (get().config.persistAlerts) {
      get().persistAlerts();
    }
  },

  // Queue Management
  enqueueAlert: (alert: Alert) => {
    set((state) => {
      const queueItem: AlertQueueItem = {
        alert,
        enqueueAt: Date.now(),
      };

      let newQueue = [...state.queue, queueItem];

      // Limit queue size
      if (newQueue.length > state.config.maxQueueSize) {
        newQueue = newQueue.slice(-state.config.maxQueueSize);
      }

      // Sort by priority if priority mode
      if (state.config.queueMode === 'priority') {
        newQueue.sort((a, b) => {
          const priorityA = a.alert.priority ?? 0;
          const priorityB = b.alert.priority ?? 0;
          return priorityB - priorityA;
        });
      }

      return { queue: newQueue };
    });
  },

  dequeueAlert: (): Alert | null => {
    const state = get();

    if (state.queue.length === 0 || state.isPaused) {
      return null;
    }

    let alert: Alert | null = null;
    let newQueue = [...state.queue];

    if (state.config.queueMode === 'lifo') {
      // Last in, first out
      const item = newQueue.pop();
      alert = item?.alert ?? null;
    } else {
      // FIFO or priority (already sorted)
      const item = newQueue.shift();
      alert = item?.alert ?? null;
    }

    set({ queue: newQueue });
    return alert;
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  pauseQueue: () => {
    set({ isPaused: true });
  },

  resumeQueue: () => {
    set({ isPaused: false });
  },

  // Configuration
  updateConfig: (newConfig: Partial<AlertConfig>) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },

  resetConfig: () => {
    set({ config: DEFAULT_ALERT_CONFIG });
  },

  // Persistence
  loadPersistedAlerts: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { activeAlerts, queue } = JSON.parse(stored);
        set({ activeAlerts: activeAlerts || [], queue: queue || [] });
      }
    } catch (error) {
      // Silent error handling as per CLAUDE.md
    }
  },

  persistAlerts: async () => {
    try {
      const { activeAlerts, queue } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ activeAlerts, queue })
      );
    } catch (error) {
      // Silent error handling as per CLAUDE.md
    }
  },

  // Internal
  setProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },
}));

/**
 * Limits the number of visible alerts based on mode and configuration
 */
function limitVisibleAlerts(alerts: Alert[], config: AlertConfig): Alert[] {
  const toastAlerts = alerts.filter((a) => a.mode === AlertMode.TOAST);
  const bannerAlerts = alerts.filter((a) => a.mode === AlertMode.BANNER);
  const otherAlerts = alerts.filter(
    (a) => a.mode !== AlertMode.TOAST && a.mode !== AlertMode.BANNER
  );

  const limitedToasts = toastAlerts.slice(-config.maxVisibleToasts);
  const limitedBanners = bannerAlerts.slice(-config.maxVisibleBanners);

  return [...limitedBanners, ...limitedToasts, ...otherAlerts];
}
