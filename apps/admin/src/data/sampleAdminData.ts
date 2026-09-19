// ─── Admin App Sample Data ───
// Seed data for platform KPI stats, pending company approvals, user moderation, and version control.

import {UserProfile, AppVersions, PlatformStats} from '@upskill/shared';

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalUsers: 1482,
  totalStudents: 1320,
  totalClients: 160,
  totalProjects: 48,
  activeProjects: 34,
  totalApplications: 620,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_APP_VERSIONS: AppVersions = {
  student: {
    minVersion: '1.0.0',
    currentVersion: '1.2.0',
    forceUpdate: false,
    storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.student',
  },
  client: {
    minVersion: '1.0.0',
    currentVersion: '1.1.0',
    forceUpdate: false,
    storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.client',
  },
  admin: {
    minVersion: '1.0.0',
    currentVersion: '1.0.0',
    forceUpdate: false,
    storeUrl: 'https://play.google.com/store/apps/details?id=com.upskill.admin',
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'admin_master',
};

export const PENDING_CLIENT_APPROVALS: UserProfile[] = [
  {
    uid: 'client-pending-001',
    phone: '+919811223344',
    displayName: 'Rajesh Singhania',
    companyName: 'Quantum AI Robotics Ltd',
    email: 'rajesh@quantumai.dev',
    role: 'client',
    clientStatus: 'pending',
    isSuspended: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'client-pending-002',
    phone: '+919877665544',
    displayName: 'Ananya Deshmukh',
    companyName: 'HyperScale Cloud Networks',
    email: 'ananya@hyperscale.cloud',
    role: 'client',
    clientStatus: 'pending',
    isSuspended: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const ALL_PLATFORM_USERS: UserProfile[] = [
  {
    uid: 'user-000',
    phone: '+919900000001',
    displayName: 'Devendra Kumar (Root)',
    email: 'devendra@5upskill.com',
    role: 'superadmin',
    isSuspended: false,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-staff-001',
    phone: '+919900000002',
    displayName: 'Neha Verma (Moderator)',
    email: 'neha.moderation@5upskill.com',
    role: 'staff',
    isSuspended: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-001',
    phone: '+919876543210',
    displayName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'student',
    isSuspended: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-002',
    phone: '+919812345678',
    displayName: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'student',
    isSuspended: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-003',
    phone: '+919988776655',
    displayName: 'Vikram Mehta',
    companyName: 'Apex Financial Technologies',
    email: 'vikram.m@apexfintech.io',
    role: 'client',
    clientStatus: 'approved',
    isSuspended: false,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-004',
    phone: '+919999000011',
    displayName: 'Spammer Test Account',
    email: 'spam@badactor.net',
    role: 'student',
    isSuspended: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
