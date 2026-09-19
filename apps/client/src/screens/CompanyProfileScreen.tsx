// ─── Client Screen: Company Profile ───
// Extended corporate profile with business details, verification status, and logo.

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  ProfileScreen,
  colors,
  textStyles,
  spacing,
  radius,
  UserProfile,
  Icon,
  IconBadge,
} from '@upskill/shared';

interface CompanyProfileScreenProps {
  user: UserProfile;
  onSignOut: () => void;
}

export function CompanyProfileScreen({user, onSignOut}: CompanyProfileScreenProps) {
  const isApproved = user.clientStatus === 'approved';

  const renderExtraCompanyContent = () => {
    return (
      <View style={styles.extraContainer}>
        {/* Verification Status Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="shield-check" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionTitle}>Partner Accreditation</Text>
            </View>
            <View
              style={[
                styles.badge,
                isApproved ? styles.badgeApproved : styles.badgePending,
              ]}>
              <Icon
                name={isApproved ? 'shield-check' : 'clock'}
                size={11}
                color={isApproved ? colors.accent[400] : colors.warning[400]}
                style={{marginRight: 3}}
              />
              <Text
                style={[
                  styles.badgeText,
                  isApproved ? styles.badgeTextApproved : styles.badgeTextPending,
                ]}>
                {isApproved ? 'VERIFIED PARTNER' : 'VERIFICATION PENDING'}
              </Text>
            </View>
          </View>
          <Text style={styles.companyInfoText}>
            Corporate Tier: Enterprise Partner
          </Text>
          <Text style={styles.companyInfoSub}>
            Authorized to recruit students for paid project engagements.
          </Text>
        </View>

        {/* Corporate Details */}
        <View style={styles.sectionCard}>
          <View style={styles.titleWithIcon}>
            <Icon name="building" size={16} color={colors.primary[400]} style={{marginRight: spacing.xs}} />
            <Text style={styles.sectionTitle}>Organization Metadata</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaLabelRow}>
              <Icon name="file-text" size={13} color={colors.neutral[500]} style={{marginRight: 4}} />
              <Text style={styles.metaLabel}>Legal Entity</Text>
            </View>
            <Text style={styles.metaValue}>
              {user.companyName || 'Apex Financial Technologies Ltd.'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaLabelRow}>
              <Icon name="activity" size={13} color={colors.neutral[500]} style={{marginRight: 4}} />
              <Text style={styles.metaLabel}>Industry</Text>
            </View>
            <Text style={styles.metaValue}>Financial Services & FinTech</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaLabelRow}>
              <Icon name="compass" size={13} color={colors.neutral[500]} style={{marginRight: 4}} />
              <Text style={styles.metaLabel}>Headquarters</Text>
            </View>
            <Text style={styles.metaValue}>Bengaluru, Karnataka</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ProfileScreen
      user={user}
      onSignOut={onSignOut}
      extraContent={renderExtraCompanyContent()}
    />
  );
}

const styles = StyleSheet.create({
  extraContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeApproved: {
    backgroundColor: colors.accent[950],
    borderColor: colors.accent[600],
  },
  badgePending: {
    backgroundColor: colors.warning[950],
    borderColor: colors.warning[600],
  },
  badgeText: {
    ...textStyles.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextApproved: {
    color: colors.accent[400],
  },
  badgeTextPending: {
    color: colors.warning[400],
  },
  companyInfoText: {
    ...textStyles.bodyMedium,
    color: colors.neutral[200],
    fontWeight: '600',
    marginTop: 2,
  },
  companyInfoSub: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  metaLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  metaValue: {
    ...textStyles.bodySmall,
    color: colors.neutral[100],
    fontWeight: '600',
  },
});
