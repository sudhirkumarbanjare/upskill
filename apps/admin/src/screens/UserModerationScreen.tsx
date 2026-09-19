// ─── Admin Screen: User Directory, Staff & SuperAdmin Provisioning ───
// Search, inspect, suspend, moderate accounts, and provision new Staff & SuperAdmin accounts.

import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
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
  toast,
  UserProfile,
  UserRole,
  EmptyState,
  PremiumButton,
  Icon,
  IconName,
} from '@upskill/shared';
import {ALL_PLATFORM_USERS} from '../data/sampleAdminData';

interface RoleFilterItem {
  id: string;
  label: string;
  icon: IconName;
}

const ROLE_FILTERS: RoleFilterItem[] = [
  {id: 'All', label: 'All Users', icon: 'users'},
  {id: 'student', label: 'Students', icon: 'graduation-cap'},
  {id: 'client', label: 'Clients', icon: 'building'},
  {id: 'staff', label: 'Staff', icon: 'shield'},
  {id: 'superadmin', label: 'SuperAdmin', icon: 'shield-check'},
];

interface UserModerationRowProps {
  item: UserProfile;
  onToggleSuspend: (user: UserProfile) => void;
  onDeleteUser: (user: UserProfile) => void;
}

const UserModerationRow = React.memo(function UserModerationRow({
  item,
  onToggleSuspend,
  onDeleteUser,
}: UserModerationRowProps) {
  const isSuspended = item.isSuspended;

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return styles.roleBadgeSuperAdmin;
      case 'staff':
        return styles.roleBadgeStaff;
      case 'client':
        return styles.roleBadgeClient;
      case 'student':
      default:
        return styles.roleBadgeStudent;
    }
  };

  const getRoleIcon = (role: UserRole): IconName => {
    switch (role) {
      case 'superadmin':
        return 'shield-check';
      case 'staff':
        return 'shield';
      case 'client':
        return 'building';
      case 'student':
      default:
        return 'graduation-cap';
    }
  };

  const getRoleIconColor = (role: UserRole): string => {
    switch (role) {
      case 'superadmin':
        return '#f59e0b';
      case 'staff':
        return '#c084fc';
      case 'client':
        return colors.accent[400];
      case 'student':
      default:
        return colors.neutral[300];
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return 'SUPERADMIN';
      case 'staff':
        return 'STAFF MODERATOR';
      case 'client':
        return 'CLIENT';
      case 'student':
      default:
        return 'STUDENT';
    }
  };

  return (
    <View
      style={[
        styles.userCard,
        isSuspended && styles.userCardSuspended,
      ]}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {item.displayName || item.companyName || 'Anonymous'}
            </Text>
            <View
              style={[
                styles.roleBadge,
                getRoleBadgeStyle(item.role),
              ]}>
              <Icon
                name={getRoleIcon(item.role)}
                size={11}
                color={getRoleIconColor(item.role)}
              />
              <Text style={styles.roleBadgeText}>
                {getRoleLabel(item.role)}
              </Text>
            </View>
          </View>
          <Text style={styles.contactDetails}>
            {item.phone} • {item.email}
          </Text>
        </View>

        {/* Status Indicator */}
        <View
          style={[
            styles.statusPill,
            isSuspended
              ? styles.statusPillSuspended
              : styles.statusPillActive,
          ]}>
          <Text
            style={[
              styles.statusPillText,
              isSuspended
                ? styles.statusTextSuspended
                : styles.statusTextActive,
            ]}>
            {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            isSuspended
              ? styles.reinstateBtn
              : styles.suspendBtn,
          ]}
          onPress={() => onToggleSuspend(item)}>
          <Icon
            name={isSuspended ? 'check' : 'alert-triangle'}
            size={12}
            color={isSuspended ? colors.accent[300] : colors.warning[300]}
          />
          <Text
            style={[
              styles.actionBtnText,
              isSuspended
                ? styles.reinstateBtnText
                : styles.suspendBtnText,
            ]}>
            {isSuspended ? 'Reinstate Account' : 'Suspend Access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDeleteUser(item)}>
          <Icon name="trash" size={12} color={colors.error[400]} />
          <Text style={styles.deleteBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export function UserModerationScreen() {
  const [users, setUsers] = useState<UserProfile[]>(ALL_PLATFORM_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // New admin / staff form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesRole =
        selectedRole === 'All' || u.role === selectedRole;
      const matchesSearch =
        (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, searchQuery, selectedRole]);

  const handleToggleSuspend = useCallback((user: UserProfile) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.uid === user.uid) {
          const nextSuspended = !u.isSuspended;
          if (nextSuspended) {
            toast.warning(`User "${u.displayName}" has been suspended.`);
          } else {
            toast.success(`User "${u.displayName}" has been reinstated.`);
          }
          return {...u, isSuspended: nextSuspended};
        }
        return u;
      })
    );
  }, []);

  const handleDeleteUser = useCallback((user: UserProfile) => {
    setUsers(prev => prev.filter(u => u.uid !== user.uid));
    toast.error(`User profile "${user.displayName}" removed.`);
  }, []);

  const handleCreateStaffOrAdmin = useCallback(() => {
    if (!newName.trim() || !newPhone.trim() || !newEmail.trim()) {
      toast.warning('Please fill in full name, phone number, and official email.');
      return;
    }

    if (!newPhone.startsWith('+91') || newPhone.length < 13) {
      toast.warning('Please enter valid 10-digit phone with +91 country code.');
      return;
    }

    const newUser: UserProfile = {
      uid: `admin-usr-${Date.now()}`,
      phone: newPhone.trim(),
      displayName: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success(
      `Successfully provisioned ${newRole === 'superadmin' ? 'SuperAdmin' : 'Staff'} account for ${newUser.displayName}!`
    );

    // Reset Form
    setIsProvisioning(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewRole('staff');
  }, [newName, newPhone, newEmail, newRole]);

  const keyExtractor = useCallback((item: UserProfile) => item.uid, []);

  const renderItem = useCallback(({item}: {item: UserProfile}) => (
    <UserModerationRow
      item={item}
      onToggleSuspend={handleToggleSuspend}
      onDeleteUser={handleDeleteUser}
    />
  ), [handleToggleSuspend, handleDeleteUser]);

  return (
    <View style={styles.container}>
      {/* User Directory List with Header and Provisioning Form */}
      <FlatList
        data={filteredUsers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={7}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <View style={styles.headerTitles}>
                  <Text style={styles.title}>User & Staff Directory</Text>
                  <Text style={styles.subtitle}>
                    Manage access, permissions, and provision Admin & Staff accounts
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.provisionBtn}
                  onPress={() => setIsProvisioning(!isProvisioning)}>
                  <Icon
                    name={isProvisioning ? 'x' : 'plus'}
                    size={14}
                    color={colors.accent[300]}
                  />
                  <Text style={styles.provisionBtnText}>
                    {isProvisioning ? 'Cancel' : 'Provision Staff / Admin'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Search */}
              <View style={styles.searchBar}>
                <Icon name="search" size={14} color={colors.neutral[400]} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, phone, or email..."
                  placeholderTextColor={colors.neutral[500]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="x" size={14} color={colors.neutral[400]} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Role Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {ROLE_FILTERS.map(roleItem => {
                  const isSelected = selectedRole === roleItem.id;
                  return (
                    <TouchableOpacity
                      key={roleItem.id}
                      onPress={() => setSelectedRole(roleItem.id)}
                      style={[
                        styles.filterPill,
                        isSelected && styles.filterPillActive,
                      ]}>
                      <Icon
                        name={roleItem.icon}
                        size={12}
                        color={isSelected ? colors.neutral[100] : colors.neutral[400]}
                      />
                      <Text
                        style={[
                          styles.filterText,
                          isSelected && styles.filterTextActive,
                        ]}>
                        {roleItem.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Provision Staff / SuperAdmin Card */}
            {isProvisioning && (
              <View style={styles.provisionCard}>
                <View style={styles.provisionHeader}>
                  <View style={styles.provisionTitleRow}>
                    <Icon name="shield-check" size={18} color={colors.accent[400]} />
                    <Text style={styles.provisionTitle}>
                      Provision Internal Access Account
                    </Text>
                  </View>
                  <Text style={styles.provisionDesc}>
                    Grant administrative or support moderation roles with Firestore security rule validation.
                  </Text>
                </View>

                {/* Role Choice */}
                <Text style={styles.formLabel}>Target System Role</Text>
                <View style={styles.roleChoiceRow}>
                  <TouchableOpacity
                    style={[
                      styles.roleChoiceBtn,
                      newRole === 'staff' && styles.roleChoiceBtnActive,
                    ]}
                    onPress={() => setNewRole('staff')}>
                    <Icon name="shield" size={20} color="#a855f7" />
                    <Text style={styles.roleChoiceTitle}>Staff Moderator</Text>
                    <Text style={styles.roleChoiceSub}>Review & Approvals</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleChoiceBtn,
                      newRole === 'superadmin' && styles.roleChoiceBtnActiveSuper,
                    ]}
                    onPress={() => setNewRole('superadmin')}>
                    <Icon name="shield-check" size={20} color="#f59e0b" />
                    <Text style={styles.roleChoiceTitle}>SuperAdmin</Text>
                    <Text style={styles.roleChoiceSub}>Full Root Authority</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.formLabel}>Full Legal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sumanth Reddy"
                  placeholderTextColor={colors.neutral[500]}
                  value={newName}
                  onChangeText={setNewName}
                />

                <Text style={styles.formLabel}>Mobile Number (+91)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+919876543210"
                  placeholderTextColor={colors.neutral[500]}
                  value={newPhone}
                  onChangeText={setNewPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.formLabel}>Official Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. sumanth@5upskill.com"
                  placeholderTextColor={colors.neutral[500]}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <View style={styles.provisionActions}>
                  <PremiumButton
                    title={`Provision ${newRole === 'superadmin' ? 'SuperAdmin' : 'Staff'} User`}
                    icon={newRole === 'superadmin' ? 'shield-check' : 'shield'}
                    variant="primary"
                    size="lg"
                    onPress={handleCreateStaffOrAdmin}
                  />
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Users Found"
            subtitle="Try adjusting your search criteria."
            icon="users"
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerTitles: {
    flex: 1,
    marginRight: spacing.sm,
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
  provisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent[950],
    borderWidth: 1,
    borderColor: colors.accent[500],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  provisionBtnText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
  },
  clearSearch: {
    color: colors.neutral[400],
    fontSize: 14,
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  filterPillActive: {
    backgroundColor: colors.accent[600],
    borderColor: colors.accent[500],
  },
  filterText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.neutral[100],
    fontWeight: '700',
  },
  provisionCard: {
    backgroundColor: colors.surface.elevated,
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent[600],
    gap: spacing.sm,
  },
  provisionHeader: {
    marginBottom: 4,
  },
  provisionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  provisionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  provisionDesc: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: 2,
  },
  formLabel: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
    marginTop: 4,
  },
  roleChoiceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleChoiceBtn: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  roleChoiceBtnActive: {
    backgroundColor: '#3b0764',
    borderColor: '#a855f7',
  },
  roleChoiceBtnActiveSuper: {
    backgroundColor: '#451a03',
    borderColor: '#f59e0b',
  },
  roleChoiceIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  roleChoiceTitle: {
    ...textStyles.caption,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  roleChoiceSub: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontSize: 9,
  },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  provisionActions: {
    marginTop: spacing.sm,
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  userCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  userCardSuspended: {
    borderColor: colors.error[600],
    opacity: 0.8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  userName: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  roleBadgeStudent: {
    backgroundColor: colors.surface.card,
  },
  roleBadgeClient: {
    backgroundColor: colors.accent[950],
  },
  roleBadgeStaff: {
    backgroundColor: '#3b0764',
  },
  roleBadgeSuperAdmin: {
    backgroundColor: '#451a03',
  },
  roleBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 10,
    fontWeight: '700',
  },
  contactDetails: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusPillActive: {
    backgroundColor: colors.success[950],
    borderWidth: 1,
    borderColor: colors.success[600],
  },
  statusPillSuspended: {
    backgroundColor: colors.error[950],
    borderWidth: 1,
    borderColor: colors.error[600],
  },
  statusPillText: {
    ...textStyles.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.success[400],
  },
  statusTextSuspended: {
    color: colors.error[400],
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  suspendBtn: {
    backgroundColor: colors.warning[950],
    borderWidth: 1,
    borderColor: colors.warning[600],
  },
  reinstateBtn: {
    backgroundColor: colors.accent[950],
    borderWidth: 1,
    borderColor: colors.accent[600],
  },
  suspendBtnText: {
    ...textStyles.caption,
    color: colors.warning[300],
    fontWeight: '700',
  },
  reinstateBtnText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontWeight: '700',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error[600],
  },
  deleteBtnText: {
    ...textStyles.caption,
    color: colors.error[400],
    fontWeight: '700',
  },
});
