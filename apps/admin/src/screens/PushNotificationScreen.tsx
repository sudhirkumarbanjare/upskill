// ─── Admin Screen: Push Notification Dispatcher ───
// Broadcast or targeted push notifications per app (Student, Client, Admin) or individual single users.

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  PremiumButton,
  UserProfile,
  Icon,
  IconName,
} from '@upskill/shared';
import {ALL_PLATFORM_USERS} from '../data/sampleAdminData';

export type TargetScope =
  | 'all_apps'
  | 'student_app'
  | 'client_app'
  | 'admin_staff'
  | 'individual';

export type NotificationPriority = 'normal' | 'high';

interface PushHistoryItem {
  id: string;
  title: string;
  body: string;
  audience: string;
  targetCount: number;
  sentAt: string;
  priority: NotificationPriority;
}

const INITIAL_HISTORY: PushHistoryItem[] = [
  {
    id: 'push-1',
    title: '5 New FinTech Projects Live!',
    body: 'Apex Financial and CyberShield posted high-stipend live projects. Apply today.',
    audience: 'Student App Users',
    targetCount: 1420,
    sentAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: 'push-2',
    title: 'Top 5% Assessed Interns Ready for Placement',
    body: 'New batch of verified mobile and backend engineers available for recruitment.',
    audience: 'Client App Users',
    targetCount: 350,
    sentAt: 'Yesterday',
    priority: 'normal',
  },
  {
    id: 'push-3',
    title: 'System Config & Version Update',
    body: 'Minimum app versions updated. Remote force-update active across all clusters.',
    audience: 'All 3 Apps (Global)',
    targetCount: 1770,
    sentAt: '3 days ago',
    priority: 'normal',
  },
];

export function PushNotificationScreen() {
  const [targetScope, setTargetScope] = useState<TargetScope>('all_apps');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('normal');
  const [isSending, setIsSending] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [history, setHistory] = useState<PushHistoryItem[]>(INITIAL_HISTORY);

  // Search filtered individual users
  const searchResults = ALL_PLATFORM_USERS.filter(u =>
    (u.displayName || u.companyName || '')
      .toLowerCase()
      .includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const getRecipientCount = (): number => {
    switch (targetScope) {
      case 'all_apps':
        return 1770;
      case 'student_app':
        return 1420;
      case 'client_app':
        return 350;
      case 'admin_staff':
        return 12;
      case 'individual':
        return selectedUser ? 1 : 0;
    }
  };

  const getAudienceLabel = (): string => {
    switch (targetScope) {
      case 'all_apps':
        return 'All 3 Apps (Global)';
      case 'student_app':
        return 'Student App Users';
      case 'client_app':
        return 'Client App Users';
      case 'admin_staff':
        return 'Staff & Admin App';
      case 'individual':
        return selectedUser
          ? `${selectedUser.displayName || selectedUser.companyName} (${selectedUser.phone})`
          : 'Individual User';
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      toast.warning('Please provide both notification title and message body.');
      return;
    }

    if (targetScope === 'individual' && !selectedUser) {
      toast.warning('Please search and select a recipient user from the directory.');
      return;
    }

    setIsSending(true);

    try {
      // Simulate FCM Cloud Messaging packet dispatch
      await new Promise(resolve => setTimeout(resolve, 700));

      const newHistoryItem: PushHistoryItem = {
        id: `push-${Date.now()}`,
        title: title.trim(),
        body: body.trim(),
        audience: getAudienceLabel(),
        targetCount: getRecipientCount(),
        sentAt: 'Just now',
        priority,
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      toast.success(
        `Push alert dispatched to ${getAudienceLabel()} (${getRecipientCount()} device${getRecipientCount() === 1 ? '' : 's'})!`
      );

      // Reset form
      setTitle('');
      setBody('');
      setDeepLink('');
      if (targetScope === 'individual') {
        setSelectedUser(null);
        setUserSearch('');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to dispatch push notification.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Push Notification Hub</Text>
        <Text style={styles.subtitle}>
          Deliver individual or broadcast FCM push alerts across Student, Client & Admin apps
        </Text>
      </View>

      {/* Target Scope Selection */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>1. Select Target App or Individual</Text>
        <View style={styles.scopeGrid}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTargetScope('all_apps')}
            style={[
              styles.scopeOption,
              targetScope === 'all_apps' && styles.scopeOptionActive,
            ]}>
            <View style={styles.scopeIconBox}>
              <Icon
                name="bell-ring"
                size={20}
                color={targetScope === 'all_apps' ? colors.accent[300] : colors.neutral[300]}
              />
            </View>
            <Text style={styles.scopeTitle}>All 3 Apps</Text>
            <Text style={styles.scopeMeta}>1,770 Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTargetScope('student_app')}
            style={[
              styles.scopeOption,
              targetScope === 'student_app' && styles.scopeOptionActive,
            ]}>
            <View style={styles.scopeIconBox}>
              <Icon
                name="smartphone"
                size={20}
                color={targetScope === 'student_app' ? colors.accent[300] : colors.neutral[300]}
              />
            </View>
            <Text style={styles.scopeTitle}>Student App</Text>
            <Text style={styles.scopeMeta}>1,420 Students</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTargetScope('client_app')}
            style={[
              styles.scopeOption,
              targetScope === 'client_app' && styles.scopeOptionActive,
            ]}>
            <View style={styles.scopeIconBox}>
              <Icon
                name="building"
                size={20}
                color={targetScope === 'client_app' ? colors.accent[300] : colors.neutral[300]}
              />
            </View>
            <Text style={styles.scopeTitle}>Client App</Text>
            <Text style={styles.scopeMeta}>350 Corporate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTargetScope('admin_staff')}
            style={[
              styles.scopeOption,
              targetScope === 'admin_staff' && styles.scopeOptionActive,
            ]}>
            <View style={styles.scopeIconBox}>
              <Icon
                name="shield-check"
                size={20}
                color={targetScope === 'admin_staff' ? colors.accent[300] : colors.neutral[300]}
              />
            </View>
            <Text style={styles.scopeTitle}>Admin / Staff</Text>
            <Text style={styles.scopeMeta}>12 Internal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTargetScope('individual')}
            style={[
              styles.scopeOptionFull,
              targetScope === 'individual' && styles.scopeOptionActive,
            ]}>
            <View style={styles.scopeIconBox}>
              <Icon
                name="user"
                size={20}
                color={targetScope === 'individual' ? colors.accent[300] : colors.neutral[300]}
              />
            </View>
            <View style={styles.scopeOptionFullText}>
              <Text style={styles.scopeTitle}>Individual User Push</Text>
              <Text style={styles.scopeMeta}>
                {selectedUser
                  ? `Selected: ${selectedUser.displayName || selectedUser.companyName} (${selectedUser.phone})`
                  : 'Target a single student, client, or staff member'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Individual User Search and Selection */}
        {targetScope === 'individual' && (
          <View style={styles.individualPickerBox}>
            <Text style={styles.fieldLabel}>Search Recipient User</Text>
            <View style={styles.searchBar}>
              <Icon name="search" size={14} color={colors.neutral[400]} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, phone or email..."
                placeholderTextColor={colors.neutral[500]}
                value={userSearch}
                onChangeText={setUserSearch}
              />
            </View>

            {selectedUser && (
              <View style={styles.selectedUserBanner}>
                <View style={styles.selectedUserTextCol}>
                  <View style={styles.selectedUserNameRow}>
                    <Icon name="check" size={13} color={colors.accent[300]} />
                    <Text style={styles.selectedUserName}>
                      {selectedUser.displayName || selectedUser.companyName}
                    </Text>
                  </View>
                  <Text style={styles.selectedUserMeta}>
                    {selectedUser.role.toUpperCase()} • {selectedUser.phone} •{' '}
                    {selectedUser.email}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeUserBtn}
                  onPress={() => setSelectedUser(null)}>
                  <Icon name="x" size={12} color={colors.error[400]} />
                  <Text style={styles.removeUserBtnText}>Change</Text>
                </TouchableOpacity>
              </View>
            )}

            {!selectedUser && (
              <View style={styles.userResultsList}>
                {searchResults.slice(0, 4).map(u => (
                  <TouchableOpacity
                    key={u.uid}
                    style={styles.userResultItem}
                    onPress={() => {
                      setSelectedUser(u);
                      setUserSearch(u.displayName || u.companyName || u.phone);
                    }}>
                    <View>
                      <Text style={styles.userResultName}>
                        {u.displayName || u.companyName}
                      </Text>
                      <Text style={styles.userResultSub}>
                        {u.role.toUpperCase()} • {u.phone} • {u.email}
                      </Text>
                    </View>
                    <View style={styles.selectBadge}>
                      <Icon name="plus" size={10} color={colors.accent[300]} />
                      <Text style={styles.selectBadgeText}>Select</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Notification Message Content */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>2. Notification Content</Text>

        <Text style={styles.fieldLabel}>Notification Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Application Shortlisted for Interview!"
          placeholderTextColor={colors.neutral[500]}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.fieldLabel}>Message Body</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter message details for user lock-screen & notification tray..."
          placeholderTextColor={colors.neutral[500]}
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.fieldLabel}>Action Deep Link (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. upskill://projects or upskill://profile"
          placeholderTextColor={colors.neutral[500]}
          value={deepLink}
          onChangeText={setDeepLink}
          autoCapitalize="none"
        />

        {/* Priority Selector */}
        <Text style={styles.fieldLabel}>Delivery Priority</Text>
        <View style={styles.priorityRow}>
          <TouchableOpacity
            style={[
              styles.priorityBtn,
              priority === 'normal' && styles.priorityBtnActive,
            ]}
            onPress={() => setPriority('normal')}>
            <Icon
              name="zap"
              size={13}
              color={priority === 'normal' ? colors.neutral[100] : colors.neutral[400]}
            />
            <Text
              style={[
                styles.priorityText,
                priority === 'normal' && styles.priorityTextActive,
              ]}>
              Normal Priority
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.priorityBtn,
              priority === 'high' && styles.priorityBtnActiveUrgent,
            ]}
            onPress={() => setPriority('high')}>
            <Icon
              name="alert-triangle"
              size={13}
              color={priority === 'high' ? colors.neutral[100] : colors.neutral[400]}
            />
            <Text
              style={[
                styles.priorityText,
                priority === 'high' && styles.priorityTextActive,
              ]}>
              Urgent / High Priority
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Push Notification Preview */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>3. Live Device System Preview</Text>
        <View style={styles.previewPhone}>
          <View style={styles.notificationBubble}>
            <View style={styles.notifHeader}>
              <View style={styles.notifAppRow}>
                <View style={styles.notifIconCircle}>
                  <Text style={styles.notifIconText}>5U</Text>
                </View>
                <Text style={styles.notifAppName}>
                  {targetScope === 'client_app'
                    ? 'Upskill Client'
                    : targetScope === 'admin_staff'
                    ? 'Upskill Console'
                    : 'Upskill Student'}
                </Text>
                <Text style={styles.notifDot}>•</Text>
                <Text style={styles.notifTime}>Just now</Text>
              </View>
              {priority === 'high' && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>URGENT</Text>
                </View>
              )}
            </View>
            <Text style={styles.previewTitle}>
              {title.trim() || 'Your Notification Title Here'}
            </Text>
            <Text style={styles.previewBody} numberOfLines={2}>
              {body.trim() ||
                'This preview displays how your message will appear in the system notification shade.'}
            </Text>
            {deepLink.trim().length > 0 && (
              <View style={styles.deepLinkBadge}>
                <Icon name="external-link" size={11} color={colors.accent[400]} />
                <Text style={styles.deepLinkBadgeText}>
                  Action: {deepLink.trim()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Dispatch CTA */}
      <View style={styles.sendCard}>
        <View style={styles.sendMetaRow}>
          <Text style={styles.sendMetaTitle}>Target Scope</Text>
          <Text style={styles.sendMetaCount}>
            {getAudienceLabel()} ({getRecipientCount()} Recipient{getRecipientCount() === 1 ? '' : 's'})
          </Text>
        </View>
        <PremiumButton
          title={
            isSending
              ? 'Dispatching FCM Packets...'
              : `Dispatch Push Alert (${getRecipientCount()} Device${getRecipientCount() === 1 ? '' : 's'})`
          }
          icon={isSending ? 'refresh-cw' : 'send'}
          variant="primary"
          size="lg"
          disabled={isSending}
          onPress={handleSendNotification}
        />
      </View>

      {/* Dispatch History */}
      <Text style={styles.sectionTitle}>Recent Broadcast History</Text>
      <View style={styles.historyList}>
        {history.map(item => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyMetaLeft}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyAudience}>
                  {item.audience} • {item.targetCount} delivered • {item.sentAt}
                </Text>
              </View>
              <View style={styles.deliveredBadge}>
                <Icon name="check-circle" size={10} color={colors.accent[300]} />
                <Text style={styles.deliveredBadgeText}>DELIVERED</Text>
              </View>
            </View>
            <Text style={styles.historyBody} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.base,
  },
  header: {
    marginBottom: spacing.xs,
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
  card: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  sectionLabel: {
    ...textStyles.h3,
    color: colors.neutral[200],
    marginBottom: spacing.md,
  },
  scopeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scopeOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  scopeIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  scopeOptionFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
  },
  scopeOptionFullText: {
    flex: 1,
  },
  scopeOptionActive: {
    backgroundColor: colors.accent[950],
    borderColor: colors.accent[500],
  },
  scopeTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  scopeMeta: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  individualPickerBox: {
    marginTop: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 36,
    ...textStyles.bodySmall,
    color: colors.neutral[100],
  },
  selectedUserBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accent[950],
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  selectedUserTextCol: {
    flex: 1,
  },
  selectedUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedUserName: {
    ...textStyles.bodySmall,
    color: colors.accent[300],
    fontWeight: '700',
  },
  selectedUserMeta: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontSize: 10,
  },
  removeUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeUserBtnText: {
    ...textStyles.caption,
    color: colors.error[400],
    fontWeight: '700',
  },
  userResultsList: {
    gap: 4,
  },
  userResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.elevated,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  userResultName: {
    ...textStyles.bodySmall,
    color: colors.neutral[100],
    fontWeight: '600',
  },
  userResultSub: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontSize: 10,
  },
  selectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent[950],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  selectBadgeText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontSize: 10,
    fontWeight: '700',
  },
  fieldLabel: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  priorityBtnActive: {
    backgroundColor: colors.accent[950],
    borderColor: colors.accent[500],
  },
  priorityBtnActiveUrgent: {
    backgroundColor: colors.error[950],
    borderColor: colors.error[500],
  },
  priorityText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  priorityTextActive: {
    color: colors.neutral[100],
    fontWeight: '700',
  },
  previewPhone: {
    backgroundColor: colors.background.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  notificationBubble: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.focus,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notifAppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.accent[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIconText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.neutral[950],
  },
  notifAppName: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '700',
    fontSize: 11,
  },
  notifDot: {
    color: colors.neutral[500],
    fontSize: 10,
  },
  notifTime: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 10,
  },
  urgentBadge: {
    backgroundColor: colors.error[900],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  urgentBadgeText: {
    ...textStyles.caption,
    color: colors.error[300],
    fontSize: 9,
    fontWeight: '800',
  },
  previewTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
    marginBottom: 2,
  },
  previewBody: {
    ...textStyles.caption,
    color: colors.neutral[300],
    lineHeight: 16,
  },
  deepLinkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: colors.surface.elevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  deepLinkBadgeText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontSize: 10,
    fontWeight: '600',
  },
  sendCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
  },
  sendMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendMetaTitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
  },
  sendMetaCount: {
    ...textStyles.bodyMedium,
    color: colors.accent[300],
    fontWeight: '700',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[200],
    marginTop: spacing.xs,
  },
  historyList: {
    gap: spacing.sm,
  },
  historyCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  historyMetaLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  historyTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  historyAudience: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontSize: 11,
    marginTop: 2,
  },
  deliveredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent[950],
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  deliveredBadgeText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontSize: 9,
    fontWeight: '800',
  },
  historyBody: {
    ...textStyles.caption,
    color: colors.neutral[300],
    lineHeight: 16,
  },
});
