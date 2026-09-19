// ─── Admin Screen: Pending Client Approvals ───
// Moderation queue for validating newly registered corporate client partners.

import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  UserProfile,
  EmptyState,
  Icon,
} from '@upskill/shared';

interface PendingApprovalCardProps {
  item: UserProfile;
  onApprove: (client: UserProfile) => void;
  onReject: (client: UserProfile) => void;
}

const PendingApprovalCard = React.memo(function PendingApprovalCard({
  item,
  onApprove,
  onReject,
}: PendingApprovalCardProps) {
  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.cardHeader}>
        <View style={styles.companyMeta}>
          <Text style={styles.companyName}>
            {item.companyName || 'Corporate Partner'}
          </Text>
          <Text style={styles.contactName}>
            Rep: {item.displayName} • {item.phone}
          </Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
        <View style={styles.pendingBadge}>
          <Icon name="clock" size={10} color={colors.warning[400]} />
          <Text style={styles.pendingBadgeText}>PENDING</Text>
        </View>
      </View>

      {/* Registration Time */}
      <View style={styles.timestampRow}>
        <Text style={styles.timestampText}>
          Registered:{' '}
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Decision Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => onReject(item)}>
          <Icon name="x" size={14} color={colors.neutral[400]} />
          <Text style={styles.rejectBtnText}>Reject Partner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => onApprove(item)}>
          <Icon name="check" size={14} color={colors.neutral[950]} />
          <Text style={styles.approveBtnText}>Approve Partner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

interface PendingApprovalsScreenProps {
  pendingList: UserProfile[];
  onApprove: (clientUid: string) => void;
  onReject: (clientUid: string) => void;
}

export function PendingApprovalsScreen({
  pendingList,
  onApprove,
  onReject,
}: PendingApprovalsScreenProps) {
  const handleApprove = useCallback((client: UserProfile) => {
    onApprove(client.uid);
    toast.success(`Approved "${client.companyName || client.displayName}"! Partner can now post projects.`);
  }, [onApprove]);

  const handleReject = useCallback((client: UserProfile) => {
    onReject(client.uid);
    toast.info(`Declined application for "${client.companyName || client.displayName}".`);
  }, [onReject]);

  const keyExtractor = useCallback((item: UserProfile) => item.uid, []);

  const renderItem = useCallback(({item}: {item: UserProfile}) => (
    <PendingApprovalCard
      item={item}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  ), [handleApprove, handleReject]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Corporate Approvals</Text>
        <Text style={styles.subtitle}>
          Review corporate credentials and grant project posting rights
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={pendingList}
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
          <EmptyState
            title="All Clear! No Pending Approvals"
            subtitle="All client company applications have been reviewed."
            icon="shield-check"
          />
        }
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
  title: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  subtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginTop: 2,
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  companyMeta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  companyName: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  contactName: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
    marginTop: 2,
  },
  emailText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warning[950],
    borderColor: colors.warning[600],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    ...textStyles.caption,
    color: colors.warning[400],
    fontWeight: '700',
    fontSize: 10,
  },
  timestampRow: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  timestampText: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.accent[600],
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[950],
    fontWeight: '700',
  },
});
