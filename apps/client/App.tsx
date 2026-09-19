// ─── Client App Root ───
// Handles Phone+OTP Auth, role verification, force updates, offline banner, and client dashboard.

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
import {ClientNavigator} from './src/navigation/ClientNavigator';

// Mock client profile for seamless offline/prototype testing
const DEMO_CLIENT: UserProfile = {
  uid: 'demo-client-corp',
  phone: '+919988776655',
  displayName: 'Vikram Mehta',
  companyName: 'Apex Financial Technologies',
  email: 'vikram.m@apexfintech.io',
  role: 'client',
  clientStatus: 'approved',
  isSuspended: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function ClientAppContent() {
  const {isConnected, isInternetReachable} = useNetwork();
  const {isUpdateRequired, updateDetails} = useForceUpdate({
    appType: 'client',
  });
  const {
    user,
    loading,
    roleMismatch,
    isSuspended,
    signOut,
  } = useAuth({requiredRole: 'client'});

  // Auth flow local state
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | null>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [demoActive, setDemoActive] = useState(true);

  // 1. Force update lock
  if (isUpdateRequired && updateDetails) {
    return (
      <ForceUpdateScreen
        appName="5Upskill Client"
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

  // 3. User suspended state
  if (isSuspended) {
    return (
      <View style={styles.stateCenter}>
        <View style={styles.stateIconCircle}>
          <Icon name="alert-triangle" size={32} color={colors.warning[400]} />
        </View>
        <Text style={styles.stateTitle}>Account Suspended</Text>
        <Text style={styles.stateSubtitle}>
          Your corporate partner profile has been suspended. Please contact
          partner-support@5upskill.com.
        </Text>
        <TouchableOpacity style={styles.stateBtn} onPress={signOut}>
          <Text style={styles.stateBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Role mismatch state
  if (roleMismatch) {
    return (
      <View style={styles.stateCenter}>
        <View style={styles.stateIconCircle}>
          <Icon name="user-x" size={32} color={colors.error[400]} />
        </View>
        <Text style={styles.stateTitle}>Student / Admin Account</Text>
        <Text style={styles.stateSubtitle}>
          This account is registered as a Student or Administrator. Please open
          the 5Upskill Student or Admin app.
        </Text>
        <TouchableOpacity style={styles.stateBtn} onPress={signOut}>
          <Text style={styles.stateBtnText}>Switch Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine active client profile
  const activeClient = user || (demoActive ? DEMO_CLIENT : null);

  // 5. Authenticated corporate workspace
  if (activeClient) {
    return (
      <View style={styles.container}>
        {(!isConnected || isInternetReachable === false) && (
          <NoInternetBanner />
        )}
        <ClientNavigator
          user={activeClient}
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
        <PhoneAuthScreen
          appName="5Upskill Client"
          onOTPSent={confirmation => {
            setConfirmationResult(confirmation);
            setAuthStep('otp');
          }}
          onBypass={() => setDemoActive(true)}
        />
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
        <ClientAppContent />
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
    borderColor: colors.primary[500] + '50',
  },
  demoBypassText: {
    ...textStyles.caption,
    color: colors.primary[400],
    fontWeight: '700',
  },
});
