// ─── Client Component: Pending Approval Banner ───
// Displayed when a client company is awaiting admin moderation and onboarding approval.

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, textStyles, spacing, radius, Icon} from '@upskill/shared';

export function PendingApprovalBanner() {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.iconCircle}>
        <Icon name="clock" size={18} color={colors.warning[400]} />
      </View>
      <View style={styles.textColumn}>
        <View style={styles.titleRow}>
          <Text style={styles.bannerTitle}>Account Verification Pending</Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>IN REVIEW</Text>
          </View>
        </View>
        <Text style={styles.bannerSubtitle}>
          Your corporate profile is undergoing 5Upskill partner verification.
          You can draft projects now; they will become public once approved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning[950] + 'E6',
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.warning[600],
    margin: spacing.base,
    gap: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warning[900],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  textColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  bannerTitle: {
    ...textStyles.bodyMedium,
    color: colors.warning[300],
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: colors.warning[900],
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.warning[600],
  },
  pendingBadgeText: {
    ...textStyles.caption,
    color: colors.warning[300],
    fontSize: 10,
    fontWeight: '700',
  },
  bannerSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[300],
    lineHeight: 18,
  },
});
