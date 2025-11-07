# Alert Domain - Complete Guide

A comprehensive, production-ready alert system for React Native apps with support for multiple display modes, animations, queuing, and offline-first architecture.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Alert Types](#alert-types)
- [Display Modes](#display-modes)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## ✨ Features

- **4 Alert Types**: Success, Error, Warning, Info
- **4 Display Modes**: Toast, Banner, Modal, Inline
- **Smooth Animations**: Slide, Fade, Scale, Bounce (Reanimated v3)
- **Queue Management**: FIFO, LIFO, Priority-based
- **Action Support**: Primary, Secondary, Destructive buttons
- **Auto-dismiss**: Configurable duration or persistent
- **Haptic Feedback**: Native tactile response
- **Theme-aware**: Light/dark mode support
- **Responsive**: Phone and tablet optimized
- **Offline-first**: Works without backend
- **Type-safe**: Full TypeScript support
- **Accessible**: VoiceOver/TalkBack ready

## 🏗️ Architecture

```
domains/alert/
├── domain/              # Business logic layer
│   ├── entities/       # Core types & interfaces
│   └── repositories/   # Repository interfaces
├── infrastructure/     # Technical implementation
│   ├── storage/       # Zustand store
│   └── services/      # Business services
├── presentation/       # UI layer
│   ├── components/    # React components
│   └── hooks/         # React hooks
└── application/       # Application layer
    └── utils/         # Utilities & presets
```

## 📦 Installation

The alert domain is automatically included in all generated apps when enabled in `domains.yaml`:

```yaml
domains:
  alert: true
```

## 🚀 Quick Start

### 1. Wrap your app with AlertProvider

```typescript
// App.tsx
import { AlertProvider, AlertContainer } from '@umituz/react-native-alert';

export default function App() {
  return (
    <AlertProvider>
      <NavigationContainer>
        {/* Your app content */}
      </NavigationContainer>
      <AlertContainer /> {/* Renders all alerts */}
    </AlertProvider>
  );
}
```

### 2. Use alerts in your screens

```typescript
import { useAlert } from '@umituz/react-native-alert';

function MyScreen() {
  const { showSuccess, showError } = useAlert();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Saved!', 'Your changes have been saved');
    } catch (error) {
      showError('Error', 'Failed to save changes');
    }
  };

  return <Button onPress={handleSave} label="Save" />;
}
```

## 🎨 Alert Types

### Success
```typescript
showSuccess('Title', 'Optional message');
// Green background, CheckCircle icon, 2s duration
```

### Error
```typescript
showError('Title', 'Optional message');
// Red background, XCircle icon, 5s duration
```

### Warning
```typescript
showWarning('Title', 'Optional message');
// Orange background, AlertTriangle icon, 3s duration
```

### Info
```typescript
showInfo('Title', 'Optional message');
// Blue background, Info icon, 3s duration
```

## 📱 Display Modes

### Toast (Default)
Floating notification at top or bottom of screen.

```typescript
showSuccess('Saved!', undefined, {
  mode: AlertMode.TOAST,
  position: AlertPosition.TOP,
  duration: 2000,
});
```

### Banner
Full-width bar at top or bottom, respects safe area.

```typescript
show({
  type: AlertType.ERROR,
  mode: AlertMode.BANNER,
  title: 'No Internet',
  message: 'Please check your connection',
  position: AlertPosition.TOP,
  duration: 0, // Persistent
});
```

### Modal
Centered overlay with BottomSheet, for confirmations.

```typescript
show({
  type: AlertType.WARNING,
  mode: AlertMode.MODAL,
  title: 'Delete Item?',
  message: 'This action cannot be undone',
  actions: [
    {
      id: 'cancel',
      label: 'Cancel',
      style: 'secondary',
      onPress: () => console.log('Cancelled'),
    },
    {
      id: 'delete',
      label: 'Delete',
      style: 'destructive',
      onPress: () => handleDelete(),
    },
  ],
});
```

### Inline
Embedded in screen content, for contextual messages.

```typescript
// Rendered inline in your component
<AlertInline
  alert={{
    type: AlertType.ERROR,
    title: 'Validation Error',
    message: 'Please fill all required fields',
  }}
/>
```

## 📚 Usage Examples

### Basic Alerts

```typescript
const { showSuccess, showError, showWarning, showInfo } = useAlert();

// Simple success
showSuccess('Saved!');

// With message
showError('Error', 'Something went wrong');

// Custom icon
showInfo('Update Available', 'Version 2.0 is ready', {
  icon: 'Download',
});

// Custom duration
showWarning('Warning', 'This action is risky', {
  duration: 5000, // 5 seconds
});

// Persistent (never auto-dismiss)
showInfo('Loading...', undefined, {
  duration: 0,
  dismissible: false,
});
```

### Alerts with Actions

```typescript
show({
  type: AlertType.WARNING,
  mode: AlertMode.MODAL,
  title: 'Unsaved Changes',
  message: 'Do you want to save before leaving?',
  actions: [
    {
      id: 'discard',
      label: 'Discard',
      style: 'destructive',
      onPress: () => navigation.goBack(),
    },
    {
      id: 'cancel',
      label: 'Cancel',
      style: 'secondary',
      onPress: () => console.log('Cancelled'),
    },
    {
      id: 'save',
      label: 'Save',
      style: 'primary',
      onPress: async () => {
        await saveChanges();
        navigation.goBack();
      },
    },
  ],
});
```

### Using Presets

```typescript
import { getPreset } from '@umituz/react-native-alert';

// Use built-in preset
const savedPreset = getPreset('saved');
show(savedPreset);

// Available presets:
// - saved, deleted, updated, created, copied
// - error, networkError, validationError, permissionDenied
// - deleteConfirmation, unsavedChanges
// - comingSoon, loading, offline

// Customize preset
show({
  ...getPreset('deleteConfirmation'),
  message: 'Delete all 50 items?',
});
```

### Form Validation

```typescript
function LoginForm() {
  const { showError } = useAlert();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      await login(email, password);
    } catch (error) {
      const message = errorToAlertMessage(error);
      showError('Login Failed', message);
    }
  };

  return (
    <View>
      {error && (
        <AlertInline
          alert={{
            type: AlertType.ERROR,
            title: 'Validation Error',
            message: error,
          }}
        />
      )}
      {/* Form fields */}
    </View>
  );
}
```

### Loading States

```typescript
function DataFetchScreen() {
  const { show, dismiss } = useAlert();
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);

  const fetchData = async () => {
    // Show loading alert
    const id = show({
      ...getPreset('loading'),
      title: 'Loading data...',
    });
    setLoadingAlertId(id);

    try {
      await fetchFromAPI();
      dismiss(id);
      showSuccess('Success', 'Data loaded');
    } catch (error) {
      dismiss(id);
      showError('Error', 'Failed to load data');
    }
  };

  return <Button onPress={fetchData} label="Fetch Data" />;
}
```

### Network Status

```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

function NetworkStatusBanner() {
  const { show, dismiss } = useAlert();
  const { isOffline } = useNetworkStatus();
  const [offlineAlertId, setOfflineAlertId] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline && !offlineAlertId) {
      const id = show(getPreset('offline'));
      setOfflineAlertId(id);
    } else if (!isOffline && offlineAlertId) {
      dismiss(offlineAlertId);
      setOfflineAlertId(null);
    }
  }, [isOffline]);

  return null;
}
```

### Confirmation Dialogs

```typescript
function DeleteButton({ item }: { item: Item }) {
  const { show } = useAlert();

  const confirmDelete = () => {
    show({
      type: AlertType.WARNING,
      mode: AlertMode.MODAL,
      title: 'Delete Item?',
      message: `Are you sure you want to delete "${item.name}"? This cannot be undone.`,
      icon: 'Trash2',
      actions: [
        {
          id: 'cancel',
          label: 'Cancel',
          style: 'secondary',
          onPress: () => {}, // Just closes
        },
        {
          id: 'delete',
          label: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(item.id);
            showSuccess('Deleted', `${item.name} has been deleted`);
          },
        },
      ],
    });
  };

  return <Button onPress={confirmDelete} label="Delete" />;
}
```

## 🎯 Advanced Features

### Queue Management

```typescript
const { queue } = useAlert();

// Check queue status
console.log('Queue size:', queue.size);
console.log('Is empty:', queue.isEmpty);
console.log('Is full:', queue.isFull);

// Pause queue processing
queue.pause();

// Resume queue processing
queue.resume();

// Clear all queued alerts
queue.clear();
```

### Custom Animations

```typescript
show({
  title: 'Custom Animation',
  animation: AlertAnimation.BOUNCE,
  position: AlertPosition.BOTTOM,
});
```

### Manual Dismissal

```typescript
const alertId = showSuccess('Processing...');

// Later...
setTimeout(() => {
  dismiss(alertId);
}, 3000);
```

### Dismiss All Alerts

```typescript
const { dismissAll } = useAlert();

dismissAll(); // Removes all active alerts
```

### Priority-based Queue

```typescript
// High priority alert (shown first)
show({
  title: 'Critical Error',
  type: AlertType.ERROR,
  priority: 10,
});

// Low priority alert (shown later)
show({
  title: 'Info',
  type: AlertType.INFO,
  priority: 1,
});
```

### Delayed Alerts

```typescript
// Show alert 5 seconds from now
show({
  title: 'Reminder',
  message: 'Time to take a break',
  showAt: Date.now() + 5000,
});
```

## 📖 API Reference

### useAlert Hook

```typescript
interface UseAlertReturn {
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
```

### AlertOptions

```typescript
interface AlertOptions {
  type?: AlertType;
  mode?: AlertMode;
  icon?: string; // Lucide icon name
  actions?: AlertAction[];
  position?: AlertPosition;
  animation?: AlertAnimation;
  duration?: number; // milliseconds, 0 for persistent
  dismissible?: boolean;
  hapticFeedback?: boolean;
  testID?: string;
  metadata?: Record<string, unknown>;
  showAt?: number; // timestamp for delayed alerts
  priority?: number; // higher = more important
}
```

### Alert Entity

```typescript
interface Alert {
  id: string;
  type: AlertType;
  mode: AlertMode;
  title: string;
  message?: string;
  icon?: string;
  actions?: AlertAction[];
  position?: AlertPosition;
  animation?: AlertAnimation;
  duration?: number;
  dismissible?: boolean;
  hapticFeedback?: boolean;
  testID?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  showAt?: number;
  priority?: number;
}
```

## ✅ Best Practices

### 1. Use Appropriate Alert Types
```typescript
// ✅ Good: Use success for positive actions
showSuccess('Item saved');

// ❌ Bad: Using error for success
showError('Item saved successfully');
```

### 2. Choose the Right Display Mode
```typescript
// ✅ Toast for quick feedback
showSuccess('Copied!', undefined, { mode: AlertMode.TOAST });

// ✅ Modal for confirmations
show({ mode: AlertMode.MODAL, title: 'Delete?' });

// ✅ Banner for persistent status
show({ mode: AlertMode.BANNER, title: 'Offline', duration: 0 });

// ✅ Inline for form validation
<AlertInline alert={{ title: 'Invalid email' }} />
```

### 3. Keep Messages Concise
```typescript
// ✅ Good: Short and clear
showSuccess('Saved');

// ❌ Bad: Too verbose
showSuccess('Your changes have been successfully saved to the database');
```

### 4. Use Actions for Important Decisions
```typescript
// ✅ Good: Provide actions for destructive operations
show({
  title: 'Delete?',
  actions: [
    { label: 'Cancel', style: 'secondary' },
    { label: 'Delete', style: 'destructive', onPress: handleDelete },
  ],
});

// ❌ Bad: No way to undo
handleDelete();
showSuccess('Deleted');
```

### 5. Handle Errors Gracefully
```typescript
// ✅ Good: User-friendly error messages
catch (error) {
  showError('Failed to save', 'Please try again later');
}

// ❌ Bad: Technical error messages
catch (error) {
  showError('Error', error.stack);
}
```

### 6. Clean Up Loading Alerts
```typescript
// ✅ Good: Always dismiss loading alerts
const id = show({ title: 'Loading...' });
try {
  await fetchData();
  dismiss(id);
} catch {
  dismiss(id);
  showError('Failed');
}

// ❌ Bad: Leaving loading alert visible
show({ title: 'Loading...' });
await fetchData(); // Alert stays forever
```

### 7. Use Presets for Common Scenarios
```typescript
// ✅ Good: Consistent presets
show(getPreset('saved'));

// ❌ Bad: Inconsistent messages
showSuccess('Item saved successfully');
showSuccess('Saved!');
showSuccess('Changes have been saved');
```

## 🎓 Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAlert } from '@umituz/react-native-alert';

describe('useAlert', () => {
  it('should show success alert', () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showSuccess('Test');
    });

    expect(result.current.activeAlerts).toHaveLength(1);
    expect(result.current.activeAlerts[0].title).toBe('Test');
  });
});
```

## 🚀 Performance Tips

1. **Use appropriate durations**: Short (2s) for success, Long (5s) for errors
2. **Limit queue size**: Default 50, adjust via config
3. **Avoid excessive alerts**: Batch related messages
4. **Clean up on unmount**: Alerts auto-cleanup, but dismiss manually if needed
5. **Use inline mode**: For static content to avoid overlay overhead

## 📄 License

Part of the React Native Offline App Factory.
Copyright © 2025 Umit Uz. All rights reserved.
