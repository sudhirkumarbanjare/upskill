// ─── Student Screen: Profile & Applications ───
// Extended student profile with assessment scores and project applications.

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  ProfileScreen,
  colors,
  textStyles,
  spacing,
  radius,
  UserProfile,
  Project,
  Icon,
  IconBadge,
} from '@upskill/shared';
import {SAMPLE_PROJECTS} from '../data/sampleData';

interface StudentProfileScreenProps {
  user: UserProfile;
  onSignOut: () => void;
  appliedProjectIds?: string[];
}

export function StudentProfileScreen({
  user,
  onSignOut,
  appliedProjectIds = ['proj-fintech-dash'],
}: StudentProfileScreenProps) {
  const appliedProjects: Project[] = SAMPLE_PROJECTS.filter(p =>
    appliedProjectIds.includes(p.id)
  );

  const renderExtraStudentContent = () => {
    return (
      <View style={styles.extraContainer}>
        {/* Career Assessment Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="target" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionTitle}>Career DNA Badge</Text>
            </View>
            <View style={styles.activePill}>
              <Icon name="shield-check" size={11} color={colors.accent[400]} style={{marginRight: 3}} />
              <Text style={styles.activePillText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.roleMatch}>Fullstack Mobile Engineer</Text>
          <Text style={styles.roleDesc}>
            React Native • Serverless Firebase • UI Motion
          </Text>
        </View>

        {/* Applied Projects Status */}
        <View style={styles.sectionCard}>
          <View style={styles.titleWithIcon}>
            <Icon name="briefcase" size={16} color={colors.primary[400]} style={{marginRight: spacing.xs}} />
            <Text style={styles.sectionTitle}>Project Applications</Text>
          </View>
          {appliedProjects.length > 0 ? (
            appliedProjects.map(proj => (
              <View key={proj.id} style={styles.appRow}>
                <View style={styles.appMeta}>
                  <Text style={styles.appTitle} numberOfLines={1}>
                    {proj.title}
                  </Text>
                  <Text style={styles.appCompany}>{proj.clientName}</Text>
                </View>
                <View style={styles.statusBadgeApplied}>
                  <Icon name="clock" size={11} color={colors.warning[400]} style={{marginRight: 3}} />
                  <Text style={styles.statusTextApplied}>Under Review</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              You have not applied to any project listings yet.
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ProfileScreen
      user={user}
      onSignOut={onSignOut}
      extraContent={renderExtraStudentContent()}
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
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent[950],
    borderColor: colors.accent[600],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activePillText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
  },
  roleMatch: {
    ...textStyles.bodyMedium,
    color: colors.accent[400],
    fontWeight: '700',
    marginTop: 2,
  },
  roleDesc: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  appRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  appMeta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  appTitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[100],
    fontWeight: '600',
  },
  appCompany: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  statusBadgeApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning[950],
    borderColor: colors.warning[700],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusTextApplied: {
    ...textStyles.caption,
    color: colors.warning[400],
    fontWeight: '600',
  },
  emptyText: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});
