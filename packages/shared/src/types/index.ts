// ─── 5Upskill Shared Types ───
// Single source of truth for all TypeScript interfaces across all three apps.

import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

type Timestamp = FirebaseFirestoreTypes.Timestamp;

// ─── Enums ───

export type UserRole = 'student' | 'client' | 'staff' | 'admin' | 'superadmin';
export type UserStatus = 'pending' | 'active' | 'suspended';
export type ApprovalStatus = 'pending_approval' | 'approved' | 'rejected';
export type ProjectType = 'project' | 'job';
export type ProjectStatus = 'draft' | 'active' | 'closed' | 'suspended';
export type ApplicationStatus = 'applied' | 'accepted' | 'rejected' | 'withdrawn';
export type ContentType = 'video' | 'text' | 'quiz';
export type CourseStatus = 'draft' | 'published';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ─── Core Models ───

export interface User {
  uid: string;
  phone: string;
  displayName: string;
  avatarUrl?: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  avatarUrl?: string;
  email?: string;
  role: UserRole;
  status?: UserStatus;
  companyName?: string;
  clientStatus?: string;
  isSuspended?: boolean;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}


export interface Client {
  uid: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  website?: string;
  description?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Timestamp;
}

export interface Project {
  projectId: string;
  clientId: string;
  clientName: string;
  type: ProjectType;
  title: string;
  description: string;
  requiredSkills: string[];
  duration: string;
  maxSlots: number;
  filledSlots: number;
  status: ProjectStatus;
  coverImage?: string;
  mediaUrls?: string[];
  videoUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Application {
  applicationId: string;
  projectId: string;
  studentId: string;
  studentName: string;
  status: ApplicationStatus;
  assessmentScore?: number;
  matchedSkills: string[];
  appliedAt: Timestamp;
  reviewedAt?: Timestamp;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  skillTags: string[];
  targetRoles: string[];
  createdBy: string;
  status: CourseStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CourseModule {
  moduleId: string;
  title: string;
  order: number;
  contentType: ContentType;
  contentUrl?: string;
  contentBody?: string;
  durationMinutes: number;
}

export interface AssessmentQuestion {
  questionId: string;
  category: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: Difficulty;
  roleMapping: string[];
  createdBy: string;
  createdAt: Timestamp;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

export interface Assessment {
  assessmentId: string;
  answers: AssessmentAnswer[];
  score: number;
  recommendedRoles: string[];
  completedAt: Timestamp;
}

export interface Enrollment {
  enrollmentId: string;
  courseId: string;
  progress: number;
  enrolledAt: Timestamp;
  lastAccessedAt: Timestamp;
}

export interface AppVersions {
  student_min_version: string;
  client_min_version: string;
  admin_min_version: string;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface PlatformStats {
  totalStudents: number;
  totalClients: number;
  totalActiveProjects: number;
  lastUpdated: Timestamp;
}

// ─── Form / Input types (without timestamps, for creation) ───

export type CreateUserInput = Omit<User, 'createdAt' | 'updatedAt'>;
export type CreateClientInput = Omit<Client, 'approvedBy' | 'approvedAt'>;
export type CreateProjectInput = Omit<Project, 'projectId' | 'filledSlots' | 'createdAt' | 'updatedAt'>;
export type CreateApplicationInput = Omit<Application, 'applicationId' | 'appliedAt' | 'reviewedAt'>;
export type CreateCourseInput = Omit<Course, 'courseId' | 'createdAt' | 'updatedAt'>;
export type CreateModuleInput = Omit<CourseModule, 'moduleId'>;
export type CreateQuestionInput = Omit<AssessmentQuestion, 'questionId' | 'createdAt'>;

// ─── Navigation param types ───

export type AuthStackParamList = {
  PhoneAuth: undefined;
  OTPVerification: {verificationId: string; phoneNumber: string};
};

export type StudentOnboardingParamList = {
  CreateProfile: undefined;
  CareerAssessment: undefined;
  AssessmentResults: {assessmentId: string};
};

export type StudentTabParamList = {
  HomeTab: undefined;
  ProjectsTab: undefined;
  ProfileTab: undefined;
};

export type StudentStackParamList = {
  CourseHub: undefined;
  CourseDetail: {courseId: string};
  ModuleViewer: {courseId: string; moduleId: string};
  ProjectList: undefined;
  ProjectDetail: {projectId: string};
  Profile: undefined;
  AssessmentResults: {assessmentId: string};
};

export type ClientTabParamList = {
  DashboardTab: undefined;
  CreateTab: undefined;
  ApplicantsTab: undefined;
  ProfileTab: undefined;
};

export type ClientStackParamList = {
  Dashboard: undefined;
  CreateListing: undefined;
  ApplicantList: {projectId: string};
  StudentProfile: {studentId: string};
  CompanyProfile: undefined;
  PendingApproval: undefined;
};

export type AdminTabParamList = {
  DashboardTab: undefined;
  UsersTab: undefined;
  ContentTab: undefined;
  SettingsTab: undefined;
};

export type AdminStackParamList = {
  PlatformDashboard: undefined;
  UserList: {role?: UserRole};
  UserDetail: {uid: string};
  ContentManagement: undefined;
  AssessmentQuestions: undefined;
  QuestionEditor: {questionId?: string};
  Courses: undefined;
  CourseEditor: {courseId?: string};
  VersionControl: undefined;
};
