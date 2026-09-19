// ─── Admin App Navigator ───
// Central administrative navigation shell with 5-tab control bar and live notification badges.

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, textStyles, spacing, radius, UserProfile, Icon, IconName} from '@upskill/shared';
import {AdminDashboardScreen} from '../screens/AdminDashboardScreen';
import {PendingApprovalsScreen} from '../screens/PendingApprovalsScreen';
import {UserModerationScreen} from '../screens/UserModerationScreen';
import {VersionControlScreen} from '../screens/VersionControlScreen';
import {ContentManagementScreen} from '../screens/ContentManagementScreen';
import {PushNotificationScreen} from '../screens/PushNotificationScreen';
import {PENDING_CLIENT_APPROVALS} from '../data/sampleAdminData';

type AdminTab =
  | 'dashboard'
  | 'approvals'
  | 'users'
  | 'notifications'
  | 'versions'
  | 'content';

interface AdminNavigatorProps {
  user: UserProfile;
  onSignOut: () => void;
}

export function AdminNavigator({user, onSignOut}: AdminNavigatorProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [pendingClients, setPendingClients] = useState<UserProfile[]>(
    PENDING_CLIENT_APPROVALS
  );

  const handleApproveClient = (uid: string) => {
    setPendingClients(prev => prev.filter(c => c.uid !== uid));
  };

  const handleRejectClient = (uid: string) => {
    setPendingClients(prev => prev.filter(c => c.uid !== uid));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboardScreen
            onNavigateTab={tab => setActiveTab(tab as AdminTab)}
            pendingCount={pendingClients.length}
          />
        );
      case 'approvals':
        return (
          <PendingApprovalsScreen
            pendingList={pendingClients}
            onApprove={handleApproveClient}
            onReject={handleRejectClient}
          />
        );
      case 'users':
        return <UserModerationScreen />;
      case 'notifications':
        return <PushNotificationScreen />;
      case 'versions':
        return <VersionControlScreen />;
      case 'content':
        return <ContentManagementScreen />;
    }
  };

  const tabs: {id: AdminTab; label: string; icon: IconName; badge?: number}[] = [
    {id: 'dashboard', label: 'Command', icon: 'activity'},
    {
      id: 'approvals',
      label: 'Approvals',
      icon: 'check-square',
      badge: pendingClients.length,
    },
    {id: 'notifications', label: 'Push Hub', icon: 'bell'},
    {id: 'users', label: 'Users', icon: 'users'},
    {id: 'versions', label: 'Versions', icon: 'git-branch'},
    {id: 'content', label: 'Content', icon: 'book-open'},
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Admin Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <View style={styles.brandRow}>
            <Icon name="shield-check" size={18} color={colors.accent[400]} />
            <Text style={styles.appTitle}>5Upskill Console</Text>
          </View>
          <Text style={styles.adminEmail}>{user.email || 'admin@5upskill.com'}</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
          <Icon name="log-out" size={14} color={colors.neutral[300]} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>{renderContent()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const activeColor = colors.accent[400];
          const inactiveColor = colors.neutral[500];

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}>
              <View style={styles.iconWrapper}>
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? activeColor : inactiveColor}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                {tab.badge && tab.badge > 0 ? (
                  <View style={styles.badgeIndicator}>
                    <Text style={styles.badgeIndicatorText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activePill} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  topHeaderLeft: {
    flex: 1,
  },
  appTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  adminEmail: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  signOutBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  signOutText: {
    ...textStyles.caption,
    color: colors.neutral[300],
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: colors.surface.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    zIndex: 9999,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{scale: 1.1}],
  },
  badgeIndicator: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error[500],
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIndicatorText: {
    color: colors.neutral[100],
    fontSize: 9,
    fontWeight: '700',
  },
  tabLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontSize: 10,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.error[400],
    fontWeight: '700',
  },
  activePill: {
    position: 'absolute',
    bottom: -4,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.error[500],
  },
});
