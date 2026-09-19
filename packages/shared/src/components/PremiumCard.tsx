import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors, textStyles, spacing, radius} from '../theme';
import {Icon} from './icons/Icon';

interface PremiumCardProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  index?: number;
}

export const PremiumCard = React.memo(function PremiumCard({
  onPress,
  children,
  style,
  index = 0,
}: PremiumCardProps) {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
});

// ─── Pre-composed card variants ───

const DEFAULT_PROJECT_COVER = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
const DEFAULT_JOB_COVER = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';

interface ProjectCardProps {
  project?: any;
  title?: string;
  clientName?: string;
  type?: 'project' | 'job';
  skills?: string[];
  duration?: string;
  slots?: {filled: number; max: number};
  coverImage?: string;
  videoUrl?: string;
  onPress: () => void;
  index?: number;
}

export const ProjectCard = React.memo(function ProjectCard(props: ProjectCardProps) {
  const {project, onPress, index = 0} = props;
  const title = project?.title || props.title || 'Untitled Project';
  const clientName = project?.clientName || props.clientName || 'Corporate Partner';
  const type = project?.type || props.type || 'project';
  const rawSkills = project?.skills || project?.requiredSkills || props.skills || [];
  const skills = Array.isArray(rawSkills) ? rawSkills : [];
  const duration = project?.duration || props.duration || 'Flexible';
  const filled = project?.filledSlots ?? props.slots?.filled ?? 0;
  const max = project?.totalSlots ?? project?.maxSlots ?? props.slots?.max ?? 1;
  const mediaUrl = project?.coverImage || project?.mediaUrls?.[0] || props.coverImage || (type === 'job' ? DEFAULT_JOB_COVER : DEFAULT_PROJECT_COVER);
  const hasVideo = Boolean(project?.videoUrl || props.videoUrl);

  return (
    <PremiumCard onPress={onPress} index={index}>
      {/* Cover Image / Media Banner with Fallback */}
      <View style={styles.mediaContainer}>
        <Image
          source={{uri: mediaUrl}}
          style={styles.projectCover}
          resizeMode="cover"
        />
        <View style={styles.mediaOverlay}>
          <View style={[styles.typeBadge, type === 'job' ? styles.jobBadge : styles.projectBadge]}>
            <Icon
              name={type === 'job' ? 'briefcase' : 'code'}
              size={12}
              color={type === 'job' ? colors.accent[300] : colors.primary[300]}
            />
            <Text style={styles.typeBadgeText}>
              {type === 'job' ? 'Job' : 'Project'}
            </Text>
          </View>
          {hasVideo && (
            <View style={styles.videoBadge}>
              <Icon name="play" size={10} color={colors.accent[300]} />
              <Text style={styles.videoBadgeText}>Video Demo</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.metaRow}>
            <Icon name="building" size={14} color={colors.neutral[400]} />
            <Text style={styles.cardSubtitle}>{clientName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="clock" size={13} color={colors.neutral[400]} />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.skillsRow}>
          {skills.slice(0, 3).map(skill => (
            <View key={skill} style={styles.skillChip}>
              <Icon name="zap" size={11} color={colors.accent[400]} />
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {skills.length > 3 && (
            <Text style={styles.moreSkills}>+{skills.length - 3}</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.slotsContainer}>
            <View style={styles.slotsBar}>
              <View
                style={[
                  styles.slotsFill,
                  {width: `${Math.min(100, (filled / Math.max(1, max)) * 100)}%`},
                ]}
              />
            </View>
            <View style={styles.slotsRow}>
              <View style={styles.slotsMeta}>
                <Icon name="users" size={13} color={colors.neutral[400]} />
                <Text style={styles.slotsText}>
                  {filled}/{max} cohort slots filled
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsCta}>View Details</Text>
                <Icon name="chevron-right" size={13} color={colors.accent[400]} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </PremiumCard>
  );
});

interface CourseCardProps {
  course?: any;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  skillTags?: string[];
  skills?: string[];
  onPress: () => void;
  index?: number;
}

export const CourseCard = React.memo(function CourseCard(props: CourseCardProps) {
  const {course, onPress, index = 0} = props;
  const title = course?.title || props.title || 'Untitled Course';
  const description = course?.description || props.description || '';
  const thumbnailUrl = course?.thumbnailUrl || props.thumbnailUrl;
  const rawSkills = course?.skills || course?.skillTags || props.skillTags || props.skills || [];
  const skillTags = Array.isArray(rawSkills) ? rawSkills : [];

  return (
    <PremiumCard onPress={onPress} index={index}>
      {thumbnailUrl && (
        <Image
          source={{uri: thumbnailUrl}}
          style={styles.courseThumbnail}
          resizeMode="cover"
        />
      )}
      <View style={styles.courseContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.courseDesc} numberOfLines={2}>{description}</Text>
        <View style={styles.skillsRow}>
          {skillTags.slice(0, 2).map(tag => (
            <View key={tag} style={styles.skillChip}>
              <Icon name="sparkles" size={11} color={colors.accent[400]} />
              <Text style={styles.skillText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </PremiumCard>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.neutral[700] + '4D', // 0.3 opacity
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  projectBadge: {
    backgroundColor: colors.primary[900] + '90',
  },
  jobBadge: {
    backgroundColor: colors.accent[950] + 'B0',
  },
  typeBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontWeight: '700',
    fontSize: 11,
  },
  duration: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardTitle: {
    ...textStyles.h4,
    color: colors.neutral[100],
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  skillChip: {
    backgroundColor: colors.surface.elevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skillText: {
    ...textStyles.caption,
    color: colors.neutral[300],
  },
  moreSkills: {
    ...textStyles.caption,
    color: colors.neutral[500],
    alignSelf: 'center',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[700] + '40',
    paddingTop: spacing.md,
  },
  slotsContainer: {
    gap: spacing.xs,
  },
  slotsBar: {
    height: 4,
    backgroundColor: colors.neutral[700],
    borderRadius: 2,
    overflow: 'hidden',
  },
  slotsFill: {
    height: '100%',
    backgroundColor: colors.accent[500],
    borderRadius: 2,
  },
  slotsText: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  slotsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  // Media styles
  mediaContainer: {
    width: '100%',
    height: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
    backgroundColor: colors.neutral[900],
  },
  projectCover: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoBadge: {
    backgroundColor: colors.surface.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent[400] + '80',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoBadgeText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    width: '100%',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsCta: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '600',
  },
  // Course card
  courseThumbnail: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.neutral[800],
  },
  courseContent: {
    gap: spacing.xs,
  },
  courseDesc: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
});
