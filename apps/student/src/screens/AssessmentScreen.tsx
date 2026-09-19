// ─── Student Screen: Career Assessment Quiz ───
// Interactive aptitude assessment with animated questions, scoring, and role recommendations.

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  colors,
  textStyles,
  spacing,
  radius,
  toast,
  PremiumButton,
  AssessmentQuestion,
  Icon,
  IconBadge,
} from '@upskill/shared';
import {SAMPLE_QUESTIONS} from '../data/sampleData';

interface AssessmentScreenProps {
  onExploreCourses: () => void;
  onExploreProjects: () => void;
}

interface DomainScore {
  domain: string;
  points: number;
  percentage: number;
}

export function AssessmentScreen({
  onExploreCourses,
  onExploreProjects,
}: AssessmentScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {domain: string; points: number}>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [scores, setScores] = useState<DomainScore[]>([]);
  const [topRole, setTopRole] = useState<string>('');

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100
  );

  const handleSelectOption = (option: AssessmentQuestion['options'][0]) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {domain: option.domain, points: option.points},
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate results
      computeResults(updatedAnswers);
    }
  };

  const computeResults = (allAnswers: Record<string, {domain: string; points: number}>) => {
    const domainTotals: Record<string, number> = {};
    let grandTotal = 0;

    Object.values(allAnswers).forEach(ans => {
      domainTotals[ans.domain] = (domainTotals[ans.domain] || 0) + ans.points;
      grandTotal += ans.points;
    });

    const calculated: DomainScore[] = Object.entries(domainTotals).map(
      ([domain, pts]) => ({
        domain,
        points: pts,
        percentage: grandTotal > 0 ? Math.round((pts / grandTotal) * 100) : 0,
      })
    );

    calculated.sort((a, b) => b.percentage - a.percentage);
    setScores(calculated);

    // Determine top matched role
    const primary = calculated[0]?.domain || 'Frontend / Mobile';
    let roleTitle = 'Fullstack Mobile & React Native Engineer';
    if (primary.includes('Backend')) {
      roleTitle = 'Cloud Backend & Serverless Architect';
    } else if (primary.includes('AI')) {
      roleTitle = 'Applied Generative AI Engineer';
    } else if (primary.includes('UX')) {
      roleTitle = 'Product UI/UX Systems Designer';
    }
    setTopRole(roleTitle);
    setIsCompleted(true);
    toast.success('Assessment completed! Your custom career path is ready.');
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setScores([]);
  };

  if (isCompleted) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Result Header */}
        <View style={styles.resultBadgeContainer}>
          <View style={styles.badgePill}>
            <Icon name="target" size={14} color={colors.accent[400]} style={{marginRight: 6}} />
            <Text style={styles.badgePillText}>CAREER DNA MATCHED</Text>
          </View>
          <Text style={styles.resultTitle}>{topRole}</Text>
          <Text style={styles.resultSubtitle}>
            Based on your technical preferences and architecture choices, you excel in this domain.
          </Text>
        </View>

        {/* Aptitude Breakdown Cards */}
        <View style={styles.scoresCard}>
          <Text style={styles.cardHeader}>Domain Aptitude Breakdown</Text>
          {scores.map((sc, index) => (
            <View key={sc.domain} style={styles.scoreRow}>
              <View style={styles.scoreMeta}>
                <Text style={styles.domainName}>{sc.domain}</Text>
                <Text style={styles.domainPercent}>{sc.percentage}%</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${sc.percentage}%`,
                      backgroundColor:
                        index === 0
                          ? colors.accent[500]
                          : index === 1
                          ? colors.primary[500]
                          : colors.neutral[600],
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recommended Action CTA */}
        <View style={styles.actionSection}>
          <PremiumButton
            title="Start Recommended Courses"
            icon="book-open"
            variant="primary"
            size="lg"
            onPress={onExploreCourses}
            style={styles.actionBtn}
          />
          <PremiumButton
            title="Apply to Matched Projects"
            icon="briefcase"
            variant="secondary"
            size="lg"
            onPress={onExploreProjects}
            style={styles.actionBtn}
          />
          <TouchableOpacity onPress={handleReset} style={styles.retakeBtn}>
            <View style={styles.retakeRow}>
              <Icon name="refresh-cw" size={14} color={colors.neutral[400]} style={{marginRight: spacing.xs}} />
              <Text style={styles.retakeText}>Retake Assessment</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header & Progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.kickerRow}>
            <Icon name="target" size={16} color={colors.accent[400]} style={{marginRight: spacing.xs}} />
            <Text style={styles.headerKicker}>Career DNA Quiz</Text>
          </View>
          <Text style={styles.counterText}>
            Question {currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progressPercent}%`}]} />
        </View>
      </View>

      {/* Question Card */}
      <ScrollView
        contentContainerStyle={styles.quizContent}
        showsVerticalScrollIndicator={false}>
        <View key={currentQuestion.id}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsList}>
            {currentQuestion.options.map(opt => {
              const isSelected = answers[currentQuestion.id]?.domain === opt.domain;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption(opt)}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}>
                  <View style={styles.optionCircle}>
                    {isSelected && <View style={styles.optionCircleInner} />}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>{opt.text}</Text>
                    <Text style={styles.domainTag}>{opt.domain}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerKicker: {
    ...textStyles.caption,
    color: colors.accent[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counterText: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent[500],
    borderRadius: radius.full,
  },
  quizContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  questionText: {
    ...textStyles.h2,
    color: colors.neutral[100],
    marginBottom: spacing.lg,
    lineHeight: 30,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  optionCardSelected: {
    borderColor: colors.accent[500],
    backgroundColor: colors.accent[950] + '40',
  },
  optionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.neutral[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent[500],
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    ...textStyles.bodyMedium,
    color: colors.neutral[100],
    marginBottom: spacing.xs,
  },
  domainTag: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '600',
  },
  resultBadgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  badgePill: {
    backgroundColor: colors.accent[950],
    borderWidth: 1,
    borderColor: colors.accent[600],
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: spacing.sm,
  },
  badgePillText: {
    ...textStyles.caption,
    color: colors.accent[400],
    fontWeight: '700',
  },
  resultTitle: {
    ...textStyles.h1,
    color: colors.neutral[100],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  resultSubtitle: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  scoresCard: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    ...textStyles.h3,
    color: colors.neutral[100],
    marginBottom: spacing.md,
  },
  scoreRow: {
    marginBottom: spacing.md,
  },
  scoreMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  domainName: {
    ...textStyles.bodySmall,
    color: colors.neutral[300],
    fontWeight: '500',
  },
  domainPercent: {
    ...textStyles.bodySmall,
    color: colors.accent[400],
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.surface.card,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  actionSection: {
    gap: spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
  retakeBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  retakeText: {
    ...textStyles.bodySmall,
    color: colors.neutral[400],
    textDecorationLine: 'underline',
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
