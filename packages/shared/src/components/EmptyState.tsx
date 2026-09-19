// ─── Component: EmptyState ───
// Beautiful illustrated empty states for lists and data views.

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, textStyles, spacing, radius} from '../theme';
import {Icon, IconBadge, IconName} from './icons/Icon';

interface EmptyStateProps {
  icon?: string;
  iconName?: IconName;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  iconName = 'sparkles',
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={36} color={colors.accent[400]} strokeWidth={1.75} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.button}
          onPress={onAction}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Pre-configured empty states for common scenarios
export function EmptyProjects({onAction}: {onAction?: () => void}) {
  return (
    <EmptyState
      iconName="briefcase"
      title="No Projects Found"
      subtitle="There are no projects matching your criteria right now. Check back soon!"
      actionLabel={onAction ? 'Browse All' : undefined}
      onAction={onAction}
    />
  );
}

export function EmptyCourses() {
  return (
    <EmptyState
      iconName="book-open"
      title="No Courses Available"
      subtitle="New courses are being added regularly. Stay tuned for exciting learning opportunities!"
    />
  );
}

export function EmptyApplicants() {
  return (
    <EmptyState
      iconName="users"
      title="No Applicants Yet"
      subtitle="Your listing is live. Qualified candidates will start applying soon."
    />
  );
}

export function EmptyApplications() {
  return (
    <EmptyState
      iconName="file-text"
      title="No Applications"
      subtitle="You haven't applied to any projects yet. Start exploring opportunities!"
    />
  );
}

export function EmptyAssessment() {
  return (
    <EmptyState
      iconName="target"
      title="Take Your Assessment"
      subtitle="Complete the career assessment to discover roles that match your skills."
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    ...textStyles.h4,
    color: colors.neutral[200],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[400],
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonText: {
    ...textStyles.buttonMedium,
    color: colors.white,
  },
});
