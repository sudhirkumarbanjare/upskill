// ─── Component: NoInternet ───
// Premium "No Connection" overlay. Never use native system alerts.

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, textStyles, spacing, radius} from '../theme';
import {Icon} from './icons/Icon';

interface NoInternetProps {
  onRetry?: () => void;
}

export function NoInternet({onRetry}: NoInternetProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="wifi-off" size={38} color={colors.accent[400]} strokeWidth={2} />
        </View>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          Please check your network settings and try again. Some cached data may
          still be available.
        </Text>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Compact inline version for bottom sheets / list headers
export function NoInternetBanner({onRetry}: NoInternetProps) {
  return (
    <View style={styles.banner}>
      <Icon name="alert-triangle" size={16} color={colors.warning[400]} style={{marginRight: spacing.xs}} />
      <Text style={styles.bannerText}>You're offline</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text style={styles.bannerRetry}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    ...textStyles.h4,
    color: colors.neutral[100],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[400],
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryText: {
    ...textStyles.buttonMedium,
    color: colors.white,
  },
  // Banner styles
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning[600] + '20',
    borderWidth: 1,
    borderColor: colors.warning[600] + '40',
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  bannerIcon: {
    fontSize: 14,
  },
  bannerText: {
    ...textStyles.bodySmall,
    color: colors.warning[400],
    flex: 1,
  },
  bannerRetry: {
    ...textStyles.buttonSmall,
    color: colors.warning[400],
  },
});
