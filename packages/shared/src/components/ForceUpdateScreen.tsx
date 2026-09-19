// ─── Component: ForceUpdateScreen ───
// Traps user on mandatory update screen when local version < Firestore minimum.

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, textStyles, spacing, radius} from '../theme';
import {Icon, IconBadge} from './icons/Icon';

interface ForceUpdateScreenProps {
  appName?: string;
  currentVersion: string;
  minVersion?: string;
  requiredVersion?: string;
  storeUrl?: string;
  onUpdate?: () => void;
}

export function ForceUpdateScreen({
  appName = '5Upskill',
  currentVersion,
  minVersion,
  requiredVersion,
  storeUrl,
  onUpdate,
}: ForceUpdateScreenProps) {
  const reqVer = minVersion || requiredVersion || '1.0.0';
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral[950]} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="download" size={44} color={colors.accent[400]} strokeWidth={2} />
        </View>

        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.subtitle}>
          A new version of {appName} is available with important improvements and
          bug fixes. Please update to continue.
        </Text>

        <View style={styles.versionInfo}>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Current Version</Text>
            <Text style={styles.versionValue}>v{currentVersion}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Required Version</Text>
            <Text style={[styles.versionValue, {color: colors.accent[400]}]}>
              v{reqVer}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={onUpdate}
          activeOpacity={0.85}>
          <View style={styles.buttonContent}>
            <Icon name="download" size={18} color={colors.white} style={{marginRight: spacing.sm}} />
            <Text style={styles.updateButtonText}>Download Latest Update</Text>
            <Icon name="arrow-right" size={18} color={colors.white} style={{marginLeft: spacing.sm}} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[950],
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  content: {
    alignItems: 'center',
    maxWidth: 360,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[900] + '60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[400],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['2xl'],
  },
  versionInfo: {
    width: '100%',
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing['2xl'],
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  versionLabel: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
  },
  versionValue: {
    ...textStyles.bodySmall,
    color: colors.neutral[200],
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[700],
    marginVertical: spacing.xs,
  },
  updateButton: {
    width: '100%',
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  updateButtonText: {
    ...textStyles.buttonLarge,
    color: colors.white,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
