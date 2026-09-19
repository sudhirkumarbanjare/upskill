// ─── Student Component: Project Detail Modal ───
// Modal showing project specifications, slot availability, and application submission.

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  PremiumButton,
  Icon,
  IconBadge,
  IconName,
} from '@upskill/shared';

const DEFAULT_PROJECT_COVER =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
const DEFAULT_JOB_COVER =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';

interface ProjectDetailModalProps {
  project: Project | null;
  visible: boolean;
  onClose: () => void;
  onApplySuccess?: (projectId: string) => void;
  isApplied?: boolean;
}

export function ProjectDetailModal({
  project,
  visible,
  onClose,
  onApplySuccess,
  isApplied = false,
}: ProjectDetailModalProps) {
  const [applied, setApplied] = useState(isApplied);
  const [submitting, setSubmitting] = useState(false);

  if (!project) return null;

  const availableSlots = project.totalSlots - project.filledSlots;
  const isFull = availableSlots <= 0;

  // Fallback cover image if no media is provided
  const coverUrl =
    project.mediaUrls && project.mediaUrls.length > 0
      ? project.mediaUrls[0]
      : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80';

  const hasVideo = !!project.videoUrl;

  const handleApply = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setApplied(true);
      toast.success(
        `Successfully applied to ${project.title}! The client will review your profile.`
      );
      onApplySuccess?.(project.id);
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarTitleRow}>
            <Icon name="briefcase" size={18} color={colors.accent[400]} style={{marginRight: spacing.sm}} />
            <Text style={styles.topBarTitle}>Project Opportunity</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" size={18} color={colors.neutral[300]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Project Media Banner */}
          <View style={styles.heroBanner}>
            <Image
              source={{uri: coverUrl}}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <Icon
                  name={project.type === 'job' ? 'briefcase' : 'file-text'}
                  size={12}
                  color={colors.white}
                  style={{marginRight: 4}}
                />
                <Text style={styles.heroBadgeText}>
                  {project.type === 'job' ? 'Full-Time Role' : 'Live Industry Project'}
                </Text>
              </View>
              {hasVideo && (
                <View style={styles.videoHeroBadge}>
                  <Icon name="play" size={11} color={colors.white} style={{marginRight: 4}} />
                  <Text style={styles.videoHeroBadgeText}>Video Demo Available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Company Info Row */}
          <View style={styles.companyRow}>
            {project.clientLogo ? (
              <Image source={{uri: project.clientLogo}} style={styles.companyLogo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>
                  {project.clientName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.companyInfo}>
              <View style={styles.companyNameRow}>
                <Icon name="building" size={14} color={colors.neutral[300]} style={{marginRight: 4}} />
                <Text style={styles.companyName}>{project.clientName}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="shield-check" size={12} color={colors.accent[400]} style={{marginRight: 4}} />
                <Text style={styles.verifiedText}>Verified Corporate Partner</Text>
              </View>
            </View>
          </View>

          {/* Project Title */}
          <Text style={styles.title}>{project.title}</Text>

          {/* Key Metrics Cards */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricLabelRow}>
                <Icon name="dollar-sign" size={13} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.metricLabel}>Stipend</Text>
              </View>
              <Text style={styles.metricValuePrimary}>{project.stipend}</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricLabelRow}>
                <Icon name="clock" size={13} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.metricLabel}>Duration</Text>
              </View>
              <Text style={styles.metricValue}>{project.duration}</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricLabelRow}>
                <Icon name="users" size={13} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.metricLabel}>Open Slots</Text>
              </View>
              <Text
                style={[
                  styles.metricValue,
                  isFull ? styles.metricFull : styles.metricAvailable,
                ]}>
                {isFull ? 'Full' : `${availableSlots} left`}
              </Text>
            </View>
          </View>

          {/* Slot Progress Bar */}
          <View style={styles.slotProgressSection}>
            <View style={styles.slotMeta}>
              <Text style={styles.slotLabel}>Cohort Enlistment</Text>
              <View style={styles.slotCountRow}>
                <Icon name="users" size={12} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.slotNumbers}>
                  {project.filledSlots} of {project.totalSlots} slots taken
                </Text>
              </View>
            </View>
            <View style={styles.slotBarBackground}>
              <View
                style={[
                  styles.slotBarFill,
                  {
                    width: `${Math.min(
                      100,
                      (project.filledSlots / project.totalSlots) * 100
                    )}%`,
                    backgroundColor: isFull
                      ? colors.error[500]
                      : colors.accent[500],
                  },
                ]}
              />
            </View>
          </View>

          {/* Project Overview */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="file-text" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionTitle}>Overview & Deliverables</Text>
            </View>
            <Text style={styles.description}>{project.description}</Text>
          </View>

          {/* Required Skills */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="code" size={16} color={colors.primary[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionTitle}>Required Tech Stack</Text>
            </View>
            <View style={styles.skillChipsWrap}>
              {project.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Icon name="zap" size={12} color={colors.accent[400]} style={{marginRight: 4}} />
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Requirements & Criteria */}
          {project.requirements && project.requirements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Icon name="target" size={16} color={colors.warning[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.sectionTitle}>Applicant Criteria</Text>
              </View>
              {project.requirements.map((req, i) => (
                <View key={i} style={styles.reqRow}>
                  <Icon name="check-circle" size={14} color={colors.accent[400]} style={{marginRight: spacing.xs, marginTop: 2}} />
                  <Text style={styles.reqText}>{req}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Bar */}
        <View style={styles.bottomBar}>
          <PremiumButton
            title={
              applied
                ? 'Application Submitted'
                : isFull
                ? 'Cohort Full'
                : 'Apply for this Project'
            }
            icon={applied ? 'check-circle' : isFull ? 'lock' : 'zap'}
            variant={applied || isFull ? 'secondary' : 'primary'}
            size="lg"
            disabled={applied || isFull || submitting}
            onPress={handleApply}
            style={styles.applyBtn}
          />
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    backgroundColor: colors.surface.elevated,
  },
  topBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  heroBanner: {
    width: '100%',
    height: 160,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.base,
    backgroundColor: colors.neutral[900],
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  heroBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[100],
    fontWeight: '700',
    fontSize: 10,
  },
  videoHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent[400] + '80',
  },
  videoHeroBadgeText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontWeight: '700',
    fontSize: 10,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoPlaceholderText: {
    ...textStyles.h3,
    color: colors.accent[400],
  },
  companyInfo: {
    flex: 1,
  },
  companyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifiedText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '600',
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[100],
    fontSize: 22,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  metricValue: {
    ...textStyles.bodySmall,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  metricValuePrimary: {
    ...textStyles.bodySmall,
    color: colors.accent[400],
    fontWeight: '700',
  },
  metricFull: {
    color: colors.error[400],
  },
  metricAvailable: {
    color: colors.accent[400],
  },
  slotProgressSection: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.lg,
  },
  slotMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  slotCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotLabel: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
  },
  slotNumbers: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  slotBarBackground: {
    height: 8,
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  slotBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  description: {
    ...textStyles.bodyMedium,
    color: colors.neutral[300],
    lineHeight: 22,
  },
  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  skillChipText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontWeight: '600',
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  reqBullet: {
    color: colors.accent[400],
    fontWeight: '700',
    fontSize: 14,
    marginTop: 2,
  },
  reqText: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
    flex: 1,
    lineHeight: 20,
  },
  bottomBar: {
    padding: spacing.base,
    backgroundColor: colors.surface.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  applyBtn: {
    width: '100%',
  },
});
