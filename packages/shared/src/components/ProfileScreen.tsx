// ─── Component: ProfileScreen ───
// Shared profile screen with avatar upload, name editing, and contact details.

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {colors, textStyles, spacing, radius, fontFamily} from '../theme';
import {updateUser} from '../firebase/firestore';
import {uploadAvatar} from '../firebase/storage';
import {Icon, IconBadge} from './icons/Icon';
import {toast} from './Toast';
import {SkeletonProfile} from './SkeletonLoader';
import {User} from '../types';

interface ProfileScreenProps {
  user: User | null;
  isLoading: boolean;
  onSignOut: () => void;
  onPickImage?: () => Promise<string | null>; // Returns local URI
  extraContent?: React.ReactNode; // App-specific content (assessment scores, etc.)
}

export function ProfileScreen({
  user,
  isLoading,
  onSignOut,
  onPickImage,
  extraContent,
}: ProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral[950]} />
        <SkeletonProfile />
      </View>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(user.uid, {
        displayName: name.trim(),
        email: email.trim() || undefined,
      });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPress = async () => {
    if (!onPickImage) return;
    try {
      const localUri = await onPickImage();
      if (localUri) {
        const downloadUrl = await uploadAvatar(user.uid, localUri);
        await updateUser(user.uid, {avatarUrl: downloadUrl});
        toast.success('Avatar updated!');
      }
    } catch (error) {
      toast.error('Failed to upload avatar.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral[950]} />

      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
          {user.avatarUrl ? (
            <Image source={{uri: user.avatarUrl}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user.displayName?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.avatarBadge}>
            <Icon name="camera" size={14} color={colors.white} />
          </View>
        </TouchableOpacity>

        {!editing ? (
          <>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      {editing ? (
        <View style={styles.editForm}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={colors.neutral[600]}
          />

          <Text style={styles.fieldLabel}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={colors.neutral[600]}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditing(false);
                setName(user.displayName);
                setEmail(user.email || '');
              }}>
              <View style={styles.inlineRow}>
                <Icon name="x" size={16} color={colors.neutral[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && {opacity: 0.5}]}
              onPress={handleSave}
              disabled={saving}>
              <View style={styles.inlineRow}>
                <Icon name={saving ? 'refresh-cw' : 'check'} size={16} color={colors.white} style={{marginRight: spacing.xs}} />
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoSection}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setEditing(true)}>
            <View style={styles.inlineRow}>
              <Icon name="edit" size={16} color={colors.primary[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>

          {user.email ? (
            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <Icon name="mail" size={16} color={colors.neutral[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Icon name="calendar" size={16} color={colors.neutral[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.infoLabel}>Member Since</Text>
            </View>
            <Text style={styles.infoValue}>
              {user.createdAt?.toDate?.()?.toLocaleDateString() || 'Active Member'}
            </Text>
          </View>
        </View>
      )}

      {extraContent}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={onSignOut}
        activeOpacity={0.8}>
        <View style={styles.inlineRow}>
          <Icon name="log-out" size={18} color={colors.error[400]} style={{marginRight: spacing.sm}} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[950],
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary[600],
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary[600],
  },
  avatarInitial: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: colors.primary[200],
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral[950],
  },
  avatarBadgeIcon: {
    fontSize: 12,
  },
  displayName: {
    ...textStyles.h3,
    color: colors.white,
    marginTop: spacing.base,
  },
  phone: {
    ...textStyles.body,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
  roleBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.primary[900] + '60',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary[700],
  },
  roleText: {
    ...textStyles.caption,
    color: colors.primary[400],
    fontFamily: fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.base,
  },
  editProfileButton: {
    backgroundColor: colors.surface.card,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.neutral[700],
  },
  editProfileText: {
    ...textStyles.buttonMedium,
    color: colors.primary[400],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[800],
  },
  infoLabel: {
    ...textStyles.bodySmall,
    color: colors.neutral[500],
  },
  infoValue: {
    ...textStyles.bodySmall,
    color: colors.neutral[200],
    fontFamily: fontFamily.medium,
  },
  // Edit form
  editForm: {
    paddingHorizontal: spacing.xl,
  },
  fieldLabel: {
    ...textStyles.label,
    color: colors.neutral[400],
    marginBottom: spacing.sm,
    marginTop: spacing.base,
  },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral[700],
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface.card,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[700],
  },
  cancelButtonText: {
    ...textStyles.buttonMedium,
    color: colors.neutral[300],
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...textStyles.buttonMedium,
    color: colors.white,
  },
  signOutButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing['3xl'],
    backgroundColor: colors.error[900] + '40',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error[800],
  },
  signOutText: {
    ...textStyles.buttonMedium,
    color: colors.error[400],
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
