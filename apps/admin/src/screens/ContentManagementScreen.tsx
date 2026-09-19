// ─── Admin Screen: Content Management ───
// Course CRUD, module curriculum creation, and career assessment questions management.

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  PremiumButton,
  Course,
  Icon,
} from '@upskill/shared';

const INITIAL_ADMIN_COURSES: Course[] = [
  {
    id: 'course-rn-reanimated',
    title: 'Advanced React Native & Reanimated 3 Masterclass',
    description: 'Master high-performance mobile animations, gesture handling, and 60 FPS UI patterns.',
    category: 'Mobile',
    level: 'intermediate',
    totalHours: 18,
    modulesCount: 5,
    skills: ['React Native', 'Reanimated', 'Gestures', 'TypeScript'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-firebase-serverless',
    title: 'Serverless Fullstack with Firebase & Firestore',
    description: 'Build scalable backends using Firestore rules, atomic transactions, and storage security.',
    category: 'Backend',
    level: 'advanced',
    totalHours: 22,
    modulesCount: 6,
    skills: ['Firebase Auth', 'Cloud Firestore', 'Security Rules'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ContentManagementScreen() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_ADMIN_COURSES);
  const [isCreating, setIsCreating] = useState(false);

  // New course form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Mobile');
  const [newHours, setNewHours] = useState('16');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCourse = () => {
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.warning('Please enter course title and description.');
      return;
    }

    const created: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      level: 'intermediate',
      totalHours: parseInt(newHours, 10) || 12,
      modulesCount: 4,
      skills: ['Production Engineering', 'System Design'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCourses(prev => [created, ...prev]);
    toast.success(`Published course "${created.title}"!`);
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast.error('Course removed from public catalog.');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Curriculum & Courses</Text>
            <Text style={styles.subtitle}>
              Manage masterclasses, syllabus modules, and quiz catalog
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsCreating(!isCreating)}>
            <Icon
              name={isCreating ? 'x' : 'plus'}
              size={14}
              color={colors.neutral[950]}
            />
            <Text style={styles.addBtnText}>
              {isCreating ? 'Cancel' : 'New Course'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Course Form */}
      {isCreating && (
        <View style={styles.createCard}>
          <Text style={styles.createCardTitle}>Create New Masterclass</Text>

          <Text style={styles.label}>Course Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Distributed Cloud Systems"
            placeholderTextColor={colors.neutral[500]}
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <Text style={styles.label}>Domain Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mobile, Backend, AI / ML"
            placeholderTextColor={colors.neutral[500]}
            value={newCategory}
            onChangeText={setNewCategory}
          />

          <Text style={styles.label}>Estimated Total Hours</Text>
          <TextInput
            style={styles.input}
            placeholder="16"
            placeholderTextColor={colors.neutral[500]}
            value={newHours}
            onChangeText={setNewHours}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Curriculum Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Outline syllabus topics and student learning outcomes..."
            placeholderTextColor={colors.neutral[500]}
            value={newDesc}
            onChangeText={setNewDesc}
            multiline
            numberOfLines={3}
          />

          <PremiumButton
            title="Publish to Student Catalog"
            icon="sparkles"
            variant="primary"
            onPress={handleCreateCourse}
            style={styles.submitBtn}
          />
        </View>
      )}

      {/* Courses List */}
      <Text style={styles.sectionTitle}>Active Masterclasses ({courses.length})</Text>
      <View style={styles.courseList}>
        {courses.map(c => (
          <View key={c.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={styles.courseMetaCol}>
                <Text style={styles.courseTitle}>{c.title}</Text>
                <Text style={styles.courseCategory}>
                  {c.category} • {c.totalHours} hrs • {c.modulesCount} modules
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteCourse(c.id)}>
                <Icon name="trash" size={12} color={colors.error[400]} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.courseDesc} numberOfLines={2}>
              {c.description}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  subtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent[600],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[950],
    fontWeight: '700',
  },
  createCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.accent[500] + '80',
    marginBottom: spacing.lg,
  },
  createCardTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    height: 44,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 80,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: spacing.sm,
    width: '100%',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
    marginBottom: spacing.sm,
  },
  courseList: {
    gap: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  courseMetaCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  courseTitle: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  courseCategory: {
    ...textStyles.caption,
    color: colors.accent[400],
    marginTop: 2,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  deleteBtnText: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  courseDesc: {
    ...textStyles.caption,
    color: colors.neutral[400],
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
