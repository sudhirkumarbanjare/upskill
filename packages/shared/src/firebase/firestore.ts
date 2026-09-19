// ─── Firebase: Firestore Typed Helpers ───
// All Firestore CRUD operations go through these typed helpers.
// App code must NEVER import firestore directly.

import {firestore, COLLECTIONS, SYSTEM_DOCS, SUB_COLLECTIONS} from './config';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  User,
  Client,
  Project,
  Application,
  Course,
  CourseModule,
  AssessmentQuestion,
  Assessment,
  Enrollment,
  AppVersions,
  PlatformStats,
  CreateUserInput,
  CreateClientInput,
  CreateProjectInput,
  CreateApplicationInput,
  CreateCourseInput,
  CreateModuleInput,
  CreateQuestionInput,
  UserRole,
  UserStatus,
  ProjectStatus,
  ApplicationStatus,
  ApprovalStatus,
} from '../types';

type DocumentData = FirebaseFirestoreTypes.DocumentData;
type QuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot<DocumentData>;

// ─── Generic Helpers ───

function parseDoc<T>(doc: FirebaseFirestoreTypes.DocumentSnapshot): T | null {
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()} as T;
}

function parseDocs<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as T));
}

export function parseFirestoreError(error: any): string {
  if (error?.code === 'firestore/permission-denied') {
    return 'Action not allowed. Please check your permissions.';
  }
  if (error?.code === 'firestore/unavailable') {
    return 'Service temporarily unavailable. Please try again.';
  }
  if (error?.code === 'firestore/not-found') {
    return 'The requested data was not found.';
  }
  return 'Something went wrong. Please try again.';
}

// ─── Users ───

export async function getUser(uid: string): Promise<User | null> {
  const doc = await firestore().collection(COLLECTIONS.USERS).doc(uid).get();
  return parseDoc<User>(doc);
}

export async function createUser(data: CreateUserInput): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(data.uid)
    .set({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function updateUser(
  uid: string,
  data: Partial<Omit<User, 'uid' | 'role' | 'createdAt'>>,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function getUsersByRole(
  role: UserRole,
  status?: UserStatus,
  limit = 50,
): Promise<User[]> {
  let query = firestore()
    .collection(COLLECTIONS.USERS)
    .where('role', '==', role);

  if (status) {
    query = query.where('status', '==', status);
  }

  query = query.orderBy('createdAt', 'desc').limit(limit);
  const snapshot = await query.get();
  return parseDocs<User>(snapshot);
}

export function subscribeToUser(
  uid: string,
  callback: (user: User | null) => void,
): () => void {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .onSnapshot(doc => {
      callback(parseDoc<User>(doc));
    });
}

// ─── Clients ───

export async function getClient(uid: string): Promise<Client | null> {
  const doc = await firestore().collection(COLLECTIONS.CLIENTS).doc(uid).get();
  return parseDoc<Client>(doc);
}

export async function createClient(data: CreateClientInput): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.CLIENTS)
    .doc(data.uid)
    .set(data);
}

export async function updateClient(
  uid: string,
  data: Partial<Omit<Client, 'uid'>>,
): Promise<void> {
  await firestore().collection(COLLECTIONS.CLIENTS).doc(uid).update(data);
}

export async function approveClient(
  clientUid: string,
  adminUid: string,
): Promise<void> {
  const batch = firestore().batch();

  const clientRef = firestore().collection(COLLECTIONS.CLIENTS).doc(clientUid);
  batch.update(clientRef, {
    approvalStatus: 'approved' as ApprovalStatus,
    approvedBy: adminUid,
    approvedAt: firestore.FieldValue.serverTimestamp(),
  });

  const userRef = firestore().collection(COLLECTIONS.USERS).doc(clientUid);
  batch.update(userRef, {
    status: 'active' as UserStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
}

export async function getClientsByStatus(
  status: ApprovalStatus,
  limit = 50,
): Promise<Client[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.CLIENTS)
    .where('approvalStatus', '==', status)
    .limit(limit)
    .get();
  return parseDocs<Client>(snapshot);
}

// ─── Projects ───

export async function getProject(projectId: string): Promise<Project | null> {
  const doc = await firestore()
    .collection(COLLECTIONS.PROJECTS)
    .doc(projectId)
    .get();
  return parseDoc<Project>(doc);
}

export async function createProject(data: CreateProjectInput): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.PROJECTS)
    .add({
      ...data,
      filledSlots: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  // Store projectId inside the document for easier querying
  await docRef.update({projectId: docRef.id});
  return docRef.id;
}

export async function getActiveProjects(
  limit = 20,
  startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
): Promise<{projects: Project[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null}> {
  let query = firestore()
    .collection(COLLECTIONS.PROJECTS)
    .where('status', '==', 'active' as ProjectStatus)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (startAfterDoc) {
    query = query.startAfter(startAfterDoc);
  }

  const snapshot = await query.get();
  const projects = parseDocs<Project>(snapshot);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return {projects, lastDoc};
}

export async function getProjectsByClient(
  clientId: string,
  limit = 50,
): Promise<Project[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.PROJECTS)
    .where('clientId', '==', clientId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return parseDocs<Project>(snapshot);
}

export async function getProjectsBySkill(
  skill: string,
  limit = 20,
): Promise<Project[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.PROJECTS)
    .where('requiredSkills', 'array-contains', skill)
    .where('status', '==', 'active' as ProjectStatus)
    .limit(limit)
    .get();
  return parseDocs<Project>(snapshot);
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.PROJECTS)
    .doc(projectId)
    .update({
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

// ─── Applications (with transaction for slot management) ───

export async function applyToProject(
  data: CreateApplicationInput,
): Promise<string> {
  const projectRef = firestore()
    .collection(COLLECTIONS.PROJECTS)
    .doc(data.projectId);

  return firestore().runTransaction(async transaction => {
    const projectDoc = await transaction.get(projectRef);
    const project = projectDoc.data() as Project;

    if (!project) throw new Error('Project not found');
    if (project.status !== 'active') throw new Error('Project is no longer active');
    if (project.filledSlots >= project.maxSlots) throw new Error('No slots available');

    const appRef = firestore().collection(COLLECTIONS.APPLICATIONS).doc();

    transaction.set(appRef, {
      ...data,
      applicationId: appRef.id,
      status: 'applied',
      appliedAt: firestore.FieldValue.serverTimestamp(),
    });

    // Don't increment filledSlots on apply — only on accept
    return appRef.id;
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  projectId: string,
): Promise<void> {
  if (status === 'accepted') {
    // Use transaction to safely increment filledSlots
    const projectRef = firestore()
      .collection(COLLECTIONS.PROJECTS)
      .doc(projectId);
    const appRef = firestore()
      .collection(COLLECTIONS.APPLICATIONS)
      .doc(applicationId);

    await firestore().runTransaction(async transaction => {
      const projectDoc = await transaction.get(projectRef);
      const project = projectDoc.data() as Project;

      if (project.filledSlots >= project.maxSlots) {
        throw new Error('No slots available');
      }

      transaction.update(appRef, {
        status,
        reviewedAt: firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(projectRef, {
        filledSlots: firestore.FieldValue.increment(1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  } else {
    await firestore()
      .collection(COLLECTIONS.APPLICATIONS)
      .doc(applicationId)
      .update({
        status,
        reviewedAt: firestore.FieldValue.serverTimestamp(),
      });
  }
}

export async function getApplicationsByProject(
  projectId: string,
  limit = 50,
): Promise<Application[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.APPLICATIONS)
    .where('projectId', '==', projectId)
    .orderBy('appliedAt', 'desc')
    .limit(limit)
    .get();
  return parseDocs<Application>(snapshot);
}

export async function getApplicationsByStudent(
  studentId: string,
  limit = 50,
): Promise<Application[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.APPLICATIONS)
    .where('studentId', '==', studentId)
    .orderBy('appliedAt', 'desc')
    .limit(limit)
    .get();
  return parseDocs<Application>(snapshot);
}

// ─── Courses ───

export async function getCourses(
  status: 'published' | 'draft' = 'published',
  limit = 20,
): Promise<Course[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.COURSES)
    .where('status', '==', status)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return parseDocs<Course>(snapshot);
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const doc = await firestore()
    .collection(COLLECTIONS.COURSES)
    .doc(courseId)
    .get();
  return parseDoc<Course>(doc);
}

export async function getCoursesByRole(
  role: string,
  limit = 20,
): Promise<Course[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.COURSES)
    .where('targetRoles', 'array-contains', role)
    .where('status', '==', 'published')
    .limit(limit)
    .get();
  return parseDocs<Course>(snapshot);
}

export async function createCourse(data: CreateCourseInput): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.COURSES)
    .add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  await docRef.update({courseId: docRef.id});
  return docRef.id;
}

export async function updateCourse(
  courseId: string,
  data: Partial<Omit<Course, 'courseId' | 'createdAt'>>,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.COURSES)
    .doc(courseId)
    .update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.COURSES)
    .doc(courseId)
    .collection(SUB_COLLECTIONS.MODULES)
    .orderBy('order', 'asc')
    .get();
  return parseDocs<CourseModule>(snapshot);
}

export async function createModule(
  courseId: string,
  data: CreateModuleInput,
): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.COURSES)
    .doc(courseId)
    .collection(SUB_COLLECTIONS.MODULES)
    .add({...data});
  await docRef.update({moduleId: docRef.id});
  return docRef.id;
}

// ─── Assessments ───

export async function getAssessmentQuestions(
  category?: string,
  limit = 50,
): Promise<AssessmentQuestion[]> {
  let query = firestore()
    .collection(COLLECTIONS.ASSESSMENT_QUESTIONS) as FirebaseFirestoreTypes.Query;

  if (category) {
    query = query.where('category', '==', category);
  }

  const snapshot = await query.limit(limit).get();
  return parseDocs<AssessmentQuestion>(snapshot);
}

export async function createQuestion(data: CreateQuestionInput): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.ASSESSMENT_QUESTIONS)
    .add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  await docRef.update({questionId: docRef.id});
  return docRef.id;
}

export async function updateQuestion(
  questionId: string,
  data: Partial<Omit<AssessmentQuestion, 'questionId' | 'createdAt'>>,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.ASSESSMENT_QUESTIONS)
    .doc(questionId)
    .update(data);
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.ASSESSMENT_QUESTIONS)
    .doc(questionId)
    .delete();
}

export async function saveAssessment(
  uid: string,
  assessment: Omit<Assessment, 'assessmentId' | 'completedAt'>,
): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(SUB_COLLECTIONS.ASSESSMENTS)
    .add({
      ...assessment,
      completedAt: firestore.FieldValue.serverTimestamp(),
    });
  await docRef.update({assessmentId: docRef.id});
  return docRef.id;
}

export async function getAssessments(uid: string): Promise<Assessment[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(SUB_COLLECTIONS.ASSESSMENTS)
    .orderBy('completedAt', 'desc')
    .get();
  return parseDocs<Assessment>(snapshot);
}

// ─── Enrollments ───

export async function enrollInCourse(
  uid: string,
  courseId: string,
): Promise<string> {
  const docRef = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(SUB_COLLECTIONS.ENROLLMENTS)
    .add({
      courseId,
      progress: 0,
      enrolledAt: firestore.FieldValue.serverTimestamp(),
      lastAccessedAt: firestore.FieldValue.serverTimestamp(),
    });
  await docRef.update({enrollmentId: docRef.id});
  return docRef.id;
}

export async function getEnrollments(uid: string): Promise<Enrollment[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(SUB_COLLECTIONS.ENROLLMENTS)
    .orderBy('enrolledAt', 'desc')
    .get();
  return parseDocs<Enrollment>(snapshot);
}

export async function updateEnrollmentProgress(
  uid: string,
  enrollmentId: string,
  progress: number,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(SUB_COLLECTIONS.ENROLLMENTS)
    .doc(enrollmentId)
    .update({
      progress,
      lastAccessedAt: firestore.FieldValue.serverTimestamp(),
    });
}

// ─── System Config ───

export async function getAppVersions(): Promise<AppVersions | null> {
  const doc = await firestore()
    .collection(COLLECTIONS.SYSTEM_CONFIG)
    .doc(SYSTEM_DOCS.APP_VERSIONS)
    .get();
  return parseDoc<AppVersions>(doc);
}

export async function updateAppVersions(
  data: Partial<Pick<AppVersions, 'student_min_version' | 'client_min_version' | 'admin_min_version'>>,
  adminUid: string,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.SYSTEM_CONFIG)
    .doc(SYSTEM_DOCS.APP_VERSIONS)
    .set(
      {
        ...data,
        updatedBy: adminUid,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
}

export async function getPlatformStats(): Promise<PlatformStats | null> {
  const doc = await firestore()
    .collection(COLLECTIONS.SYSTEM_CONFIG)
    .doc(SYSTEM_DOCS.PLATFORM_STATS)
    .get();
  return parseDoc<PlatformStats>(doc);
}

// ─── Admin: User Moderation ───

export async function suspendUser(uid: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .update({
      status: 'suspended' as UserStatus,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function activateUser(uid: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .update({
      status: 'active' as UserStatus,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function deleteUserData(uid: string): Promise<void> {
  const batch = firestore().batch();
  batch.delete(firestore().collection(COLLECTIONS.USERS).doc(uid));

  // Also delete client profile if exists
  const clientDoc = await firestore().collection(COLLECTIONS.CLIENTS).doc(uid).get();
  if (clientDoc.exists) {
    batch.delete(clientDoc.ref);
  }

  await batch.commit();
}
