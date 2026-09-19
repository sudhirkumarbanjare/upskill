// ─── Hook: useNetwork ───
// Monitors network connectivity and provides offline awareness.
// Standalone pure-JS implementation with native NetInfo fallback when available.

import {useState, useEffect, useCallback} from 'react';
import {NativeModules} from 'react-native';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

export function useNetwork() {
  const [network, setNetwork] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    // Only attempt NetInfo if the native module is actually linked
    if (NativeModules.RNCNetInfo) {
      try {
        const NetInfo = require('@react-native-community/netinfo').default;
        if (NetInfo && typeof NetInfo.addEventListener === 'function') {
          unsubscribe = NetInfo.addEventListener((state: any) => {
            setNetwork({
              isConnected: state.isConnected ?? true,
              isInternetReachable: state.isInternetReachable ?? true,
              type: state.type ?? 'wifi',
            });
          });
        }
      } catch {
        // Silently preserve online state
      }
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (NativeModules.RNCNetInfo) {
      try {
        const NetInfo = require('@react-native-community/netinfo').default;
        if (NetInfo && typeof NetInfo.fetch === 'function') {
          const state = await NetInfo.fetch();
          return state.isConnected ?? true;
        }
      } catch {}
    }
    return true;
  }, []);

  return {
    ...network,
    isOffline: !network.isConnected,
    checkConnection,
  };
}
