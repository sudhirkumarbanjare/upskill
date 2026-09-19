// ─── Student Component: Course Detail Modal ───
// Modal showing complete course curriculum, syllabus modules, and enrollment.

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
  Course,
  Icon,
  IconBadge,
  IconName,
} from '@upskill/shared';

const DEFAULT_COURSE_THUMBNAIL =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';

interface CourseDetailModalProps {
  course: Course | null;
  visible: boolean;
  onClose: () => void;
  onEnrollSuccess?: (courseId: string) => void;
}

export function CourseDetailModal({
  course,
  visible,
  onClose,
  onEnrollSuccess,
}: CourseDetailModalProps) {
  const [enrolled, setEnrolled] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');

  if (!course) return null;

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success(`Successfully enrolled in "${course.title}"!`);
    onEnrollSuccess?.(course.id);
  };

  const thumbnailUrl = course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL;

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
            <Icon name="book-open" size={18} color={colors.primary[400]} style={{marginRight: spacing.sm}} />
            <Text style={styles.topBarTitle}>Course Syllabus</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" size={18} color={colors.neutral[300]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <Image
            source={{uri: thumbnailUrl}}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.levelBadge}>
              <Icon name="award" size={12} color={colors.accent[300]} style={{marginRight: 4}} />
              <Text style={styles.levelText}>{course.level.toUpperCase()}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Icon name="clock" size={12} color={colors.neutral[400]} style={{marginRight: 4}} />
              <Text style={styles.metaBadgeText}>{course.totalHours} Hours</Text>
            </View>
            <View style={styles.metaBadge}>
              <Icon name="book-open" size={12} color={colors.neutral[400]} style={{marginRight: 4}} />
              <Text style={styles.metaBadgeText}>
                {course.modules?.length ?? course.modulesCount} Modules
              </Text>
            </View>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>

          {/* Skills Covered */}
          <View style={styles.skillsSection}>
            <View style={styles.sectionHeaderRow}>
              <Icon name="code" size={16} color={colors.primary[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionHeader}>Skills You Will Master</Text>
            </View>
            <View style={styles.skillChipsWrap}>
              {course.skills.map((skill, i) => (
                <View key={i} style={styles.skillChip}>
                  <Icon name="zap" size={12} color={colors.accent[400]} style={{marginRight: 4}} />
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Syllabus Modules */}
          <View style={styles.modulesSection}>
            <View style={styles.sectionHeaderRow}>
              <Icon name="layers" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.sectionHeader}>Curriculum Modules</Text>
            </View>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((mod, index) => {
                const isExpanded = expandedModule === mod.id;
                return (
                  <TouchableOpacity
                    key={mod.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      setExpandedModule(isExpanded ? null : mod.id)
                    }
                    style={styles.moduleCard}>
                    <View style={styles.moduleHeader}>
                      <View style={styles.moduleNumberBadge}>
                        <Text style={styles.moduleNumberText}>0{index + 1}</Text>
                      </View>
                      <View style={styles.moduleTitleCol}>
                        <Text style={styles.moduleTitle}>{mod.title}</Text>
                        <View style={styles.moduleDurationRow}>
                          <Icon name="clock" size={11} color={colors.neutral[400]} style={{marginRight: 4}} />
                          <Text style={styles.moduleDuration}>
                            {mod.durationMinutes} mins • {mod.lessons?.length || 3} lessons
                          </Text>
                        </View>
                      </View>
                      <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.neutral[400]}
                      />
                    </View>

                    {isExpanded && (
                      <View style={styles.moduleExpandedContent}>
                        <Text style={styles.moduleDesc}>{mod.description}</Text>
                        <View style={styles.lessonItem}>
                          <Icon name="play" size={12} color={colors.accent[400]} style={{marginRight: spacing.sm}} />
                          <Text style={styles.lessonText}>
                            Interactive Architecture Walkthrough
                          </Text>
                        </View>
                        <View style={styles.lessonItem}>
                          <Icon name="code" size={12} color={colors.primary[400]} style={{marginRight: spacing.sm}} />
                          <Text style={styles.lessonText}>
                            Hands-On Production Code Exercise
                          </Text>
                        </View>
                        <View style={styles.lessonItem}>
                          <Icon name="check-circle" size={12} color={colors.accent[400]} style={{marginRight: spacing.sm}} />
                          <Text style={styles.lessonText}>
                            Code Review & Benchmark Quiz
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyModulesText}>
                Curriculum modules are being finalized for this cohort.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom CTA Bar */}
        <View style={styles.bottomBar}>
          <PremiumButton
            title={enrolled ? 'Enrolled (Resume Learning)' : 'Enroll in Masterclass'}
            icon={enrolled ? 'check-circle' : 'graduation-cap'}
            variant={enrolled ? 'secondary' : 'primary'}
            size="lg"
            onPress={handleEnroll}
            style={styles.enrollBtn}
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
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.lg,
    marginBottom: spacing.base,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[950],
    borderColor: colors.primary[700],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  levelText: {
    ...textStyles.caption,
    color: colors.primary[400],
    fontWeight: '700',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  metaBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[300],
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[100],
    marginBottom: spacing.xs,
  },
  description: {
    ...textStyles.bodyMedium,
    color: colors.neutral[300],
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  skillsSection: {
    marginBottom: spacing.lg,
  },
  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
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
  modulesSection: {
    gap: spacing.sm,
  },
  moduleCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent[950],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  moduleNumberText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
  },
  moduleTitleCol: {
    flex: 1,
  },
  moduleTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '600',
  },
  moduleDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  moduleDuration: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  chevron: {
    fontSize: 12,
    color: colors.neutral[400],
    marginLeft: spacing.sm,
  },
  moduleExpandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    gap: spacing.xs,
  },
  moduleDesc: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
    marginBottom: spacing.xs,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  lessonDot: {
    color: colors.accent[400],
    fontSize: 16,
  },
  lessonText: {
    ...textStyles.caption,
    color: colors.neutral[300],
  },
  emptyModulesText: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    fontStyle: 'italic',
  },
  bottomBar: {
    padding: spacing.base,
    backgroundColor: colors.surface.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  enrollBtn: {
    width: '100%',
  },
});
