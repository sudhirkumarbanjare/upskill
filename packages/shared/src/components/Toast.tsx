// ─── Component: Toast ───
// Premium toast notification system. NEVER use Alert.alert().

import React, {useEffect, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, textStyles, spacing, radius} from '../theme';

import {Icon, IconName} from './icons/Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Global toast state (singleton pattern)
let toastCallback: ((toast: ToastData) => void) | null = null;

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration?: number,
) {
  const id = Date.now().toString();
  const defaultDuration = type === 'error' ? 5000 : 3000;
  toastCallback?.({id, type, message, duration: duration ?? defaultDuration});
}

// Convenience methods
export const toast = {
  success: (msg: string) => showToast(msg, 'success'),
  error: (msg: string) => showToast(msg, 'error'),
  warning: (msg: string) => showToast(msg, 'warning'),
  info: (msg: string) => showToast(msg, 'info'),
};

const ACCENT_COLORS: Record<ToastType, string> = {
  success: colors.accent[500],
  error: colors.error[500],
  warning: colors.warning[500],
  info: colors.primary[500],
};

const ICONS: Record<ToastType, IconName> = {
  success: 'check',
  error: 'x',
  warning: 'alert-triangle',
  info: 'info',
};

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({data, onDismiss}: ToastItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss(data.id);
      });
    }, data.duration || 3000);

    return () => clearTimeout(timer);
  }, [data, onDismiss, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.toast,
        {borderLeftColor: ACCENT_COLORS[data.type]},
        {opacity, transform: [{translateY}]},
      ]}>
      <View
        style={[
          styles.iconBadge,
          {backgroundColor: ACCENT_COLORS[data.type] + '20'},
        ]}>
        <Icon
          name={ICONS[data.type]}
          size={14}
          color={ACCENT_COLORS[data.type]}
          strokeWidth={2.5}
        />
      </View>
      <Text style={styles.message} numberOfLines={3}>
        {data.message}
      </Text>
    </Animated.View>
  );
}

export function ToastProvider({children}: {children: React.ReactNode}) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  useEffect(() => {
    toastCallback = (newToast: ToastData) => {
      setToasts(prev => [...prev, newToast]);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <View style={styles.rootContainer}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map(t => (
          <ToastItem key={t.id} data={t} onDismiss={handleDismiss} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: spacing.base,
    right: spacing.base,
    zIndex: 9999,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.elevated + 'F2', // 0.95 opacity
    borderRadius: radius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    ...textStyles.bodySmall,
    color: colors.neutral[200],
    flex: 1,
  },
});
