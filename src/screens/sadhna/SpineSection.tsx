import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { SpineSection as SpineSectionType } from '../../types';
import { breathEngine } from '../../features/spine/BreathEngine';

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
  const vbt = section.vbtTechniqueId ? breathEngine.getVBTTechnique(section.vbtTechniqueId) : undefined;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>VERTEBRA {section.id} / 33 · [{section.regionCode}]</Text>
      </View>

      <Text style={styles.title}>{section.name}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.chapterBadge}>
          {section.region} · CHAPTER {section.chapter.toUpperCase()}
        </Text>
        {section.chakraAnchor && (
          <View style={styles.waypointPill}>
            <Text style={styles.waypointPillText}>✦ {section.chakraAnchor}</Text>
          </View>
        )}
      </View>

      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>MEDITATIVE PROTOCOL</Text>
        <Text style={styles.description}>{section.description}</Text>
      </View>

      {/* VBT Ancient Technique Card (if paired) */}
      {vbt && (
        <View style={[styles.card, styles.vbtCard]}>
          <Text style={styles.vbtHeader}>VIGYAN BHAIRAV TANTRA · {vbt.verse.toUpperCase()}</Text>
          <Text style={styles.vbtTitle}>{vbt.title}</Text>
          <Text style={styles.vbtEssence}>{vbt.essence}</Text>
          <View style={styles.vbtDivider} />
          <Text style={styles.vbtScript}>{vbt.script}</Text>
          <Text style={styles.vbtSource}>{vbt.source}</Text>
        </View>
      )}

      {/* Verification Requirements */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>ASCENSION REQUIREMENTS</Text>
        <Text style={styles.reqItem}>1. Breath Pattern: {section.breathPatternId.toUpperCase()}</Text>
        <Text style={styles.reqItem}>2. Attention Exercise: {section.attentionExercise}</Text>
        <Text style={styles.reqItem}>3. Minimum Qualification: 90 seconds continuous presence</Text>
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
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  waypointPill: {
    backgroundColor: 'rgba(201, 146, 42, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  waypointPillText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    fontSize: 10,
  },
  vbtCard: {
    borderColor: COLORS.SADHNA_VIOLET,
    borderWidth: 1,
    backgroundColor: 'rgba(108, 99, 255, 0.04)',
  },
  vbtHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  vbtTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    marginBottom: 8,
  },
  vbtEssence: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 12,
  },
  vbtDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER_SUBTLE,
    marginBottom: 12,
  },
  vbtScript: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
    marginBottom: 12,
  },
  vbtSource: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
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
