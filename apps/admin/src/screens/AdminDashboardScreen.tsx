import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors, textStyles, spacing, radius, Icon} from '@upskill/shared';
import {INITIAL_PLATFORM_STATS} from '../data/sampleAdminData';

interface AdminDashboardScreenProps {
  onNavigateTab: (tab: string) => void;
  pendingCount: number;
}

export function AdminDashboardScreen({
  onNavigateTab,
  pendingCount,
}: AdminDashboardScreenProps) {
  const stats = INITIAL_PLATFORM_STATS;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.adminBadge}>
            <Icon name="shield-check" size={12} color={colors.error[400]} />
            <Text style={styles.adminBadgeText}>ROOT ADMIN</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>SYSTEM OPERATIONAL</Text>
          </View>
        </View>
        <Text style={styles.title}>Platform Command Center</Text>
        <Text style={styles.subtitle}>
          5Upskill Multi-Sided Marketplace Health
        </Text>
      </View>

      {/* Pending Action Alert */}
      {pendingCount > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.actionAlert}
          onPress={() => onNavigateTab('approvals')}>
          <View style={styles.alertIconBadge}>
            <Icon name="alert-triangle" size={18} color={colors.warning[300]} />
          </View>
          <View style={styles.alertTextCol}>
            <Text style={styles.alertTitle}>
              {pendingCount} Corporate Partners Awaiting Approval
            </Text>
            <Text style={styles.alertDesc}>
              Tap here to review corporate compliance and grant posting access.
            </Text>
          </View>
          <Icon name="arrow-right" size={16} color={colors.warning[400]} />
        </TouchableOpacity>
      )}

      {/* KPI Metrics Grid */}
      <Text style={styles.sectionTitle}>Ecosystem Analytics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconBadge}>
            <Icon name="graduation-cap" size={20} color={colors.accent[400]} />
          </View>
          <Text style={styles.statValue}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Enrolled Students</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconBadge}>
            <Icon name="building" size={20} color={colors.primary[400]} />
          </View>
          <Text style={styles.statValue}>{stats.totalClients}</Text>
          <Text style={styles.statLabel}>Corporate Clients</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconBadge}>
            <Icon name="briefcase" size={20} color={colors.accent[400]} />
          </View>
          <Text style={styles.statValue}>{stats.activeProjects}</Text>
          <Text style={styles.statLabel}>Active Projects</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconBadge}>
            <Icon name="file-text" size={20} color={colors.neutral[300]} />
          </View>
          <Text style={styles.statValue}>{stats.totalApplications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
      </View>

      {/* System Infrastructure Health */}
      <Text style={styles.sectionTitle}>Infrastructure Telemetry</Text>
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Cloud Firestore</Text>
          <View style={styles.statusBadgeGreen}>
            <Text style={styles.statusBadgeGreenText}>ONLINE • 0ms</Text>
          </View>
        </View>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Firebase Phone Auth</Text>
          <View style={styles.statusBadgeGreen}>
            <Text style={styles.statusBadgeGreenText}>AUTHENTICATED</Text>
          </View>
        </View>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Firebase Cloud Storage</Text>
          <View style={styles.statusBadgeGreen}>
            <Text style={styles.statusBadgeGreenText}>READ / WRITE READY</Text>
          </View>
        </View>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Security Rules Version</Text>
          <Text style={styles.telemetryVal}>v2 (Role Verified)</Text>
        </View>
      </View>

      {/* Quick Launchpad Buttons */}
      <Text style={styles.sectionTitle}>Administrative Controls</Text>
      <View style={styles.launchpadRow}>
        <TouchableOpacity
          style={styles.launchpadBtn}
          onPress={() => onNavigateTab('notifications')}>
          <View style={styles.launchpadIconBox}>
            <Icon name="bell-ring" size={20} color={colors.accent[400]} />
          </View>
          <Text style={styles.launchpadText}>Push Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.launchpadBtn}
          onPress={() => onNavigateTab('versions')}>
          <View style={styles.launchpadIconBox}>
            <Icon name="git-branch" size={20} color={colors.primary[400]} />
          </View>
          <Text style={styles.launchpadText}>Force Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.launchpadBtn}
          onPress={() => onNavigateTab('users')}>
          <View style={styles.launchpadIconBox}>
            <Icon name="users" size={20} color={colors.neutral[200]} />
          </View>
          <Text style={styles.launchpadText}>Directory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.launchpadBtn}
          onPress={() => onNavigateTab('content')}>
          <View style={styles.launchpadIconBox}>
            <Icon name="book-open" size={20} color={colors.accent[400]} />
          </View>
          <Text style={styles.launchpadText}>Courses</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  adminBadge: {
    backgroundColor: colors.error[950],
    borderWidth: 1,
    borderColor: colors.error[600],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  adminBadgeText: {
    ...textStyles.caption,
    color: colors.error[400],
    fontWeight: '700',
    fontSize: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent[500],
  },
  liveText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[100],
    fontSize: 24,
  },
  subtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginTop: 2,
  },
  actionAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning[950],
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.warning[600],
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  alertIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warning[900],
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 16,
  },
  alertTextCol: {
    flex: 1,
  },
  alertTitle: {
    ...textStyles.bodySmall,
    color: colors.warning[300],
    fontWeight: '700',
  },
  alertDesc: {
    ...textStyles.caption,
    color: colors.neutral[300],
    marginTop: 2,
  },
  chevron: {
    color: colors.warning[400],
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...textStyles.h1,
    color: colors.neutral[100],
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  telemetryCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  telemetryLabel: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
  },
  telemetryVal: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  statusBadgeGreen: {
    backgroundColor: colors.accent[950],
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  statusBadgeGreenText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
    fontSize: 10,
  },
  launchpadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  launchpadBtn: {
    flex: 1,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  launchpadIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  launchpadText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontWeight: '600',
    textAlign: 'center',
  },
});
