// ─── Student App Navigator ───
// Premium bottom tab bar navigation between Career Quiz, Courses, Projects, and Profile.

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, textStyles, spacing, radius, UserProfile, Icon, IconName} from '@upskill/shared';
import {AssessmentScreen} from '../screens/AssessmentScreen';
import {CoursesScreen} from '../screens/CoursesScreen';
import {ProjectsScreen} from '../screens/ProjectsScreen';
import {StudentProfileScreen} from '../screens/StudentProfileScreen';

type Tab = 'quiz' | 'courses' | 'projects' | 'profile';

interface StudentNavigatorProps {
  user: UserProfile;
  onSignOut: () => void;
}

export function StudentNavigator({user, onSignOut}: StudentNavigatorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const [appliedProjectIds, setAppliedProjectIds] = useState<string[]>([
    'proj-fintech-dash',
  ]);

  const handleApplySuccess = (projectId: string) => {
    if (!appliedProjectIds.includes(projectId)) {
      setAppliedProjectIds(prev => [...prev, projectId]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'quiz':
        return (
          <AssessmentScreen
            onExploreCourses={() => setActiveTab('courses')}
            onExploreProjects={() => setActiveTab('projects')}
          />
        );
      case 'courses':
        return <CoursesScreen />;
      case 'projects':
        return (
          <ProjectsScreen
            appliedProjectIds={appliedProjectIds}
            onApplySuccess={handleApplySuccess}
          />
        );
      case 'profile':
        return (
          <StudentProfileScreen
            user={user}
            onSignOut={onSignOut}
            appliedProjectIds={appliedProjectIds}
          />
        );
    }
  };

  const tabs: {id: Tab; label: string; icon: IconName}[] = [
    {id: 'quiz', label: 'Career Quiz', icon: 'target'},
    {id: 'courses', label: 'Courses', icon: 'book-open'},
    {id: 'projects', label: 'Projects', icon: 'briefcase'},
    {id: 'profile', label: 'Profile', icon: 'user'},
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>{renderContent()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}>
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? colors.accent[400] : colors.neutral[500]}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activePillIndicator} />}
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
    paddingHorizontal: spacing.sm,
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
  activePillIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent[500],
  },
});
