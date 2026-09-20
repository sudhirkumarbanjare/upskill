// ─── Admin App Root ───
import React, {useState} from 'react';
import {StatusBar, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  ToastProvider,
  colors,
  textStyles,
  spacing,
  radius,
  Icon,
} from '@upskill/shared';
import {AdminNavigator} from './src/navigation/AdminNavigator';

const DEMO_ADMIN = {
  uid: 'demo-admin-root',
  phone: '+919900112233',
  displayName: 'Antigravity SuperAdmin',
  email: 'admin@upskill.com',
  role: 'admin' as const,
  isSuspended: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  const [activeAdmin, setActiveAdmin] = useState<any>(DEMO_ADMIN);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <ToastProvider>
        <View style={styles.container}>
          {activeAdmin ? (
            <AdminNavigator
              user={activeAdmin}
              onSignOut={() => setActiveAdmin(null)}
            />
          ) : (
            <SafeAreaView style={styles.stateCenter}>
              <View style={styles.stateIconCircle}>
                <Icon name="shield-check" size={32} color={colors.accent[400]} />
              </View>
              <Text style={styles.stateTitle}>Upskill Admin Console</Text>
              <Text style={styles.stateSubtitle}>Root Administrator clearance required.</Text>
              <TouchableOpacity
                style={styles.stateBtn}
                onPress={() => setActiveAdmin(DEMO_ADMIN)}>
                <Text style={styles.stateBtnText}>Authenticate SuperAdmin</Text>
              </TouchableOpacity>
            </SafeAreaView>
          )}
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  stateCenter: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  stateIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  stateTitle: {
    ...textStyles.h2,
    color: colors.neutral[100],
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  stateSubtitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[400],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  stateBtn: {
    backgroundColor: colors.accent[600],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  stateBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[950],
    fontWeight: '700',
  },
});

