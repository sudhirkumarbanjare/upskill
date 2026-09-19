// ─── Firebase: Configuration & Initialization ───
// This module handles Firebase app initialization and Firestore settings.
// All apps import from here — never directly from @react-native-firebase.

import {NativeModules} from 'react-native';

let firebase: any = null;
let firestore: any = null;
let auth: any = null;
let storage: any = null;

const hasRNFB = !!NativeModules.RNFBAppModule;

if (hasRNFB) {
  try {
    firebase = require('@react-native-firebase/app').default;
    firestore = require('@react-native-firebase/firestore').default;
    auth = require('@react-native-firebase/auth').default;
    storage = require('@react-native-firebase/storage').default;

    // Enable Firestore offline persistence
    firestore().settings({
      persistence: true,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    });
  } catch (e) {
    console.warn('Firebase initialization error:', e);
  }
} else {
  // Safe mock functions so callers get clean promises / no crash
  const mockQuery: any = () => ({
    get: async () => ({ docs: [], empty: true, exists: false, data: () => ({}) }),
    set: async () => {},
    update: async () => {},
    delete: async () => {},
    onSnapshot: (cb: any) => { cb({ docs: [], empty: true, exists: false, id: 'demo' }); return () => {}; },
    where: () => mockQuery(),
    orderBy: () => mockQuery(),
    limit: () => mockQuery(),
    doc: () => mockQuery(),
    collection: () => mockQuery(),
    runTransaction: async (updateFn: any) => {
      try {
        await updateFn({
          get: async () => ({ data: () => ({ filledSlots: 0, maxSlots: 5, totalSlots: 5 }), exists: true }),
          update: async () => {},
          set: async () => {},
          delete: async () => {},
        });
      } catch (e) {
        console.warn('mock runTransaction error', e);
      }
    },
  });

  firestore = () => mockQuery();
  firestore.FieldValue = {
    serverTimestamp: () => new Date().toISOString(),
    increment: (n: number) => n,
    arrayUnion: (...items: any[]) => items,
    arrayRemove: (...items: any[]) => items,
  };
  firestore.CACHE_SIZE_UNLIMITED = -1;

  auth = () => ({
    currentUser: null,
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    signInWithPhoneNumber: async () => ({ confirm: async () => ({ user: { uid: 'demo-user' } }) }),
    signOut: async () => {},
  });

  storage = () => ({
    ref: () => ({
      putFile: () => ({ on: () => {}, then: (cb: any) => cb() }),
      getDownloadURL: async () => 'https://via.placeholder.com/150',
      fullPath: 'demo/path',
    }),
  });

  firebase = { apps: [] };
}

export {firebase, firestore, auth, storage};

// Collection references (typed paths)
export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  APPLICATIONS: 'applications',
  COURSES: 'courses',
  ASSESSMENT_QUESTIONS: 'assessment_questions',
  SYSTEM_CONFIG: 'system_config',
} as const;

export const SYSTEM_DOCS = {
  APP_VERSIONS: 'app_versions',
  PLATFORM_STATS: 'platform_stats',
} as const;

export const SUB_COLLECTIONS = {
  ASSESSMENTS: 'assessments',
  ENROLLMENTS: 'enrollments',
  MODULES: 'modules',
} as const;
