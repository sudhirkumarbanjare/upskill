// ─── Firebase: Auth Helpers ───
// Phone OTP authentication flow helpers.

import {auth} from './config';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
}

// Map Firebase auth error codes to user-friendly messages
const AUTH_ERROR_MAP: Record<string, string> = {
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
  'auth/invalid-verification-code': 'The OTP you entered is incorrect. Please try again.',
  'auth/code-expired': 'This OTP has expired. Please request a new one.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/quota-exceeded': 'SMS limit reached. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/user-disabled': 'This account has been suspended. Contact support for help.',
  'auth/session-expired': 'Your session expired. Please request a new OTP.',
  'auth/missing-phone-number': 'Please enter your phone number.',
  'auth/captcha-check-failed': 'Verification failed. Please try again.',
};

export function parseAuthError(error: any): AuthError {
  const code = error?.code || 'auth/unknown';
  const message = error?.message || 'An unexpected error occurred.';
  const userMessage =
    AUTH_ERROR_MAP[code] || 'Something went wrong. Please try again.';

  return {code, message, userMessage};
}

/**
 * Send OTP to a phone number.
 * Returns a verification ID used to confirm the OTP.
 */
export async function sendOTP(
  phoneNumber: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    throw parseAuthError(error);
  }
}

/**
 * Verify OTP code against the confirmation result.
 * Returns the Firebase User on success.
 */
export async function verifyOTP(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
): Promise<FirebaseAuthTypes.User> {
  try {
    const userCredential = await confirmation.confirm(code);
    if (!userCredential?.user) {
      throw {code: 'auth/unknown', message: 'User not found after verification'};
    }
    return userCredential.user;
  } catch (error) {
    throw parseAuthError(error);
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  try {
    await auth().signOut();
  } catch (error) {
    throw parseAuthError(error);
  }
}

/**
 * Get current authenticated user (or null).
 */
export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

/**
 * Listen to auth state changes.
 */
export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void,
): () => void {
  return auth().onAuthStateChanged(callback);
}
