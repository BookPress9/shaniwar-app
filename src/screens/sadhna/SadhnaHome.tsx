import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { spineJourney } from '../../features/spine/SpineJourney';

export const SadhnaHome = ({ onNavigate }: { onNavigate?: (screen: string, params?: any) => void }) => {
  const unlockedCount = spineJourney.getUnlockedCount();
  const currentSection = spineJourney.getSection(unlockedCount) || spineJourney.getSection(1);
  const activeSadhaks = 892;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ATTENTION TRAINING SANCTUARY</Text>
        <Text style={styles.title}>SADHNA</Text>
        <View style={styles.ambientPill}>
          <View style={styles.violetPulse} />
          <Text style={styles.ambientText}>{activeSadhaks.toLocaleString()} Sadhaks in Breath Right Now</Text>
        </View>
      </View>

      {/* Living Spine Progress Card */}
      <View style={styles.spineProgressCard}>
        <View style={styles.spineHeader}>
          <Text style={styles.cardTag}>THE 33-SECTION LIVING SPINE</Text>
          <Text style={styles.progressPercent}>{Math.round((unlockedCount / 33) * 100)}%</Text>
        </View>
        <Text style={styles.sectionActiveTitle}>
          Vertebra {unlockedCount} of 33: {currentSection?.name}
        </Text>
        <Text style={styles.sectionDesc}>{currentSection?.description}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onNavigate?.('BreathingSession', { sectionId: unlockedCount })}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>INITIATE VERTEBRA {unlockedCount} SADHNA 🪷</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapLink}
          onPress={() => onNavigate?.('SpineJourney')}
        >
          <Text style={styles.mapLinkText}>View Full 33-Vertebra Map →</Text>
        </TouchableOpacity>
      </View>

      {/* Attention Exercise Quick Launcher */}
      <View style={styles.gameCard}>
        <Text style={styles.cardTag}>NEURO-TRAINING LABORATORY</Text>
        <Text style={styles.gameTitle}>The Dot Focus Protocol</Text>
        <Text style={styles.gameSub}>
          Train sustained uninterrupted visual focus. Zero mind-wandering allowed.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => onNavigate?.('AttentionGame')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>ENTER ATTENTION EXERCISE 🎯</Text>
        </TouchableOpacity>
      </View>

      {/* Three Chapters Map Overview */}
      <Text style={styles.chapterSectionHeader}>THREE CHAPTERS OF ASCENSION</Text>
      
      <View style={styles.chapterCard}>
        <Text style={styles.chapterBadge}>CHAPTER I (VERTEBRAE 1–11)</Text>
        <Text style={styles.chapterTitle}>THE ROOT — Foundational Breath</Text>
        <Text style={styles.chapterMeta}>Sama Vritti, Coherence 0.1Hz, Diaphragmatic Anchoring</Text>
      </View>

      <View style={styles.chapterCard}>
        <Text style={styles.chapterBadge}>CHAPTER II (VERTEBRAE 12–22)</Text>
        <Text style={styles.chapterTitle}>THE CHANNEL — Attention Fortification</Text>
        <Text style={styles.chapterMeta}>Sound Horizon, Thought Labeling, Micro-Stillness Sensors</Text>
      </View>

      <View style={styles.chapterCard}>
        <Text style={styles.chapterBadge}>CHAPTER III (VERTEBRAE 23–33)</Text>
        <Text style={styles.chapterTitle}>THE CROWN — Total Sovereignty</Text>
        <Text style={styles.chapterMeta}>Samadhi Threshold, Sushumna Golden Pillar, Non-Dual Stillness</Text>
      </View>
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
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  ambientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  violetPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SADHNA_VIOLET,
    marginRight: 6,
  },
  ambientText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    fontWeight: '600',
  },
  spineProgressCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.SADHNA_VIOLET,
    marginBottom: 20,
  },
  spineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
  },
  progressPercent: {
    ...TYPOGRAPHY.h3,
    color: COLORS.SADHNA_VIOLET,
  },
  sectionActiveTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 4,
  },
  sectionDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.SADHNA_VIOLET,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
  mapLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  mapLinkText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
  },
  gameCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 24,
  },
  gameTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.PRIMARY,
    marginVertical: 6,
  },
  gameSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.PRIMARY,
  },
  chapterSectionHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  chapterCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  chapterBadge: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    marginBottom: 4,
  },
  chapterTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  chapterMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});
