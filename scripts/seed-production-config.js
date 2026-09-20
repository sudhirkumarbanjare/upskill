/**
 * 5Upskill — Production Firestore Initializer & Seed Script
 * 
 * Usage:
 *   node scripts/seed-production-config.js
 * 
 * Prerequisites:
 *   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
try {
  initializeApp();
} catch (e) {
  console.log('Using default or environment credentials...');
}

const db = getFirestore();

async function seedSystemConfig() {
  console.log('🚀 Initializing Firestore system_config/app_versions...');

  const appVersionsData = {
    student: {
      minVersion: '1.0.0',
      latestVersion: '1.0.0',
      forceUpdate: false,
      storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.student',
      releaseNotes: 'Initial production release of 5Upskill Student App.',
      updatedAt: new Date().toISOString(),
    },
    client: {
      minVersion: '1.0.0',
      latestVersion: '1.0.0',
      forceUpdate: false,
      storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.client',
      releaseNotes: 'Initial production release of 5Upskill Client App.',
      updatedAt: new Date().toISOString(),
    },
    admin: {
      minVersion: '1.0.0',
      latestVersion: '1.0.0',
      forceUpdate: false,
      storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.admin',
      releaseNotes: 'Initial production release of 5Upskill Admin Console.',
      updatedAt: new Date().toISOString(),
    },
  };

  await db.collection('system_config').doc('app_versions').set(appVersionsData, { merge: true });
  console.log('✅ system_config/app_versions configured successfully.');

  console.log('📚 Seeding default masterclass curriculum catalog...');
  const masterclasses = [
    {
      id: 'course-rn-mastery',
      title: 'Advanced React Native & Reanimated 3 Masterclass',
      category: 'Mobile Development',
      instructor: 'Alex Rivera (Lead Architect)',
      duration: '18 hours',
      level: 'Advanced',
      rating: 4.9,
      studentsCount: 640,
      description: 'Master high-performance mobile animations, gesture handling, and 60 FPS UI patterns.',
      skillsCovered: ['React Native', 'Reanimated 3', 'TypeScript', 'Gesture Handler'],
      modulesCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course-serverless-firebase',
      title: 'Serverless Fullstack with Firebase & Firestore',
      category: 'Backend Architecture',
      instructor: 'Sarah Chen (Google Developer Expert)',
      duration: '22 hours',
      level: 'Intermediate',
      rating: 4.8,
      studentsCount: 920,
      description: 'Build scalable backends using Firestore rules, atomic transactions, and storage security.',
      skillsCovered: ['Firestore', 'Firebase Auth', 'Cloud Functions', 'Security Rules'],
      modulesCount: 6,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const course of masterclasses) {
    await db.collection('courses').doc(course.id).set(course, { merge: true });
    console.log(`  + Seeded course: ${course.title}`);
  }

  console.log('🎉 Production Firestore seeding complete!');
}

seedSystemConfig().catch(err => {
  console.error('❌ Error during Firestore seeding:', err);
  process.exit(1);
});
