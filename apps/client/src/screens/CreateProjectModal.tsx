// ─── Client Component: Create Project Modal ───
// Multi-step project listing creator with validation and slot controls.

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  PremiumButton,
  Project,
  Icon,
  IconBadge,
  IconName,
} from '@upskill/shared';

const DEFAULT_COVER_PREVIEW =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
  clientId: string;
  clientName: string;
  clientLogo?: string;
}

export function CreateProjectModal({
  visible,
  onClose,
  onProjectCreated,
  clientId,
  clientName,
  clientLogo,
}: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Mobile Development');

  const [skills, setSkills] = useState<string[]>(['React Native', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');
  const [totalSlots, setTotalSlots] = useState('2');

  const [coverImage, setCoverImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [stipend, setStipend] = useState('₹30,000 / month');
  const [duration, setDuration] = useState('8 Weeks');
  const [deliverables, setDeliverables] = useState(
    'Deliver clean, tested TypeScript components with complete documentation.'
  );

  const [submitting, setSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title.trim() || !description.trim()) {
        toast.warning('Please enter a project title and description.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const slotsNum = parseInt(totalSlots, 10);
      if (isNaN(slotsNum) || slotsNum < 1) {
        toast.warning('Please specify at least 1 open slot.');
        return;
      }
      if (skills.length === 0) {
        toast.warning('Please add at least one required skill tag.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!stipend.trim() || !duration.trim()) {
      toast.warning('Please provide stipend and duration details.');
      return;
    }

    setSubmitting(true);
    try {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        clientId,
        clientName,
        clientLogo,
        title: title.trim(),
        description: description.trim(),
        requirements: [deliverables.trim()],
        skills,
        stipend: stipend.trim(),
        duration: duration.trim(),
        totalSlots: parseInt(totalSlots, 10) || 2,
        filledSlots: 0,
        status: 'open',
        coverImage: coverImage.trim() || DEFAULT_COVER_PREVIEW,
        videoUrl: videoUrl.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onProjectCreated(newProj);
      toast.success('Project opportunity published successfully!');
      handleReset();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to publish project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setTitle('');
    setDescription('');
    setTotalSlots('2');
    setSkillInput('');
    setCoverImage('');
    setVideoUrl('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View>
            <View style={styles.titleRow}>
              <Icon name="plus" size={18} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.topBarTitle}>Post Opportunity</Text>
            </View>
            <Text style={styles.stepIndicator}>Step {currentStep} of 3</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" size={18} color={colors.neutral[300]} />
          </TouchableOpacity>
        </View>

        {/* Step Progress Bar */}
        <View style={styles.stepTrack}>
          <View
            style={[
              styles.stepFill,
              {width: `${(currentStep / 3) * 100}%`},
            ]}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* STEP 1: Basic Info & Media */}
          {currentStep === 1 && (
            <View style={styles.stepSection}>
              <View style={styles.sectionHeaderRow}>
                <Icon name="file-text" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.stepTitle}>Project Overview</Text>
              </View>
              <Text style={styles.stepDesc}>
                Define the core objectives, deliverables, and media for candidates.
              </Text>

              <Text style={styles.label}>Project Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Next-Gen Financial AI Analytics Dashboard"
                placeholderTextColor={colors.neutral[500]}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Domain Category</Text>
              <View style={styles.domainRow}>
                {[
                  {id: 'Mobile Development', label: 'Mobile', icon: 'smartphone' as IconName},
                  {id: 'Backend & Cloud', label: 'Cloud/Backend', icon: 'server' as IconName},
                  {id: 'AI & Data', label: 'AI & Data', icon: 'cpu' as IconName},
                ].map(d => (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setDomain(d.id)}
                    style={[
                      styles.domainPill,
                      domain === d.id && styles.domainPillActive,
                    ]}>
                    <Icon
                      name={d.icon}
                      size={12}
                      color={domain === d.id ? colors.accent[400] : colors.neutral[400]}
                      style={{marginRight: 4}}
                    />
                    <Text
                      style={[
                        styles.domainPillText,
                        domain === d.id && styles.domainPillTextActive,
                      ]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Detailed Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe what the student will build, tools used, and architecture..."
                placeholderTextColor={colors.neutral[500]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />

              <View style={styles.labelWithIcon}>
                <Icon name="camera" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Cover Photo URL (Optional)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="https://images.unsplash.com/... (or leave empty for default)"
                placeholderTextColor={colors.neutral[500]}
                value={coverImage}
                onChangeText={setCoverImage}
              />

              <View style={styles.labelWithIcon}>
                <Icon name="video" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Demo Video URL (Optional)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="https://youtube.com/watch?v=... or mp4 stream"
                placeholderTextColor={colors.neutral[500]}
                value={videoUrl}
                onChangeText={setVideoUrl}
              />

              {/* Media Preview Card */}
              <View style={styles.mediaPreviewCard}>
                <Image
                  source={{uri: coverImage.trim() || DEFAULT_COVER_PREVIEW}}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <View style={styles.previewOverlay}>
                  <View style={styles.previewBadge}>
                    <Icon
                      name={coverImage.trim() ? 'camera' : 'image'}
                      size={11}
                      color={colors.white}
                      style={{marginRight: 4}}
                    />
                    <Text style={styles.previewBadgeText}>
                      {coverImage.trim() ? 'Custom Photo' : 'Default Tech Cover'}
                    </Text>
                  </View>
                  {videoUrl.trim() ? (
                    <View style={styles.videoPreviewBadge}>
                      <Icon name="play" size={10} color={colors.accent[300]} style={{marginRight: 4}} />
                      <Text style={styles.videoPreviewBadgeText}>Video Linked</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Skills & Slots */}
          {currentStep === 2 && (
            <View style={styles.stepSection}>
              <View style={styles.sectionHeaderRow}>
                <Icon name="zap" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.stepTitle}>Skills & Capacity</Text>
              </View>
              <Text style={styles.stepDesc}>
                Specify required technologies and limited team cohort slots.
              </Text>

              <View style={styles.labelWithIcon}>
                <Icon name="users" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Total Cohort Seats (Slots)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                placeholderTextColor={colors.neutral[500]}
                value={totalSlots}
                onChangeText={setTotalSlots}
                keyboardType="numeric"
              />

              <View style={styles.labelWithIcon}>
                <Icon name="code" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Required Tech Stack</Text>
              </View>
              <View style={styles.addSkillRow}>
                <TextInput
                  style={[styles.input, styles.skillInputField]}
                  placeholder="Add skill (e.g. React Native, TypeScript)"
                  placeholderTextColor={colors.neutral[500]}
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={handleAddSkill}
                />
                <TouchableOpacity
                  style={styles.addSkillBtn}
                  onPress={handleAddSkill}>
                  <View style={styles.btnContentRow}>
                    <Icon name="plus" size={13} color={colors.white} style={{marginRight: 2}} />
                    <Text style={styles.addSkillBtnText}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.skillChipsContainer}>
                {skills.map(s => (
                  <View key={s} style={styles.skillChip}>
                    <Icon name="zap" size={11} color={colors.accent[400]} style={{marginRight: 4}} />
                    <Text style={styles.skillChipText}>{s}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSkill(s)}>
                      <Icon name="x" size={12} color={colors.neutral[400]} style={{marginLeft: 4}} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STEP 3: Stipend & Terms */}
          {currentStep === 3 && (
            <View style={styles.stepSection}>
              <View style={styles.sectionHeaderRow}>
                <Icon name="dollar-sign" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
                <Text style={styles.stepTitle}>Stipend & Timeline</Text>
              </View>
              <Text style={styles.stepDesc}>
                Establish compensation and expected engagement duration.
              </Text>

              <View style={styles.labelWithIcon}>
                <Icon name="dollar-sign" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Monthly Stipend</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. ₹35,000 / month"
                placeholderTextColor={colors.neutral[500]}
                value={stipend}
                onChangeText={setStipend}
              />

              <View style={styles.labelWithIcon}>
                <Icon name="clock" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Project Duration</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. 8 Weeks"
                placeholderTextColor={colors.neutral[500]}
                value={duration}
                onChangeText={setDuration}
              />

              <View style={styles.labelWithIcon}>
                <Icon name="file-text" size={14} color={colors.neutral[400]} style={{marginRight: 4}} />
                <Text style={styles.label}>Key Deliverables / Criteria</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Requirements the student must meet..."
                placeholderTextColor={colors.neutral[500]}
                value={deliverables}
                onChangeText={setDeliverables}
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions Bar */}
        <View style={styles.bottomBar}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setCurrentStep(prev => prev - 1)}>
              <View style={styles.btnContentRow}>
                <Icon name="arrow-left" size={14} color={colors.neutral[300]} style={{marginRight: 4}} />
                <Text style={styles.backBtnText}>Back</Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.actionBtnContainer}>
            {currentStep < 3 ? (
              <PremiumButton
                title="Continue"
                icon="arrow-right"
                variant="primary"
                onPress={handleNext}
                style={styles.fullWidth}
              />
            ) : (
              <PremiumButton
                title={submitting ? 'Publishing...' : 'Publish Listing'}
                icon="sparkles"
                variant="primary"
                disabled={submitting}
                onPress={handleSubmit}
                style={styles.fullWidth}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.elevated,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    ...textStyles.h3,
    color: colors.neutral[100],
  },
  stepIndicator: {
    ...textStyles.caption,
    color: colors.primary[400],
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: colors.neutral[300],
    fontSize: 14,
    fontWeight: '700',
  },
  stepTrack: {
    height: 4,
    backgroundColor: colors.surface.card,
  },
  stepFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  stepSection: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    ...textStyles.h2,
    color: colors.neutral[100],
  },
  stepDesc: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    marginBottom: spacing.md,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  label: {
    ...textStyles.caption,
    color: colors.neutral[300],
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    height: 48,
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
  },
  textArea: {
    height: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  domainPillActive: {
    backgroundColor: colors.primary[950],
    borderColor: colors.primary[500],
  },
  domainPillText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    fontWeight: '600',
  },
  domainPillTextActive: {
    color: colors.primary[300],
    fontWeight: '700',
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skillInputField: {
    flex: 1,
  },
  addSkillBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSkillBtnText: {
    ...textStyles.bodySmall,
    color: colors.neutral[100],
    fontWeight: '700',
  },
  skillChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.xs,
  },
  skillChipText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontWeight: '600',
  },
  mediaPreviewCard: {
    width: '100%',
    height: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
    position: 'relative',
    backgroundColor: colors.neutral[900],
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  previewBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 10,
    fontWeight: '700',
  },
  videoPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent[400] + '60',
  },
  videoPreviewBadgeText: {
    ...textStyles.caption,
    color: colors.accent[300],
    fontSize: 10,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.surface.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    gap: spacing.md,
  },
  backBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    ...textStyles.bodyMedium,
    color: colors.neutral[300],
  },
  actionBtnContainer: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
});
