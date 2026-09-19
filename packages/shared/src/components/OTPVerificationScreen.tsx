// ─── Component: OTPVerificationScreen ───
// 6-digit OTP input with auto-focus and smooth animations.

import React, {useState, useRef, useEffect} from 'react';
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
import {toast} from './Toast';
import {Icon, IconBadge} from './icons/Icon';

interface OTPVerificationScreenProps {
  phoneNumber: string;
  confirmation?: any; // FirebaseAuthTypes.ConfirmationResult
  onVerified?: (uid: string) => void;
  onSuccess?: () => void;
  onResend?: () => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export function OTPVerificationScreen({
  phoneNumber,
  confirmation,
  onVerified,
  onSuccess,
  onResend,
  onBack,
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (confirmation && typeof confirmation.confirm === 'function') {
        const result = await confirmation.confirm(otp);
        toast.success('Phone verified successfully!');
        if (onVerified && result?.user) {
          onVerified(result.user.uid);
        }
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Fallback for mock demo
        toast.success('Phone verified successfully!');
        if (onVerified) onVerified('test-uid');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      // If code was 123456 or test run, allow passage
      if (otp === '123456') {
        toast.success('Phone verified successfully!');
        if (onVerified) onVerified('test-uid');
        if (onSuccess) onSuccess();
        return;
      }
      const message =
        err?.code === 'auth/invalid-verification-code'
          ? 'The OTP you entered is incorrect. (For demo test, enter 123456)'
          : err?.userMessage || 'Verification failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp('');
    setError('');
    onResend?.();
    toast.info('A new OTP has been sent to your phone.');
  };

  // Render OTP boxes visualization
  const renderOTPBoxes = () => {
    return (
      <View style={styles.otpBoxContainer}>
        {Array.from({length: OTP_LENGTH}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              index < otp.length && styles.otpBoxFilled,
              error && styles.otpBoxError,
            ]}>
            <Text style={styles.otpDigit}>
              {otp[index] || ''}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral[950]} />

        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="chevron-left" size={20} color={colors.accent[400]} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <IconBadge
              name="shield-check"
              size={28}
              iconColor={colors.accent[400]}
              backgroundColor={colors.accent[950]}
              borderColor={colors.accent[500] + '40'}
            />
          </View>

          <Text style={styles.title}>Verify OTP Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit verification code sent to{'\n'}
            <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
          </Text>

          {/* Hidden TextInput for keyboard */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={otp}
            onChangeText={text => {
              if (text.length <= OTP_LENGTH) {
                setOtp(text.replace(/[^0-9]/g, ''));
                setError('');
              }
            }}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
          />

          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}>
            {renderOTPBoxes()}
          </TouchableOpacity>

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={loading || otp.length !== OTP_LENGTH}
            activeOpacity={0.85}>
            {loading ? (
              <>
                <Icon name="refresh-cw" size={18} color={colors.white} />
                <Text style={styles.verifyButtonText}>Verifying OTP...</Text>
              </>
            ) : (
              <>
                <Icon name="lock" size={18} color={colors.neutral[950]} />
                <Text style={styles.verifyButtonText}>Verify & Authenticate</Text>
                <Icon name="arrow-right" size={18} color={colors.neutral[950]} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <View style={styles.timerRow}>
                <Icon name="clock" size={14} color={colors.neutral[400]} />
                <Text style={styles.resendTimer}>
                  Resend code in {resendTimer}s
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Icon name="refresh-cw" size={14} color={colors.accent[400]} />
                <Text style={styles.resendLink}>Resend OTP Code</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.base,
    gap: spacing.xs,
  },
  backText: {
    ...textStyles.body,
    color: colors.accent[400],
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.xl,
  },
  iconWrapper: {
    marginBottom: spacing.base,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[400],
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  phoneHighlight: {
    color: colors.accent[400],
    fontFamily: fontFamily.semiBold,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.neutral[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    borderColor: colors.accent[500],
    backgroundColor: colors.accent[950] + '40',
  },
  otpBoxError: {
    borderColor: colors.error[500],
  },
  otpDigit: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.white,
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.error[400],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  verifyButton: {
    backgroundColor: colors.accent[600],
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    ...textStyles.buttonLarge,
    color: colors.neutral[950],
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resendTimer: {
    ...textStyles.bodySmall,
    color: colors.neutral[500],
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resendLink: {
    ...textStyles.buttonMedium,
    color: colors.accent[400],
  },
});
