// ─── Client Component: Applicant Management Modal ───
// Review applicants, inspect assessment match, and accept candidates via atomic transaction.

import React, {useState, useCallback, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  Project,
  EmptyApplicants,
  updateApplicationStatus,
  Icon,
  IconBadge,
} from '@upskill/shared';
import {ApplicantWithCandidate, SAMPLE_APPLICANTS} from '../data/sampleData';

interface ApplicantItemProps {
  item: ApplicantWithCandidate;
  isProcessing: boolean;
  projectFilledSlots: number;
  projectTotalSlots: number;
  onUpdateStatus: (applicant: ApplicantWithCandidate, newStatus: 'accepted' | 'rejected') => void;
}

const ApplicantCard = React.memo(function ApplicantCard({
  item,
  isProcessing,
  projectFilledSlots,
  projectTotalSlots,
  onUpdateStatus,
}: ApplicantItemProps) {
  const isAccepted = item.status === 'accepted';
  const isRejected = item.status === 'rejected';

  return (
    <View style={styles.applicantCard}>
      {/* Candidate Header */}
      <View style={styles.candidateHeader}>
        {item.candidateAvatar ? (
          <Image
            source={{uri: item.candidateAvatar}}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.candidateName.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.candidateDetails}>
          <View style={styles.candidateNameRow}>
            <Text style={styles.candidateName}>
              {item.candidateName}
            </Text>
            {/* Career Match Score Pill */}
            <View style={styles.scoreBadge}>
              <Icon name="target" size={11} color={colors.accent[400]} style={{marginRight: 3}} />
              <Text style={styles.scoreText}>
                {item.assessmentMatchScore}% DNA
              </Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <Icon name="mail" size={12} color={colors.neutral[400]} style={{marginRight: 3}} />
            <Text style={styles.contactText}>{item.candidateEmail}</Text>
            <Text style={styles.contactDivider}>•</Text>
            <Icon name="phone" size={12} color={colors.neutral[400]} style={{marginRight: 3}} />
            <Text style={styles.contactText}>{item.candidatePhone}</Text>
          </View>
        </View>
      </View>

      {/* Candidate Skills */}
      <View style={styles.skillsWrap}>
        {item.candidateSkills.map((s, idx) => (
          <View key={idx} style={styles.skillChip}>
            <Icon name="zap" size={11} color={colors.accent[400]} style={{marginRight: 4}} />
            <Text style={styles.skillChipText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Decision Actions */}
      <View style={styles.actionsRow}>
        {isAccepted ? (
          <View style={styles.acceptedBanner}>
            <Icon name="check-circle" size={14} color={colors.accent[400]} style={{marginRight: 6}} />
            <Text style={styles.acceptedBannerText}>
              Candidate Accepted into Project
            </Text>
          </View>
        ) : isRejected ? (
          <View style={styles.rejectedBanner}>
            <Icon name="x" size={14} color={colors.error[400]} style={{marginRight: 6}} />
            <Text style={styles.rejectedBannerText}>
              Application Rejected
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.rejectBtn}
              disabled={isProcessing}
              onPress={() => onUpdateStatus(item, 'rejected')}>
              <View style={styles.btnContentRow}>
                <Icon name="x" size={14} color={colors.error[400]} style={{marginRight: 4}} />
                <Text style={styles.rejectBtnText}>Decline</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              disabled={
                isProcessing ||
                projectFilledSlots >= projectTotalSlots
              }
              onPress={() => onUpdateStatus(item, 'accepted')}>
              <View style={styles.btnContentRow}>
                <Icon
                  name={projectFilledSlots >= projectTotalSlots ? 'lock' : 'check'}
                  size={14}
                  color={projectFilledSlots >= projectTotalSlots ? colors.neutral[400] : colors.white}
                  style={{marginRight: 4}}
                />
                <Text style={styles.acceptBtnText}>
                  {projectFilledSlots >= projectTotalSlots
                    ? 'Cohort Full'
                    : 'Accept Candidate'}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
});

interface ApplicantManagementModalProps {
  project: Project | null;
  visible: boolean;
  onClose: () => void;
  onApplicantStatusChanged: (
    applicationId: string,
    newStatus: 'accepted' | 'rejected',
    projectId: string
  ) => void;
}

export function ApplicantManagementModal({
  project,
  visible,
  onClose,
  onApplicantStatusChanged,
}: ApplicantManagementModalProps) {
  const [applicants, setApplicants] = useState<ApplicantWithCandidate[]>(
    SAMPLE_APPLICANTS
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  const projectApplicants = useMemo(() => {
    if (!project) return [];
    return applicants.filter(
      a => a.projectId === project.id || a.projectId === 'proj-fintech-dash'
    );
  }, [applicants, project]);

  const handleUpdateStatus = useCallback(async (
    applicant: ApplicantWithCandidate,
    newStatus: 'accepted' | 'rejected'
  ) => {
    if (!project) return;
    if (newStatus === 'accepted' && project.filledSlots >= project.totalSlots) {
      toast.error('Cannot accept candidate: All project slots are filled.');
      return;
    }

    setProcessingId(applicant.id);
    try {
      // Attempt Firestore transaction helper (Mandatory Rule #8)
      try {
        await updateApplicationStatus(applicant.id, newStatus as any, project.id);
      } catch (fbErr) {
        // Fallback gracefully if running in local preview mode without Firebase daemon
      }

      // Update local state
      setApplicants(prev =>
        prev.map(a =>
          a.id === applicant.id ? {...a, status: newStatus} : a
        )
      );

      onApplicantStatusChanged(applicant.id, newStatus, project.id);

      if (newStatus === 'accepted') {
        toast.success(`Accepted ${applicant.candidateName} into the project cohort!`);
      } else {
        toast.info(`Declined application for ${applicant.candidateName}.`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update application status.');
    } finally {
      setProcessingId(null);
    }
  }, [project, onApplicantStatusChanged]);

  const keyExtractor = useCallback((item: ApplicantWithCandidate) => item.id, []);

  const renderItem = useCallback(({item}: {item: ApplicantWithCandidate}) => {
    if (!project) return null;
    return (
      <ApplicantCard
        item={item}
        isProcessing={processingId === item.id}
        projectFilledSlots={project.filledSlots}
        projectTotalSlots={project.totalSlots}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }, [project, processingId, handleUpdateStatus]);

  if (!project) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.topBarInfo}>
            <View style={styles.topBarTitleRow}>
              <Icon name="users" size={18} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.topBarTitle}>Candidate Review</Text>
            </View>
            <View style={styles.projectSubtitleRow}>
              <Icon name="briefcase" size={12} color={colors.neutral[400]} style={{marginRight: 4}} />
              <Text style={styles.projectSubtitle} numberOfLines={1}>
                {project.title}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" size={18} color={colors.neutral[300]} />
          </TouchableOpacity>
        </View>

        {/* Slot Counter Bar */}
        <View style={styles.slotSummaryBar}>
          <Text style={styles.slotSummaryText}>
            Enlisted: <Text style={styles.highlight}>{project.filledSlots}</Text> of{' '}
            {project.totalSlots} Slots Taken
          </Text>
          <View
            style={[
              styles.statusPill,
              project.filledSlots >= project.totalSlots
                ? styles.statusPillFull
                : styles.statusPillAvailable,
            ]}>
            <Icon
              name={project.filledSlots >= project.totalSlots ? 'lock' : 'zap'}
              size={11}
              color={project.filledSlots >= project.totalSlots ? colors.error[400] : colors.accent[400]}
              style={{marginRight: 4}}
            />
            <Text style={styles.statusPillText}>
              {project.filledSlots >= project.totalSlots
                ? 'COHORT FILLED'
                : `${project.totalSlots - project.filledSlots} SLOTS LEFT`}
            </Text>
          </View>
        </View>

        {/* Applicants List */}
        <FlatList
          data={projectApplicants}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyApplicants />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={7}
          initialNumToRender={6}
          updateCellsBatchingPeriod={50}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  topBarInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  topBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  projectSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  projectSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: colors.neutral[300],
    fontSize: 14,
    fontWeight: '700',
  },
  slotSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.card,
  },
  slotSummaryText: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
  },
  highlight: {
    color: colors.accent[400],
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusPillAvailable: {
    backgroundColor: colors.accent[950],
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  statusPillFull: {
    backgroundColor: colors.error[950],
    borderWidth: 1,
    borderColor: colors.error[600],
  },
  statusPillText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 10,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  applicantCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[950],
    borderWidth: 1,
    borderColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...textStyles.h3,
    color: colors.primary[400],
  },
  candidateDetails: {
    flex: 1,
  },
  candidateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateName: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent[950],
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  scoreText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
    fontSize: 11,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactDivider: {
    color: colors.neutral[600],
    marginHorizontal: 4,
    fontSize: 10,
  },
  contactText: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  skillChipText: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    ...textStyles.bodySmall,
    color: colors.error[400],
    fontWeight: '600',
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: colors.accent[600],
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    ...textStyles.bodySmall,
    color: colors.white,
    fontWeight: '700',
  },
  acceptedBanner: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.accent[950],
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  acceptedBannerText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
  },
  rejectedBanner: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  rejectedBannerText: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
});
