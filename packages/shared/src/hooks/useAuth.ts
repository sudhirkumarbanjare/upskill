// ─── Hook: useAuth ───
// Manages Firebase auth state, user profile, and role verification.

import {useState, useEffect, useCallback} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {onAuthStateChanged, signOut as firebaseSignOut} from '../firebase/auth';
import {getUser} from '../firebase/firestore';
import {User, UserRole} from '../types';

export type AuthState =
  | {status: 'loading'}
  | {status: 'unauthenticated'}
  | {status: 'authenticated'; firebaseUser: FirebaseAuthTypes.User; profile: null; needsProfile: true}
  | {status: 'authenticated'; firebaseUser: FirebaseAuthTypes.User; profile: User; needsProfile: false}
  | {status: 'unauthorized'; firebaseUser: FirebaseAuthTypes.User; message: string};

interface UseAuthOptions {
  /** Required role to use this app */
  requiredRole: UserRole;
}

export function useAuth({requiredRole}: UseAuthOptions) {
  const [state, setState] = useState<AuthState>({status: 'loading'});

  useEffect(() => {
    // Failsafe timer so the UI is never permanently stuck on loading screen
    const timer = setTimeout(() => {
      setState(prev => (prev.status === 'loading' ? {status: 'unauthenticated'} : prev));
    }, 800);

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      clearTimeout(timer);
      if (!firebaseUser) {
        setState({status: 'unauthenticated'});
        return;
      }


      try {
        const profile = await getUser(firebaseUser.uid);

        if (!profile) {
          // User is authenticated but hasn't created a profile yet
          setState({
            status: 'authenticated',
            firebaseUser,
            profile: null,
            needsProfile: true,
          });
          return;
        }

        // Check role authorization
        if (profile.role !== requiredRole) {
          setState({
            status: 'unauthorized',
            firebaseUser,
            message: `This app is for ${requiredRole}s only. You are registered as a ${profile.role}.`,
          });
          return;
        }

        // Check if user is suspended
        if (profile.status === 'suspended') {
          setState({
            status: 'unauthorized',
            firebaseUser,
            message: 'Your account has been suspended. Please contact support.',
          });
          return;
        }

        setState({
          status: 'authenticated',
          firebaseUser,
          profile,
          needsProfile: false,
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
        setState({
          status: 'authenticated',
          firebaseUser,
          profile: null,
          needsProfile: true,
        });
      }
    });

    return unsubscribe;
  }, [requiredRole]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut();
      setState({status: 'unauthenticated'});
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.status !== 'authenticated' || !('firebaseUser' in state)) return;
    const profile = await getUser(state.firebaseUser.uid);
    if (profile && profile.role === requiredRole && profile.status !== 'suspended') {
      setState({
        status: 'authenticated',
        firebaseUser: state.firebaseUser,
        profile,
        needsProfile: false,
      });
    }
  }, [state, requiredRole]);

  const loading = state.status === 'loading';
  const user = state.status === 'authenticated' ? (state.profile as any) : null;
  const roleMismatch = state.status === 'unauthorized' && state.message.includes('only');
  const isSuspended = state.status === 'unauthorized' && state.message.includes('suspended');

  return {
    state,
    user,
    loading,
    roleMismatch,
    isSuspended,
    signOut,
    refreshProfile,
  };
}

