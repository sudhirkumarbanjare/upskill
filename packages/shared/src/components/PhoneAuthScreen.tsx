// ─── Component: PhoneAuthScreen ───
// Premium phone number input with OTP flow initiation.

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, textStyles, spacing, radius, fontFamily} from '../theme';
import {sendOTP, AuthError} from '../firebase/auth';
import {toast} from './Toast';
import {Icon, IconBadge} from './icons/Icon';

interface PhoneAuthScreenProps {
  onOTPSent: (verificationId: string, phoneNumber: string) => void;
  appName: string;
  onBypass?: () => void;
}

export function PhoneAuthScreen({onOTPSent, appName, onBypass}: PhoneAuthScreenProps) {
  const [phone, setPhone] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const confirmation = await sendOTP(phone);
      // The confirmation object has a verificationId we can use
      onOTPSent(confirmation as any, phone);
    } catch (err) {
      const authError = err as AuthError;
      console.warn('Firebase Auth sendOTP failed (likely no google-services.json yet):', authError);
      // If Firebase project is not linked yet, provide a mock confirmation for testing
      const mockConfirmation = {
        verificationId: 'mock-verification-id-5upskill',
        confirm: async (code: string) => {
          if (code === '123456' || code.length === 6) {
            return {
              user: {
                uid: 'test-user-' + phone.replace(/[^0-9]/g, ''),
                phoneNumber: phone,
                displayName: 'Test User',
              },
            };
          }
          throw {code: 'auth/invalid-verification-code'};
        },
      };
      toast.info('Firebase not configured. Entering Prototype OTP mode (Use OTP: 123456)');
      onOTPSent(mockConfirmation as any, phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral[950]} />

        <View style={styles.header}>
          <IconBadge
            name="sparkles"
            size={32}
            iconColor={colors.accent[400]}
            backgroundColor={colors.accent[950]}
            borderColor={colors.accent[500] + '40'}
            style={styles.logoBadge}
          />
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.tagline}>Upskill Your Career</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome</Text>
          <Text style={styles.formSubtitle}>
            Enter your mobile number to sign in or register
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.phoneIconWrap}>
              <Icon name="phone" size={18} color={colors.accent[400]} />
            </View>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={phone}
              onChangeText={text => {
                setPhone(text);
                setError('');
              }}
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.neutral[600]}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
            activeOpacity={0.85}>
            {loading ? (
              <>
                <Icon name="refresh-cw" size={18} color={colors.neutral[950]} />
                <Text style={styles.sendButtonText}>Sending OTP...</Text>
              </>
            ) : (
              <>
                <Icon name="smartphone" size={18} color={colors.neutral[950]} />
                <Text style={styles.sendButtonText}>Send OTP Code</Text>
                <Icon name="arrow-right" size={18} color={colors.neutral[950]} />
              </>
            )}
          </TouchableOpacity>

          {onBypass ? (
            <TouchableOpacity
              style={styles.bypassBtn}
              onPress={onBypass}
              activeOpacity={0.85}>
              <Icon name="zap" size={16} color={colors.neutral[300]} />
              <Text style={styles.bypassBtnText}>
                Fast-Pass Prototype Login
              </Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[950],
  },
  container: {
    flex: 1,
    backgroundColor: colors.neutral[950],
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  logoBadge: {
    marginBottom: spacing.md,
  },
  appName: {
    ...textStyles.h2,
    color: colors.white,
  },
  tagline: {
    ...textStyles.body,
    color: colors.accent[400],
    marginTop: spacing.xs,
  },
  form: {
    flex: 1,
    backgroundColor: colors.surface.dark,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    padding: spacing['2xl'],
    paddingTop: spacing.xl,
  },
  formTitle: {
    ...textStyles.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...textStyles.body,
    color: colors.neutral[400],
    marginBottom: spacing.xl,
  },
  inputContainer: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral[700],
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  phoneIconWrap: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.white,
    paddingVertical: spacing.base,
    letterSpacing: 1,
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.error[400],
    marginBottom: spacing.md,
  },
  sendButton: {
    backgroundColor: colors.accent[600],
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    ...textStyles.button,
    color: colors.neutral[950],
    fontWeight: '700',
  },
  bypassBtn: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent[500] + '40',
  },
  bypassBtnText: {
    ...textStyles.button,
    color: colors.neutral[100],
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 16,
  },
});
