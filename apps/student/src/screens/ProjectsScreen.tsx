// ─── Student Screen: Projects & Internships Board ───
// Browse live industry projects with slot tracking and application flow.

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
  ProjectCard,
  Project,
  EmptyProjects,
  Icon,
  IconBadge,
  IconName,
} from '@upskill/shared';
import {SAMPLE_PROJECTS} from '../data/sampleData';
import {ProjectDetailModal} from './ProjectDetailModal';

const FILTERS: {id: string; label: string; icon: IconName}[] = [
  {id: 'All', label: 'All Projects', icon: 'briefcase'},
  {id: 'Open Only', label: 'Open Slots Only', icon: 'zap'},
  {id: 'High Stipend (₹30k+)', label: 'High Stipend (₹30k+)', icon: 'dollar-sign'},
];

interface ProjectsScreenProps {
  appliedProjectIds?: string[];
  onApplySuccess?: (projectId: string) => void;
}

export function ProjectsScreen({
  appliedProjectIds = [],
  onApplySuccess,
}: ProjectsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredProjects = useMemo(() => {
    return SAMPLE_PROJECTS.filter(proj => {
      if (selectedFilter === 'Open Only' && proj.filledSlots >= proj.totalSlots) {
        return false;
      }
      if (selectedFilter.includes('High Stipend') && !proj.stipend.includes('30,000') && !proj.stipend.includes('35,000')) {
        return false;
      }
      const matchesSearch =
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery, selectedFilter]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setModalVisible(true);
  }, []);

  const keyExtractor = useCallback((item: Project) => item.id, []);

  const renderItem = useCallback(({item, index}: {item: Project; index: number}) => (
    <ProjectCard
      project={item}
      index={index}
      onPress={() => handleSelectProject(item)}
    />
  ), [handleSelectProject]);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <IconBadge name="briefcase" size={18} iconColor={colors.accent[400]} style={{marginRight: spacing.sm}} />
          <Text style={styles.screenTitle}>Live Industry Projects</Text>
        </View>
        <Text style={styles.screenSubtitle}>
          Real client assignments with guaranteed stipends
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={colors.neutral[500]} style={{marginRight: spacing.xs}} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by company, role, or tech..."
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

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}>
          {FILTERS.map(item => {
            const isSelected = selectedFilter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(item.id)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}>
                <Icon
                  name={item.icon}
                  size={13}
                  color={isSelected ? colors.accent[400] : colors.neutral[400]}
                  style={{marginRight: 6}}
                />
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyProjects />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={7}
        initialNumToRender={6}
        updateCellsBatchingPeriod={50}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplySuccess={onApplySuccess}
        alreadyApplied={
          selectedProject ? appliedProjectIds.includes(selectedProject.id) : false
        }
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
  filtersContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  filterPillActive: {
    backgroundColor: colors.accent[600],
    borderColor: colors.accent[500],
  },
  filterText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.neutral[100],
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
