# UI Conventions Reference

Design system standards and animation patterns for all 5Upskill apps.

---

## Theme Tokens

### Color Palette

```typescript
export const colors = {
  // Primary brand
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',  // Main brand color (Indigo)
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Accent / Success
  accent: {
    400: '#34D399',
    500: '#10B981',  // Emerald
    600: '#059669',
  },

  // Warning
  warning: {
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Error / Danger
  error: {
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },

  // Neutrals (Dark mode first)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0A0E1A',  // Deep dark background
  },

  // Surface colors (for cards, modals)
  surface: {
    dark: '#1A1D2E',
    card: '#242840',
    elevated: '#2D3154',
  },

  white: '#FFFFFF',
  black: '#000000',
};
```

### Typography

```typescript
// Google Font: Inter (imported via react-native-google-fonts or bundled)
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing Scale

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};
```

### Border Radius

```typescript
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
```

---

## Component Patterns

### Skeleton Loader
- Use `react-native-reanimated` shimmer effect
- Match the exact layout of the content it replaces
- Animate from `neutral.800` → `neutral.700` → `neutral.800`
- Duration: 1.2s, easing: `Easing.inOut(Easing.ease)`

```tsx
// Usage — always replace actual content layout
<SkeletonLoader>
  <SkeletonBox width="100%" height={200} borderRadius={radius.lg} />
  <SkeletonBox width="60%" height={20} marginTop={spacing.md} />
  <SkeletonBox width="80%" height={14} marginTop={spacing.sm} />
</SkeletonLoader>
```

### Empty State
- Full-screen centered layout
- Illustrated icon (not a raw icon — use a composed SVG illustration)
- Title: `typography.size.lg`, `fontFamily.semiBold`, `neutral.300`
- Subtitle: `typography.size.base`, `fontFamily.regular`, `neutral.500`
- Optional CTA button below

### Toast Messages
- Position: bottom, 80px from bottom edge
- Background: `surface.elevated` with `0.95` opacity
- Border-left accent color based on type (success=accent, error=error, warning=warning, info=primary)
- Animated entry: `SlideInUp` 300ms
- Animated exit: `FadeOut` 200ms
- Auto-dismiss: 3 seconds (errors: 5 seconds)

### Cards
- Background: `surface.card`
- Border: 1px `neutral.700` with 0.3 opacity
- Border radius: `radius.lg`
- Padding: `spacing.base`
- Shadow: none (use border for depth in dark mode)
- Press effect: `withTiming(scale(0.98), { duration: 100 })`

---

## Animation Standards

### Library: `react-native-reanimated` v3+

### Screen Transitions
```typescript
// Stack navigator screen options
{
  animation: 'slide_from_right',
  animationDuration: 250,
}
```

### List Item Entrance
- Use `FadeInDown` with staggered delay
- Delay: `index * 50ms`, max 500ms
- Duration: 300ms

### Tab Switches
- Use `FadeIn` with 200ms duration
- No slide — tabs should feel instant

### Button Press
- Scale down to 0.96 on press, back to 1.0 on release
- Duration: 100ms, easing: `Easing.out(Easing.cubic)`

### Pull-to-Refresh
- Use native `RefreshControl` with custom colors matching the theme
- `tintColor: colors.primary[400]`
- `progressBackgroundColor: colors.surface.dark`

---

## Navigation Structure

### Student App
```
AuthStack (unauthenticated)
├── PhoneAuthScreen
└── OTPVerificationScreen

OnboardingStack (first login)
├── CreateProfileScreen
└── CareerAssessmentScreen

MainTabs (authenticated)
├── HomeTab → CourseHubScreen → CourseDetailScreen
├── ProjectsTab → ProjectListScreen → ProjectDetailScreen
├── ProfileTab → ProfileScreen → AssessmentResultsScreen
```

### Client App
```
AuthStack
├── PhoneAuthScreen
└── OTPVerificationScreen

OnboardingStack
├── CompanyProfileScreen
└── PendingApprovalScreen

MainTabs
├── DashboardTab → DashboardScreen
├── CreateTab → CreateListingScreen (multi-step)
├── ApplicantsTab → ApplicantListScreen → StudentProfileScreen
├── ProfileTab → CompanyProfileScreen
```

### Admin App
```
AuthStack
├── PhoneAuthScreen
└── OTPVerificationScreen

MainTabs
├── DashboardTab → PlatformDashboardScreen
├── UsersTab → UserListScreen → UserDetailScreen
├── ContentTab → ContentManagementScreen
│   ├── AssessmentQuestionsScreen → QuestionEditorScreen
│   └── CoursesScreen → CourseEditorScreen
├── SettingsTab → VersionControlScreen
```

---

## Accessibility

- All touchable areas minimum 48x48 dp
- Color contrast ratio ≥ 4.5:1 for text
- All images have `accessibilityLabel`
- Form inputs have `accessibilityHint`
