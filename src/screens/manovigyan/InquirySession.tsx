import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';
import { InquiryDilemma, InquiryCategory } from '../../types';

export const InquirySession = ({
  category,
  dilemmaId,
  onBack,
  onFinish,
}: {
  category?: InquiryCategory;
  dilemmaId?: string;
  onBack?: () => void;
  onFinish?: () => void;
}) => {
  const allDilemmas = category
    ? selfInquiryEngine.getDilemmasByCategory(category)
    : selfInquiryEngine.getDilemmas();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDilemma: InquiryDilemma =
    allDilemmas.find((d) => d.id === dilemmaId) || allDilemmas[currentIndex] || allDilemmas[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<{ isConditioned: boolean; insight: string } | null>(null);

  const handleSelectOption = (optionId: string) => {
    if (result) return; // already answered
    setSelectedOptionId(optionId);
    const evaluation = selfInquiryEngine.recordChoice(currentDilemma.id, optionId);
    setResult(evaluation);
  };

  const handleNext = () => {
    if (currentIndex + 1 < allDilemmas.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setResult(null);
    } else {
      onFinish?.();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>{currentDilemma.categoryTitle.toUpperCase()}</Text>
      </View>

      <Text style={styles.headline}>Self-Inquiry Mirror</Text>
      <Text style={styles.questionIndex}>
        Inquiry {currentIndex + 1} of {allDilemmas.length}
      </Text>

      {/* Scenario Card */}
      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioLabel}>REAL-WORLD SITUATION</Text>
        <Text style={styles.scenarioText}>{currentDilemma.scenario}</Text>
        <Text style={styles.promptQuestion}>{currentDilemma.question}</Text>
      </View>

      {/* Forced-Choice Options */}
      <Text style={styles.sectionHeader}>CHOOSE YOUR VISCERAL REFLEX</Text>

      {currentDilemma.options.map((opt) => {
        const isChosen = selectedOptionId === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.optionCard,
              isChosen && (opt.isConditionedPersona ? styles.optionConditioned : styles.optionAuthentic),
            ]}
            onPress={() => handleSelectOption(opt.id)}
            activeOpacity={0.8}
            disabled={result !== null}
          >
            <View style={styles.optionHeaderRow}>
              <Text style={styles.optionLabel}>{opt.psychologicalLabel}</Text>
              {isChosen && (
                <Text
                  style={[
                    styles.statusPill,
                    opt.isConditionedPersona ? styles.pillRed : styles.pillCyan,
                  ]}
                >
                  {opt.isConditionedPersona ? 'WHAT YOU ARE NOT' : 'WHAT YOU TRULY ARE'}
                </Text>
              )}
            </View>
            <Text style={styles.optionText}>{opt.text}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Deconstruction Insight Reveal */}
      {result && (
        <View
          style={[
            styles.insightCard,
            result.isConditioned ? styles.insightConditioned : styles.insightAuthentic,
          ]}
        >
          <Text style={styles.insightTag}>
            {result.isConditioned ? '🛡️ CONDITIONED ARMOR IDENTIFIED' : '🌿 ORGANIC CORE SOVEREIGNTY'}
          </Text>
          <Text style={styles.insightText}>{result.insight}</Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 < allDilemmas.length ? 'NEXT INQUIRY →' : 'VIEW MIRROR REPORT →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    letterSpacing: 1.5,
  },
  headline: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  questionIndex: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 20,
  },
  scenarioLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    marginBottom: 8,
  },
  scenarioText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 12,
  },
  promptQuestion: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  sectionHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  optionConditioned: {
    borderColor: COLORS.ROUTINE_RED,
    backgroundColor: 'rgba(232, 69, 69, 0.08)',
  },
  optionAuthentic: {
    borderColor: COLORS.MANOVIGYAN_CYAN,
    backgroundColor: 'rgba(0, 210, 211, 0.08)',
  },
  optionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
  },
  statusPill: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillRed: {
    backgroundColor: 'rgba(232, 69, 69, 0.2)',
    color: COLORS.ROUTINE_RED,
  },
  pillCyan: {
    backgroundColor: 'rgba(0, 210, 211, 0.2)',
    color: COLORS.MANOVIGYAN_CYAN,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
  },
  insightCard: {
    borderRadius: 14,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
  },
  insightConditioned: {
    backgroundColor: 'rgba(232, 69, 69, 0.1)',
    borderColor: COLORS.ROUTINE_RED,
  },
  insightAuthentic: {
    backgroundColor: 'rgba(0, 210, 211, 0.1)',
    borderColor: COLORS.MANOVIGYAN_CYAN,
  },
  insightTag: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    color: COLORS.TEXT_PRIMARY,
  },
  insightText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: COLORS.TEXT_PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
});
