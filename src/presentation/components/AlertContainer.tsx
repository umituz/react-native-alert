/**
 * AlertContainer Component
 *
 * Renders all active alerts based on their mode.
 * Manages positioning and stacking of alerts.
 */

import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useAlertStore } from '../../infrastructure/storage/AlertStore';
import { AlertMode, Alert } from '../../domain/entities/Alert.entity';
import { ALERT_Z_INDEX, ALERT_SPACING } from '../../application/utils/alertConstants';
import { AlertToast } from './AlertToast';
import { AlertBanner } from './AlertBanner';
import { AlertModal } from './AlertModal';

export function AlertContainer() {
  const activeAlerts = useAlertStore((state) => state.activeAlerts);

  // Group alerts by mode
  const toastAlerts = activeAlerts.filter((alert) => alert.mode === AlertMode.TOAST);
  const bannerAlerts = activeAlerts.filter((alert) => alert.mode === AlertMode.BANNER);
  const modalAlerts = activeAlerts.filter((alert) => alert.mode === AlertMode.MODAL);

  return (
    <>
      {/* Banner Alerts */}
      {bannerAlerts.length > 0 && (
        <View style={styles.bannerContainer} pointerEvents="box-none">
          {bannerAlerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </View>
      )}

      {/* Toast Alerts */}
      {toastAlerts.length > 0 && (
        <View style={styles.toastContainer} pointerEvents="box-none">
          {toastAlerts.map((alert, index) => (
            <View
              key={alert.id}
              style={[
                styles.toastWrapper,
                index > 0 ? { marginTop: ALERT_SPACING.TOAST_VERTICAL } : undefined,
              ]}
            >
              <AlertToast alert={alert} />
            </View>
          ))}
        </View>
      )}

      {/* Modal Alerts */}
      {modalAlerts.map((alert) => (
        <AlertModal key={alert.id} alert={alert} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: ALERT_Z_INDEX.BANNER,
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: ALERT_Z_INDEX.TOAST,
  },
  toastWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: ALERT_SPACING.TOAST_HORIZONTAL,
  },
});
