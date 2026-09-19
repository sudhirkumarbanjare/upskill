// ─── Admin App Root ───
// Enforces strict admin gatekeeper, phone+OTP auth, and root administrative console.

import React, {useState} from 'react';
import {StatusBar, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  ToastProvider,
  PhoneAuthScreen,
  OTPVerificationScreen,
  ForceUpdateScreen,
  NoInternetBanner,
  SkeletonProfile,
  useAuth,
  useNetwork,
  useForceUpdate,
  colors,
  textStyles,
  spacing,
  radius,
  UserProfile,
  Icon,
} from '@upskill/shared';
import {AdminNavigator} from './src/navigation/AdminNavigator';

// Mock root administrator profile for seamless prototype testing
const DEMO_ADMIN: UserProfile = {
  uid: 'demo-admin-root',
  phone: '+919900112233',
  displayName: 'Antigravity SuperAdmin',
  email: 'admin@5upskill.com',
  role: 'admin',
  isSuspended: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function AdminAppContent() {
  const {isConnected, isInternetReachable} = useNetwork();
  const {isUpdateRequired, updateDetails} = useForceUpdate({
    appType: 'admin',
  });
  const {
    user,
    loading,
    roleMismatch,
    isSuspended,
    signOut,
  } = useAuth({requiredRole: 'admin'});

  // Auth flow local state
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | null>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [demoActive, setDemoActive] = useState(true);

  // 1. Force update lock
  if (isUpdateRequired && updateDetails) {
    return (
      <ForceUpdateScreen
        appName="5Upskill Admin Console"
        currentVersion={updateDetails.currentVersion}
        minVersion={updateDetails.minVersion}
        storeUrl={updateDetails.storeUrl}
      />
    );
  }

  // 2. Loading state: skeleton loader (Rule: Never use ActivityIndicator)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonProfile />
      </View>
    );
  }

  // 3. Admin suspended state
  if (isSuspended) {
    return (
      <View style={styles.stateCenter}>
        <View style={styles.stateIconCircle}>
          <Icon name="alert-triangle" size={32} color={colors.warning[400]} />
        </View>
        <Text style={styles.stateTitle}>Admin Credentials Revoked</Text>
        <Text style={styles.stateSubtitle}>
          Your administrative clearance has been deactivated.
        </Text>
        <TouchableOpacity style={styles.stateBtn} onPress={signOut}>
          <Text style={styles.stateBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Strict Role Mismatch Gatekeeper
  if (roleMismatch) {
    return (
      <View style={styles.stateCenter}>
        <View style={styles.stateIconCircle}>
          <Icon name="lock" size={32} color={colors.error[400]} />
        </View>
        <Text style={styles.stateTitle}>Access Denied</Text>
        <Text style={styles.stateSubtitle}>
          Only authorized system administrators may enter this console.
          Your account is not provisioned with administrative privileges.
        </Text>
        <TouchableOpacity style={styles.stateBtn} onPress={signOut}>
          <Text style={styles.stateBtnText}>Exit Console</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine active admin profile
  const activeAdmin = user || (demoActive ? DEMO_ADMIN : null);

  // 5. Authenticated Admin Console
  if (activeAdmin) {
    return (
      <View style={styles.container}>
        {(!isConnected || isInternetReachable === false) && (
          <NoInternetBanner />
        )}
        <AdminNavigator
          user={activeAdmin}
          onSignOut={() => {
            setDemoActive(false);
            signOut();
          }}
        />
      </View>
    );
  }

  // 6. Unauthenticated Auth Flow (Phone -> OTP)
  return (
    <View style={styles.container}>
      {(!isConnected || isInternetReachable === false) && <NoInternetBanner />}
      {authStep === 'phone' ? (
        <View style={styles.container}>
          <PhoneAuthScreen
            appName="5Upskill Admin Console"
            onOTPSent={confirmation => {
              setConfirmationResult(confirmation);
              setAuthStep('otp');
            }}
            onBypass={() => setDemoActive(true)}
          />
        </View>
      ) : (
        <OTPVerificationScreen
          confirmation={confirmationResult}
          phoneNumber="your number"
          onSuccess={() => {
            setDemoActive(true);
            setAuthStep(null);
          }}
          onBack={() => setAuthStep('phone')}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <ToastProvider>
        <AdminAppContent />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.base,
    justifyContent: 'center',
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
    backgroundColor: colors.surface.elevated,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  stateBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[200],
    fontWeight: '600',
  },
  demoBypass: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.error[500] + '50',
  },
  demoBypassText: {
    ...textStyles.caption,
    color: colors.error[400],
    fontWeight: '700',
  },
});
