/**
 * Alert Domain - Barrel Export
 *
 * Central export file for the alert domain.
 * Import from '@umituz/react-native-alert' in your app.
 */

// Entities
export * from './domain/entities/Alert.entity';
export * from './domain/entities/AlertConfig.entity';
export * from './domain/entities/AlertQueue.entity';

// Hooks
export { useAlert } from './presentation/hooks/useAlert';
export type { UseAlertReturn } from './presentation/hooks/useAlert';
export { useAlertAnimation } from './presentation/hooks/useAlertAnimation';

// Components
export { AlertProvider } from './presentation/components/AlertProvider';
export { AlertContainer } from './presentation/components/AlertContainer';
export { AlertToast } from './presentation/components/AlertToast';
export { AlertBanner } from './presentation/components/AlertBanner';
export { AlertModal } from './presentation/components/AlertModal';
export { AlertInline } from './presentation/components/AlertInline';

// Store
export { useAlertStore } from './infrastructure/storage/AlertStore';

// Services
export { AlertService } from './infrastructure/services/AlertService';
export { AlertQueueService } from './infrastructure/services/AlertQueueService';

// Service instance (convenience export)
import { AlertService } from './infrastructure/services/AlertService';
import { useAlertStore } from './infrastructure/storage/AlertStore';

// Wrapper object for instance methods
export const alertService = {
  error: (title: string, message?: string, options?: any) => {
    const alert = AlertService.createErrorAlert(title, message, options);
    useAlertStore.getState().addAlert(alert);
    return alert.id;
  },
  success: (title: string, message?: string, options?: any) => {
    const alert = AlertService.createSuccessAlert(title, message, options);
    useAlertStore.getState().addAlert(alert);
    return alert.id;
  },
  warning: (title: string, message?: string, options?: any) => {
    const alert = AlertService.createWarningAlert(title, message, options);
    useAlertStore.getState().addAlert(alert);
    return alert.id;
  },
  info: (title: string, message?: string, options?: any) => {
    const alert = AlertService.createInfoAlert(title, message, options);
    useAlertStore.getState().addAlert(alert);
    return alert.id;
  },
};

// Utilities
export * from './application/utils/alertConstants';
export * from './application/utils/alertPresets';
export * from './application/utils/alertHelpers';
