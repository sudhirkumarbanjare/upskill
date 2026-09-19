// ─── Hook: useForceUpdate ───
// Checks app version against Firestore minimum and blocks if outdated.

import {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {getAppVersions} from '../firebase/firestore';
import {UserRole} from '../types';

export interface ForceUpdateDetails {
  currentVersion: string;
  minVersion: string;
  storeUrl: string;
}

export interface ForceUpdateState {
  isChecking: boolean;
  needsUpdate: boolean;
  isUpdateRequired: boolean;
  currentVersion: string;
  requiredVersion: string;
  updateDetails: ForceUpdateDetails | null;
  openStore: () => void;
}

function compareVersions(current: string, minimum: string): boolean {
  if (!current || !minimum) return false;
  const currentParts = String(current).split('.').map(n => parseInt(n, 10) || 0);
  const minimumParts = String(minimum).split('.').map(n => parseInt(n, 10) || 0);

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0;
    const m = minimumParts[i] || 0;
    if (c < m) return true; // needs update
    if (c > m) return false;
  }
  return false;
}

export function useForceUpdate(
  appRoleOrOptions: UserRole | {appType: string; currentVersion?: string},
  currentVersionParam: string = '1.0.0'
): ForceUpdateState {
  const appRole =
    typeof appRoleOrOptions === 'object' && appRoleOrOptions !== null
      ? (appRoleOrOptions.appType as UserRole)
      : (appRoleOrOptions as UserRole);

  const currentVersion =
    typeof appRoleOrOptions === 'object' && appRoleOrOptions !== null && appRoleOrOptions.currentVersion
      ? appRoleOrOptions.currentVersion
      : currentVersionParam || '1.0.0';

  const [state, setState] = useState<{
    isChecking: boolean;
    needsUpdate: boolean;
    requiredVersion: string;
    updateDetails: ForceUpdateDetails | null;
  }>({
    isChecking: false,
    needsUpdate: false,
    requiredVersion: '',
    updateDetails: null,
  });

  const storeUrls: Record<string, string> = {
    student: 'https://play.google.com/store/apps/details?id=com.upskill.student',
    client: 'https://play.google.com/store/apps/details?id=com.upskill.client',
    admin: 'https://play.google.com/store/apps/details?id=com.upskill.admin',
  };

  useEffect(() => {
    let mounted = true;

    async function checkVersion() {
      try {
        const versions: any = await getAppVersions();
        if (!versions || !mounted) return;

        const roleKey = appRole || 'student';
        const roleConfig = versions[roleKey];
        const minVer = roleConfig?.minVersion || versions[`${roleKey}_min_version`];
        const storeUrl = roleConfig?.storeUrl || storeUrls[roleKey] || '';

        if (minVer && compareVersions(currentVersion, minVer)) {
          setState({
            isChecking: false,
            needsUpdate: true,
            requiredVersion: minVer,
            updateDetails: {
              currentVersion,
              minVersion: minVer,
              storeUrl,
            },
          });
        } else {
          setState({
            isChecking: false,
            needsUpdate: false,
            requiredVersion: minVer || '',
            updateDetails: null,
          });
        }
      } catch (error) {
        // Silently allow local prototype access
        if (mounted) {
          setState(prev => ({...prev, isChecking: false}));
        }
      }
    }

    checkVersion();
    return () => {
      mounted = false;
    };
  }, [appRole, currentVersion]);

  const openStore = () => {
    const url = storeUrls[appRole] || 'https://play.google.com';
    Linking.openURL(url).catch(() => {});
  };

  return {
    isChecking: state.isChecking,
    needsUpdate: state.needsUpdate,
    isUpdateRequired: state.needsUpdate,
    currentVersion,
    requiredVersion: state.requiredVersion,
    updateDetails: state.updateDetails,
    openStore,
  };
}
