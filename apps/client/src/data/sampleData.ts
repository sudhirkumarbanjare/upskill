// ─── Client App Sample Data ───
// Seed data for client company profile, listings, and applicants

import {Project, Application} from '@upskill/shared';

export interface ApplicantWithCandidate extends Application {
  candidateName: string;
  candidateAvatar?: string;
  candidatePhone: string;
  candidateEmail: string;
  assessmentMatchScore: number;
  candidateSkills: string[];
}

export const SAMPLE_CLIENT_PROJECTS: Project[] = [
  {
    id: 'proj-fintech-dash',
    clientId: 'client-fintech-corp',
    clientName: 'Apex Financial Technologies',
    clientLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    title: 'React Native Crypto & Portfolio Mobile Dashboard',
    description:
      'Build a high-performance, dark-mode real-time asset dashboard with interactive candlestick charts and biometric lock.',
    requirements: [
      'Strong proficiency in TypeScript and React Native',
      'Experience with SVG charting libraries',
      'Commitment of 15-20 hours per week for 6 weeks',
    ],
    skills: ['React Native', 'TypeScript', 'Charts', 'Dark Mode'],
    stipend: '₹25,000 / month',
    duration: '6 Weeks',
    totalSlots: 3,
    filledSlots: 1,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-algo-trading',
    clientId: 'client-fintech-corp',
    clientName: 'Apex Financial Technologies',
    clientLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    title: 'High-Frequency Order Book Visualizer',
    description:
      'Develop a canvas/Skia real-time order depth chart rendering 50 updates per second with zero garbage collection spikes.',
    requirements: [
      'Understanding of WebSockets and buffer queues',
      'High-performance Android UI rendering',
    ],
    skills: ['React Native', 'Skia', 'WebSockets', 'Perf Tuning'],
    stipend: '₹35,000 / month',
    duration: '8 Weeks',
    totalSlots: 2,
    filledSlots: 0,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SAMPLE_APPLICANTS: ApplicantWithCandidate[] = [
  {
    id: 'app-001',
    projectId: 'proj-fintech-dash',
    studentId: 'student-aarav-01',
    clientId: 'client-fintech-corp',
    candidateName: 'Aarav Sharma',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    candidatePhone: '+919876543210',
    candidateEmail: 'aarav.sharma@example.com',
    assessmentMatchScore: 94,
    candidateSkills: ['React Native', 'TypeScript', 'Reanimated 3', 'Firebase'],
    status: 'applied',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'app-002',
    projectId: 'proj-fintech-dash',
    studentId: 'student-priya-02',
    clientId: 'client-fintech-corp',
    candidateName: 'Priya Patel',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    candidatePhone: '+919812345678',
    candidateEmail: 'priya.patel@example.com',
    assessmentMatchScore: 88,
    candidateSkills: ['React Native', 'Redux', 'UI Testing'],
    status: 'applied',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'app-003',
    projectId: 'proj-fintech-dash',
    studentId: 'student-rohan-03',
    clientId: 'client-fintech-corp',
    candidateName: 'Rohan Verma',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    candidatePhone: '+919898989898',
    candidateEmail: 'rohan.v@example.com',
    assessmentMatchScore: 91,
    candidateSkills: ['TypeScript', 'Node.js', 'Firestore', 'Android'],
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
