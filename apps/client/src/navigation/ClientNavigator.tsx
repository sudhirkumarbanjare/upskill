// ─── Client App Navigator ───
// Bottom navigation between Corporate Dashboard and Company Profile.

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, textStyles, spacing, UserProfile, Icon} from '@upskill/shared';
import {ClientDashboardScreen} from '../screens/ClientDashboardScreen';
import {CompanyProfileScreen} from '../screens/CompanyProfileScreen';

type ClientTab = 'dashboard' | 'profile';

interface ClientNavigatorProps {
  user: UserProfile;
  onSignOut: () => void;
}

export function ClientNavigator({user, onSignOut}: ClientNavigatorProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {activeTab === 'dashboard' ? (
          <ClientDashboardScreen user={user} />
        ) : (
          <CompanyProfileScreen user={user} onSignOut={onSignOut} />
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('dashboard')}
          style={styles.tabItem}>
          <View style={[styles.iconWrapper, activeTab === 'dashboard' && styles.iconWrapperActive]}>
            <Icon
              name="bar-chart"
              size={20}
              color={activeTab === 'dashboard' ? colors.accent[400] : colors.neutral[500]}
              strokeWidth={activeTab === 'dashboard' ? 2.5 : 1.75}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'dashboard' && styles.tabLabelActive,
            ]}>
            Dashboard & Listings
          </Text>
          {activeTab === 'dashboard' && <View style={styles.activePill} />}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('profile')}
          style={styles.tabItem}>
          <View style={[styles.iconWrapper, activeTab === 'profile' && styles.iconWrapperActive]}>
            <Icon
              name="building"
              size={20}
              color={activeTab === 'profile' ? colors.accent[400] : colors.neutral[500]}
              strokeWidth={activeTab === 'profile' ? 2.5 : 1.75}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && styles.tabLabelActive,
            ]}>
            Company Profile
          </Text>
          {activeTab === 'profile' && <View style={styles.activePill} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    paddingHorizontal: spacing.base,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    opacity: 0.6,
  },
  iconWrapperActive: {
    opacity: 1,
    transform: [{scale: 1.1}],
  },
  tabLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.accent[400],
    fontWeight: '700',
  },
  activePill: {
    position: 'absolute',
    bottom: -4,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent[500],
  },
});
