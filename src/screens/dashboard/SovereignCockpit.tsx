import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { blockScheduler } from '../../features/focus/BlockScheduler';
import { spineJourney } from '../../features/spine/SpineJourney';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';

export const SovereignCockpit = ({
  onNavigate,
}: {
  onNavigate?: (tab: string, screen?: string, params?: any) => void;
}) => {
  const blocks = blockScheduler.getBlocks();
  const armedBlocksCount = blocks.filter((b) => b.isActive).length;
  const unlockedVertebrae = spineJourney.getUnlockedCount();
  const radar = selfInquiryEngine.getRadarProfile();
  const ledger = selfInquiryEngine.getDeconstructionLedger();
  const shedMasksCount = ledger.filter((i) => i.nature === 'conditioned_armor').length;

  // Holistic vitality index combining all 3 pillars
  const routineScore = Math.round((armedBlocksCount / blocks.length) * 100);
  const sadhnaScore = Math.round((unlockedVertebrae / 33) * 100);
  const manovigyanScore = Math.round((radar.authenticity + radar.internalAgency) / 2);
  const overallVitality = Math.round((routineScore + sadhnaScore * 3 + manovigyanScore) / 5);

  // Pulse animation for the living energy body
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // 30-day grove mock items
  const groveDays = [
    '🌲', '🌲', '🌲', '🪵', '🌲', '🌲', '🌲', '🌲', '🌲', '🥀',
    '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲',
    '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '✨',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Monastery Bar */}
      <View style={styles.monasteryBar}>
        <View style={styles.activeMonksPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.activeMonksText}>1,428 Monks Locked In Now</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 14 DAYS</Text>
        </View>
      </View>

      {/* Hero: The Living Sushumna Spine Avatar */}
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>THE LIVING SUSHUMNA AXIS</Text>

        <View style={styles.auraWrapper}>
          <Animated.View style={[styles.vitalityAura, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.vitalityNumber}>{overallVitality}%</Text>
            <Text style={styles.vitalityLabel}>INTEGRATED VITALITY</Text>
          </Animated.View>
        </View>

        <Text style={styles.heroStatus}>
          Vertebra {unlockedVertebrae} of 33 Illuminated · {shedMasksCount} False Personas Shed
        </Text>
        <Text style={styles.heroSub}>
          "Your nervous system is calibrated. Your morning routine is guarded."
        </Text>
      </View>

      {/* The Immediate Next Move Card (Headspace/Intellect Zero-Friction DNA) */}
      <View style={styles.nextMoveCard}>
        <View style={styles.nextMoveHeader}>
          <Text style={styles.nextMoveTag}>IMMEDIATE STRATEGIC ACTION</Text>
          <Text style={styles.nextMoveEst}>8 MIN</Text>
        </View>
        <Text style={styles.nextMoveTitle}>
          Vertebra {unlockedVertebrae}: Initiate Box Breath Protocol
        </Text>
        <Text style={styles.nextMoveDesc}>
          Stabilize autonomic vagal tone before your 09:00 Deep Work Monastery block.
        </Text>
        <TouchableOpacity
          style={styles.executeButton}
          onPress={() => onNavigate?.('SADHNA', 'BreathingSession', { sectionId: unlockedVertebrae })}
          activeOpacity={0.8}
        >
          <Text style={styles.executeButtonText}>ENTER BREATH PROTOCOL 🪷</Text>
        </TouchableOpacity>
      </View>

      {/* The Trinity Synergy Matrix */}
      <Text style={styles.sectionHeading}>THE TRINITY SYNERGY MATRIX</Text>

      <View style={styles.trinityRow}>
        {/* ROUTINE GAUGE */}
        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.ROUTINE_RED }]}
          onPress={() => onNavigate?.('ROUTINE')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>🔥</Text>
          <Text style={styles.trinityName}>ROUTINE</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.ROUTINE_RED }]}>
            {armedBlocksCount}/{blocks.length}
          </Text>
          <Text style={styles.trinityStatus}>Blocks Guarded</Text>
          <View style={styles.gaugePill}>
            <Text style={[styles.gaugePillText, { color: COLORS.ROUTINE_RED }]}>ARMED ✓</Text>
          </View>
        </TouchableOpacity>

        {/* SADHNA GAUGE */}
        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.SADHNA_VIOLET }]}
          onPress={() => onNavigate?.('SADHNA')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>🪷</Text>
          <Text style={styles.trinityName}>SADHNA</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.SADHNA_VIOLET }]}>
            {unlockedVertebrae}/33
          </Text>
          <Text style={styles.trinityStatus}>Spine Stations</Text>
          <View style={styles.gaugePill}>
            <Text style={[styles.gaugePillText, { color: COLORS.SADHNA_VIOLET }]}>94% MATCH</Text>
          </View>
        </TouchableOpacity>

        {/* MANOVIGYAN GAUGE */}
        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.MANOVIGYAN_CYAN }]}
          onPress={() => onNavigate?.('MANOVIGYAN')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>👁️</Text>
          <Text style={styles.trinityName}>MANOVIGYAN</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.MANOVIGYAN_CYAN }]}>
            {radar.authenticity}%
          </Text>
          <Text style={styles.trinityStatus}>Authentic Core</Text>
          <View style={styles.gaugePill}>
            <Text style={[styles.gaugePillText, { color: COLORS.MANOVIGYAN_CYAN }]}>
              {shedMasksCount} SHED
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 30-Day Monk Grove & Journey Landscape */}
      <View style={styles.groveCard}>
        <View style={styles.groveHeader}>
          <Text style={styles.groveTag}>30-DAY MONK GROVE LANDSCAPE</Text>
          <Text style={styles.groveScore}>28 / 30 Passed</Text>
        </View>
        <Text style={styles.groveSub}>
          Visualized living discipline: Every completed day plants a permanent Cedar.
        </Text>
        <View style={styles.groveGrid}>
          {groveDays.map((emoji, idx) => (
            <View key={idx} style={styles.groveItem}>
              <Text style={styles.groveEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
        <View style={styles.groveLegend}>
          <Text style={styles.legendText}>🌲 Protected Day</Text>
          <Text style={styles.legendText}>🪵 Interrupted</Text>
          <Text style={styles.legendText}>🥀 Fallen Tree</Text>
          <Text style={styles.legendText}>✨ Today</Text>
        </View>
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
  monasteryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeMonksPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 217, 138, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57, 217, 138, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS,
    marginRight: 6,
  },
  activeMonksText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  streakBadge: {
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  streakText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 20,
  },
  heroEyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 2,
    marginBottom: 16,
  },
  auraWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  vitalityAura: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(201, 146, 42, 0.12)',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalityNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 44,
    color: COLORS.TEXT_PRIMARY,
  },
  vitalityLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
    fontWeight: '700',
  },
  heroStatus: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 14,
    textAlign: 'center',
  },
  heroSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  nextMoveCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.SADHNA_VIOLET,
    marginBottom: 24,
  },
  nextMoveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextMoveTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  nextMoveEst: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  nextMoveTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 4,
  },
  nextMoveDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    fontSize: 13,
  },
  executeButton: {
    backgroundColor: COLORS.SADHNA_VIOLET,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  executeButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
  sectionHeading: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  trinityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  trinityCard: {
    width: '31%',
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  trinityIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  trinityName: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
  trinityMetric: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginVertical: 4,
  },
  trinityStatus: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  gaugePill: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gaugePillText: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    fontWeight: '700',
  },
  groveCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  groveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groveTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
  },
  groveScore: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  groveSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 14,
  },
  groveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  groveItem: {
    width: '10%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  groveEmoji: {
    fontSize: 18,
  },
  groveLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
});
