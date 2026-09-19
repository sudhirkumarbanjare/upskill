# Firestore Database Schema Reference

This document is the single source of truth for all Firestore collections, fields,
sub-collections, indexes, and Firebase Storage paths used in the 5Upskill platform.

---

## Collections

### `users`
**Document ID**: Firebase Auth UID

| Field | Type | Required | Description |
|---|---|---|---|
| `uid` | `string` | ✅ | Same as doc ID |
| `phone` | `string` | ✅ | E.164 format phone number |
| `displayName` | `string` | ✅ | Full name |
| `avatarUrl` | `string` | ❌ | Firebase Storage download URL |
| `email` | `string` | ❌ | Optional contact email |
| `role` | `string` | ✅ | Enum: `student` \| `client` \| `admin` |
| `status` | `string` | ✅ | Enum: `pending` \| `active` \| `suspended` |
| `createdAt` | `Timestamp` | ✅ | Server timestamp on create |
| `updatedAt` | `Timestamp` | ✅ | Server timestamp on update |

#### Sub-collection: `users/{uid}/assessments`

| Field | Type | Required | Description |
|---|---|---|---|
| `assessmentId` | `string` | ✅ | Auto-generated doc ID |
| `answers` | `array<map>` | ✅ | `[{ questionId: string, selectedOption: number, isCorrect: boolean }]` |
| `score` | `number` | ✅ | Calculated score (0–100) |
| `recommendedRoles` | `array<string>` | ✅ | e.g. `["frontend_dev", "data_analyst"]` |
| `completedAt` | `Timestamp` | ✅ | When the assessment was completed |

#### Sub-collection: `users/{uid}/enrollments`

| Field | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | `string` | ✅ | Auto-generated doc ID |
| `courseId` | `string` | ✅ | Reference to `courses` collection |
| `progress` | `number` | ✅ | 0–100 percentage complete |
| `enrolledAt` | `Timestamp` | ✅ | Enrollment timestamp |
| `lastAccessedAt` | `Timestamp` | ✅ | Last access timestamp |

---

### `clients`
**Document ID**: Same as the user's Auth UID (1:1 relationship with `users`)

| Field | Type | Required | Description |
|---|---|---|---|
| `uid` | `string` | ✅ | Same as doc ID, links to `users` |
| `companyName` | `string` | ✅ | Company / brand name |
| `companyLogo` | `string` | ❌ | Firebase Storage URL |
| `industry` | `string` | ✅ | e.g. "Technology", "Finance" |
| `website` | `string` | ❌ | Company website URL |
| `description` | `string` | ❌ | About the company |
| `approvalStatus` | `string` | ✅ | Enum: `pending_approval` \| `approved` \| `rejected` |
| `approvedBy` | `string` | ❌ | Admin UID who approved |
| `approvedAt` | `Timestamp` | ❌ | Approval timestamp |

---

### `projects`
**Document ID**: Auto-generated

| Field | Type | Required | Description |
|---|---|---|---|
| `projectId` | `string` | ✅ | Same as doc ID |
| `clientId` | `string` | ✅ | UID of the posting client |
| `clientName` | `string` | ✅ | Denormalized company name for list views |
| `type` | `string` | ✅ | Enum: `project` \| `job` |
| `title` | `string` | ✅ | Listing title |
| `description` | `string` | ✅ | Full description |
| `requiredSkills` | `array<string>` | ✅ | Skill tags for filtering |
| `duration` | `string` | ✅ | e.g. "2 weeks", "3 months" |
| `maxSlots` | `number` | ✅ | Maximum acceptable applicants |
| `filledSlots` | `number` | ✅ | Current count — **must use transactions** |
| `status` | `string` | ✅ | Enum: `draft` \| `active` \| `closed` \| `suspended` |
| `createdAt` | `Timestamp` | ✅ | Server timestamp on create |
| `updatedAt` | `Timestamp` | ✅ | Server timestamp on update |

---

### `applications`
**Document ID**: Auto-generated

| Field | Type | Required | Description |
|---|---|---|---|
| `applicationId` | `string` | ✅ | Same as doc ID |
| `projectId` | `string` | ✅ | Reference to `projects` |
| `studentId` | `string` | ✅ | UID of the applying student |
| `studentName` | `string` | ✅ | Denormalized name |
| `status` | `string` | ✅ | Enum: `applied` \| `accepted` \| `rejected` \| `withdrawn` |
| `assessmentScore` | `number` | ❌ | Denormalized from latest assessment |
| `matchedSkills` | `array<string>` | ✅ | Skills matching project requirements |
| `appliedAt` | `Timestamp` | ✅ | Application timestamp |
| `reviewedAt` | `Timestamp` | ❌ | When client reviewed |

---

### `courses`
**Document ID**: Auto-generated

| Field | Type | Required | Description |
|---|---|---|---|
| `courseId` | `string` | ✅ | Same as doc ID |
| `title` | `string` | ✅ | Course title |
| `description` | `string` | ✅ | Course overview |
| `thumbnailUrl` | `string` | ❌ | Firebase Storage URL |
| `skillTags` | `array<string>` | ✅ | Related skills |
| `targetRoles` | `array<string>` | ✅ | Mapped job roles |
| `createdBy` | `string` | ✅ | Admin UID |
| `status` | `string` | ✅ | Enum: `draft` \| `published` |
| `createdAt` | `Timestamp` | ✅ | Server timestamp |
| `updatedAt` | `Timestamp` | ✅ | Server timestamp |

#### Sub-collection: `courses/{courseId}/modules`

| Field | Type | Required | Description |
|---|---|---|---|
| `moduleId` | `string` | ✅ | Auto-generated doc ID |
| `title` | `string` | ✅ | Module title |
| `order` | `number` | ✅ | Sort order within the course |
| `contentType` | `string` | ✅ | Enum: `video` \| `text` \| `quiz` |
| `contentUrl` | `string` | ❌ | Video URL (null for text/quiz) |
| `contentBody` | `string` | ❌ | Rich text content |
| `durationMinutes` | `number` | ✅ | Estimated time |

---

### `assessment_questions`
**Document ID**: Auto-generated

| Field | Type | Required | Description |
|---|---|---|---|
| `questionId` | `string` | ✅ | Same as doc ID |
| `category` | `string` | ✅ | e.g. "javascript", "design", "communication" |
| `questionText` | `string` | ✅ | The question text |
| `options` | `array<string>` | ✅ | Answer choices (4 options) |
| `correctOptionIndex` | `number` | ✅ | Index of correct answer (0-based) |
| `difficulty` | `string` | ✅ | Enum: `easy` \| `medium` \| `hard` |
| `roleMapping` | `array<string>` | ✅ | Job roles this question maps to |
| `createdBy` | `string` | ✅ | Admin UID |
| `createdAt` | `Timestamp` | ✅ | Server timestamp |

---

### `system_config`
**This is a collection with known, fixed document IDs.**

#### Document: `app_versions`

| Field | Type | Description |
|---|---|---|
| `student_min_version` | `string` | e.g. "1.2.0" |
| `client_min_version` | `string` | e.g. "1.1.0" |
| `admin_min_version` | `string` | e.g. "1.0.0" |
| `updatedBy` | `string` | Admin UID who last changed |
| `updatedAt` | `Timestamp` | Last update time |

#### Document: `platform_stats`

| Field | Type | Description |
|---|---|---|
| `totalStudents` | `number` | Users with `role=student` |
| `totalClients` | `number` | Users with `role=client` |
| `totalActiveProjects` | `number` | Projects with `status=active` |
| `lastUpdated` | `Timestamp` | Last recalculation time |

---

## Composite Indexes

| Collection | Fields | Order | Purpose |
|---|---|---|---|
| `projects` | `status`, `createdAt` | ASC, DESC | Browse active projects |
| `projects` | `clientId`, `createdAt` | ASC, DESC | Client's own listings |
| `projects` | `requiredSkills`, `status` | ARRAY_CONTAINS, ASC | Filter by skill |
| `applications` | `projectId`, `appliedAt` | ASC, DESC | Applicants per project |
| `applications` | `studentId`, `appliedAt` | ASC, DESC | Student's applications |
| `users` | `role`, `status`, `createdAt` | ASC, ASC, DESC | Admin moderation lists |
| `courses` | `status`, `targetRoles` | ASC, ARRAY_CONTAINS | Courses by role |
| `assessment_questions` | `category`, `difficulty` | ASC, ASC | Filter questions |

---

## Firebase Storage Paths

```
/avatars/{uid}/profile.jpg          — User profile photos (max 2MB)
/company-logos/{uid}/logo.jpg       — Company logos (max 2MB)
/courses/{courseId}/thumbnail.jpg   — Course thumbnails (max 1MB)
/courses/{courseId}/modules/{moduleId}/video.mp4  — Module videos (max 500MB)
```

### Storage Security Rules Summary
- `/avatars/{uid}/*` — only the user with matching UID can write
- `/company-logos/{uid}/*` — only the client with matching UID can write
- `/courses/**` — only users with `admin` role can write; all authenticated users can read
