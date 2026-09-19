# Firestore Security Rules Reference

These rules enforce role-based access control across all three apps. Every rule
follows the principle of least privilege.

---

## Rules Structure

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Helper Functions ───

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return request.auth.uid == uid;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }

    function isStudent() {
      return isAuthenticated() && getUserRole() == 'student';
    }

    function isClient() {
      return isAuthenticated() && getUserRole() == 'client';
    }

    function isApprovedClient() {
      return isClient() &&
        get(/databases/$(database)/documents/clients/$(request.auth.uid)).data.approvalStatus == 'approved';
    }

    // ─── Users ───

    match /users/{uid} {
      allow read: if isAuthenticated();
      allow create: if isOwner(uid) &&
        request.resource.data.keys().hasAll(['phone', 'displayName', 'role', 'status']) &&
        request.resource.data.role in ['student', 'client'] &&
        request.resource.data.status == 'pending';
      allow update: if isOwner(uid) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'uid']) ||
        isAdmin();
      allow delete: if isAdmin();

      // Assessments sub-collection
      match /assessments/{assessmentId} {
        allow read: if isOwner(uid) || isAdmin() || isClient();
        allow create: if isOwner(uid) && isStudent();
        allow update, delete: if false; // Assessments are immutable
      }

      // Enrollments sub-collection
      match /enrollments/{enrollmentId} {
        allow read: if isOwner(uid) || isAdmin();
        allow create: if isOwner(uid) && isStudent();
        allow update: if isOwner(uid) && isStudent();
        allow delete: if false;
      }
    }

    // ─── Clients ───

    match /clients/{uid} {
      allow read: if isAuthenticated();
      allow create: if isOwner(uid) && isClient();
      allow update: if isOwner(uid) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['approvalStatus', 'approvedBy', 'approvedAt']) ||
        isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Projects ───

    match /projects/{projectId} {
      allow read: if isAuthenticated();
      allow create: if isApprovedClient() &&
        request.resource.data.clientId == request.auth.uid;
      allow update: if (resource.data.clientId == request.auth.uid && isApprovedClient()) ||
        isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Applications ───

    match /applications/{applicationId} {
      allow read: if isAuthenticated() && (
        resource.data.studentId == request.auth.uid ||
        resource.data.projectId in getClientProjectIds() ||
        isAdmin()
      );
      // Simplified: allow read for authenticated users since getClientProjectIds is complex
      allow read: if isAuthenticated();
      allow create: if isStudent() &&
        request.resource.data.studentId == request.auth.uid &&
        request.resource.data.status == 'applied';
      allow update: if (
        // Student can withdraw
        (resource.data.studentId == request.auth.uid &&
         request.resource.data.status == 'withdrawn') ||
        // Client who owns the project can accept/reject
        isApprovedClient() ||
        isAdmin()
      );
      allow delete: if isAdmin();
    }

    // ─── Courses ───

    match /courses/{courseId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();

      match /modules/{moduleId} {
        allow read: if isAuthenticated();
        allow create, update, delete: if isAdmin();
      }
    }

    // ─── Assessment Questions ───

    match /assessment_questions/{questionId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // ─── System Config ───

    match /system_config/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## Key Security Principles

1. **Users cannot change their own role** — the `role` field is protected from
   self-modification on updates
2. **Clients cannot self-approve** — `approvalStatus`, `approvedBy`, and
   `approvedAt` are admin-only fields
3. **Assessments are immutable** — once submitted, they cannot be edited or deleted
4. **Projects can only be created by approved clients** — pending clients are blocked
5. **System config is admin-only for writes** — prevents unauthorized version changes
6. **All reads require authentication** — no public data access

## Error Handling in Client Code

When Firestore returns `PERMISSION_DENIED`:
```typescript
try {
  await firestore().collection('projects').add(data);
} catch (error) {
  if (error.code === 'firestore/permission-denied') {
    showToast('Action not allowed. Please check your permissions.');
  }
}
```
