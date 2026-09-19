// ─── Student App Sample Data ───
// Seed data for assessment quiz, courses, and projects

import {Course, Project, AssessmentQuestion} from '@upskill/shared';

export const SAMPLE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'When designing a mobile app feature, what interests you most?',
    category: 'architecture',
    options: [
      {
        id: 'opt_fe',
        text: 'Crafting pixel-perfect animations, gestures, and fluid UI layouts',
        domain: 'Frontend / Mobile',
        points: 10,
      },
      {
        id: 'opt_be',
        text: 'Designing scalable APIs, database indexes, and serverless pipelines',
        domain: 'Backend / Cloud',
        points: 10,
      },
      {
        id: 'opt_ai',
        text: 'Integrating machine learning models, vector search, and LLM reasoning',
        domain: 'AI / Data Science',
        points: 10,
      },
      {
        id: 'opt_ux',
        text: 'User research, wireframing, color psychology, and design systems',
        domain: 'UI / UX Design',
        points: 10,
      },
    ],
  },
  {
    id: 'q2',
    question: 'How do you prefer to approach a complex technical problem?',
    category: 'problem_solving',
    options: [
      {
        id: 'opt2_be',
        text: 'Model the relational schema and concurrency transactions first',
        domain: 'Backend / Cloud',
        points: 10,
      },
      {
        id: 'opt2_fe',
        text: 'Build an interactive prototype to test the user interaction loop',
        domain: 'Frontend / Mobile',
        points: 10,
      },
      {
        id: 'opt2_ai',
        text: 'Analyze the statistical dataset and evaluate model precision/recall',
        domain: 'AI / Data Science',
        points: 10,
      },
      {
        id: 'opt2_ux',
        text: 'Map the user journey and remove cognitive friction points',
        domain: 'UI / UX Design',
        points: 10,
      },
    ],
  },
  {
    id: 'q3',
    question: 'Which tool or technology excites you the most?',
    category: 'tech_preference',
    options: [
      {
        id: 'opt3_fe',
        text: 'React Native, Reanimated 3, TypeScript & Skia graphics',
        domain: 'Frontend / Mobile',
        points: 10,
      },
      {
        id: 'opt3_be',
        text: 'Cloud Firestore, Firebase Security Rules & Node.js Microservices',
        domain: 'Backend / Cloud',
        points: 10,
      },
      {
        id: 'opt3_ai',
        text: 'Gemini API, LangChain, embeddings, and generative AI pipelines',
        domain: 'AI / Data Science',
        points: 10,
      },
      {
        id: 'opt3_ux',
        text: 'Figma, design tokens, micro-interactions & accessibility audits',
        domain: 'UI / UX Design',
        points: 10,
      },
    ],
  },
  {
    id: 'q4',
    question: 'What is your dream project to ship this quarter?',
    category: 'aspiration',
    options: [
      {
        id: 'opt4_fe',
        text: 'A lightning-fast cross-platform Android app with 60fps animations',
        domain: 'Frontend / Mobile',
        points: 10,
      },
      {
        id: 'opt4_be',
        text: 'A resilient multi-tenant backend handling 100k concurrent requests',
        domain: 'Backend / Cloud',
        points: 10,
      },
      {
        id: 'opt4_ai',
        text: 'An autonomous agent workflow that automates developer workflows',
        domain: 'AI / Data Science',
        points: 10,
      },
      {
        id: 'opt4_ux',
        text: 'A world-class design system adopted across millions of active users',
        domain: 'UI / UX Design',
        points: 10,
      },
    ],
  },
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-rn-reanimated',
    title: 'Advanced React Native & Reanimated 3 Masterclass',
    description:
      'Master high-performance mobile animations, gesture handling, Skia visual effects, and 60 FPS UI patterns for Android.',
    category: 'Mobile',
    level: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    totalHours: 18,
    modulesCount: 5,
    skills: ['React Native', 'Reanimated', 'Gestures', 'TypeScript', 'Android UI'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      {
        id: 'mod-1',
        title: 'Core Animation Mechanics & Shared Values',
        description: 'Understand worklets, useSharedValue, and useAnimatedStyle',
        durationMinutes: 45,
        order: 1,
      },
      {
        id: 'mod-2',
        title: 'Gesture Handlers: Pan, Pinch, and Decay',
        description: 'Building gesture-driven carousels and bottom sheet sheets',
        durationMinutes: 60,
        order: 2,
      },
      {
        id: 'mod-3',
        title: 'Layout Animations & Shared Element Transitions',
        description: 'Smooth screen transitions without frame drops',
        durationMinutes: 50,
        order: 3,
      },
      {
        id: 'mod-4',
        title: 'Skeleton Loaders & Shimmer Performance',
        description: 'Eliminating jarring spinners with continuous gradient shimmers',
        durationMinutes: 40,
        order: 4,
      },
      {
        id: 'mod-5',
        title: 'Production Android Performance Tuning',
        description: 'Memory profiling, Hermes bytecode, and frame rate optimization',
        durationMinutes: 65,
        order: 5,
      },
    ],
  },
  {
    id: 'course-firebase-serverless',
    title: 'Serverless Fullstack with Firebase & Firestore',
    description:
      'Build zero-maintenance scalable backends using Firestore rules, atomic transactions, phone authentication, and storage security.',
    category: 'Backend',
    level: 'advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    totalHours: 22,
    modulesCount: 6,
    skills: ['Firebase Auth', 'Cloud Firestore', 'Security Rules', 'Transactions'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      {
        id: 'mod-f1',
        title: 'Firestore Data Modeling & Compound Indexes',
        description: 'Subcollections vs root collections and query optimization',
        durationMinutes: 50,
        order: 1,
      },
      {
        id: 'mod-f2',
        title: 'Bulletproof Security Rules Architecture',
        description: 'Role-based access control, schema validation, and privilege checks',
        durationMinutes: 75,
        order: 2,
      },
      {
        id: 'mod-f3',
        title: 'Atomic Transactions & Race Condition Defense',
        description: 'Guarding inventory and slot bookings with runTransaction()',
        durationMinutes: 60,
        order: 3,
      },
    ],
  },
  {
    id: 'course-ai-agents',
    title: 'Generative AI & Multimodal Agent Engineering',
    description:
      'Integrate the Google Gemini SDK, function calling, tool use, streaming tokens, and contextual memory into mobile apps.',
    category: 'AI / ML',
    level: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
    totalHours: 15,
    modulesCount: 4,
    skills: ['Gemini API', 'Prompt Engineering', 'Structured JSON', 'Agents'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SAMPLE_PROJECTS: Project[] = [
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
    id: 'proj-edtech-ai',
    clientId: 'client-edtech-inc',
    clientName: 'EduVerse Learning Platform',
    clientLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    title: 'Adaptive Learning Quiz Engine with Gemini Integration',
    description:
      'Develop an offline-first mobile quiz component that connects to the Gemini API to provide step-by-step hints and automated grading.',
    requirements: [
      'Experience with Firebase Firestore and local caching',
      'Knowledge of REST APIs and prompt engineering',
      'Passionate about interactive education',
    ],
    skills: ['Firebase', 'Gemini API', 'Offline Persistence', 'State Mgmt'],
    stipend: '₹30,000 / month',
    duration: '8 Weeks',
    totalSlots: 2,
    filledSlots: 0,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-marketplace-admin',
    clientId: 'client-market-ltd',
    clientName: 'Novastack Logistics',
    clientLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400',
    title: 'Fleet Tracking & Driver Android App',
    description:
      'Create a GPS location tracker and order dispatch interface with foreground service integration and instant push alerts.',
    requirements: [
      'Experience with Android location APIs and maps',
      'Sound understanding of battery optimization and background tasks',
    ],
    skills: ['Android', 'Maps API', 'Background Tasks', 'Kotlin/RN'],
    stipend: '₹35,000 / month',
    duration: '10 Weeks',
    totalSlots: 2,
    filledSlots: 2,
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
