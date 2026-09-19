// ─── Client Screen: Corporate Dashboard ───
// Overview metrics, active listings, candidate management, and project creation.

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  ProjectCard,
  Project,
  UserProfile,
  EmptyProjects,
  Icon,
  IconBadge,
} from '@upskill/shared';
import {SAMPLE_CLIENT_PROJECTS} from '../data/sampleData';
import {CreateProjectModal} from './CreateProjectModal';
import {ApplicantManagementModal} from './ApplicantManagementModal';
import {PendingApprovalBanner} from './PendingApprovalBanner';

interface ClientDashboardScreenProps {
  user: UserProfile;
}

export function ClientDashboardScreen({user}: ClientDashboardScreenProps) {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_CLIENT_PROJECTS || []);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applicantModalVisible, setApplicantModalVisible] = useState(false);

  // Status check for client onboarding approval
  const isPendingApproval = user.status === 'pending_approval';

  const activeProjectsCount = projects.length;
  const filledSlotsCount = projects.reduce((acc, p) => acc + p.filledSlots, 0);
  const totalSlotsCount = projects.reduce((acc, p) => acc + p.totalSlots, 0);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleOpenApplicants = useCallback((project: Project) => {
    setSelectedProject(project);
    setApplicantModalVisible(true);
  }, []);

  const handleApplicantStatusChanged = useCallback((status: 'accepted' | 'rejected') => {
    if (status === 'accepted' && selectedProject) {
      setProjects(prev => {
        const found = prev.find(p => p.id === selectedProject.id);
        if (found && found.filledSlots < found.totalSlots) {
          return prev.map(p =>
            p.id === selectedProject.id
              ? {...p, filledSlots: p.filledSlots + 1}
              : p
          );
        }
        return prev;
      });
    }
  }, [selectedProject]);

  const keyExtractor = useCallback((item: Project) => item.id, []);

  const renderItem = useCallback(({item, index}: {item: Project; index: number}) => (
    <ProjectCard
      project={item}
      index={index}
      onPress={() => handleOpenApplicants(item)}
    />
  ), [handleOpenApplicants]);

  return (
    <View style={styles.container}>
      {/* Top Corporate Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.companyRow}>
              <Icon name="building" size={18} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.companyName}>
                {user.companyName || user.displayName || 'Apex Financial'}
              </Text>
            </View>
            <Text style={styles.dashboardSubtitle}>Corporate Talent & Cohort Portal</Text>
          </View>
          <TouchableOpacity
            style={styles.newPostBtn}
            onPress={() => setCreateModalVisible(true)}>
            <View style={styles.btnContentRow}>
              <Icon name="plus" size={15} color={colors.white} style={{marginRight: 4}} />
              <Text style={styles.newPostBtnText}>Post Project</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* KPI Metrics Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statValueRow}>
              <Icon name="bar-chart" size={15} color={colors.accent[400]} style={{marginRight: 6}} />
              <Text style={styles.statNumber}>{activeProjectsCount}</Text>
            </View>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statValueRow}>
              <Icon name="users" size={15} color={colors.primary[400]} style={{marginRight: 6}} />
              <Text style={styles.statNumber}>{filledSlotsCount}</Text>
            </View>
            <Text style={styles.statLabel}>Hired Interns</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statValueRow}>
              <Icon name="zap" size={15} color={colors.warning[400]} style={{marginRight: 6}} />
              <Text style={styles.statNumber}>
                {totalSlotsCount - filledSlotsCount}
              </Text>
            </View>
            <Text style={styles.statLabel}>Open Slots</Text>
          </View>
        </View>
      </View>

      {/* Pending Account Review Notice */}
      {isPendingApproval && <PendingApprovalBanner />}

      {/* Projects List */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <Icon name="briefcase" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
          <Text style={styles.sectionTitle}>Your Active Listings</Text>
        </View>
        <View style={styles.sectionHintRow}>
          <Icon name="info" size={12} color={colors.neutral[500]} style={{marginRight: 4}} />
          <Text style={styles.sectionHint}>Tap listing to review applicants</Text>
        </View>
      </View>

      <FlatList
        data={projects}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={7}
        initialNumToRender={6}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <EmptyProjects onAction={() => setCreateModalVisible(true)} />
        }
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onProjectCreated={handleProjectCreated}
        clientId={user.uid}
        clientName={user.companyName || user.displayName || 'Apex Technologies'}
        clientLogo={user.photoURL}
      />

      {/* Applicant Management Modal */}
      <ApplicantManagementModal
        project={selectedProject}
        visible={applicantModalVisible}
        onClose={() => setApplicantModalVisible(false)}
        onApplicantStatusChanged={handleApplicantStatusChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.surface.elevated,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  dashboardSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  newPostBtn: {
    backgroundColor: colors.accent[600],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newPostBtnText: {
    ...textStyles.bodySmall,
    color: colors.white,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    ...textStyles.h2,
    color: colors.accent[400],
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  sectionHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHint: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
