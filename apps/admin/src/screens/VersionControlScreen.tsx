// ─── Admin Screen: Version Control & Force Update ───
// Live management of system_config/app_versions for controlling force updates across apps.

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  PremiumButton,
  AppVersions,
  Icon,
  IconName,
} from '@upskill/shared';
import {INITIAL_APP_VERSIONS} from '../data/sampleAdminData';

export function VersionControlScreen() {
  const [versions, setVersions] = useState<AppVersions>(INITIAL_APP_VERSIONS);
  const [saving, setSaving] = useState(false);

  // Student version fields
  const [studentMin, setStudentMin] = useState(versions.student.minVersion);
  const [studentForce, setStudentForce] = useState(versions.student.forceUpdate);

  // Client version fields
  const [clientMin, setClientMin] = useState(versions.client.minVersion);
  const [clientForce, setClientForce] = useState(versions.client.forceUpdate);

  // Admin version fields
  const [adminMin, setAdminMin] = useState(versions.admin.minVersion);
  const [adminForce, setAdminForce] = useState(versions.admin.forceUpdate);

  // Validate semver
  const isValidSemver = (v: string) => /^\d+\.\d+\.\d+$/.test(v);

  const handleSaveAll = async () => {
    if (!isValidSemver(studentMin) || !isValidSemver(clientMin) || !isValidSemver(adminMin)) {
      toast.error('All minimum versions must follow strict semver format (e.g. 1.0.0)');
      return;
    }

    setSaving(true);
    try {
      // In production, writes to firestore().collection('system_config').doc('app_versions')
      await new Promise(resolve => setTimeout(resolve, 600));

      const updated: AppVersions = {
        student: {
          ...versions.student,
          minVersion: studentMin,
          forceUpdate: studentForce,
        },
        client: {
          ...versions.client,
          minVersion: clientMin,
          forceUpdate: clientForce,
        },
        admin: {
          ...versions.admin,
          minVersion: adminMin,
          forceUpdate: adminForce,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin_root',
      };

      setVersions(updated);
      toast.success('App versions updated! Devices below minimum version will be locked.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update app versions.');
    } finally {
      setSaving(false);
    }
  };

  const renderAppCard = (
    title: string,
    packageName: string,
    currentVersion: string,
    minVersion: string,
    setMinVersion: (v: string) => void,
    forceUpdate: boolean,
    setForceUpdate: (f: boolean) => void,
    icon: IconName
  ) => {
    return (
      <View style={styles.appCard}>
        <View style={styles.appCardHeader}>
          <View style={styles.appCardMeta}>
            <View style={styles.appCardTitleRow}>
              <Icon name={icon} size={16} color={colors.accent[400]} />
              <Text style={styles.appCardTitle}>{title}</Text>
            </View>
            <Text style={styles.packageIdText}>{packageName}</Text>
          </View>
          <View style={styles.versionPill}>
            <Text style={styles.versionPillText}>v{currentVersion}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldCol}>
            <Text style={styles.fieldLabel}>Required Min Version (Semver)</Text>
            <TextInput
              style={styles.input}
              value={minVersion}
              onChangeText={setMinVersion}
              placeholder="1.0.0"
              placeholderTextColor={colors.neutral[500]}
            />
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>Force Update Lockout</Text>
            <Text style={styles.toggleSubtitle}>
              Immediately display full-screen blocker on outdated builds
            </Text>
          </View>
          <Switch
            value={forceUpdate}
            onValueChange={setForceUpdate}
            thumbColor={forceUpdate ? colors.accent[500] : colors.neutral[400]}
            trackColor={{
              false: colors.surface.card,
              true: colors.accent[950],
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Version Control Gateway</Text>
        <Text style={styles.subtitle}>
          Manage Firestore system_config/app_versions to trigger remote force updates
        </Text>
      </View>

      {/* Warning Notice */}
      <View style={styles.noticeCard}>
        <Icon name="zap" size={18} color={colors.accent[400]} />
        <Text style={styles.noticeText}>
          Updating minimum version prompts live users to update from Google Play
          Store before accessing any Firestore queries.
        </Text>
      </View>

      {/* Apps Configuration */}
      {renderAppCard(
        'Student App',
        'com.upskill.student',
        versions.student.currentVersion,
        studentMin,
        setStudentMin,
        studentForce,
        setStudentForce,
        'smartphone'
      )}

      {renderAppCard(
        'Client App',
        'com.upskill.client',
        versions.client.currentVersion,
        clientMin,
        setClientMin,
        clientForce,
        setClientForce,
        'building'
      )}

      {renderAppCard(
        'Admin App',
        'com.upskill.admin',
        versions.admin.currentVersion,
        adminMin,
        setAdminMin,
        adminForce,
        setAdminForce,
        'shield-check'
      )}

      {/* Save Button */}
      <View style={styles.saveSection}>
        <PremiumButton
          title={saving ? 'Deploying Rules...' : 'Save & Publish Version Rules'}
          icon={saving ? 'refresh-cw' : 'git-branch'}
          variant="primary"
          size="lg"
          disabled={saving}
          onPress={handleSaveAll}
          style={styles.saveBtn}
        />
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
    marginBottom: spacing.base,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  subtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginTop: 2,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  noticeIcon: {
    fontSize: 18,
  },
  noticeText: {
    ...textStyles.caption,
    color: colors.neutral[300],
    flex: 1,
    lineHeight: 18,
  },
  appCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.base,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  appCardMeta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  appCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appCardTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  packageIdText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontFamily: 'monospace',
    marginTop: 2,
  },
  versionPill: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  versionPillText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
  },
  fieldRow: {
    marginBottom: spacing.md,
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleTitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[200],
    fontWeight: '600',
  },
  toggleSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  saveSection: {
    marginTop: spacing.md,
  },
  saveBtn: {
    width: '100%',
  },
});
