// ─── Student Screen: Courses Hub ───
// Browse, search, filter, and inspect courses.

import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  CourseCard,
  Course,
  EmptyCourses,
  Icon,
  IconBadge,
  IconName,
} from '@upskill/shared';
import {SAMPLE_COURSES} from '../data/sampleData';
import {CourseDetailModal} from './CourseDetailModal';

const CATEGORIES: {id: string; label: string; icon: IconName}[] = [
  {id: 'All', label: 'All Tracks', icon: 'sparkles'},
  {id: 'Mobile', label: 'Mobile', icon: 'smartphone'},
  {id: 'Backend', label: 'Cloud & Backend', icon: 'server'},
  {id: 'AI / ML', label: 'AI & Data', icon: 'cpu'},
];

export function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredCourses = useMemo(() => {
    return SAMPLE_COURSES.filter(c => {
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectCourse = useCallback((course: Course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  }, []);

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const renderItem = useCallback(({item, index}: {item: Course; index: number}) => (
    <CourseCard
      course={item}
      index={index}
      onPress={() => handleSelectCourse(item)}
    />
  ), [handleSelectCourse]);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <IconBadge name="book-open" size={18} iconColor={colors.primary[400]} style={{marginRight: spacing.sm}} />
          <Text style={styles.screenTitle}>Upskill Masterclasses</Text>
        </View>
        <Text style={styles.screenSubtitle}>
          Industry-aligned curricula with hands-on labs
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={colors.neutral[500]} style={{marginRight: spacing.xs}} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills, topics, or tracks..."
            placeholderTextColor={colors.neutral[500]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={16} color={colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}>
                <Icon
                  name={cat.icon}
                  size={13}
                  color={isSelected ? colors.accent[400] : colors.neutral[400]}
                  style={{marginRight: 6}}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyCourses />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={7}
        initialNumToRender={6}
        updateCellsBatchingPeriod={50}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.surface.elevated,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  screenTitle: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  screenSubtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginTop: 2,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  categoryPillActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[500],
  },
  categoryText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.neutral[100],
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
