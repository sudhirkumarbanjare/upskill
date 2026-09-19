# 5Upskill Project Rules

## Project Context
This is a multi-sided marketplace platform consisting of three React Native
Android apps (Student, Client, Admin) in a yarn workspaces monorepo, backed by a
single Firebase project (Auth, Firestore, Storage).

## Mandatory Rules

1. **TypeScript Only** — All source files must be `.ts` or `.tsx`. No `.js` files
   in `src/` directories.

2. **Shared Package First** — Before creating any component, hook, or utility,
   check if it already exists in `packages/shared/`. If it should be reusable,
   create it there.

3. **No Direct Firebase Imports** — App code must never `import` from
   `@react-native-firebase/*` directly. Use the wrappers in
   `packages/shared/src/firebase/`.

4. **No Native Alerts** — Never use `Alert.alert()`. Use the shared `Toast`
   component for all user-facing messages.

5. **No Spinners** — Never use `<ActivityIndicator />`. Use `<SkeletonLoader />`
   for all loading states.

6. **Dark Mode Default** — The app uses a dark theme. All colors must come from
   the shared theme tokens.

7. **Inter Font** — Use the Inter font family. No system fonts or fallbacks in
   production.

8. **Firestore Transactions** — Any operation that modifies `filledSlots` on a
   project document MUST use `runTransaction()`.

9. **Role Verification** — After authentication, always verify the user's role
   from Firestore before granting access. Never trust client-side state alone.

10. **Semantic Versioning** — App versions follow semver (MAJOR.MINOR.PATCH).
    The force-update check compares against `system_config/app_versions`.

11. **100% Sleek Vector SVG Icons (Zero Emoji Policy)** — Every button, CTA,
    pill, action, header item, menu item, OTP screen, modal, and interactive touchable
    in all 3 apps (Student, Client, Admin) MUST feature pure vector SVG icons via
    `<Icon name="..." />` from `@upskill/shared` (using `react-native-svg`).
    Plain text/Unicode emojis are strictly forbidden in UI components.

12. **Media Attachments & Default Fallbacks** — Projects, courses, and job listings
    can support photos or demo video links. If media is missing (or only video is
    provided), a curated high-resolution tech cover image fallback must ALWAYS
    be rendered.

13. **Android Status Bar & Safe Area Insets** — Always use `SafeAreaView` from
    `react-native-safe-area-context` with `edges={['top', 'bottom']}` across all
    navigators, screens, and modals to prevent status bar and punch-hole overlap.

14. **Push Notification Manager** — The Admin app must provide comprehensive push
    notification dispatching to all users (broadcast), segmented roles (Students,
    Clients), or single / specific multiple selected users with live previews.

15. **High Performance & Optimization** — All list renders must use `FlatList`
    with `keyExtractor`, `removeClippedSubviews`, `maxToRenderPerBatch`, `windowSize`,
    and `useMemo`/`useCallback` hooks to guarantee buttery 60 FPS performance.

16. **Code Review -> Fix -> Test on ADB -> Fix Cycle** — Always review source code,
    fix issues, compile JS bundle and assemble Android APK, install onto connected
    physical/virtual device via ADB (`adb -s <deviceId> install -r <apk>`), verify
    live UI/interaction, and resolve any runtime regressions immediately.

