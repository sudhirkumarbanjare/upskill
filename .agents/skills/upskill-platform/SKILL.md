---
name: upskill-platform
description: >-
  Core skill for building and maintaining the 5Upskill multi-sided marketplace
  platform. Use this skill when working on any of the three apps (Student,
  Client, Admin), the shared package, Firestore schema, security rules, or
  Firebase configuration. Provides the authoritative database schema, UI
  conventions, monorepo structure, and coding standards for the project.
---

# 5Upskill Platform Development Skill

This skill provides the canonical reference for building the 5Upskill platform —
a React Native monorepo consisting of three Android apps sharing a single
Firebase backend.

## Architecture Overview

- **Monorepo**: Yarn workspaces with three apps + one shared package
- **Apps**: `apps/student`, `apps/client`, `apps/admin`
- **Shared**: `packages/shared` (UI, Firebase, hooks, theme, types)
- **Backend**: 100% Firebase (Auth, Firestore, Storage) — no custom server

## Key References

Before writing code, read the appropriate reference:

- **Database Schema**: [references/firestore-schema.md](references/firestore-schema.md)
  — Full collection/field definitions, indexes, and Storage paths
- **Security Rules**: [references/security-rules.md](references/security-rules.md)
  — Comprehensive Firestore and Storage security rules
- **UI Conventions**: [references/ui-conventions.md](references/ui-conventions.md)
  — Theme tokens, component patterns, animation guidelines

## Mandatory Coding Standards

### 1. TypeScript Everywhere
- All source files must be `.ts` or `.tsx`
- No `any` types — use interfaces from `packages/shared/src/types/`
- Enable strict mode in `tsconfig.json`

### 2. Firebase Usage Rules
- **Never** import Firebase directly in app code. Use the wrappers from
  `packages/shared/src/firebase/`
- **Always** use typed helper functions (`getDoc<T>`, `setDoc<T>`)
- **Transactions** are required when modifying `filledSlots` on projects
- **Offline persistence** must be enabled via `firebase.firestore().settings({ persistence: true })`

### 3. Component Architecture
- Shared UI goes in `packages/shared/src/components/`
- App-specific screens go in `apps/<app>/src/screens/`
- App-specific components go in `apps/<app>/src/components/`
- Navigation config goes in `apps/<app>/src/navigation/`

### 4. Loading & Error States
- **Loading**: Use `<SkeletonLoader />` for all list/detail views. Never use `<ActivityIndicator />` spinners.
- **Empty**: Use `<EmptyState />` with an illustration, title, and subtitle.
- **Error**: Use the shared `<Toast />` component. Never use `Alert.alert()`.
- **Network**: Use the shared `<NoInternet />` overlay. Never show native system dialogs.

### 5. Animations
- Use `react-native-reanimated` for all animations
- Shared layout transitions via `<Animated.View>` with `FadeIn`, `SlideInRight`
- Screen transitions configured in React Navigation stack options

### 6. Role-Based Access
- After auth, always verify `users/{uid}.role` before allowing navigation
- Student app: only `role === 'student'`
- Client app: only `role === 'client'` AND `clients/{uid}.approvalStatus === 'approved'`
- Admin app: only `role === 'admin'`
- Unauthorized users see a "Not Authorized" screen and are signed out

### 8. 100% Sleek Vector SVG Icons (Strict Zero Emoji Policy)
- Every single button, CTA, pill, action, header item, menu item, OTP screen, modal, and interactive touchable in all 3 apps MUST feature sleek, crisp vector SVG icons via `<Icon name="..." />` from `@upskill/shared` (backed by `react-native-svg`).
- Plain text/Unicode emojis are strictly forbidden in UI components.

### 9. Media Attachments & Default Fallbacks
- Projects, courses, and job listings support photos or demo video links. If media is missing (or only video is provided), a curated high-resolution tech cover image fallback must ALWAYS be rendered.

### 10. Android Status Bar & Safe Area Insets
- Always use `SafeAreaView` from `react-native-safe-area-context` with `edges={['top', 'bottom']}` across all navigators, screens, and modals to prevent status bar and punch-hole overlap on physical Android devices.

### 11. Push Notification Manager (Admin App)
- The Admin app must provide comprehensive push notification dispatching to all users (broadcast), segmented roles (Students, Clients), or single / specific multiple selected users with live previews and delivery tracking.

### 12. High Performance & Optimization
- Use `FlatList` with `keyExtractor`, `removeClippedSubviews`, `maxToRenderPerBatch`, `windowSize`, and `useMemo`/`useCallback` hooks to guarantee buttery 60 FPS performance and avoid unnecessary re-renders.

### 13. Code Review -> Fix -> Test on ADB -> Fix Cycle
- Follow the rigorous testing cycle for all three applications:
  1. Systematic TypeScript code review and static verification
  2. Fix runtime bugs, typing discrepancies, and missing imports
  3. Bundle React Native JavaScript (`npx react-native bundle`)
  4. Compile Android APK (`./gradlew assembleDebug`)
  5. Deploy and install to connected device via ADB (`adb -s <device> install -r <apk>`)
  6. Verify real-time on-device rendering, navigation flows, and interactive state
  7. Iterate and fix any edge-case bugs immediately

## Common Pitfalls

1. **Don't denormalize excessively** — only denormalize fields needed for list
   views (e.g., `clientName` on projects, `studentName` on applications)
2. **Don't use `.onSnapshot()` on large collections** — use paginated queries
   with `limit()` and `startAfter()` for lists
3. **Don't store assessment answers in the user's root doc** — use the
   `users/{uid}/assessments` sub-collection
4. **Don't skip Firestore transactions** — any write to `filledSlots` must use
   `runTransaction()` to prevent double-booking
5. **Don't hard-code colors** — always use `theme.colors.*` tokens
6. **Never use plain emojis in UI** — all interactive elements must use vector SVG `<Icon name="..." />`
7. **Never import `SafeAreaView` from `react-native`** — use `react-native-safe-area-context` with `edges={['top', 'bottom']}`

