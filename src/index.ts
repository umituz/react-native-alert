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

// Utilities
export * from './application/utils/alertConstants';
export * from './application/utils/alertPresets';
export * from './application/utils/alertHelpers';
