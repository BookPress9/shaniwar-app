import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { SpineSection as SpineSectionType } from '../../types';

export const SpineSection = ({
  section,
  onBack,
  onBeginBreath,
  onBeginAttention,
}: {
  section: SpineSectionType;
  onBack?: () => void;
  onBeginBreath?: (sectionId: number) => void;
  onBeginAttention?: () => void;
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>VERTEBRA {section.id} / 33</Text>
      </View>

      <Text style={styles.title}>{section.name}</Text>
      <Text style={styles.chapterBadge}>
        CHAPTER {section.chapter.toUpperCase()} AXIS
      </Text>

      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>MEDITATIVE PROTOCOL</Text>
        <Text style={styles.description}>{section.description}</Text>
      </View>

      {/* Verification Requirements */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>ASCENSION REQUIREMENTS</Text>
        <Text style={styles.reqItem}>1. Breath Pattern: {section.breathPatternId.toUpperCase()}</Text>
        <Text style={styles.reqItem}>2. Attention Exercise: {section.attentionExercise}</Text>
        <Text style={styles.reqItem}>3. Minimum Sensor Accuracy: 85% sustained cadence</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => onBeginBreath?.(section.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>COMMENCE BREATH CADENCE 🪷</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onBeginAttention}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>PRACTICE ATTENTION EXERCISE 🎯</Text>
      </TouchableOpacity>
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
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  chapterBadge: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  cardHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  reqItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.SADHNA_VIOLET,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.PRIMARY,
  },
});
